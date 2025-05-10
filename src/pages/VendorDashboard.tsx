
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatEventDate, getEventTypeColor } from '@/utils/eventHelpers';
import { CalendarIcon, ClipboardList, Bell, Settings, Users, CalendarCheck, Calendar, Calendar as CalendarIcon2, Percent, Building, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VendorEvent {
  id: string;
  title: string;
  type: string;
  date: Timestamp;
  location: string;
  status: 'upcoming' | 'active' | 'completed' | 'canceled';
  clientName: string;
  amount: number;
}

interface VendorStats {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  totalRevenue: number;
}

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { userData, currentUser } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<VendorEvent[]>([]);
  const [stats, setStats] = useState<VendorStats>({
    totalEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  // Get vendor services
  const vendorServices = userData?.services || [];
  
  useEffect(() => {
    const fetchVendorEvents = async () => {
      if (!currentUser || !userData) return;

      try {
        // Create a query against events that match this vendor's services
        const eventsRef = collection(db, "events");
        
        // We're using the vendor's services to find matching events
        // In a real app, you might have a more direct relationship between vendors and events
        const eventQuery = query(
          eventsRef, 
          where("vendorServices", "array-contains-any", vendorServices)
        );
        
        const querySnapshot = await getDocs(eventQuery);
        
        const vendorEvents: VendorEvent[] = [];
        let revenue = 0;
        let upcoming = 0;
        let completed = 0;
        
        querySnapshot.forEach((doc) => {
          const eventData = doc.data();
          const event: VendorEvent = {
            id: doc.id,
            title: eventData.title,
            type: eventData.type,
            date: eventData.date,
            location: eventData.location,
            status: eventData.status || 'upcoming',
            clientName: eventData.clientName || 'Client',
            amount: eventData.amount || 0
          };
          
          vendorEvents.push(event);
          revenue += event.amount;
          
          if (event.status === 'upcoming') upcoming++;
          if (event.status === 'completed') completed++;
        });
        
        setEvents(vendorEvents);
        setStats({
          totalEvents: vendorEvents.length,
          upcomingEvents: upcoming,
          completedEvents: completed,
          totalRevenue: revenue
        });
      } catch (error) {
        console.error("Error fetching vendor events:", error);
        toast({
          title: "Error",
          description: "Failed to load event data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVendorEvents();
  }, [currentUser, userData, vendorServices, toast]);

  // Filter events by status
  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  const completedEvents = events.filter(event => event.status === 'completed');

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="hidden lg:block w-64 border-r bg-card p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Building className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Vendor Portal</span>
        </div>
        
        <nav className="space-y-1">
          <Button variant="ghost" className="w-full justify-start text-primary" disabled>
            <CalendarIcon2 className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/events')}>
            <Calendar className="mr-2 h-4 w-4" />
            Events
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <ClipboardList className="mr-2 h-4 w-4" />
            Services
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>
        
        <Separator />
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Your Services</p>
          <div className="flex flex-wrap gap-1">
            {vendorServices.map((service) => (
              <Badge key={service} variant="outline" className="bg-primary/10">
                {service.charAt(0).toUpperCase() + service.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <p className="text-sm font-medium">Profile Completion</p>
            <p className="text-sm text-muted-foreground">75%</p>
          </div>
          <Progress value={75} />
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => navigate('/vendor/profile')}>
                <Settings className="h-4 w-4 mr-2" />
                Vendor Settings
              </Button>
              <Avatar>
                <AvatarImage src={currentUser?.photoURL || undefined} />
                <AvatarFallback>
                  {userData?.displayName?.charAt(0) || userData?.businessName?.charAt(0) || 'V'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Business Overview Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Business Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Events</p>
                      <p className="text-3xl font-bold">{stats.totalEvents}</p>
                    </div>
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <CalendarCheck className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Upcoming</p>
                      <p className="text-3xl font-bold">{stats.upcomingEvents}</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-3xl font-bold">{stats.completedEvents}</p>
                    </div>
                    <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
                      <CalendarCheck className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="h-12 w-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                      <Percent className="h-6 w-6 text-amber-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Business Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Business Name</p>
                  <p className="text-lg font-medium">{userData?.businessName || 'Your Business'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{userData?.email || currentUser?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{userData?.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Services Offered</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {vendorServices.map((service) => (
                      <Badge key={service} variant="outline" className="bg-primary/10">
                        {service.charAt(0).toUpperCase() + service.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={userData?.verified ? "default" : "outline"} className={userData?.verified ? "bg-green-500" : ""}>
                    {userData?.verified ? 'Verified' : 'Pending Verification'}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Update Business Profile
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your vendor services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  View Upcoming Clients
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <CalendarCheck className="mr-2 h-4 w-4" />
                  Add Availability Dates
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Percent className="mr-2 h-4 w-4" />
                  View Service Requests
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Bell className="mr-2 h-4 w-4" />
                  Manage Notifications
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Events Tabs */}
          <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="completed">Completed Events</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="space-y-4">
              {loading ? (
                <Card>
                  <CardContent className="py-10 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <p>Loading upcoming events...</p>
                    </div>
                  </CardContent>
                </Card>
              ) : upcomingEvents.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {upcomingEvents.map(event => (
                    <Card key={event.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div>
                            <Badge
                              className={getEventTypeColor(event.type)}
                            >
                              {event.type}
                            </Badge>
                            <CardTitle className="mt-2">{event.title}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{formatEventDate(event.date)}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Client: {event.clientName}</span>
                        </div>
                        <div className="mt-2">
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                            ${event.amount.toLocaleString()}
                          </Badge>
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
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-10 text-center">
                    <p className="text-muted-foreground">No upcoming events found.</p>
                    <Button className="mt-4" variant="outline">
                      Explore Events
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4">
              {loading ? (
                <Card>
                  <CardContent className="py-10 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <p>Loading completed events...</p>
                    </div>
                  </CardContent>
                </Card>
              ) : completedEvents.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {completedEvents.map(event => (
                    <Card key={event.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div>
                            <Badge
                              className={getEventTypeColor(event.type)}
                            >
                              {event.type}
                            </Badge>
                            <CardTitle className="mt-2">{event.title}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{formatEventDate(event.date)}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Client: {event.clientName}</span>
                        </div>
                        <div className="mt-2">
                          <Badge variant="outline" className="bg-green-500/10 text-green-500">
                            ${event.amount.toLocaleString()}
                          </Badge>
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
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-10 text-center">
                    <p className="text-muted-foreground">No completed events found.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default VendorDashboard;
