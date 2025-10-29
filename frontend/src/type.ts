export interface Event {
  _id?: string;
  title: string;
  description: string;
  category: 'workshop' | 'competition' | 'seminar' | 'activity' | 'other';
  department: string;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  organizerEmail: string;
  maxParticipants?: number;
  registrationRequired: boolean;
  status: 'upcoming' | 'ongoing' | 'completed';
  image?: string;   // ✅ Add this line
}
