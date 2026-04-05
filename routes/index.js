const express = require('express');
const router  = express.Router();
const spider  = require('../services/spiderApi');

/**
 * GET /
 * Portal público: carga todos los códigos y los renderiza con EJS.
 */
router.get('/', async (req, res) => {
    try {
        const result = await spider.query('SELECT * FROM legal_codes ORDER BY jurisdiction, title');
        const codes  = result.result || result.rows || result.data || [];
        res.render('index', { codes, error: null });
    } catch (err) {
        console.error('[Portal] Error cargando códigos:', err.message);
        res.render('index', { codes: [], error: 'No se pudo conectar con la base de datos.' });
    }
});

module.exports = router;
