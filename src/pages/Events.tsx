
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
import { getEventTypeColor, formatEventDate } from '@/utils/eventHelpers';
import { useAuth } from '@/context/AuthContext';

const Events = () => {
  const navigate = useNavigate();
  const { events, loading } = useEvents();
  const { currentUser, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Get current date for filtering
  const currentDate = new Date();
  
  // Filter events based on search term, filter, and tab
  const filteredEvents = events.filter(event => {
    // Filter by search term
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.type.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Filter by event type
    const matchesFilter = selectedFilter === 'all' ? true : 
      event.type.toLowerCase() === selectedFilter.toLowerCase();
      
    // Filter by tab (past, upcoming, all)
    const eventDate = new Date(event.date);
    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'upcoming' ? eventDate >= currentDate :
      activeTab === 'past' ? eventDate < currentDate :
      true;
      
    // Only show user's own events (unless admin)
    const isOwnEvent = isAdmin || event.createdBy === currentUser?.uid;
    
    return matchesSearch && matchesFilter && matchesTab && isOwnEvent;
  });

  const parentRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset virtual list when filters change
    if (parentRef.current) {
      parentRef.current.scrollTop = 0;
    }
  }, [selectedFilter, searchTerm, activeTab]);

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

          <Tabs 
            defaultValue="all" 
            className="mb-8"
            onValueChange={(value) => setActiveTab(value)}
          >
            <TabsList className="mb-6">
              <TabsTrigger value="all" className="rounded-full">All Events</TabsTrigger>
              <TabsTrigger value="upcoming" className="rounded-full">Upcoming</TabsTrigger>
              <TabsTrigger value="past" className="rounded-full">Past Events</TabsTrigger>
            </TabsList>
          </Tabs>

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
              <option value="all">All Types</option>
              <option value="wedding">Weddings</option>
              <option value="birthday">Birthdays</option>
              <option value="corporate">Corporate</option>
              <option value="graduation">Graduations</option>
              <option value="babyshower">Baby Showers</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="relative overflow-hidden backdrop-blur-sm">
                  <div className="h-48 bg-muted/50 animate-pulse rounded-t-lg" />
                  <CardContent className="p-6 space-y-4">
                    <div className="h-4 w-2/3 bg-muted/70 rounded animate-pulse" />
                    <div className="h-3 w-full bg-muted/70 rounded animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-3 w-4/5 bg-muted/70 rounded animate-pulse" />
                      <div className="h-3 w-3/4 bg-muted/70 rounded animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-block p-4 bg-muted/30 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-medium mb-2">No events found</h2>
              <p className="text-muted-foreground mb-6">
                {searchTerm || selectedFilter !== 'all' 
                  ? "Try adjusting your filters to see more events" 
                  : "You haven't created any events yet"}
              </p>
              <Button onClick={() => navigate('/create-event')}>
                <Plus size={16} className="mr-2" />
                Create Your First Event
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className="group hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 overflow-hidden h-full backdrop-blur-sm bg-card/50"
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
                      <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-start mb-2">
                          <Badge
                            variant="outline"
                            className={getEventTypeColor(event.type)}
                          >
                            {event.type}
                          </Badge>
                          
                          <Badge variant={
                            new Date(event.date) < currentDate 
                              ? "outline" 
                              : "default"
                          }>
                            {new Date(event.date) < currentDate ? "Past" : "Upcoming"}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-semibold line-clamp-1">{event.title}</h3>
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
                        <div className="pt-4 flex justify-end">
                          <Button variant="ghost" size="sm" className="text-primary p-0 hover:bg-transparent group-hover:translate-x-1 transition-transform">
                            View Details
                            <ChevronRight size={16} className="ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Events;
