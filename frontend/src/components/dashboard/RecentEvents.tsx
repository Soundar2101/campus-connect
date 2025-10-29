import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Event } from '../../types';

interface RecentEventsProps {
  events: Event[];
  title: string;
  onViewAll: () => void;
}

export default function RecentEvents({ events, title, onViewAll }: RecentEventsProps) {
  const recentEvents = events.slice(0, 5);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button
          onClick={onViewAll}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="p-6">
        {recentEvents.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No events to display</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentEvents.map((event) => (
              <div key={event.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {event.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(event.date)} • {event.time} • {event.venue}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {event.department}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    event.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                    event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}