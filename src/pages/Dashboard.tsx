
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileText, Gift, Plus, Users, Clock, MapPin, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Mock data for upcoming events
  const upcomingEvents = [
    {
      id: '1',
      title: 'Summer Wedding',
      date: 'August 15, 2024',
      location: 'Malibu Beach Club',
      type: 'wedding',
      guests: 120,
    },
    {
      id: '2',
      title: 'Company Holiday Party',
      date: 'December 18, 2024',
      location: 'Grand Hotel Downtown',
      type: 'corporate',
      guests: 75,
    }
  ];

  // Mock AI suggestions
  const aiInsights = [
    "Consider adding photo booth with props for your company party",
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
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    Upcoming Events
                  </CardTitle>
                  <CardDescription>Manage your scheduled events</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingEvents.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingEvents.map((event) => (
                        <Card key={event.id} className="event-card">
                          <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                                <div className="space-y-1 text-sm">
                                  <div className="flex items-center text-muted-foreground">
                                    <Clock size={14} className="mr-1" />
                                    {event.date}
                                  </div>
                                  <div className="flex items-center text-muted-foreground">
                                    <MapPin size={14} className="mr-1" />
                                    {event.location}
                                  </div>
                                  <div className="flex items-center text-muted-foreground">
                                    <Users size={14} className="mr-1" />
                                    {event.guests} guests
                                  </div>
                                </div>
                              </div>
                              <div>
                                <Button size="sm" variant="outline" className="mb-2 w-full">
                                  <FileText size={14} className="mr-1" />
                                  View
                                </Button>
                                <Button size="sm" className="w-full">
                                  <Sparkles size={14} className="mr-1" />
                                  AI Ideas
                                </Button>
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
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    Guest Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-8">
                    <div className="bg-accent/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                      <Users size={24} />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Manage your guest lists</h3>
                    <p className="text-muted-foreground mb-4">Track invitations, RSVPs, and seating arrangements</p>
                    <Button variant="outline" disabled>
                      Coming Soon
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-primary" />
                    AI Insights
                  </CardTitle>
                  <CardDescription>Personalized suggestions for your events</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {aiInsights.map((insight, index) => (
                      <li key={index} className="flex">
                        <span className="mr-2 text-primary">💡</span>
                        <p className="text-sm">{insight}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/inspiration" className="w-full">
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
                    <Link to="/vendors">
                      <Button size="sm" className="w-full">
                        Explore Vendors
                      </Button>
                    </Link>
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
