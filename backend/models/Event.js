
// import mongoose from "mongoose";

// const eventSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: String,
//   date: String,
//   time: String,
//   venue: String,
//   organizer: String,
//   department: String,
//   category: { type: String, default: "other" },
//   status: { type: String, default: "upcoming" },
//   maxParticipants: Number,
//   registrationRequired: { type: Boolean, default: false },
// }, { timestamps: true });

// export default mongoose.model("Event", eventSchema);
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String },
    venue: { type: String },
    department: { type: String },
    category: { type: String },
    status: { type: String, default: "upcoming" },
    organizer: { type: String },
    organizerEmail: { type: String },
    image: { type: String },
    registrationRequired: { type: Boolean, default: false },
    maxParticipants: { type: Number },
    registeredStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // linked to faculty user
      required: true,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
