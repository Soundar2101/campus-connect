export interface User {
  id: string;
  name: string;
  email: string;
  role: 'staff' | 'student';
  department?: string;
  verified: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: 'workshop' | 'competition' | 'activity' | 'seminar' | 'other';
  department: string;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  organizerEmail: string;
  maxParticipants?: number;
  registrationRequired: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
}