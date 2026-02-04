// routes/indexRoutes.js
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

router.get('/', (req, res) => {
    res.render('index', { user: req.user });
});

router.get('/profile', isAuthenticated, userController.getProfile);

module.exports = router;
