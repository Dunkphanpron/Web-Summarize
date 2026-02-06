// routes/indexRoutes.js
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const dashboardController = require('../controllers/dashboardController');
const userController = require('../controllers/userController');

// Clean up the index route if it's just a splash page, or redirect to dashboard if logged in
router.get('/', (req, res) => {
    // If logged in, maybe redirect to dashboard? or show landing page
    res.render('index', { user: req.user });
});

router.get('/dashboard', isAuthenticated, dashboardController.getDashboard);
router.post('/dashboard/estimate', isAuthenticated, dashboardController.calculateEstimation);
router.post('/dashboard/save', isAuthenticated, dashboardController.confirmEstimation);
router.get('/dashboard/delete/:id', isAuthenticated, dashboardController.deleteEstimation);

router.get('/profile', isAuthenticated, userController.getProfile);

module.exports = router;
