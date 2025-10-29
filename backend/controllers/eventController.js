// // controllers/eventController.js
// import Event from "../models/Event.js";

// export const createEvent = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       date,
//       time,
//       venue,
//       organizer,
//       department,
//       category,
//       status,
//       maxParticipants,
//       registrationRequired
//     } = req.body;

//     const newEvent = new Event({
//       title,
//       description,
//       date,
//       time,
//       venue,
//       organizer,
//       department,
//       category,
//       status,
//       maxParticipants,
//       registrationRequired,
//     });

//     await newEvent.save();
//     res.status(201).json({ success: true, event: newEvent });
//   } catch (err) {
//     console.error("Error creating event:", err);
//     res.status(500).json({ success: false, message: "Failed to create event" });
//   }
// };
// controllers/eventController.js
import Event from "../models/Event.js";
import User from "../models/User.js";
import { sendMail } from "../utils/sendMail.js";

/* =========================================================
   1️⃣ CREATE EVENT (Faculty)
   ========================================================= */
export const createEvent = async (req, res) => {
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

    // ✅ Validate required fields
    if (!title || !description || !date || !department) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    // ✅ Create new event
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
      createdBy: organizerEmail || "faculty@college.com",
    });

    const savedEvent = await newEvent.save();
    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: savedEvent,
    });
  } catch (err) {
    console.error("❌ Error creating event:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while creating event",
      error: err.message,
    });
  }
};

/* =========================================================
   2️⃣ GET ALL EVENTS
   ========================================================= */
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    return res.status(200).json(events);
  } catch (err) {
    console.error("❌ Error fetching events:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching events",
      error: err.message,
    });
  }
};

/* =========================================================
   3️⃣ GET EVENT BY ID
   ========================================================= */
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "registeredStudents",
      "name email"
    );

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    return res.status(200).json(event);
  } catch (err) {
    console.error("❌ Error fetching event details:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching event details",
      error: err.message,
    });
  }
};

/* =========================================================
   4️⃣ UPDATE EVENT (Faculty)
   ========================================================= */
export const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (err) {
    console.error("❌ Error updating event:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while updating event",
      error: err.message,
    });
  }
};

/* =========================================================
   5️⃣ DELETE EVENT (Faculty)
   ========================================================= */
export const deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (err) {
    console.error("❌ Error deleting event:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting event",
      error: err.message,
    });
  }
};

/* =========================================================
   6️⃣ REGISTER STUDENT FOR EVENT + SEND EMAIL
   ========================================================= */
export const registerStudent = async (req, res) => {
  try {
    const { studentEmail } = req.body;

    if (!studentEmail) {
      return res.status(400).json({
        success: false,
        message: "Student email is required",
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event)
      return res.status(404).json({ success: false, message: "Event not found" });

    const student = await User.findOne({ email: studentEmail, role: "student" });
    if (!student)
      return res.status(404).json({ success: false, message: "Student not found" });

    if (event.registeredStudents?.includes(student._id)) {
      return res.status(400).json({
        success: false,
        message: "Already registered for this event",
      });
    }

    event.registeredStudents.push(student._id);
    await event.save();

    // ✅ Send confirmation email
    const emailHTML = `
      <h2>Hi ${student.name},</h2>
      <p>🎉 You have successfully registered for the event:</p>
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
      success: true,
      message: "Student registered successfully! Confirmation email sent.",
      event,
    });
  } catch (err) {
    console.error("❌ Error registering student:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while registering student",
      error: err.message,
    });
  }
};
