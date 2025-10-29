
// import express from "express";
// import Event from "../models/Event.js";
// import User from "../models/User.js";
// import { sendMail } from "../utils/sendMail.js";
// import upload from "../middleware/upload.js";

// const router = express.Router();

// /* =========================================================
//    1️⃣ CREATE EVENT (Faculty)
//    ========================================================= */
// router.post("/", upload.single("image"), async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       date,
//       department,
//       venue,
//       time,
//       category,
//       status,
//       organizer,
//       organizerEmail,
//       registrationRequired,
//       maxParticipants,
//     } = req.body;

//     if (!title || !description || !date || !department) {
//       return res
//         .status(400)
//         .json({ message: "All required fields must be filled" });
//     }

//     const newEvent = new Event({
//       title,
//       description,
//       date,
//       department,
//       venue,
//       time,
//       category,
//       status,
//       organizer,
//       organizerEmail,
//       registrationRequired:
//         registrationRequired === "true" ||
//         registrationRequired === true ||
//         registrationRequired === 1,
//       maxParticipants: maxParticipants ? parseInt(maxParticipants, 10) : undefined,
//       image: req.file ? `/uploads/events/${req.file.filename}` : undefined,
//       createdBy: organizerEmail || "faculty@college.com",
//     });

//     const savedEvent = await newEvent.save();
//     return res
//       .status(201)
//       .json({ message: "Event created successfully", event: savedEvent });
//   } catch (err) {
//     console.error("❌ Error creating event:", err);
//     return res
//       .status(500)
//       .json({ message: "Server error", error: err.message });
//   }
// });

// /* =========================================================
//    2️⃣ GET ALL EVENTS
//    ========================================================= */
// router.get("/", async (req, res) => {
//   try {
//     const events = await Event.find().sort({ createdAt: -1 });
//     return res.status(200).json(events);
//   } catch (err) {
//     console.error("❌ Error fetching events:", err);
//     return res
//       .status(500)
//       .json({ message: "Server error", error: err.message });
//   }
// });

// /* =========================================================
//    3️⃣ GET EVENT BY ID
//    ========================================================= */
// router.get("/:id", async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id).populate(
//       "registeredStudents",
//       "name email"
//     );
//     if (!event) {
//       return res.status(404).json({ message: "Event not found" });
//     }
//     return res.status(200).json(event);
//   } catch (err) {
//     console.error("❌ Error fetching event details:", err);
//     return res
//       .status(500)
//       .json({ message: "Server error", error: err.message });
//   }
// });

// /* =========================================================
//    4️⃣ UPDATE EVENT (Faculty)
//    ========================================================= */
// router.put("/:id", async (req, res) => {
//   try {
//     const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedEvent) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     return res
//       .status(200)
//       .json({ message: "Event updated successfully", event: updatedEvent });
//   } catch (err) {
//     console.error("❌ Error updating event:", err);
//     return res
//       .status(500)
//       .json({ message: "Server error", error: err.message });
//   }
// });

// /* =========================================================
//    5️⃣ DELETE EVENT (Faculty)
//    ========================================================= */
// router.delete("/:id", async (req, res) => {
//   try {
//     const deletedEvent = await Event.findByIdAndDelete(req.params.id);
//     if (!deletedEvent) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     return res.status(200).json({ message: "Event deleted successfully" });
//   } catch (err) {
//     console.error("❌ Error deleting event:", err);
//     return res
//       .status(500)
//       .json({ message: "Server error", error: err.message });
//   }
// });

// /* =========================================================
//    6️⃣ REGISTER STUDENT FOR EVENT + SEND EMAIL
//    ========================================================= */
// router.post("/:id/register", async (req, res) => {
//   try {
//     const { studentEmail } = req.body;

//     if (!studentEmail) {
//       return res.status(400).json({ message: "Student email is required" });
//     }

//     const event = await Event.findById(req.params.id);
//     if (!event) return res.status(404).json({ message: "Event not found" });

//     const student = await User.findOne({ email: studentEmail, role: "student" });
//     if (!student) return res.status(404).json({ message: "Student not found" });

//     // Prevent duplicate registration
//     if (event.registeredStudents?.includes(student._id)) {
//       return res.status(400).json({ message: "Already registered for this event" });
//     }

//     // Register student
//     event.registeredStudents.push(student._id);
//     await event.save();

//     // Send email confirmation
//     const emailHTML = `
//       <h2>Hi ${student.name},</h2>
//       <p>🎉 You have successfully registered for the event:</p>
//       <h3>${event.title}</h3>
//       <p>${event.description}</p>
//       <p><b>Date:</b> ${new Date(event.date).toLocaleDateString()}</p>
//       <p><b>Venue:</b> ${event.venue}</p>
//       <br/>
//       <a href="http://localhost:5173/event/${event._id}" 
//          style="background:#007BFF;color:white;padding:10px 20px;text-decoration:none;border-radius:8px;">
//          View Event Details
//       </a>
//     `;

