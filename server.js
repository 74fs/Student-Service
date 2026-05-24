const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ️ إعدادات الاتصال بقاعدة البيانات (من الصورة)
const db = mysql.createConnection({
  host: 'YOUR_DB_HOST',      // استبدلها بعنوان الخادم من Cloud SQL
  user: 'YOUR_DB_USER',      // اسم المستخدم
  password: 'YOUR_DB_PASS',  // كلمة المرور
  database: 'MECComplaints'  // اسم القاعدة كما في الصورة
});

db.connect(err => {
  if (err) console.error('Error connecting to DB:', err);
  else console.log('Connected to MECComplaints Database');
});

// 1. إرسال شكوى (Student Submit)
app.post('/api/complaints', (req, res) => {
  const { collegeId, building, serviceType, rootCause, details } = req.body;
  
  // نحتاج لتحويل الأسماء إلى IDs كما في جدول Complaint في صورتك
  // (هذا تبسيط، في المشروع الحقيقي نستخدم Queries للبحث عن الـ ID)
  const sql = `INSERT INTO Complaint (collegeId, details, status, timestamp) 
               VALUES (?, ?, 'Pending', NOW())`;
  
  // ملاحظة: الصورة تظهر أعمدة FK مثل buildingNameId. 
  // للتبسيط هنا سنخزن البيانات النصية أو يمكنك تعديل الكود ليجلب الـ ID أولاً.
  
  db.query(sql, [collegeId, details], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Complaint submitted successfully', id: result.insertId });
  });
});

// 2. جلب الشكاوى للوحة التحكم (Admin Dashboard)
app.get('/api/complaints', (req, res) => {
  const sql = "SELECT * FROM Complaint ORDER BY timestamp DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
