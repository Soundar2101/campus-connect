// src/components/events/EventCard.tsx
import React, { useState } from "react";
import { Calendar, Clock, MapPin, User, Users, Tag } from "lucide-react";
import { Event } from "../../types";
import { deleteEvent } from "../../api/eventsApi";

interface EventCardProps {
  event: Event;
  showActions?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void; // parent should update UI / refetch
}

export default function EventCard({ event, showActions, onEdit, onDelete }: EventCardProps) {
  const [deleting, setDeleting] = useState(false);

  const getCategoryColor = (category?: Event["category"]) => {
    const colors: Record<string, string> = {
      workshop: "bg-blue-100 text-blue-800",
      competition: "bg-red-100 text-red-800",
      seminar: "bg-green-100 text-green-800",
      activity: "bg-purple-100 text-purple-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category ?? ""] || colors.other;
  };

  const getStatusColor = (status?: Event["status"]) => {
    const colors: Record<string, string> = {
      upcoming: "bg-yellow-100 text-yellow-800",
      ongoing: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status ?? "upcoming"] || colors.upcoming;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "TBD";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const handleDelete = async () => {
    const id = (event as any).id ?? (event as any)._id;
    if (!id) {
      console.warn("No id available for event", event);
      return;
    }
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    setDeleting(true);
    try {
      await deleteEvent(String(id));
      onDelete?.(String(id));
    } catch (err) {
      console.error("Failed to delete event:", err);
      alert("Failed to delete event. See console for details.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                <Tag className="h-3 w-3 mr-1" />
                {event.category ? event.category.charAt(0).toUpperCase() + event.category.slice(1) : "Uncategorized"}
              </span>

              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                {event.status ? event.status.charAt(0).toUpperCase() + event.status.slice(1) : "Unknown"}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{event.time ?? "TBD"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{event.venue ?? "TBD"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>{event.organizer ?? "Unknown"} • {event.department ?? "General"}</span>
          </div>
          {event.maxParticipants && (
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Max participants: {event.maxParticipants}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            {event.registrationRequired && (
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                Registration Required
              </span>
            )}
          </div>

          {showActions && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit?.(event)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                disabled={deleting}
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
