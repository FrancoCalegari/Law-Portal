require('dotenv').config();
const express      = require('express');
const session      = require('express-session');
const path         = require('path');
const spider       = require('./services/spiderApi');

const indexRouter  = require('./routes/index');
const adminRouter  = require('./routes/admin');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ─── VIEW ENGINE ─────────────────────────────────────────────────────── */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* ─── STATIC FILES ────────────────────────────────────────────────────── */
app.use(express.static(path.join(__dirname, 'public')));

/* ─── MIDDLEWARE ─────────────────────────────────────────────────────── */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret:            process.env.SESSION_SECRET || 'lawportal_secret',
    resave:            false,
    saveUninitialized: false,
    cookie:            { maxAge: 1000 * 60 * 60 * 8 } // 8 horas
}));

/* ─── ROUTES ─────────────────────────────────────────────────────────── */
app.use('/',       indexRouter);
app.use('/admin',  adminRouter);

/* ─── PROXY: imágenes del Cloud Storage ─────────────────────────────── */
// El browser no puede enviar X-API-KEY en un <img src>, así que el
// servidor actúa de proxy para descargar y redirigir al navegador.
const axios = require('axios');
app.get('/img/cloud/:fileId', async (req, res) => {
    const { fileId } = req.params;
    const url = `${process.env.SPIDER_API_URL.replace(/\/$/, '')}/storage/files/${fileId}`;
    try {
        const upstream = await axios.get(url, {
            headers: { 'X-API-KEY': process.env.SPIDER_API_KEY },
            responseType: 'stream'
        });
        // Reenviar content-type original
        const ct = upstream.headers['content-type'] || 'image/jpeg';
        res.setHeader('Content-Type', ct);
        res.setHeader('Cache-Control', 'public, max-age=86400'); // caché 1 día
        upstream.data.pipe(res);
    } catch (err) {
        console.error('[Proxy] Error sirviendo imagen cloud:', err.message);
        res.redirect('/img/portadas/default.webp');
    }
});

/* ─── 404 ────────────────────────────────────────────────────────────── */
app.use((req, res) => {
    res.status(404).render('index', {
        codes: [],
        error: 'Página no encontrada (404).'
    });
});

/* ─── DB SEED ────────────────────────────────────────────────────────── */

