
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '@/context/EventContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, MapPin, Users, Search, Plus, ChevronRight } from 'lucide-react';

const Events = () => {
  const navigate = useNavigate();
  const { events, loading } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter events based on search term
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEventTypeColor = (type: string) => {
    switch (type) {
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

  return (
    <>
      <Navbar />

      <main className="min-h-screen py-24 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Events</h1>
              <p className="text-muted-foreground">Browse and manage your events</p>
            </div>
            <Button onClick={() => navigate('/create-event')} className="group">
              <Plus size={16} className="mr-2 group-hover:rotate-90 transition-transform" />
              Create New Event
            </Button>
          </div>

          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search events by name, location, or type..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-pulse space-y-4 w-full">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="opacity-70">
                        <CardContent className="h-32 p-6"></CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <Card 
                      key={event.id} 
                      className="event-card overflow-hidden hover:border-primary transition-all cursor-pointer"
                      onClick={() => navigate(`/event/${event.id}`)}
                    >
                      {event.image && (
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={event.image} 
                            alt={event.title} 
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
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
                            {event.date}
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
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-accent/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                    <Calendar size={24} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No events found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm ? 'Try a different search term' : 'Create your first event to get started'}
                  </p>
                  <Button onClick={() => navigate('/create-event')}>
                    <Plus size={16} className="mr-2" />
                    Create New Event
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="upcoming">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Upcoming events filtering coming soon</p>
              </div>
            </TabsContent>
            
            <TabsContent value="past">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Past events filtering coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Events;
