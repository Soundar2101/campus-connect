// import Student from "../models/studentModel.js";
// import bcrypt from "bcryptjs";
// import nodemailer from "nodemailer";

// // Register Student
// export const registerStudent = async (req, res) => {
//   try {
//     const { name, email, password, department } = req.body;

//     // 1️⃣ Check if all fields are present
//     if (!name || !email || !password || !department) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // 2️⃣ Check if student already exists
//     const existingStudent = await Student.findOne({ email });
//     if (existingStudent) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     // 3️⃣ Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 4️⃣ Create new student
//     const newStudent = new Student({
//       name,
//       email,
//       password: hashedPassword,
//       department,
//     });

//     await newStudent.save();

//     // 5️⃣ Send confirmation email (optional)
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER, // your Gmail
//         pass: process.env.EMAIL_PASS, // your App Password
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Student Registration Successful 🎉",
//       text: `Hello ${name},\n\nYour registration for the ${department} department was successful!\n\nWelcome aboard!`,
//     };

//     await transporter.sendMail(mailOptions);

//     // 6️⃣ Respond success
//     res.status(201).json({ message: "Student registered successfully!" });
//   } catch (error) {
//   console.error("❌ Registration Error:", error); // 👈 print full error object
//   res.status(500).json({
//     message: "Server error during registration",
//     error: error.message, // 👈 include details for debugging
//   });
// }
// };
import Student from "../models/studentModel.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

// ✅ REGISTER STUDENT
export const registerStudent = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    // 1️⃣ Validate inputs
    if (!name || !email || !password || !department) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create new student
    const newStudent = new Student({
      name,
      email,
      password: hashedPassword,
      department,
    });

    await newStudent.save();

    // 5️⃣ Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Student Registration Successful 🎉",
      text: `Hello ${name},\n\nYour registration for the ${department} department was successful!\n\nWelcome aboard!`,
    };

    await transporter.sendMail(mailOptions);

    // 6️⃣ Success response
    res.status(201).json({ message: "Student registered successfully!" });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};

// ✅ LOGIN STUDENT
export const loginStudent = async (req, res) => {
  try {
    const { email, password, department } = req.body;

    // 1️⃣ Validate fields
    if (!email || !password || !department) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Find student
    const student = await Student.findOne({ email, department });
    if (!student) {
      return res.status(400).json({ message: "Invalid email or department" });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 4️⃣ Success response
    res.status(200).json({
      message: "Login successful",
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        department: student.department,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({
      message: "Server error during login",
      error: error.message,
    });
  }
};
