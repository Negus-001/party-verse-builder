import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEvents } from '@/context/EventContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Users, Search, Plus, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useVirtualizer } from '@tanstack/react-virtual';

const Events = () => {
  const navigate = useNavigate();
  const { events, loading } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [animateItems, setAnimateItems] = useState(false);
  
  // Filter events based on search term
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Trigger animation after component mount for a nice staggered effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateItems(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const getEventTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'wedding':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'birthday':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'corporate':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'graduation':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'babyshower':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        staggerChildren: 0.05, 
        staggerDirection: -1 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    },
    exit: { 
      y: -20, 
      opacity: 0
    }
  };

  // Function to format Firebase timestamp or fall back to a placeholder
  const formatEventDate = (date: any) => {
    if (!date) return "Date not set";
    
    try {
      // Check if it's a Firebase timestamp (has seconds and nanoseconds)
      if (date.seconds && date.nanoseconds) {
        return new Date(date.seconds * 1000).toLocaleDateString();
      }
      
      // Check if it's an ISO string
      if (typeof date === 'string') {
        return new Date(date).toLocaleDateString();
      }
      
      return "Date format not recognized";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const parentRef = React.useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: filteredEvents.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 350, // Estimated height of each event card
    overscan: 5
  });

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen py-24 px-6 transition-all">
        <motion.div 
          className="container mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
            variants={itemVariants}
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 bg-gradient-to-r from-primary to-purple-400 text-transparent bg-clip-text animate-pulse-slow">
                Celebration Central
              </h1>
              <p className="text-muted-foreground animate-fade-in">
                Browse and manage your celebrations with ease
              </p>
            </div>
            <Button 
              onClick={() => navigate('/create-event')} 
              className="group transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              <Plus size={16} className="mr-2 group-hover:rotate-90 transition-transform" />
              Create New Celebration
            </Button>
          </motion.div>

          <motion.div className="mb-8" variants={itemVariants}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search events by name, location, or type..." 
                className="pl-10 transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>

          <motion.div 
            ref={parentRef}
            className="h-[800px] overflow-auto rounded-lg"
            variants={itemVariants}
          >
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative"
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const event = filteredEvents[virtualRow.index];
                return (
                  <motion.div
                    key={event.id}
                    variants={itemVariants}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <Card 
                      className="event-card overflow-hidden hover:border-primary transition-all duration-300 cursor-pointer bg-card/50 backdrop-blur-sm"
                      onClick={() => navigate(`/event/${event.id}`)}
                    >
                      {event.image && (
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={event.image} 
                            alt={event.title} 
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Celebration+Central';
                            }}
                          />
                        </div>
                      )}
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <Badge 
                            variant="outline" 
                            className={`${getEventTypeColor(event.type)} capitalize`}
                          >
                            {event.type}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 line-clamp-1">{event.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{event.description}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Clock size={14} className="mr-2" />
                            {formatEventDate(event.date)}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <MapPin size={14} className="mr-2" />
                            {event.location}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Users size={14} className="mr-2" />
                            {event.guests} guests
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </>
  );
};

export default Events;
