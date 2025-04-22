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
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  // Filter events based on search term and filter
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.type.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && event.type.toLowerCase() === selectedFilter.toLowerCase();
  });

  const parentRef = React.useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: filteredEvents.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 350,
    overscan: 5
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-24 px-6 bg-gradient-to-b from-background via-accent/20 to-background transition-all">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                Your Events
              </h1>
              <p className="text-muted-foreground text-lg">
                Browse and manage your upcoming celebrations
              </p>
            </div>
            <Button
              onClick={() => navigate('/create-event')}
              className="group hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
            >
              <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Create New Event
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search events by name, location, or type..."
                className="pl-10 transition-all focus:ring-2 focus:ring-primary/30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="w-full md:w-48 p-2 rounded-md border border-input bg-background"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Events</option>
              <option value="wedding">Weddings</option>
              <option value="birthday">Birthdays</option>
              <option value="corporate">Corporate</option>
              <option value="graduation">Graduations</option>
              <option value="babyshower">Baby Showers</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="relative overflow-hidden">
                  <div className="h-48 bg-muted animate-pulse" />
                  <CardContent className="p-6 space-y-4">
                    <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-full bg-muted rounded animate-pulse" />
                    <div className="h-3 w-4/5 bg-muted rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div
              ref={parentRef}
              className="h-[800px] overflow-auto rounded-lg"
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
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <Card
                        className="group hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 overflow-hidden backdrop-blur-sm bg-card/50"
                        onClick={() => navigate(`/event/${event.id}`)}
                      >
                        {event.image && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Celebration+Central';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        )}
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <Badge
                              variant="outline"
                              className={getEventTypeColor(event.type)}
                            >
                              {event.type}
                            </Badge>
                          </div>
                          <h3 className="text-xl font-semibold mb-2 line-clamp-1">{event.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{event.description}</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <Calendar size={14} className="mr-2" />
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
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Events;
