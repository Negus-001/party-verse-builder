
import { Timestamp } from 'firebase/firestore';

// Format timestamp specifically for display in event cards
export const formatEventDate = (timestamp: Timestamp | string | undefined | null): string => {
  if (!timestamp) return '';
  
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  
  try {
    if (typeof timestamp === 'object' && 'toDate' in timestamp) {
      const date = timestamp.toDate();
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      console.error("Invalid timestamp format:", timestamp);
      return 'Invalid date';
    }
  } catch (error) {
    console.error("Error formatting event date:", error);
    return 'Invalid date';
  }
};

// Get color class for event type badge
export const getEventTypeColor = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'wedding':
      return 'bg-pink-500/10 text-pink-500 border-pink-500/20';
    case 'birthday':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'corporate':
      return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    case 'graduation':
      return 'bg-violet-500/10 text-violet-500 border-violet-500/20';
    case 'babyshower':
      return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
    case 'party':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'reunion':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    case 'conference':
      return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
    default:
      return 'bg-primary/10 text-primary border-primary/20';
  }
};

// Filter events by date (past, upcoming, all)
export const filterEventsByDate = (events: any[], filter: 'all' | 'upcoming' | 'past'): any[] => {
  if (filter === 'all') return events;
  
  const now = new Date();
  
  return events.filter(event => {
    // Handle different timestamp formats
    let eventDate: Date;
    
    if (!event.date) return filter === 'past'; // If no date, consider it past
    
    if (typeof event.date === 'string') {
      eventDate = new Date(event.date);
    } else if (typeof event.date === 'object' && 'toDate' in event.date) {
      eventDate = event.date.toDate();
    } else {
      console.error("Unknown date format:", event.date);
      return filter === 'past'; // If unknown format, consider it past
    }
    
    if (filter === 'upcoming') {
      return eventDate >= now;
    } else { // past
      return eventDate < now;
    }
  });
};

// Sort events by date
export const sortEventsByDate = (events: any[], order: 'asc' | 'desc' = 'asc'): any[] => {
  return [...events].sort((a, b) => {
    let dateA: Date;
    let dateB: Date;
    
    // Handle different timestamp formats for a
    if (!a.date) {
      dateA = new Date(0); // Default to epoch if no date
    } else if (typeof a.date === 'string') {
      dateA = new Date(a.date);
    } else if (typeof a.date === 'object' && 'toDate' in a.date) {
      dateA = a.date.toDate();
    } else {
      dateA = new Date(0);
    }
    
    // Handle different timestamp formats for b
    if (!b.date) {
      dateB = new Date(0); // Default to epoch if no date
    } else if (typeof b.date === 'string') {
      dateB = new Date(b.date);
    } else if (typeof b.date === 'object' && 'toDate' in b.date) {
      dateB = b.date.toDate();
    } else {
      dateB = new Date(0);
    }
    
    return order === 'asc' 
      ? dateA.getTime() - dateB.getTime() 
      : dateB.getTime() - dateA.getTime();
  });
};
