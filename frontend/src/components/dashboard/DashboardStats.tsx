
// import React, { useState } from 'react';
// import { Calendar, Users, Award, Clock, Upload } from 'lucide-react';
// import { Event } from '../../types';

// interface DashboardStatsProps {
//   events: Event[];
//   userRole: 'staff' | 'student';
// }

// export default function DashboardStats({ events, userRole }: DashboardStatsProps) {
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);

//   const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
//   const totalEvents = events.length;
//   const competitionsCount = events.filter(e => e.category === 'competition').length;
//   const workshopsCount = events.filter(e => e.category === 'workshop').length;

//   const stats = userRole === 'staff'
//     ? [
//         { label: 'Total Events', value: totalEvents, icon: Calendar, color: 'blue' },
//         { label: 'Upcoming Events', value: upcomingEvents, icon: Clock, color: 'green' },
//         { label: 'Competitions', value: competitionsCount, icon: Award, color: 'red' },
//         { label: 'Workshops', value: workshopsCount, icon: Users, color: 'purple' }
//       ]
//     : [
//         { label: 'Available Events', value: totalEvents, icon: Calendar, color: 'blue' },
//         { label: 'Upcoming Events', value: upcomingEvents, icon: Clock, color: 'green' },
//         { label: 'Competitions', value: competitionsCount, icon: Award, color: 'red' },
//         { label: 'Workshops', value: workshopsCount, icon: Users, color: 'purple' }
//       ];

//   const getColorClasses = (color: string) => {
//     const colorMap = {
//       blue: 'bg-blue-50 text-blue-600',
//       green: 'bg-green-50 text-green-600',
//       red: 'bg-red-50 text-red-600',
//       purple: 'bg-purple-50 text-purple-600'
//     };
//     return colorMap[color as keyof typeof colorMap] || colorMap.blue;
//   };

//   // Handle image upload
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setSelectedImage(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleUpload = async () => {
//     if (!selectedImage) return alert('Please select an image first.');

//     const formData = new FormData();
//     formData.append('image', selectedImage);

//     try {
//       const response = await fetch('http://localhost:5000/api/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();
//       alert(`✅ Image uploaded successfully: ${data.imageUrl}`);
//     } catch (error) {
//       console.error('Upload error:', error);
//       alert('❌ Failed to upload image.');
//     }
//   };

//   return (
//     <div className="space-y-8">
//       {/* Dashboard Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {stats.map((stat, index) => {
//           const Icon = stat.icon;
//           return (
//             <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">{stat.label}</p>
//                   <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
//                 </div>
//                 <div className={`p-3 rounded-full ${getColorClasses(stat.color)}`}>
//                   <Icon className="h-6 w-6" />
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Image Uploader Section */}
//       <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center">
//         <h3 className="text-lg font-semibold mb-4">Upload Dashboard Image</h3>

//         {preview && (
//           <div className="mb-4 flex justify-center">
//             <img src={preview} alt="Preview" className="w-48 h-48 object-cover rounded-lg border" />
//           </div>
//         )}

//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageChange}
//           className="block mx-auto mb-3"
//         />
//         <button
//           onClick={handleUpload}
//           className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
//         >
//           <Upload className="h-4 w-4" /> Upload
//         </button>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { Calendar, Users, Award, Clock, Upload, Activity } from 'lucide-react';
import { Event } from '../../types';

interface DashboardStatsProps {
  events: Event[];
  userRole: 'staff' | 'student';
}

export default function DashboardStats({ events, userRole }: DashboardStatsProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // ✅ Count all event types properly
  const upcomingEvents = events.filter(e => {
    const eventDate = new Date(e.date);
    return eventDate > new Date(); // Only future events
  }).length;

  const totalEvents = events.length;
  const competitionsCount = events.filter(e => e.category.toLowerCase() === 'competition').length;
  const workshopsCount = events.filter(e => e.category.toLowerCase() === 'workshop').length;
  const seminarCount = events.filter(e => e.category.toLowerCase() === 'seminar').length;
  const activityCount = events.filter(e => e.category.toLowerCase() === 'activity').length;
  const otherCount = events.filter(e => e.category.toLowerCase() === 'other').length;

  // ✅ Build dynamic stats list (hide zero values)
  const allStats = [
    { label: 'Total Events', value: totalEvents, icon: Calendar, color: 'blue' },
    { label: 'Upcoming Events', value: upcomingEvents, icon: Clock, color: 'green' },
    { label: 'Competitions', value: competitionsCount, icon: Award, color: 'red' },
    { label: 'Workshops', value: workshopsCount, icon: Users, color: 'purple' },
    { label: 'Seminars', value: seminarCount, icon: Activity, color: 'orange' },
    { label: 'Activities', value: activityCount, icon: Activity, color: 'pink' },
    { label: 'Others', value: otherCount, icon: Calendar, color: 'gray' }
  ].filter(stat => stat.value > 0); // hide zero counts

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      red: 'bg-red-50 text-red-600',
      purple: 'bg-purple-50 text-purple-600',
      orange: 'bg-orange-50 text-orange-600',
      pink: 'bg-pink-50 text-pink-600',
      gray: 'bg-gray-50 text-gray-600',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  // ✅ Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return alert('Please select an image first.');
    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      alert(`✅ Image uploaded successfully: ${data.imageUrl}`);
    } catch (error) {
      console.error('Upload error:', error);
      alert('❌ Failed to upload image.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {allStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${getColorClasses(stat.color)}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Image Uploader Section */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center">
        <h3 className="text-lg font-semibold mb-4">Upload Dashboard Image</h3>

        {preview && (
          <div className="mb-4 flex justify-center">
            <img src={preview} alt="Preview" className="w-48 h-48 object-cover rounded-lg border" />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block mx-auto mb-3"
        />
        <button
          onClick={handleUpload}
          className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          <Upload className="h-4 w-4" /> Upload
        </button>
      </div>
    </div>
  );
}
