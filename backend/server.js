const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.DB_URL)
    .then(() => console.log(" Kết nối DB thành công"))
    .catch(err => console.error(" Lỗi DB:", err));

const StudentSchema = new mongoose.Schema({ name: String, msv: String, class: String });
const Student = mongoose.model('Student', StudentSchema);

app.get('/health', (req, res) => res.json({ status: "ok" }));

app.get('/api/about', async (req, res) => {
    const data = await Student.findOne();
    res.json(data || { name: "Chưa có dữ liệu", msv: "N/A", class: "N/A" });
});

// Lấy danh sách tất cả sinh viên
app.get('/api/students', async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

// Thêm sinh viên mới (POST)
app.post('/api/students', async (req, res) => {
    const newStudent = await Student.create(req.body);
    res.json(newStudent);
});

// Xóa sinh viên (DELETE)
app.delete('/api/students/:id', async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa" });
});

app.listen(process.env.PORT, () => console.log(`Backend chạy tại port ${process.env.PORT}`));