const seedData = [
    { title: 'CÓDIGO PROCESAL PENAL', link: 'https://www.argentina.gob.ar/normativa/nacional/ley-23984-383/actualizacion', image: '/img/portadas/CodigoProcesalPenal.webp', jurisdiction: 'Nacional', pdf: '', coment: '' },
    { title: 'CÓDIGO AERONÁUTICO', link: 'https://www.argentina.gob.ar/normativa/nacional/ley-17285-24963/actualizacion', image: '/img/portadas/CodigoAeronautico.webp', jurisdiction: 'Nacional', pdf: '', coment: '' },
    { title: 'CÓDIGO DE MINERÍA', link: 'https://www.argentina.gob.ar/normativa/nacional/ley-1919-43797/actualizacion', image: '/img/portadas/Codigo_Mineria_tapa.webp', jurisdiction: 'Nacional', pdf: '', coment: '' },
    { title: 'CÓDIGO PROCESAL LABORAL DE MENDOZA', link: 'https://www.argentina.gob.ar/normativa/provincial/ley-2144-123456789-0abc-defg-441-2000mvorpyel/actualizacion', image: '/img/portadas/CodigoProcesalLaboralDeMendoza.webp', jurisdiction: 'Provincial', pdf: '', coment: '' },
    { title: 'CÓDIGO ELECTORAL NACIONAL', link: 'https://www.argentina.gob.ar/normativa/nacional/ley-19945-19442/actualizacion', image: '/img/portadas/CodigoElectoralNacionalConcordandoYComentado.webp', jurisdiction: 'Nacional', pdf: '', coment: '' },
    { title: 'CÓDIGO ADUANERO', link: 'https://www.argentina.gob.ar/normativa/nacional/ley-22415-16536/actualizacion', image: '/img/portadas/CodigoAduanero.webp', jurisdiction: 'Nacional', pdf: '', coment: '' },
    { title: 'CÓDIGO ALIMENTARIO ARGENTINO', link: 'https://www.argentina.gob.ar/normativa/nacional/ley-18284-21841/texto', image: '/img/portadas/CodigoAlimentario.webp', jurisdiction: 'Nacional', pdf: '', coment: '' },
    { title: 'CÓDIGO PROCESAL CIVIL DE LA PROVINCIA DE MENDOZA', link: 'https://www.argentina.gob.ar/normativa/provincial/ley-2269-123456789-0abc-defg-962-2000mvorpyel/actualizacion', image: '/img/portadas/CodigoProcesalDeLaProvinciaDeMendoza.webp', jurisdiction: 'Provincial', pdf: '', coment: '' },
    { title: 'Senado Mendoza', link: 'https://www.senadomendoza.gob.ar/', image: '/img/portadas/SenadoMendoza.webp', jurisdiction: 'Provincial', pdf: '', coment: '' },
    { title: 'CÓDIGO PROCESAL PENAL DE MENDOZA', link: 'https://www.argentina.gob.ar/normativa/provincial/ley-6730-123456789-0abc-defg-037-6001mvorpyel', image: '/img/portadas/CodigoProcesalPenalProvinciaDeMendoza.webp', jurisdiction: 'Provincial', pdf: '', coment: '' },
    { title: 'Convención Americana DDHH', link: 'https://www.argentina.gob.ar/sites/default/files/derechoshumanos_publicaciones_colecciondebolsillo_10_convencion_americana_ddhh.pdf', image: '/img/portadas/ConvenciosAmericanaSobreDerechosHumanos.webp', jurisdiction: 'Internacional', pdf: '', coment: '' },
    { title: 'CÓDIGO PROCESAL CIVIL Y COMERCIAL DE LA NACION', link: 'https://www.argentina.gob.ar/normativa/nacional/ley-17454-16547/actualizacion', image: '/img/portadas/CodigoProcesalCivilYComercialDeLaNacion.webp', jurisdiction: 'Nacional', pdf: '', coment: '' },
    { title: 'Código Procesal Civil, Comercial y Tributario de la Provincia de Mendoza', link: 'https://www.argentina.gob.ar/normativa/provincial/ley-9001-123456789-0abc-defg-100-9000mvorpyel/actualizacion', image: '/img/portadas/CodigoProcesalCivilComercialYTributarioProvinciaDeMendoza.webp', jurisdiction: 'Provincial', pdf: '', coment: '' },
    { title: 'Constitución de la provincia de Mendoza', link: 'https://www.argentina.gob.ar/normativa/provincial/ley-0-123456789-0abc-defg-000-0000mvorpyel/actualizacion', image: '/img/portadas/ConstitucionDeLaProvinciaDeMendoza.webp', jurisdiction: 'Provincial', pdf: '', coment: '' },
    { title: 'CÓDIGO PENAL DE LA NACION ARGENTINA', link: 'https://www.argentina.gob.ar/normativa/nacional/ley-11179-16546/actualizacion', image: '/img/portadas/CodigoProcesalPenalDeLaNacion.webp', jurisdiction: 'Nacional', pdf: '', coment: '' },
    { title: 'CÓDIGO CIVIL Y COMERCIAL DE LA NACION', link: 'https://www.argentina.gob.ar/normativa/nacional/ley-26994-235975/actualizacion', image: '/img/portadas/CodigoCivilYComercialDeLaNacion.jpg', jurisdiction: 'Nacional', pdf: '', coment: '' },
    { title: 'CONSTITUCIÓN NACIONAL', link: 'https://www.argentina.gob.ar/normativa/nacional/ley-24430-804/texto', image: '/img/portadas/descarga (1).webp', jurisdiction: 'Nacional', pdf: '', coment: '' },
    { title: 'Ley De Transito', link: 'https://www.argentina.gob.ar/normativa/nacional/818/actualizacion', image: '/img/portadas/LeyDeTrancitoMendoza.jpg', jurisdiction: 'Nacional', pdf: '', coment: '' },
    { title: 'Código Procesal de Familia y Violencia Familiar', link: 'https://www.argentina.gob.ar/normativa/provincial/ley-9120-123456789-0abc-defg-021-9000mvorpyel/actualizacion', image: '/img/portadas/CódigoProcesaldeFamiliayViolenciaFamiliar.jpeg', jurisdiction: 'Provincial', pdf: 'http://mendozalegal.com/omeka/files/original/06e1f0caa8972c65c4fda4763751cfd0.pdf', coment: '' },
    { title: 'Ley general Del ambiente', link: 'https://www.argentina.gob.ar/normativa/nacional/ley-25675-79980/texto', image: '/img/portadas/LeyDeTrancitoMendoza.jpg', jurisdiction: 'Nacional', pdf: '', coment: '' },
    { title: 'Ley De Agua', link: 'https://www.mendoza.gov.ar/wp-content/uploads/sites/15/2021/04/LEY-DE-AGUAS.pdf', image: '/img/portadas/Ley-General-de-Aguas-820x394.jpeg', jurisdiction: 'Provincial', pdf: 'https://www.mendoza.gov.ar/wp-content/uploads/sites/15/2021/04/LEY-DE-AGUAS.pdf', coment: '' },
    { title: 'Código de mineria De mendoza', link: 'https://www.mendoza.gov.ar/economia/wp-content/uploads/sites/44/2017/01/C%C3%B3digo-de-Miner%C3%ADa.pdf', image: '/img/portadas/CodigoDeMineriaMendoza.webp', jurisdiction: 'Provincial', pdf: '', coment: '' }
];

