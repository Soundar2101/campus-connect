import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendMail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Campus Connect" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Mail sent to ${to}`);
  } catch (err) {
    console.error("❌ Error sending mail:", err);
  }
};
