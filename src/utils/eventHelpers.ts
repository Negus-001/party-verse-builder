
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
    default:
      return 'bg-primary/10 text-primary border-primary/20';
  }
};
