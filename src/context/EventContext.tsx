
import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, query, getDocs, doc, getDoc, updateDoc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db, auth, formatTimestamp } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

// Define event types
export interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  type: string;
  guests: number;
  createdBy: string;
  createdAt: string;
  image?: string;
  budget?: number;
  preferences?: string;
}

interface FirestoreEventItem {
  title: string;
  date: string | Timestamp;
  location: string;
  description: string;
  type: string;
  guests: number;
  createdBy: string;
  createdAt: Timestamp | null;
  image?: string;
  budget?: number;
  preferences?: string;
}

interface EventContextType {
  events: EventItem[];
  addEvent: (event: Omit<EventItem, 'id' | 'createdAt' | 'createdBy'>) => Promise<string>;
  getEvent: (id: string) => EventItem | undefined;
  updateEvent: (id: string, updatedEvent: Partial<EventItem>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  loading: boolean;
  refreshEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

// Helper function to safely format dates from Firestore
const formatEventDate = (date: any): string => {
  if (!date) return 'No date specified';
  
  try {
    // If it's a Firestore timestamp object with seconds
    if (date && typeof date === 'object' && 'seconds' in date) {
      return new Date(date.seconds * 1000).toLocaleDateString();
    }
    
    // If it's a string date
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString();
    }
    
    // If it's already a Date object
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    
    return 'Invalid date format';
  } catch (error) {
    console.error("Error formatting date:", error, date);
    return 'Date error';
  }
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Fetch events from Firestore
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventsCollection = collection(db, 'events');
      const eventsSnapshot = await getDocs(eventsCollection);
      
      const eventsList: EventItem[] = eventsSnapshot.docs.map(doc => {
        const data = doc.data() as FirestoreEventItem;
        
        // Ensure createdAt is properly formatted
        let createdAtStr = 'Unknown';
        if (data.createdAt) {
          createdAtStr = formatTimestamp(data.createdAt);
        }
        
        // Format date safely
        const formattedDate = formatEventDate(data.date);
        
        return {
          id: doc.id,
          title: data.title || 'Untitled Event',
          date: formattedDate,
          location: data.location || 'No location specified',
          description: data.description || 'No description',
          type: data.type || 'other',
          guests: data.guests || 0,
          createdBy: data.createdBy || '',
          createdAt: createdAtStr,
          image: data.image,
          budget: data.budget,
          preferences: data.preferences
        };
      });
      
      setEvents(eventsList);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to load events. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);
  
  // Add a new event
  const addEvent = async (event: Omit<EventItem, 'id' | 'createdAt' | 'createdBy'>) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('You must be logged in to create an event');
      }
      
      const newEvent = {
        ...event,
        createdBy: currentUser.uid,
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'events'), newEvent);
      
      // Refresh events list
      await fetchEvents();
      
      return docRef.id;
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  // Get a specific event by ID
  const getEvent = (id: string) => {
    return events.find((event) => event.id === id);
  };
  
  // Update an event
  const updateEvent = async (id: string, updatedEvent: Partial<EventItem>) => {
    try {
      const eventRef = doc(db, 'events', id);
      await updateDoc(eventRef, updatedEvent);
      
      // Update local state
      setEvents((prevEvents) => 
        prevEvents.map((event) => 
          event.id === id ? { ...event, ...updatedEvent } : event
        )
      );
      
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  // Delete an event
  const deleteEvent = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'events', id));
      
      // Update local state
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
      
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  // Refresh events (useful after adding/deleting)
  const refreshEvents = async () => {
    await fetchEvents();
  };
  
  return (
    <EventContext.Provider 
      value={{ 
        events, 
        addEvent,
        getEvent,
        updateEvent,
        deleteEvent,
        loading,
        refreshEvents
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
