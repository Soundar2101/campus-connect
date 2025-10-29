
import React, { useState, useEffect } from "react";
import { Calendar, Users, TrendingUp, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface Event {
  _id: string;
  title: string;
  description: string;
  department: string;
  date: string;
  status?: string;
  attendees?: number;
}

const StudentDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const upcomingEvents = events.filter(
    (event) => new Date(event.date) >= new Date()
  );

  const pastEvents = events.filter(
    (event) => new Date(event.date) < new Date()
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">
            Loading events...
          </p>
        </div>
      </div>
    );
  }

  // --------------------- Dashboard View ---------------------
  const renderDashboard = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, Student
        </h1>
        <p className="text-gray-600">
          Discover upcoming events and stay connected with campus activities.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {events.length}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {upcomingEvents.length}
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Past Events</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {pastEvents.length}
              </p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {new Set(events.map((e) => e.department)).size}
              </p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Upcoming Events
          </h2>
          <button
            onClick={() => setActiveTab("events")}
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            View All
          </button>
        </div>

        <div className="p-6">
          {upcomingEvents.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No upcoming events available.
            </p>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.slice(0, 3).map((event) => (
                <div
                  key={event._id}
                  className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="bg-green-100 rounded-lg p-3">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 truncate">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {event.department}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // --------------------- All Events ---------------------
  const renderAllEvents = () => (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">All Events</h1>
      <p className="text-gray-600 mb-6">
        Browse all campus events and activities.
      </p>

      {events.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No events available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white shadow rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${new Date(event.date) >= new Date()
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {new Date(event.date) >= new Date() ? "Upcoming" : "Past"}
                </span>

                <h2 className="text-xl font-semibold text-gray-900 mt-3 mb-2">
                  {event.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    <Users className="inline-block h-4 w-4 mr-2 text-gray-400" />
                    Department: {event.department}
                  </p>
                  <p className="text-sm text-gray-500">
                    <Calendar className="inline-block h-4 w-4 mr-2 text-gray-400" />
                    Date:{" "}
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4">
                <Link
                  to={`/events/${event._id}`}
                  className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // --------------------- Registration ---------------------
  const renderRegistration = () => (
    <div className="bg-white shadow rounded-lg p-8 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Event Registration
      </h2>
      <p className="text-gray-600 mb-6">
        Select an event to register your participation.
      </p>

      <div className="space-y-4 max-w-md mx-auto">
        {upcomingEvents.map((event) => (
      
          <Link
            to={`/events/${event._id}/register`}
            className="text-blue-600 hover:underline"
          >Register Now
          </Link>


        ))}
      </div>
    </div>
  );

  // --------------------- Return Layout ---------------------
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-700">Campus Events</h1>
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="h-5 w-5" />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex space-x-8 px-6">
          {["dashboard", "events", "registration"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              {tab === "dashboard"
                ? "Dashboard"
                : tab === "events"
                  ? "All Events"
                  : "Registration"}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "dashboard"
          ? renderDashboard()
          : activeTab === "events"
            ? renderAllEvents()
            : renderRegistration()}
      </main>
    </div>
  );
};

export default StudentDashboard;
