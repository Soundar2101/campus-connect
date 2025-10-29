import React, { useState } from 'react';
import { Search, Calendar } from 'lucide-react';
import { Event } from '../../types';
import EventCard from './EventCard';

interface EventListProps {
  events: Event[];
  loading?: boolean;
  showActions?: boolean;
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (eventId: string) => void;
}

export default function EventList({
  events = [],
  loading = false,
  showActions = false,
  onEditEvent,
  onDeleteEvent,
}: EventListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  const categories = ['all', 'workshop', 'competition', 'seminar', 'activity', 'other'];
  const departments = ['all', ...Array.from(new Set(events.map(e => e.department || 'Unknown')))];

  // ✅ Safely handle undefined values
  const filteredEvents = events.filter(event => {
    const title = event.title?.toLowerCase() || '';
    const description = event.description?.toLowerCase() || '';
    const category = event.category || '';
    const department = event.department || '';

    const matchesSearch =
      title.includes(searchTerm.toLowerCase()) ||
      description.includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
    const matchesDepartment = selectedDepartment === 'all' || department === selectedDepartment;

    return matchesSearch && matchesCategory && matchesDepartment;
  });

  // ✅ Loading skeleton
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-500">
            {events.length === 0
              ? 'No events have been posted yet.'
              : 'Try adjusting your search criteria.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              showActions={showActions}
              onEdit={onEditEvent}
              onDelete={onDeleteEvent}
            />
          ))}
        </div>
      )}
    </div>
  );
}
