
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import nodemailer from "nodemailer";

import eventRoutes from "./routes/eventRoutes.js";
import studentAuthRoutes from "./routes/studentAuthRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import User from "./models/User.js";
// import externalEventRoutes from "./routes/externalEventRoutes.js";


dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ----------------------
// 🖼️ Make uploads folder static
// ----------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use("/uploads", express.static(uploadDir));

app.use("/api/events", eventRoutes);
// app.use("/api", externalEventRoutes);


// ----------------------
// 📦 MongoDB Connection
// ----------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB connection error:", err));

// ----------------------
// ✉️ Email Configuration
// ----------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ----------------------
// 📍 API Routes
// ----------------------
app.use("/api/events", eventRoutes);
app.use("/api/auth/student", studentAuthRoutes);
app.use("/api/upload", uploadRoutes); // ✅ cleaner endpoint

// ----------------------
// 👨‍🏫 FACULTY ROUTES
// ----------------------
app.post("/api/faculty/register", async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password || !department)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const user = new User({
      name,
      email,
      password,
      department,
      role: "staff",
      verified: true,
    });
    await user.save();

    res.status(201).json({ message: "Registration successful", user });
  } catch (err) {
    console.error("Faculty Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/faculty/login", async (req, res) => {
  try {
    const { email, password, department } = req.body;

    if (!email || !password || !department)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email, department, role: "staff" });
    if (!user || user.password !== password)
      return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error("Faculty Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------
// 🧑‍🎓 STUDENT ROUTES (already imported above)
// ----------------------
app.post("/api/auth/student/register", async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password || !department)
      return res.status(400).json({ message: "All fields are required" });

    const existingStudent = await User.findOne({ email });
    if (existingStudent)
      return res.status(400).json({ message: "Email already registered" });

    const newStudent = new User({
      name,
      email,
      password,
      department,
      role: "student",
      verified: true,
    });

    await newStudent.save();

    // ✅ Send confirmation email
    await transporter.sendMail({
      from: `"Campus Connect" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎓 Registration Successful!",
      html: `
        <h2>Welcome to Campus Connect, ${name}!</h2>
        <p>You have successfully registered for Campus Connect.</p>
        <p>Login to explore upcoming campus events!</p>
        <br/>
        <p>Best regards,<br/>Campus Connect Team</p>
      `,
    });

    res.status(201).json({
      message: "Student registered successfully. Confirmation email sent!",
      user: newStudent,
    });
  } catch (err) {
    console.error("Student Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/auth/student/login", async (req, res) => {
  try {
    const { email, password, department } = req.body;

    if (!email || !password || !department)
      return res.status(400).json({ message: "All fields are required" });

    const student = await User.findOne({ email, department, role: "student" });

    if (!student)
      return res.status(400).json({ message: "Student not found" });

    if (student.password !== password)
      return res.status(400).json({ message: "Invalid password" });

    res.status(200).json({ message: "Login successful", user: student });
  } catch (err) {
    console.error("Student Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------
// 🚀 START SERVER
// ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
