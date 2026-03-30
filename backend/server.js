const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB (Sử dụng biến môi trường từ .env)
mongoose.connect(process.env.DB_URL)
    .then(() => console.log("✅ Kết nối DB thành công"))
    .catch(err => console.error("❌ Lỗi DB:", err));

// Định nghĩa Schema Sinh viên
const StudentSchema = new mongoose.Schema({ 
    name: String, 
    msv: String, 
    class: String 
});
const Student = mongoose.model('Student', StudentSchema);

// --- CÁC ENDPOINT API ---

// 1. Health Check (Minh chứng mục 3.2)
app.get('/health', (req, res) => res.json({ status: "ok" }));

// 2. Thông tin sinh viên thực hiện (Minh chứng mục 3.1 - Thay cho /about)
app.get('/api/about', (req, res) => {
    res.json({
        hoTen: "Lê Quốc Việt",
        mssv: "2251220068",
        lop: "22CT2",
        project: "DevOps Mini Project - Student Management"
    });
});

// 3. Lấy danh sách tất cả sinh viên (GET)
app.get('/api/students', async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

// 4. Thêm sinh viên mới (POST)
app.post('/api/students', async (req, res) => {
    const newStudent = await Student.create(req.body);
    res.json(newStudent);
});

// 5. Cập nhật thông tin sinh viên (PUT)
app.put('/api/students/:id', async (req, res) => {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

// 6. Xóa sinh viên (DELETE)
app.delete('/api/students/:id', async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa thành công" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend đang chạy tại port ${PORT}`));