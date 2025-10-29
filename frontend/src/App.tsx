// import React, { useState } from 'react';
// import { Routes, Route } from 'react-router-dom';
// import { useAuth } from './contexts/AuthContext';
// import { useEvents } from './hooks/useEvents';
// import Header from './components/layout/Header';
// import Navigation from './components/layout/Navigation';
// import StudentDashboard from "./components/dashboard/StudentDashboard";
// import LoginForm from './components/auth/LoginForm';
// import RegisterForm from './components/auth/RegisterForm';
// import StudentRegisterForm from './components/auth/StudentRegisterForm';
// import StudentLoginForm from './components/auth/StudentLoginForm';
// import EventList from './components/events/EventList';
// import CreateEventForm from './components/events/CreateEventForm';
// import DashboardStats from './components/dashboard/DashboardStats';
// import RecentEvents from './components/dashboard/RecentEvents';
// import { Event } from './types';


// function Dashboard() {
//   const { user } = useAuth();
//   const { events, loading, addEvent, updateEvent, deleteEvent } = useEvents();
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [editingEvent, setEditingEvent] = useState<Event | null>(null);

//   const userEvents = user?.role === 'staff'
//     ? events.filter(e => e.organizerEmail === user.email)
//     : events;

//   const handleCreateEvent = (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
//     addEvent(eventData);
//     setActiveTab('events');
//   };

//   const handleUpdateEvent = (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
//     if (editingEvent) {
//       updateEvent(editingEvent.id, eventData);
//       setEditingEvent(null);
//       setActiveTab('manage');
//     }
//   };

//   const handleEditEvent = (event: Event) => {
//     setEditingEvent(event);
//     setActiveTab('create');
//   };

//   const handleDeleteEvent = (eventId: string) => {
//     if (window.confirm('Are you sure you want to delete this event?')) {
//       deleteEvent(eventId);
//     }
//   };

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'dashboard':
//         return (
//           <div className="space-y-8">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900 mb-2">
//                 Welcome back, {user?.name}
//               </h1>
//               <p className="text-gray-600">
//                 {user?.role === 'staff'
//                   ? 'Manage your events and stay connected with campus activities.'
//                   : 'Discover upcoming events and stay connected with campus activities.'}
//               </p>
//             </div>

//             <DashboardStats events={events} userRole={user?.role || 'student'} />

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               <RecentEvents
//                 events={events.filter(e => e.status === 'upcoming')}
//                 title="Upcoming Events"
//                 onViewAll={() => setActiveTab('events')}
//               />
//               {user?.role === 'staff' && (
//                 <RecentEvents
//                   events={userEvents}
//                   title="My Events"
//                   onViewAll={() => setActiveTab('manage')}
//                 />
//               )}
//             </div>
//           </div>
//         );

//       case 'events':
//         return (
//           <div>
//             <div className="mb-6">
//               <h1 className="text-2xl font-bold text-gray-900 mb-2">All Events</h1>
//               <p className="text-gray-600">Browse all campus events and activities.</p>
//             </div>
//             <EventList events={events} loading={loading} />
//           </div>
//         );

//       case 'create':
//         return (
//           <div>
//             <div className="mb-6">
//               <h1 className="text-2xl font-bold text-gray-900 mb-2">
//                 {editingEvent ? 'Edit Event' : 'Create New Event'}
//               </h1>
//               <p className="text-gray-600">
//                 {editingEvent ? 'Update event details.' : 'Share your event with the campus community.'}
//               </p>
//             </div>
//             <CreateEventForm
//               onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
//               onCancel={() => {
//                 setEditingEvent(null);
//                 setActiveTab(editingEvent ? 'manage' : 'dashboard');
//               }}
//               initialData={editingEvent || undefined}
//               isEditing={!!editingEvent}
//             />
//           </div>
//         );

//       case 'manage':
//         return (
//           <div>
//             <div className="mb-6">
//               <h1 className="text-2xl font-bold text-gray-900 mb-2">My Events</h1>
//               <p className="text-gray-600">Manage events you've created.</p>
//             </div>
//             <EventList
//               events={userEvents}
//               loading={loading}
//               showActions={true}
//               onEditEvent={handleEditEvent}
//               onDeleteEvent={handleDeleteEvent}
//             />
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
//       <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {renderContent()}
//       </main>
//     </div>
//   );
// }

