// import React, { useState } from "react";

// const EventRegistration: React.FC = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     rollNo: "",
//     email: "",
//     department: "",
//     event: "",
//   });

//   const [submitted, setSubmitted] = useState(false);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       // You can later connect this to your backend API
//       console.log("Registration submitted:", formData);
//       setSubmitted(true);
//       setFormData({
//         name: "",
//         rollNo: "",
//         email: "",
//         department: "",
//         event: "",
//       });
//     } catch (err) {
//       console.error("Error submitting registration:", err);
//     }
//   };

//   if (submitted) {
//     return (
//       <div className="bg-white rounded-lg shadow-lg max-w-md mx-auto p-8 text-center">
//         <h2 className="text-2xl font-bold text-green-700 mb-4">
//           Registration Successful!
//         </h2>
//         <p className="text-gray-600 mb-4">
//           Thank you for registering. You’ll receive updates soon.
//         </p>
//         <button
//           onClick={() => setSubmitted(false)}
//           className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
//         >
//           Register Another Event
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-lg mx-auto bg-white shadow-md rounded-xl p-8 mt-6">
//       <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
//         Event Registration Form
//       </h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Full Name
//           </label>
//           <input
//             type="text"
//             name="name"
//             required
//             value={formData.name}
//             onChange={handleChange}
//             className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-green-500 focus:border-green-500"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Roll Number
//           </label>
//           <input
//             type="text"
//             name="rollNo"
//             required
//             value={formData.rollNo}
//             onChange={handleChange}
//             className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-green-500 focus:border-green-500"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Email
//           </label>
//           <input
//             type="email"
//             name="email"
//             required
//             value={formData.email}
//             onChange={handleChange}
//             className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-green-500 focus:border-green-500"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Department
//           </label>
//           <select
//             name="department"
//             required
//             value={formData.department}
//             onChange={handleChange}
//             className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-green-500 focus:border-green-500"
//           >
//             <option value="">Select Department</option>
//             <option value="CSE">CSE</option>
//             <option value="ECE">ECE</option>
//             <option value="EEE">EEE</option>
//             <option value="MECH">MECH</option>
//             <option value="CIVIL">CIVIL</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Event Name
//           </label>
//           <input
//             type="text"
//             name="event"
//             required
//             value={formData.event}
//             onChange={handleChange}
//             className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-green-500 focus:border-green-500"
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
//         >
//           Register
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EventRegistration;
