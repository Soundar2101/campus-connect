import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { Event } from "../types";

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading event details...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  if (!event) {
    return <p className="text-center text-gray-500 mt-10">Event not found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-blue-600 mb-4"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Back
      </button>

      <h1 className="text-3xl font-bold text-blue-700 mb-3">{event.title}</h1>
      <p className="text-gray-700 text-sm mb-6">
        Posted by <span className="font-semibold">{event.createdBy?.name || "Faculty"}</span> •{" "}
        {new Date(event.date).toLocaleDateString()}
      </p>

      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}

      <p className="text-gray-800 mb-6">{event.description}</p>

      <div className="space-y-3 text-gray-700">
        <p><strong>Department:</strong> {event.department}</p>
        <p><strong>Location:</strong> {event.location || "Not specified"}</p>
        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {event.time || "Not specified"}</p>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => navigate(`/events/${event._id}/register`)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Register for Event
        </button>
      </div>
    </div>
  );
};

export default EventDetails;
