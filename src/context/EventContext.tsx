
import React, { createContext, useContext, useState, useEffect } from 'react';

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
}

interface EventContextType {
  events: EventItem[];
  addEvent: (event: Omit<EventItem, 'id' | 'createdAt'>) => void;
  getEvent: (id: string) => EventItem | undefined;
  updateEvent: (id: string, updatedEvent: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  loading: boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Simulate fetching data from Firebase
  useEffect(() => {
    // This would be replaced with real Firebase fetch
    const mockEvents: EventItem[] = [
      {
        id: '1',
        title: 'Summer Wedding',
        date: 'August 15, 2024',
        location: 'Malibu Beach Club',
        description: 'A beautiful beach wedding with sunset views',
        type: 'wedding',
        guests: 120,
        createdBy: 'user123',
        createdAt: new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74'
      },
      {
        id: '2',
        title: 'Company Holiday Party',
        date: 'December 18, 2024',
        location: 'Grand Hotel Downtown',
        description: 'Annual company celebration with dinner and entertainment',
        type: 'corporate',
        guests: 75,
        createdBy: 'user123',
        createdAt: new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e'
      }
    ];
    
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Add a new event
  const addEvent = (event: Omit<EventItem, 'id' | 'createdAt'>) => {
    const newEvent: EventItem = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    // Here we would also save to Firebase
  };
  
  // Get a specific event by ID
  const getEvent = (id: string) => {
    return events.find((event) => event.id === id);
  };
  
  // Update an event
  const updateEvent = (id: string, updatedEvent: Partial<EventItem>) => {
    setEvents((prevEvents) => 
      prevEvents.map((event) => 
        event.id === id ? { ...event, ...updatedEvent } : event
      )
    );
    // Here we would also update in Firebase
  };
  
  // Delete an event
  const deleteEvent = (id: string) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
    // Here we would also delete from Firebase
  };
  
  return (
    <EventContext.Provider 
      value={{ 
        events, 
        addEvent,
        getEvent,
        updateEvent,
        deleteEvent,
        loading 
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
