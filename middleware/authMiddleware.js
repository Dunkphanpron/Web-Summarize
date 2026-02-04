// middleware/authMiddleware.js
exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login');
};

exports.isApiAuthenticated = require('passport').authenticate('jwt', { session: false });