async function initDatabase() {
    console.log('🔧 Inicializando base de datos...');
    try {
        // Crear tabla si no existe
        await spider.query(`
            CREATE TABLE IF NOT EXISTS legal_codes (
                id            INT AUTO_INCREMENT PRIMARY KEY,
                title         VARCHAR(255)  NOT NULL,
                link          VARCHAR(500),
                image_url     VARCHAR(500),
                image_file_id VARCHAR(100),
                jurisdiction  VARCHAR(50),
                pdf           VARCHAR(500),
                coment        VARCHAR(500),
                created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabla legal_codes verificada/creada.');

        // Verificar si la tabla ya tiene datos
        const check = await spider.query('SELECT COUNT(*) as total FROM legal_codes');
        const total = parseInt(
            (check.result || check.rows || check.data)?.[0]?.total ??
            (check.result || check.rows || check.data)?.[0]?.['COUNT(*)'] ?? 0
        );

        if (total === 0) {
            console.log('🌱 Tabla vacía — ejecutando seed con datos históricos...');
            for (const item of seedData) {
                const sql = `
                    INSERT INTO legal_codes (title, link, image_url, image_file_id, jurisdiction, pdf, coment)
                    VALUES (
                        '${esc(item.title)}',
                        '${esc(item.link)}',
                        '${esc(item.image)}',
                        NULL,
                        '${esc(item.jurisdiction)}',
                        '${esc(item.pdf)}',
                        '${esc(item.coment)}'
                    )
                `;
                await spider.query(sql);
            }
            console.log(`✅ Seed completado — ${seedData.length} registros insertados.`);
        } else {
            console.log(`ℹ️  Tabla ya contiene ${total} registros. Seed omitido.`);
        }
    } catch (err) {
        console.error('❌ Error inicializando DB:', err.message);
        // No lanzar excepción — el servidor arranca igual
    }
}

function esc(str) {
    return String(str || '').replace(/'/g, "''").replace(/\\/g, '\\\\');
}

/* ─── START ──────────────────────────────────────────────────────────── */
app.listen(PORT, async () => {
    console.log(`\n🚀 Law-Portal corriendo en http://localhost:${PORT}`);
    console.log(`   Admin Dashboard → http://localhost:${PORT}/admin/dashboard\n`);
    await initDatabase();
});

module.exports = app;
