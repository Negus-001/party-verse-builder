
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileText, Gift, Plus, Users, Clock, MapPin, Sparkles, ListTodo } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEvents } from '@/context/EventContext';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const { events, loading } = useEvents();
  
  // Take only up to 2 events for display
  const upcomingEvents = events.slice(0, 2);

  // Mock AI suggestions
  const aiInsights = [
    "Consider adding a photo booth with props for your company party",
    "Summer weddings benefit from cooling stations for guest comfort",
    "Add signature cocktails to personalize your event experience"
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen py-24 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Your Dashboard</h1>
              <p className="text-muted-foreground">Manage your upcoming events and planning tasks</p>
            </div>
            <Link to="/create-event">
              <Button>
                <Plus size={16} className="mr-2" />
                Create New Event
              </Button>
            </Link>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content - Events */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      Upcoming Events
                    </CardTitle>
                    <CardDescription>Manage your scheduled events</CardDescription>
                  </div>
                  <Link to="/events">
                    <Button variant="ghost" size="sm" className="gap-1 text-primary">
                      View All
                      <span className="sr-only">View all events</span>
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <Card key={i} className="animate-pulse">
                          <CardContent className="h-24 p-6"></CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : upcomingEvents.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingEvents.map((event) => (
                        <Card key={event.id} className="event-card border-muted">
                          <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Badge variant="outline" className="capitalize text-xs">
                                    {event.type}
                                  </Badge>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                                <div className="grid grid-cols-2 gap-1 text-sm">
                                  <div className="flex items-center text-muted-foreground">
                                    <Clock size={14} className="mr-1" />
                                    {event.date}
                                  </div>
                                  <div className="flex items-center text-muted-foreground">
                                    <MapPin size={14} className="mr-1" />
                                    {event.location}
                                  </div>
                                  <div className="flex items-center text-muted-foreground col-span-2">
                                    <Users size={14} className="mr-1" />
                                    {event.guests} guests
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-row sm:flex-col gap-2">
                                <Link to={`/event/${event.id}`} className="flex-1">
                                  <Button size="sm" variant="outline" className="mb-2 w-full">
                                    <FileText size={14} className="mr-1" />
                                    View
                                  </Button>
                                </Link>
                                <Link to={`/event/${event.id}`} className="flex-1">
                                  <Button size="sm" className="w-full">
                                    <Sparkles size={14} className="mr-1" />
                                    AI Ideas
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="bg-accent/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                        <Calendar size={24} />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No events yet</h3>
                      <p className="text-muted-foreground mb-4">Create your first event to get started</p>
                      <Link to="/create-event">
                        <Button>
                          <Plus size={16} className="mr-2" />
                          Create Event
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ListTodo className="h-5 w-5 mr-2 text-primary" />
                    Planning Tasks
                  </CardTitle>
                  <CardDescription>Track your event planning progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-8">
                    <div className="bg-accent/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                      <ListTodo size={24} />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Task management</h3>
                    <p className="text-muted-foreground mb-4">Create and track tasks for your events</p>
                    <Button variant="outline">
                      Coming Soon
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="border-2 border-primary/20">
                <CardHeader className="bg-accent/30 rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-primary" />
                    AI Insights
                  </CardTitle>
                  <CardDescription>Personalized suggestions for your events</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-3">
                    {aiInsights.map((insight, index) => (
                      <li key={index} className="flex p-2 rounded-lg hover:bg-accent/20 transition-colors">
                        <span className="mr-2 text-primary">💡</span>
                        <p className="text-sm">{insight}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/create-event" className="w-full">
                    <Button variant="outline" size="sm" className="w-full">
                      Get More Ideas
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gift className="h-5 w-5 mr-2 text-primary" />
                    Vendor Marketplace
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-6">
                    <div className="bg-accent/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                      <Gift size={24} />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Find Perfect Vendors</h3>
                    <p className="text-muted-foreground text-sm mb-4">Browse our curated vendor marketplace for your event needs</p>
                    <Button size="sm" className="w-full">
                      Coming Soon
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Dashboard;
