
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { PlusCircle, Search, CalendarIcon, MapPin, UsersRound, X, Filter, SlidersHorizontal } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getEventTypeColor, formatEventDate, filterEventsByDate, sortEventsByDate } from '@/utils/eventHelpers';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from 'framer-motion';

interface Event {
  id: string;
  title: string;
  description?: string;
  type: string;
  date: any; // Can be Timestamp or string
  location: string;
  status?: string;
  guests?: number;
  createdBy: string;
}

const Events = () => {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchEvents = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Create a query to get events created by the current user
        const eventsQuery = query(
          collection(db, 'events'), 
          where('createdBy', '==', currentUser.uid)
        );
        const eventsSnapshot = await getDocs(eventsQuery);

        if (eventsSnapshot.empty) {
          setEvents([]);
          setFilteredEvents([]);
        } else {
          const eventsData: Event[] = [];
          eventsSnapshot.forEach(doc => {
            const event = { id: doc.id, ...doc.data() } as Event;
            eventsData.push(event);
          });
          
          // Sort events by date
          const sortedEvents = sortEventsByDate(eventsData, sortOrder);
          setEvents(sortedEvents);
          setFilteredEvents(sortedEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: 'Error',
          description: 'Failed to load events. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentUser, toast, sortOrder]);

  // Filter events when search or filters change
  useEffect(() => {
    if (events.length === 0) {
      setFilteredEvents([]);
      return;
    }

    let result = [...events];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        event => 
          event.title.toLowerCase().includes(term) || 
          event.location.toLowerCase().includes(term) ||
          (event.description && event.description.toLowerCase().includes(term))
      );
    }

    // Filter by event type
    if (typeFilter !== 'all') {
      result = result.filter(event => event.type.toLowerCase() === typeFilter.toLowerCase());
    }

    // Filter by date
    result = filterEventsByDate(result, dateFilter);
    
    // Sort the results
    result = sortEventsByDate(result, sortOrder);
    
    setFilteredEvents(result);
  }, [events, searchTerm, typeFilter, dateFilter, sortOrder]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setDateFilter('all');
    setSortOrder('asc');
    setFilteredEvents(events);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const eventTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'wedding', label: 'Wedding' },
    { value: 'birthday', label: 'Birthday' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'party', label: 'Party' },
    { value: 'graduation', label: 'Graduation' },
    { value: 'reunion', label: 'Reunion' },
    { value: 'babyshower', label: 'Baby Shower' }
  ];

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen py-20 px-6 bg-gradient-to-b from-background to-background/90">
        <motion.div 
          className="container max-w-6xl mx-auto space-y-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl md:text-4xl font-display font-bold">Your Events</h1>
              <p className="text-muted-foreground">Manage and view all your celebration plans</p>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Button 
                onClick={() => navigate('/create-event')}
                className="w-full md:w-auto"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-shrink-0"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters {showFilters ? '▲' : '▼'}
              </Button>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Event Type</SelectLabel>
                    {eventTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
          
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-card rounded-lg p-4 shadow-sm border">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2 flex-grow">
                      <div className="flex items-center">
                        <SlidersHorizontal className="h-4 w-4 mr-2 text-muted-foreground" />
                        <h3 className="text-sm font-medium">Advanced Filters</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm" htmlFor="date-filter">Date</label>
                          <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as any)}>
                            <SelectTrigger id="date-filter">
                              <SelectValue placeholder="Filter by date" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Events</SelectItem>
                              <SelectItem value="upcoming">Upcoming Events</SelectItem>
                              <SelectItem value="past">Past Events</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm" htmlFor="sort-order">Sort Order</label>
                          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
                            <SelectTrigger id="sort-order">
                              <SelectValue placeholder="Sort by date" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="asc">Date (Oldest First)</SelectItem>
                              <SelectItem value="desc">Date (Newest First)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="ghost" onClick={handleResetFilters} className="h-10">
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="grid" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>
                
                <div className="text-sm text-muted-foreground">
                  {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
                </div>
              </div>
              
              {loading ? (
                // Loading skeleton
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="p-0">
                        <div className="w-full h-48">
                          <Skeleton className="w-full h-full" />
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-6 w-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <>
                  <TabsContent value="grid">
                    {filteredEvents.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                          <motion.div
                            key={event.id}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-all border-2">
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <Badge
                                    className={getEventTypeColor(event.type)}
                                  >
                                    {event.type}
                                  </Badge>
                                </div>
                                <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                              </CardHeader>
                              <CardContent className="pb-2 space-y-4 flex-grow">
                                {event.description && (
                                  <p className="text-muted-foreground text-sm line-clamp-2">{event.description}</p>
                                )}
                                <div className="space-y-2">
                                  <div className="flex items-center text-sm">
                                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span>{formatEventDate(event.date)}</span>
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span className="truncate">{event.location}</span>
                                  </div>
                                  {event.guests && (
                                    <div className="flex items-center text-sm">
                                      <UsersRound className="mr-2 h-4 w-4 text-muted-foreground" />
                                      <span>{event.guests} guests</span>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                              <CardFooter>
                                <Button 
                                  variant="outline" 
                                  className="w-full"
                                  onClick={() => navigate(`/event/${event.id}`)}
                                >
                                  View Details
                                </Button>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 space-y-4">
                        <div className="mx-auto bg-muted/50 rounded-full w-20 h-20 flex items-center justify-center">
                          <CalendarIcon className="h-10 w-10 text-muted-foreground/70" />
                        </div>
                        <h3 className="text-xl font-medium">No events found</h3>
                        <p className="text-muted-foreground">
                          {searchTerm || typeFilter !== 'all' || dateFilter !== 'all' 
                            ? "Try adjusting your filters to find more events." 
                            : "You haven't created any events yet."}
                        </p>
                        <Button 
                          onClick={() => navigate('/create-event')}
                          className="mt-4"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Create New Event
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="list">
                    {filteredEvents.length > 0 ? (
                      <div className="space-y-4">
                        {filteredEvents.map((event) => (
                          <Card 
                            key={event.id}
                            className="overflow-hidden hover:shadow-md transition-all border-2"
                          >
                            <div className="flex flex-col md:flex-row">
                              <div className="md:w-2/3 p-6">
                                <div className="flex flex-wrap gap-2 mb-2">
                                  <Badge
                                    className={getEventTypeColor(event.type)}
                                  >
                                    {event.type}
                                  </Badge>
                                  {event.status && (
                                    <Badge variant="outline">
                                      {event.status}
                                    </Badge>
                                  )}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                                {event.description && (
                                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{event.description}</p>
                                )}
                                <div className="space-y-2">
                                  <div className="flex items-center text-sm">
                                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span>{formatEventDate(event.date)}</span>
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span>{event.location}</span>
                                  </div>
                                  {event.guests && (
                                    <div className="flex items-center text-sm">
                                      <UsersRound className="mr-2 h-4 w-4 text-muted-foreground" />
                                      <span>{event.guests} guests</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Separator orientation="vertical" className="hidden md:block" />
                              <div className="p-6 flex items-center justify-center md:w-1/3">
                                <Button onClick={() => navigate(`/event/${event.id}`)}>
                                  View Event Details
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 space-y-4">
                        <div className="mx-auto bg-muted/50 rounded-full w-20 h-20 flex items-center justify-center">
                          <CalendarIcon className="h-10 w-10 text-muted-foreground/70" />
                        </div>
                        <h3 className="text-xl font-medium">No events found</h3>
                        <p className="text-muted-foreground">
                          {searchTerm || typeFilter !== 'all' || dateFilter !== 'all' 
                            ? "Try adjusting your filters to find more events." 
                            : "You haven't created any events yet."}
                        </p>
                        <Button 
                          onClick={() => navigate('/create-event')}
                          className="mt-4"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Create New Event
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </>
              )}
            </Tabs>
          </motion.div>
        </motion.div>
      </main>
      
      <Footer />
    </>
  );
};

export default Events;