//     await sendMail(student.email, `Registration for ${event.title}`, emailHTML);

//     return res.status(200).json({
//       message: "Student registered successfully! Confirmation email sent.",
//       event,
//     });
//   } catch (err) {
//     console.error("❌ Error registering student:", err);
//     return res
//       .status(500)
//       .json({ message: "Server error", error: err.message });
//   }
// });

// export default router;
import express from "express";
import Event from "../models/Event.js";
import User from "../models/User.js";
import { sendMail } from "../utils/sendMail.js";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js"; // ✅ Protect routes

const router = express.Router();

/* =========================================================
   1️⃣ CREATE EVENT (Faculty)
   ========================================================= */
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      department,
      venue,
      time,
      category,
      status,
      organizer,
      organizerEmail,
      registrationRequired,
      maxParticipants,
    } = req.body;

    if (!title || !description || !date || !department) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    // ✅ Store the event with faculty reference
    const newEvent = new Event({
      title,
      description,
      date,
      department,
      venue,
      time,
      category,
      status,
      organizer,
      organizerEmail,
      registrationRequired:
        registrationRequired === "true" ||
        registrationRequired === true ||
        registrationRequired === 1,
      maxParticipants: maxParticipants ? parseInt(maxParticipants, 10) : undefined,
      image: req.file ? `/uploads/events/${req.file.filename}` : undefined,
      createdBy: req.user._id, // ✅ Important: Link the event to the logged-in faculty
    });

    const savedEvent = await newEvent.save();
    return res
      .status(201)
      .json({ message: "Event created successfully", event: savedEvent });
  } catch (err) {
    console.error("❌ Error creating event:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

/* =========================================================
   2️⃣ GET ALL EVENTS (Visible to all users)
   ========================================================= */
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }).populate("createdBy", "name email role");
    return res.status(200).json(events);
  } catch (err) {
    console.error("❌ Error fetching events:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

/* =========================================================
   3️⃣ GET MY EVENTS (Faculty’s events only)
   ========================================================= */
router.get("/my-events", protect, async (req, res) => {
  try {
    const myEvents = await Event.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    if (!myEvents.length) {
      return res.status(200).json([]);
    }
    return res.status(200).json(myEvents);
  } catch (err) {
    console.error("❌ Error fetching my events:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

/* =========================================================
   4️⃣ GET EVENT BY ID
   ========================================================= */
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "registeredStudents",
      "name email"
    );
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    return res.status(200).json(event);
  } catch (err) {
    console.error("❌ Error fetching event details:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

/* =========================================================
   5️⃣ UPDATE EVENT (Faculty)
   ========================================================= */
router.put("/:id", protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    // Ensure only creator can edit
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this event" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res
      .status(200)
      .json({ message: "Event updated successfully", event: updatedEvent });
  } catch (err) {
    console.error("❌ Error updating event:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

/* =========================================================
   6️⃣ DELETE EVENT (Faculty)
   ========================================================= */
router.delete("/:id", protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    // Only creator can delete
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this event" });
    }

    await Event.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting event:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

/* =========================================================
   7️⃣ REGISTER STUDENT FOR EVENT + SEND EMAIL
   ========================================================= */
router.post("/:id/register", protect, async (req, res) => {
  try {
    const { studentEmail } = req.body;

    if (!studentEmail) {
      return res.status(400).json({ message: "Student email is required" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const student = await User.findOne({ email: studentEmail, role: "student" });
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Prevent duplicate registration
    if (event.registeredStudents?.includes(student._id)) {
      return res.status(400).json({ message: "Already registered for this event" });
    }

    event.registeredStudents.push(student._id);
    await event.save();

    // Send confirmation mail
    const emailHTML = `
      <h2>Hi ${student.name},</h2>
      <p>🎉 You have successfully registered for:</p>
      <h3>${event.title}</h3>
      <p>${event.description}</p>
      <p><b>Date:</b> ${new Date(event.date).toLocaleDateString()}</p>
      <p><b>Venue:</b> ${event.venue}</p>
      <br/>
      <a href="http://localhost:5173/event/${event._id}" 
         style="background:#007BFF;color:white;padding:10px 20px;text-decoration:none;border-radius:8px;">
         View Event Details
      </a>
    `;
    await sendMail(student.email, `Registration for ${event.title}`, emailHTML);

    return res.status(200).json({
      message: "Student registered successfully! Confirmation email sent.",
      event,
    });
  } catch (err) {
    console.error("❌ Error registering student:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

export default router;
