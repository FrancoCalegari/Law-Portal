/**
 * Middleware de autenticación de sesión de administrador.
 * Si no hay sesión activa, redirige al login.
 */
function requireAuth(req, res, next) {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    return res.redirect('/admin/login?error=session');
}

module.exports = { requireAuth };
