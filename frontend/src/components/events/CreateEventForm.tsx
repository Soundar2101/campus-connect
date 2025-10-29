// src/components/events/CreateEventForm.tsx
import React, { useState } from "react";
import { Save, X } from "lucide-react";
import { Event } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { createEvent, updateEvent } from "../../api/eventsApi";

interface CreateEventFormProps {
  onSubmit?: (event: Event) => void; // optional callback to notify parent with created/updated event
  onCancel?: () => void;
  initialData?: Event;
  isEditing?: boolean;
}

export default function CreateEventForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing,
}: CreateEventFormProps) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: (initialData?.category || "other") as Event["category"],
    department: initialData?.department || user?.department || "",
    date: initialData?.date || "",
    time: initialData?.time || "",
    venue: initialData?.venue || "",
    organizer: initialData?.organizer || user?.name || "",
    organizerEmail: initialData?.organizerEmail || user?.email || "",
    maxParticipants: initialData?.maxParticipants?.toString() || "",
    registrationRequired: initialData?.registrationRequired || false,
    status: (initialData?.status || "upcoming") as Event["status"],
    image: initialData?.image || "",
    file: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, file, image: imageUrl }));
    } else {
      setFormData((prev) => ({ ...prev, file: null }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("category", formData.category);
      payload.append("department", formData.department);
      payload.append("date", formData.date);
      payload.append("time", formData.time);
      payload.append("venue", formData.venue);
      payload.append("organizer", formData.organizer);
      payload.append("organizerEmail", formData.organizerEmail);
      payload.append("registrationRequired", String(formData.registrationRequired));
      payload.append("status", formData.status);
      if (formData.maxParticipants) payload.append("maxParticipants", formData.maxParticipants);
      if (formData.file) payload.append("image", formData.file);

      let resultEvent: Event;
      if (isEditing && initialData?.id) {
        // use id, backend expects :id in URL
        resultEvent = await updateEvent(initialData.id, payload);
      } else {
        resultEvent = await createEvent(payload);
      }

      // Notify parent with the created/updated event
      onSubmit?.(resultEvent);

      // optionally reset when creating new event
      if (!isEditing) {
        setFormData({
          title: "",
          description: "",
          category: "other",
          department: user?.department || "",
          date: "",
          time: "",
          venue: "",
          organizer: user?.name || "",
          organizerEmail: user?.email || "",
          maxParticipants: "",
          registrationRequired: false,
          status: "upcoming",
          image: "",
          file: null,
        });
      }
    } catch (err: any) {
      console.error("Create/Update event error:", err);
      setError(err?.response?.data?.message ?? err.message ?? "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {isEditing ? "Edit Event" : "Create New Event"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="text-sm text-red-700 bg-red-50 p-2 rounded">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter event title"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the event"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Upload Event Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {formData.image && (
              <div className="mt-3">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="h-40 w-auto rounded-md shadow-md border"
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="workshop">Workshop</option>
              <option value="competition">Competition</option>
              <option value="seminar">Seminar</option>
              <option value="activity">Activity</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              Department *
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Department name"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
              Time *
            </label>
            <input
              type="text"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 10:00 AM"
            />
          </div>

          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-2">
              Venue *
            </label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Event location"
            />
          </div>

          <div>
            <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-2">
              Max Participants
            </label>
            <input
              type="number"
              id="maxParticipants"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Leave blank for unlimited"
            />
          </div>

          <div>
            <label htmlFor="organizer" className="block text-sm font-medium text-gray-700 mb-2">
              Organizer *
            </label>
            <input
              type="text"
              id="organizer"
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Organizer name"
            />
          </div>

          <div>
            <label htmlFor="organizerEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Organizer Email *
            </label>
            <input
              type="email"
              id="organizerEmail"
              name="organizerEmail"
              value={formData.organizerEmail}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="contact@college.edu"
            />
          </div>

          <div className="md:col-span-2 flex items-center space-x-3 mt-2">
            <input
              type="checkbox"
              id="registrationRequired"
              name="registrationRequired"
              checked={formData.registrationRequired}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="registrationRequired" className="text-sm font-medium text-gray-700">
              Registration Required
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            <span>{isEditing ? "Update Event" : "Create Event"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
