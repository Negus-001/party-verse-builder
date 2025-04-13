
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileText, Gift, Plus, Users, Clock, MapPin, Sparkles, ListTodo } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEvents } from '@/context/EventContext';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100 
      }
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen py-24 px-6 transition-colors duration-300">
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
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Your Dashboard</h1>
              <p className="text-muted-foreground">Manage your upcoming events and planning tasks</p>
            </div>
            <Link to="/create-event">
              <Button className="transition-all duration-300 hover:scale-105">
                <Plus size={16} className="mr-2 transition-transform group-hover:rotate-90 duration-300" />
                Create New Event
              </Button>
            </Link>
          </motion.div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content - Events */}
            <motion.div 
              className="lg:col-span-2 space-y-6"
              variants={itemVariants}
            >
              <Card className="border-2 transition-all duration-300 hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      Upcoming Events
                    </CardTitle>
                    <CardDescription>Manage your scheduled events</CardDescription>
                  </div>
                  <Link to="/events">
                    <Button variant="ghost" size="sm" className="gap-1 text-primary group">
                      View All
                      <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <Card key={i} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                              <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-6 w-full max-w-[200px]" />
                                <div className="grid grid-cols-2 gap-2">
                                  <Skeleton className="h-4 w-full" />
                                  <Skeleton className="h-4 w-full" />
                                  <Skeleton className="h-4 w-[120px]" />
                                </div>
                              </div>
                              <div className="flex flex-row sm:flex-col gap-2">
                                <Skeleton className="h-9 w-20" />
                                <Skeleton className="h-9 w-20" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : upcomingEvents.length > 0 ? (
                    <motion.div 
                      className="space-y-4"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {upcomingEvents.map((event) => (
                        <motion.div
                          key={event.id}
                          variants={itemVariants}
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <Card className="event-card border-muted transition-all duration-300 hover:border-primary">
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
                                    <Button size="sm" variant="outline" className="mb-2 w-full transition-colors">
                                      <FileText size={14} className="mr-1" />
                                      View
                                    </Button>
                                  </Link>
                                  <Link to={`/ai-assistant?eventId=${event.id}`} className="flex-1">
                                    <Button size="sm" className="w-full transition-colors">
                                      <Sparkles size={14} className="mr-1 animate-pulse-slow" />
                                      AI Ideas
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="bg-accent/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                        <Calendar size={24} />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No events yet</h3>
                      <p className="text-muted-foreground mb-4">Create your first event to get started</p>
                      <Link to="/create-event">
                        <Button className="transition-transform hover:scale-105 duration-200">
                          <Plus size={16} className="mr-2" />
                          Create Event
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              <motion.div variants={itemVariants}>
                <Card className="border-2 transition-all duration-300 hover:shadow-lg">
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
                      <Button variant="outline" className="transition-transform hover:scale-105 duration-200">
                        Coming Soon
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Sidebar */}
            <motion.div 
              className="space-y-6"
              variants={itemVariants}
            >
              <Card className="border-2 border-primary/20 transition-all duration-300 hover:shadow-lg">
                <CardHeader className="bg-accent/30 rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-primary animate-pulse" />
                    AI Insights
                  </CardTitle>
                  <CardDescription>Personalized suggestions for your events</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <motion.ul 
                    className="space-y-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {aiInsights.map((insight, index) => (
                      <motion.li 
                        key={index} 
                        className="flex p-2 rounded-lg hover:bg-accent/20 transition-colors"
                        variants={itemVariants}
                      >
                        <span className="mr-2 text-primary">💡</span>
                        <p className="text-sm">{insight}</p>
                      </motion.li>
                    ))}
                  </motion.ul>
                </CardContent>
                <CardFooter>
                  <Link to="/ai-assistant" className="w-full">
                    <Button variant="outline" size="sm" className="w-full transition-transform hover:scale-105 duration-200">
                      Get More Ideas
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <motion.div variants={itemVariants}>
                <Card className="transition-all duration-300 hover:shadow-lg">
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
                      <Button size="sm" className="w-full transition-transform hover:scale-105 duration-200">
                        Coming Soon
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </>
  );
};

export default Dashboard;
