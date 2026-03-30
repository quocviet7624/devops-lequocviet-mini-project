const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.DB_URL)
    .then(() => console.log("✅ Kết nối DB thành công"))
    .catch(err => console.error("❌ Lỗi DB:", err));

const StudentSchema = new mongoose.Schema({ name: String, msv: String, class: String });
const Student = mongoose.model('Student', StudentSchema);

// 1. Health Check
app.get('/health', (req, res) => res.json({ status: "ok" }));

// 2. Lấy danh sách tất cả sinh viên
app.get('/api/students', async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

// 3. Thêm sinh viên mới (POST)
app.post('/api/students', async (req, res) => {
    const newStudent = await Student.create(req.body);
    res.json(newStudent);
});

// 4. Cập nhật thông tin sinh viên (PUT)
app.put('/api/students/:id', async (req, res) => {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

// 5. Xóa sinh viên (DELETE)
app.delete('/api/students/:id', async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend chạy tại port ${PORT}`));