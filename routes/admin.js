const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const spider   = require('../services/spiderApi');
const { requireAuth } = require('../middleware/auth');
const axios    = require('axios');

// Multer: almacena en memoria para subir al Cloud Storage directamente
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB máx
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp|gif/;
        if (allowed.test(file.mimetype)) return cb(null, true);
        cb(new Error('Solo se admiten imágenes (jpg, png, webp, gif).'));
    }
});

const STORAGE_ID = process.env.SPIDER_STORAGE_ID;

/* ─── LOGIN ─────────────────────────────────────────────────────────── */

router.get('/login', (req, res) => {
    if (req.session && req.session.isAdmin) return res.redirect('/admin/dashboard');
    const error = req.query.error || null;
    res.render('admin/login', { error });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD) {
        req.session.isAdmin   = true;
        req.session.adminUser = username;
        return res.redirect('/admin/dashboard');
    }
    res.render('admin/login', { error: 'Credenciales incorrectas.' });
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/admin/login'));
});

/* ─── DASHBOARD ──────────────────────────────────────────────────────── */

router.get('/dashboard', requireAuth, async (req, res) => {
    try {
        const result = await spider.query('SELECT * FROM legal_codes ORDER BY jurisdiction, title');
        const codes  = result.result || result.rows || result.data || [];

        // Stats por jurisdicción
        const stats = codes.reduce((acc, c) => {
            acc[c.jurisdiction] = (acc[c.jurisdiction] || 0) + 1;
            return acc;
        }, {});

        res.render('admin/dashboard', {
            codes, stats,
            adminUser: req.session.adminUser,
            success: req.query.success || null,
            error:   req.query.error   || null
        });
    } catch (err) {
        console.error('[Admin] Error dashboard:', err.message);
        res.render('admin/dashboard', {
            codes: [], stats: {},
            adminUser: req.session.adminUser,
            success: null,
            error: 'Error cargando datos: ' + err.message
        });
    }
});

/* ─── CREAR CÓDIGO ───────────────────────────────────────────────────── */

router.post('/codes', requireAuth, upload.single('image'), async (req, res) => {
    const { title, link, jurisdiction, pdf, coment } = req.body;

    if (!title) {
        return res.redirect('/admin/dashboard?error=El+titulo+es+obligatorio');
    }

    try {
        let image_url    = req.body.image_url_manual || '/img/portadas/default.webp';
        let image_file_id = null;

        // Si se subió una imagen, enviarla al Cloud Storage
        if (req.file) {
            const uploadRes = await spider.uploadFile(
                STORAGE_ID,
                req.file.buffer,
                req.file.originalname,
                req.file.mimetype
            );
            console.log('[Admin] Upload response (crear):', JSON.stringify(uploadRes));
            const { fileId, fileUrl } = spider.parseUploadResponse(uploadRes);
            if (fileId) {
                image_file_id = fileId;
                image_url     = fileUrl;
            } else {
                console.warn('[Admin] No se pudo extraer file ID del upload response');
            }
        }

        const sql = `
            INSERT INTO legal_codes (title, link, image_url, image_file_id, jurisdiction, pdf, coment)
            VALUES (
                '${escape(title)}',
                '${escape(link || '')}',
                '${escape(image_url)}',
                ${image_file_id ? `'${image_file_id}'` : 'NULL'},
                '${escape(jurisdiction || 'Nacional')}',
                '${escape(pdf || '')}',
                '${escape(coment || '')}'
            )
        `;
        await spider.query(sql);
        res.redirect('/admin/dashboard?success=Código+creado+correctamente');
    } catch (err) {
        console.error('[Admin] Error creando código:', err.message);
        res.redirect('/admin/dashboard?error=' + encodeURIComponent(err.message));
    }
});

/* ─── EDITAR CÓDIGO ──────────────────────────────────────────────────── */

router.post('/codes/:id/edit', requireAuth, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, link, jurisdiction, pdf, coment, existing_image_url, existing_image_file_id } = req.body;

    try {
        let image_url     = existing_image_url     || '/img/portadas/default.webp';
        let image_file_id = existing_image_file_id || null;

        // Si se subió una imagen nueva, subirla al Cloud Storage
        if (req.file) {
            // Limpiar image_file_id si viene como string 'null'
            const oldFileId = (existing_image_file_id && existing_image_file_id !== 'null' && existing_image_file_id.trim() !== '')
                ? existing_image_file_id
                : null;

            // Eliminar la imagen anterior si era del Cloud Storage
            if (oldFileId) {
                try { await spider.deleteFile(oldFileId); } catch (_) { /* ignora si falla */ }
            }

            const uploadRes = await spider.uploadFile(
                STORAGE_ID,
                req.file.buffer,
                req.file.originalname,
                req.file.mimetype
            );
            console.log('[Admin] Upload response (editar):', JSON.stringify(uploadRes));
            const { fileId, fileUrl } = spider.parseUploadResponse(uploadRes);
            if (fileId) {
                image_file_id = fileId;
                image_url     = fileUrl;
            } else {
                console.warn('[Admin] No se pudo extraer file ID del upload response');
                // Mantener imagen anterior — no romper el registro
            }
        }

        const sql = `
            UPDATE legal_codes SET
                title          = '${escape(title)}',
                link           = '${escape(link || '')}',
                image_url      = '${escape(image_url)}',
                image_file_id  = ${image_file_id ? `'${image_file_id}'` : 'NULL'},
                jurisdiction   = '${escape(jurisdiction || 'Nacional')}',
                pdf            = '${escape(pdf || '')}',
                coment         = '${escape(coment || '')}'
            WHERE id = ${parseInt(id)}
        `;
        await spider.query(sql);
        res.redirect('/admin/dashboard?success=Código+actualizado+correctamente');
    } catch (err) {
        console.error('[Admin] Error editando código:', err.message);
        res.redirect('/admin/dashboard?error=' + encodeURIComponent(err.message));
    }
});

/* ─── ELIMINAR CÓDIGO ────────────────────────────────────────────────── */

router.post('/codes/:id/delete', requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        // Obtener el código para ver si tiene imagen en Cloud Storage
        const result  = await spider.query(`SELECT * FROM legal_codes WHERE id = ${parseInt(id)}`);
        const rows    = result.result || result.rows || result.data || [];
        const code    = rows[0];

        if (code && code.image_file_id && code.image_file_id !== 'null') {
            try { await spider.deleteFile(code.image_file_id); } catch (_) { /* ignora */ }
        }

        await spider.query(`DELETE FROM legal_codes WHERE id = ${parseInt(id)}`);
        res.redirect('/admin/dashboard?success=Código+eliminado+correctamente');
    } catch (err) {
        console.error('[Admin] Error eliminando código:', err.message);
        res.redirect('/admin/dashboard?error=' + encodeURIComponent(err.message));
    }
});

/* ─── API: Datos de un código (para el modal de edición) ─────────────── */

router.get('/codes/:id/json', requireAuth, async (req, res) => {
    try {
        const result = await spider.query(`SELECT * FROM legal_codes WHERE id = ${parseInt(req.params.id)}`);
        const rows   = result.result || result.rows || result.data || [];
        res.json(rows[0] || null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Helper simple para escapar SQL (previene corrupción básica; en producción usar prepared statements)
function escape(str) {
    if (!str) return '';
    return String(str).replace(/'/g, "''").replace(/\\/g, '\\\\');
}

module.exports = router;
