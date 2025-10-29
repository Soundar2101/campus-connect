// import express from "express";
// import mongoose from "mongoose";
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// import User from "../models/User.js"; // adjust path if needed

// dotenv.config();

// const router = express.Router();

// // ✅ Setup Nodemailer transporter once
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // ✅ Student registration route
// router.post("/student/register", async (req, res) => {
//   const { name, email, password, department } = req.body;

//   try {
//     // Check if user already exists
//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     // Create and save new student
//     const newUser = new User({ name, email, password, department });
//     await newUser.save();

//     // ✅ Send confirmation email
//     await transporter.sendMail(
//       {
//         from: `"Campus Connect" <${process.env.EMAIL_USER}>`,
//         to: email,
//         subject: "🎓 Registration Successful!",
//         html: `
//           <h2>Welcome to Campus Connect, ${name}!</h2>
//           <p>You have successfully registered for Campus Connect.</p>
//           <p>Login to explore upcoming campus events!</p>
//           <br/>
//           <p>Best regards,<br/>Campus Connect Team</p>
//         `,
//       },
//       (error, info) => {
//         if (error) {
//           console.error("❌ Email send error:", error);
//         } else {
//           console.log("✅ Email sent successfully:", info.response);
//         }
//       }
//     );

//     res.status(201).json({ message: "Student registered successfully. Confirmation email sent!" });
//   } catch (err) {
//     console.error("❌ Registration error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // router.post("/student/register", async (req, res) => {
// //   const { name, email, password, department } = req.body;

// //   try {
// //     // Check if user already exists
// //     const existing = await User.findOne({ email });
// //     if (existing) {
// //       return res.status(400).json({ message: "Email already exists" });
// //     }

// //     // Create new student user
// //     const newUser = new User({ name, email, password, department });
// //     await newUser.save();
// //   }

// //     // ✅ Send confirmation email
// //     await transporter.sendMail({from: `"Campus Connect" <${process.env.EMAIL_USER}>`,
// //     to: email,
// //     subject: "🎓 Registration Successful!",
// //     html: `
// //       <h2>Welcome to Campus Connect, ${name}!</h2>
// //       <p>You have successfully registered for Campus Connect.</p>
// //       <p>Login to explore upcoming campus events!</p>
// //       <br/>
// //       <p>Best regards,<br/>Campus Connect Team</p>
// //     `,
// //   },
// //   (error, info) => {
// //     if (error) {
// //       console.error("❌ Email send error:", error);
// //     } else {
// //       console.log("✅ Email sent successfully:", info.response);
// //     }
// //   }
// // );
// //       from: `"Campus Connect" <${process.env.EMAIL_USER}>`,
// //       to: email,
// //       subject: "🎓 Registration Successful!",
// //       html: `
// //         <h2>Welcome to Campus Connect, ${name}!</h2>
// //         <p>You have successfully registered for Campus Connect.</p>
// //         <p>Login to explore upcoming campus events!</p>
// //         <br/>
// //         <p>Best regards,<br/>Campus Connect Team</p>
// //       `,
// //     });

// //     res.status(201).json({
// //       message: "Student registered successfully. Confirmation email sent!",
// //     });
// //   } catch (err) {
// //     console.error("Registration error:", err);
// //     res
// //       .status(500)
// //       .json({ message: "Server error", error: err.message });
// //   }
// // });

// // export default router;
// import express from "express";
// import User from "../models/User.js"; // adjust the path as needed
// import nodemailer from "nodemailer";

// const router = express.Router();

// // ✅ Email transporter setup (example using Gmail)
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// router.post("/student/register", async (req, res) => {
//   const { name, email, password, department } = req.body;

//   try {
//     // Check if all fields exist
//     if (!name || !email || !password || !department) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Check if user already exists
//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     // Create new user
//     const newUser = new User({ name, email, password, department });
//     await newUser.save();

//     // ✅ Send confirmation email
//     await transporter.sendMail({
//       from: `"Campus Connect" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "🎓 Registration Successful!",
//       html: `
//         <h2>Welcome to Campus Connect, ${name}!</h2>
//         <p>You have successfully registered for Campus Connect.</p>
//         <p>Login to explore upcoming campus events!</p>
//         <br/>
//         <p>Best regards,<br/>Campus Connect Team</p>
//       `,
//     });

//     // ✅ Send success response
//     res.status(201).json({ message: "Registration successful and email sent!" });
//   } catch (error) {
//     console.error("❌ Registration error:", error);
//     res.status(500).json({ message: "Server error during registration" });
//   }
// });

// export default router;
// import express from "express";
// import { registerStudent } from "../controllers/studentAuthController.js";

// const router = express.Router();

// router.post("/register", registerStudent);

// export default router;
import express from "express";
import { registerStudent, loginStudent } from "../controllers/studentAuthController.js";

const router = express.Router();

// Routes
router.post("/register", registerStudent);
router.post("/login", loginStudent);

export default router;
