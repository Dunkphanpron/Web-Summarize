// controllers/dashboardController.js
const Estimation = require('../models/Estimation');

exports.getDashboard = async (req, res) => {
    try {
        const estimations = await Estimation.findByUserId(req.user.id);
        res.render('dashboard', {
            user: req.user,
            estimations: estimations,
            error: null,
            success: null,
            previewResult: null
        });
    } catch (err) {
        console.error(err);
        res.render('dashboard', { user: req.user, estimations: [], error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    }
};

exports.calculateEstimation = async (req, res) => {
    const { client_name, device_type, test_type, function_count, platform_count } = req.body;

    if (!client_name || !device_type || !function_count) {
        // Handle validation logic if needed
    }

    // Calculation Logic (Man-Days)
    // Assumption: 1 Function takes 2 hours base time.
    // Working day = 8 hours.

    let hoursPerFunction = 2; // Base

    // Test Type Factor
    let typeFactor = 1.0;
    if (test_type === 'blackbox') typeFactor = 1.5; // Harder
    if (test_type === 'graybox') typeFactor = 1.0;  // Standard

    // Device Complexity Factor (Optional adjustment)
    let deviceFactor = 1.0;
    if (device_type === 'mobile_application') deviceFactor = 1.2; // Slightly more complex env setup
    if (device_type === 'infrastructure') deviceFactor = 0.5; // Adjusted: Infra usually faster per "function/host" than deep app logic
    if (device_type === 'api_webservice') deviceFactor = 0.9; // Often faster than UI testing

    // Platform Count (e.g., iOS + Android = 2)
    let platforms = parseInt(platform_count) || 1;

    // Total Hours = (Functions * BaseHours * TypeFactor * DeviceFactor) * Platforms
    // Plus Fixed overhead (Report writing) = 1 Day (8 hours)

    let totalHours = (parseInt(function_count) * hoursPerFunction * typeFactor * deviceFactor) * platforms;
    totalHours += 8; // Report writing overhead

    // Convert to Man-Days (Round up to 0.5)
    let mandays = totalHours / 8;
    mandays = Math.ceil(mandays * 2) / 2; // Round to nearest 0.5

    // Render Preview instead of saving
    try {
        const estimations = await Estimation.findByUserId(req.user.id);
        res.render('dashboard', {
            user: req.user,
            estimations: estimations,
            error: null,
            success: null,
            previewResult: {
                client_name,
                device_type,
                test_type,
                function_count,
                platform_count: platforms,
                estimated_days: mandays
            }
        });
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
};

exports.confirmEstimation = async (req, res) => {
    const { client_name, device_type, test_type, function_count, platform_count, estimated_days } = req.body;

    try {
        await Estimation.create({
            user_id: req.user.id,
            client_name,
            device_type,
            test_type,
            function_count: parseInt(function_count),
            platform_count: parseInt(platform_count),
            estimated_days: parseFloat(estimated_days)
        });

        res.render('dashboard', {
            user: req.user,
            estimations: await Estimation.findByUserId(req.user.id),
            error: null,
            success: 'บันทึกข้อมูลสำเร็จ',
            previewResult: null
        });
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
};

exports.deleteEstimation = async (req, res) => {
    try {
        await Estimation.delete(req.params.id, req.user.id);
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
};
