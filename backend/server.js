const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser'); // ใช้สำหรับการจัดการข้อมูลที่ส่งจาก client
const app = express();
app.use(cors());

// ตั้งค่า body-parser เพื่อรองรับข้อมูลขนาดใหญ่
app.use(bodyParser.json({ limit: '10mb' })); // กำหนดขนาดสูงสุดเป็น 10MB
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // กำหนดขนาดสูงสุดเป็น 10MB

// เชื่อมต่อกับฐานข้อมูล MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',         // ชื่อผู้ใช้
    password: '',         // รหัสผ่าน
    database: 'my_database' // ชื่อฐานข้อมูลของคุณ
});

// เชื่อมต่อกับฐานข้อมูล
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// API สำหรับการสมัครสมาชิก
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    // เข้ารหัสรหัสผ่านก่อนที่จะบันทึกลงฐานข้อมูล
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(sql, [username, hash], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.status(201).json({ message: 'User registered successfully!' });
        });
    });
});

// API สำหรับการเข้าสู่ระบบ
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        if (result.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }

        // ตรวจสอบรหัสผ่าน
        bcrypt.compare(password, result[0].password, (err, match) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            if (!match) {
                return res.status(401).json({ message: 'Invalid password' });
            }
            res.status(200).json({ message: 'Login successful!' });
        });
    });
});

// API สำหรับบันทึกข้อมูลโปรไฟล์
app.post('/api/update-profile', (req, res) => {
    const { username, firstName, lastName, age, profileImage } = req.body;
    const sql = 'UPDATE users SET first_name = ?, last_name = ?, age = ?, profile_image = ? WHERE username = ?';
    db.query(sql, [firstName, lastName, age, profileImage, username], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(200).json({ message: 'Profile updated successfully!' });
    });
});

// API สำหรับการเพิ่มสัตว์เลี้ยง
app.post('/api/pets', (req, res) => {
    const { type, name, gender, age } = req.body;
    const sql = 'INSERT INTO pets (type, name, gender, age) VALUES (?, ?, ?, ?)';
    db.query(sql, [type, name, gender, age], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(201).json({ message: 'Pet added successfully!', petId: result.insertId });
    });
});

// API สำหรับการดึงข้อมูลสัตว์เลี้ยง
app.get('/api/pets', (req, res) => {
    const sql = 'SELECT * FROM pets';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(200).json(result);
    });
});

// API สำหรับการแก้ไขข้อมูลสัตว์เลี้ยง
app.put('/api/pets/:id', (req, res) => {
    const { id } = req.params;
    const { type, name, gender, age } = req.body;
    const sql = 'UPDATE pets SET type = ?, name = ?, gender = ?, age = ? WHERE id = ?';
    db.query(sql, [type, name, gender, age, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(200).json({ message: 'Pet updated successfully!' });
    });
});

// API สำหรับการลบสัตว์เลี้ยง
app.delete('/api/pets/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM pets WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(200).json({ message: 'Pet deleted successfully!' });
    });
});

// เริ่มเซิร์ฟเวอร์
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