// function AppContent() {
//   const { user, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <LoginForm />;
//   }

//   return <Dashboard />;
// }

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<AppContent />} />
//       <Route path="/login" element={<LoginForm />} />
//       <Route path="/register" element={<RegisterForm />} />
//       <Route path="/dashboard" element={<Dashboard />} />
//       <Route path ="/student" element={<StudentRegisterForm/>}/>
//       <Route path="/student/login" element={<StudentLoginForm/>}/>
//       <Route path="/student/dashboard" element={<StudentDashboard />} />
//       <Route path="/events/:id" element={<EventDetails />} />


//     </Routes>
//   );
// }

// export default App;
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { useEvents } from "./hooks/useEvents";

import Header from "./components/layout/Header";
import Navigation from "./components/layout/Navigation";
import StudentDashboard from "./components/dashboard/StudentDashboard";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import StudentRegisterForm from "./components/auth/StudentRegisterForm";
import StudentLoginForm from "./components/auth/StudentLoginForm";
import EventRegistration from './components/auth/EventRegistration';
import EventList from "./components/events/EventList";
import CreateEventForm from "./components/events/CreateEventForm";
import DashboardStats from "./components/dashboard/DashboardStats";
import RecentEvents from "./components/dashboard/RecentEvents";
import EventDetails from  "./components/events/EventDetails";
// ✅ Added this import

import { Event } from "./types";

function Dashboard() {
  const { user } = useAuth();
  const { events, loading, addEvent, updateEvent, deleteEvent } = useEvents();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const userEvents =
    user?.role === "staff"
      ? events.filter((e) => e.organizerEmail === user.email)
      : events;

  const handleCreateEvent = (
    eventData: Omit<Event, "id" | "createdAt" | "updatedAt">
  ) => {
    addEvent(eventData);
    setActiveTab("events");
  };

  const handleUpdateEvent = (
    eventData: Omit<Event, "id" | "createdAt" | "updatedAt">
  ) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
      setEditingEvent(null);
      setActiveTab("manage");
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setActiveTab("create");
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteEvent(eventId);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name}
              </h1>
              <p className="text-gray-600">
                {user?.role === "staff"
                  ? "Manage your events and stay connected with campus activities."
                  : "Discover upcoming events and stay connected with campus activities."}
              </p>
            </div>

            <DashboardStats
              events={events}
              userRole={user?.role || "student"}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RecentEvents
                events={events.filter((e) => e.status === "upcoming")}
                title="Upcoming Events"
                onViewAll={() => setActiveTab("events")}
              />
              {user?.role === "staff" && (
                <RecentEvents
                  events={userEvents}
                  title="My Events"
                  onViewAll={() => setActiveTab("manage")}
                />
              )}
            </div>
          </div>
        );

      case "events":
        return (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                All Events
              </h1>
              <p className="text-gray-600">
                Browse all campus events and activities.
              </p>
            </div>
            <EventList events={events} loading={loading} />
          </div>
        );

      case "create":
        return (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {editingEvent ? "Edit Event" : "Create New Event"}
              </h1>
              <p className="text-gray-600">
                {editingEvent
                  ? "Update event details."
                  : "Share your event with the campus community."}
              </p>
            </div>
            <CreateEventForm
              onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
              onCancel={() => {
                setEditingEvent(null);
                setActiveTab(editingEvent ? "manage" : "dashboard");
              }}
              initialData={editingEvent || undefined}
              isEditing={!!editingEvent}
            />
          </div>
        );

      case "manage":
        return (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                My Events
              </h1>
              <p className="text-gray-600">
                Manage events you've created.
              </p>
            </div>
            <EventList
              events={userEvents}
              loading={loading}
              showActions={true}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return <Dashboard />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppContent />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/student" element={<StudentRegisterForm />} />
      <Route path="/student/login" element={<StudentLoginForm />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/events/:id/register" element={<EventRegistration />} />
      {/* <Route path="/register/:id" element={<EventRegistration />} /> */}

      <Route path="/events/:id" element={<EventDetails />} /> {/* ✅ Added Event Details route */}
    </Routes>
  );
}

export default App;
