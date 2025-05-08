
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  Calendar, 
  DollarSign, 
  MessageCircle, 
  Settings, 
  ChevronRight,
  Users
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

interface VendorEvent {
  id: string;
  title?: string;
  date?: string | Date;
  type?: string;
  location?: string;
  status?: string;
}

interface VendorService {
  id: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
}

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [events, setEvents] = useState<VendorEvent[]>([]);
  const [pendingEvents, setPendingEvents] = useState<VendorEvent[]>([]);
  const [services, setServices] = useState<VendorService[]>([
    {
      id: "1",
      name: "Wedding Photography",
      description: "Professional wedding photography services",
      price: 1200,
      isActive: true
    },
    {
      id: "2",
      name: "DJ Services",
      description: "Music and entertainment for your event",
      price: 800,
      isActive: true
    },
    {
      id: "3",
      name: "Catering",
      description: "Delicious food for your guests",
      price: 35, // per person
      isActive: false
    }
  ]);

  const { currentUser, userData } = useAuth();
  
  useEffect(() => {
    const fetchEvents = async () => {
      // Demo data for now - in real app, this would fetch from Firestore
      // based on the vendor's services
      setEvents([
        {
          id: "event1",
          title: "Johnson Wedding",
          date: "2025-06-15",
          type: "Wedding",
          location: "Grand Hotel",
          status: "confirmed"
        },
        {
          id: "event2",
          title: "Tech Corp Annual Party",
          date: "2025-05-20",
          type: "Corporate",
          location: "Tech Corp HQ",
          status: "confirmed"
        }
      ]);
      
      setPendingEvents([
        {
          id: "event3",
          title: "Smith Graduation",
          date: "2025-07-10",
          type: "Graduation",
          location: "City University",
          status: "pending"
        }
      ]);
    };
    
    fetchEvents();
  }, []);

  const handleAcceptEvent = (eventId: string) => {
    // Move from pending to confirmed
    const event = pendingEvents.find(e => e.id === eventId);
    if (event) {
      setPendingEvents(pendingEvents.filter(e => e.id !== eventId));
      setEvents([...events, {...event, status: "confirmed"}]);
    }
  };
  
  const handleDeclineEvent = (eventId: string) => {
    // Remove from pending
    setPendingEvents(pendingEvents.filter(e => e.id !== eventId));
  };
  
  const handleToggleService = (serviceId: string) => {
    setServices(services.map(service => 
      service.id === serviceId 
        ? { ...service, isActive: !service.isActive } 
        : service
    ));
  };

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen py-24 px-6 bg-gradient-to-b from-background via-accent/20 to-background transition-all">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold mb-2">Vendor Dashboard</h1>
            <p className="text-muted-foreground">Manage your services and event bookings</p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{events.length}</div>
                    <p className="text-xs text-muted-foreground">
                      +{pendingEvents.length} pending approval
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {services.filter(s => s.isActive).length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      of {services.length} total services
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Revenue (YTD)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$8,450</div>
                    <p className="text-xs text-muted-foreground">
                      +12% from last year
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Events</CardTitle>
                    <CardDescription>Your upcoming event bookings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {events.length > 0 ? (
                      <div className="space-y-4">
                        {events.slice(0, 3).map(event => (
                          <div key={event.id} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{event.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(event.date as string).toLocaleDateString()}, {event.location}
                              </p>
                            </div>
                            <Badge>{event.type}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        No upcoming events
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Approvals</CardTitle>
                    <CardDescription>Events waiting for your confirmation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {pendingEvents.length > 0 ? (
                      <div className="space-y-4">
                        {pendingEvents.map(event => (
                          <div key={event.id} className="flex flex-col space-y-2 border-b pb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium">{event.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(event.date as string).toLocaleDateString()}, {event.location}
                                </p>
                              </div>
                              <Badge variant="outline">{event.type}</Badge>
                            </div>
                            <div className="flex gap-2 justify-end">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeclineEvent(event.id)}
                              >
                                Decline
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleAcceptEvent(event.id)}
                              >
                                Accept
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        No pending approvals
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="events" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Calendar</CardTitle>
                  <CardDescription>Your schedule of confirmed events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.map(event => (
                      <div key={event.id} className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-start gap-4">
                          <div className="bg-primary/10 rounded-md p-2 text-center min-w-16">
                            <div className="text-xs uppercase">
                              {new Date(event.date as string).toLocaleDateString(undefined, { month: 'short' })}
                            </div>
                            <div className="text-xl font-bold">
                              {new Date(event.date as string).getDate()}
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold">{event.title}</p>
                            <p className="text-sm text-muted-foreground">{event.location}</p>
                            <Badge className="mt-1" variant="outline">{event.type}</Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <ChevronRight />
                          <span className="sr-only">Event details</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  {events.length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 font-medium">No events found</h3>
                      <p className="text-muted-foreground">You don't have any events booked yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="services" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Your Services</CardTitle>
                      <CardDescription>Manage the services you offer</CardDescription>
                    </div>
                    <Button>Add New Service</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.map(service => (
                      <div key={service.id} className="flex items-center justify-between border-b pb-3">
                        <div>
                          <div className="font-semibold">{service.name}</div>
                          <div className="text-sm text-muted-foreground">{service.description}</div>
                          <div className="font-medium mt-1">${service.price.toFixed(2)}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={service.isActive ? "default" : "outline"}>
                            {service.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Button 
                            variant="outline"
                            onClick={() => handleToggleService(service.id)}
                          >
                            {service.isActive ? "Disable" : "Enable"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Profile</CardTitle>
                  <CardDescription>Manage your business information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Business Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2 rounded border"
                      value="Celebrations & Co."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea 
                      className="w-full p-2 rounded border" 
                      rows={3}
                      value="We provide premium event services for all types of celebrations."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Email</label>
                    <input 
                      type="email" 
                      className="w-full p-2 rounded border"
                      value="contact@celebrationsco.com"
                    />
                  </div>
                  
                  <Button className="mt-4">Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default VendorDashboard;
