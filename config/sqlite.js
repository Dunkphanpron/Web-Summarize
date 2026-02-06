// config/sqlite.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../data/database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to SQLite database.');

        db.serialize(() => {
            // Create Users Table
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT,
                role TEXT DEFAULT 'user'
            )`, (err) => {
                if (err) {
                    console.error("Error creating users table:", err);
                } else {
                    // Check if admin exists
                    const checkSql = "SELECT * FROM users WHERE username = ?";
                    db.get(checkSql, ["admin"], (err, row) => {
                        if (!row) {
                            const hash = bcrypt.hashSync('password123', 8);
                            const insertSql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
                            db.run(insertSql, ["admin", hash, "admin"]);
                            console.log("Created default admin user.");
                        }
                    });
                }
            });

            // Create Estimations Table
            db.run(`CREATE TABLE IF NOT EXISTS estimations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                client_name TEXT,
                device_type TEXT,
                test_type TEXT,
                function_count INTEGER,
                platform_count INTEGER,
                estimated_days REAL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )`, (err) => {
                if (err) console.error("Error creating estimations table:", err);
            });
        });
    }
});

module.exports = db;
