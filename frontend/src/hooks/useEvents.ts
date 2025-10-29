import { useState, useEffect } from 'react';
import { Event } from '../types';

// Mock events data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'AI & Machine Learning Workshop',
    description: 'Hands-on workshop covering fundamentals of AI and ML with practical applications.',
    category: 'workshop',
    department: 'Computer Science',
    date: '2025-01-20',
    time: '10:00 AM',
    venue: 'CS Lab 101',
    organizer: 'Dr. Sarah Johnson',
    organizerEmail: 'sarah.johnson@college.edu',
    maxParticipants: 30,
    registrationRequired: true,
    status: 'upcoming',
    createdAt: '2025-01-10T09:00:00Z',
    updatedAt: '2025-01-10T09:00:00Z'
  },
  {
    id: '2',
    title: 'Annual Coding Competition',
    description: 'Test your programming skills in this exciting inter-department competition.',
    category: 'competition',
    department: 'Computer Science',
    date: '2025-01-25',
    time: '2:00 PM',
    venue: 'Main Auditorium',
    organizer: 'Prof. Michael Chen',
    organizerEmail: 'michael.chen@college.edu',
    maxParticipants: 100,
    registrationRequired: true,
    status: 'upcoming',
    createdAt: '2025-01-08T14:00:00Z',
    updatedAt: '2025-01-08T14:00:00Z'
  },
  {
    id: '3',
    title: 'Career Guidance Seminar',
    description: 'Learn about career opportunities and industry trends from experienced professionals.',
    category: 'seminar',
    department: 'Career Services',
    date: '2025-01-18',
    time: '11:00 AM',
    venue: 'Conference Hall',
    organizer: 'Ms. Jennifer Williams',
    organizerEmail: 'jennifer.williams@college.edu',
    registrationRequired: false,
    status: 'upcoming',
    createdAt: '2025-01-05T10:00:00Z',
    updatedAt: '2025-01-05T10:00:00Z'
  }
];

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 500);
  }, []);

  const addEvent = (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents(prev => prev.map(event => 
      event.id === id 
        ? { ...event, ...updates, updatedAt: new Date().toISOString() }
        : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  return {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent
  };
}