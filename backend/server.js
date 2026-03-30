const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB (Yêu cầu 4)
mongoose.connect(process.env.DB_URL)
    .then(() => console.log(" Kết nối DB thành công"))
    .catch(err => console.error(" Lỗi DB:", err));

// Schema (Yêu cầu 4 - Không hard-code)
const StudentSchema = new mongoose.Schema({ name: String, msv: String, class: String });
const Student = mongoose.model('Student', StudentSchema);

// Endpoint /health (Yêu cầu 3.2)
app.get('/health', (req, res) => res.json({ status: "ok" }));

// Endpoint lấy thông tin (Yêu cầu 3.1)
app.get('/api/about', async (req, res) => {
    const data = await Student.findOne();
    res.json(data || { name: "Chưa có dữ liệu", msv: "N/A", class: "N/A" });
});

app.post('/api/update', async (req, res) => {
    const { name, msv, class: className } = req.body;
    await Student.deleteMany({}); 
    const newStudent = await Student.create({ name, msv, class: className });
    res.json(newStudent);
});

app.listen(process.env.PORT, () => console.log(`Backend chạy tại port ${process.env.PORT}`));