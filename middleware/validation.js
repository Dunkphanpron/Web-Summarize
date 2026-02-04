// middleware/validation.js
module.exports = {
    validateLogin: (req, res, next) => {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.render('login', { error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
        }
        next();
    },
    validateRegister: (req, res, next) => {
        const { username, password, confirmPassword } = req.body;
        if (!username || !password || !confirmPassword) {
            return res.render('register', { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }
        if (password !== confirmPassword) {
            return res.render('register', { error: 'รหัสผ่านไม่ตรงกัน' });
        }
        if (password.length < 6) {
            return res.render('register', { error: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' });
        }
        next();
    }
};
