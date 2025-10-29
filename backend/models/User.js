
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: {
    type: String,
    required: true,
    enum: ["AERO", "CHEMICAL", "CIVIL", "CSE", "ECE", "IT", "MECH", "eventmanagement", "events"],
  },
  role: { type: String, enum: ["staff", "student"], default: "student" },
  verified: { type: Boolean, default: true },
}, { timestamps: true });

// ✅ Prevent model overwrite
export default mongoose.models.User || mongoose.model("User", userSchema);
