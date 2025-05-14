
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '@/context/EventContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import EventShareMenu from '@/components/events/EventShareMenu';
import EventHistory from '@/components/events/EventHistory';
import VendorRecommendations from '@/components/events/VendorRecommendations';
import { getEventTypeColor } from '@/utils/eventHelpers';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit,
  Trash2,
  ArrowLeft,
  AlertCircle,
  Download,
  Sparkles
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { motion } from 'framer-motion';

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEvent, deleteEvent } = useEvents();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  
  const event = getEvent(id || '');
  
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, [id]);
  
  if (!event) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen py-24 px-6">
          <div className="container max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/events')}
              className="mb-6 hover:bg-background"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>
            
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Event Not Found</h2>
              <p className="text-muted-foreground mb-6">The event you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate('/events')}>
                View All Events
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  const handleDelete = () => {
    deleteEvent(event.id);
    toast({
      title: "Event deleted",
      description: "The event has been successfully deleted.",
    });
    setIsDeleteDialogOpen(false);
    navigate('/events');
  };

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen py-24 px-6">
        <div className="container max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/events')}
            className="mb-6 hover:bg-background"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
          
          {/* Event Header */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {event.image ? (
              <div className="h-64 md:h-80 w-full overflow-hidden rounded-xl mb-6">
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10"></div>
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-64 md:h-80 w-full overflow-hidden rounded-xl mb-6 bg-gradient-to-r from-primary/20 to-purple-400/20">
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10"></div>
              </div>
            )}
            
            <div className="relative z-20 -mt-16 px-6">
              <div className="bg-card shadow-lg rounded-xl p-6 border">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <Badge variant="outline" className={`mb-2 capitalize ${getEventTypeColor(event.type)}`}>
                      {event.type}
                    </Badge>
                    <h1 className="text-2xl md:text-3xl font-display font-bold">{event.title}</h1>
                  </div>
                  
                  <div className="flex gap-2">
                    <EventShareMenu event={event} />
                    
                    <Button variant="outline" size="sm" onClick={() => navigate(`/edit-event/${event.id}`)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Main Content */}
            <motion.div 
              className="md:col-span-2 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start mb-6">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="vendors">Vendors</TabsTrigger>
                  <TabsTrigger value="history">About This Event</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Event Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Date</p>
                            <p className="text-muted-foreground">{event.date}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Location</p>
                            <p className="text-muted-foreground">{event.location}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Users className="h-5 w-5 mr-3 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Expected Guests</p>
                            <p className="text-muted-foreground">{event.guests}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Created On</p>
                            <p className="text-muted-foreground">{event.createdAt}</p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div>
                        <h3 className="font-medium mb-2">Description</h3>
                        <p className="text-muted-foreground">{event.description || "No description provided."}</p>
                      </div>
                      
                      {event.preferences && (
                        <>
                          <Separator className="my-4" />
                          <div>
                            <h3 className="font-medium mb-2">Preferences</h3>
                            <p className="text-muted-foreground">{event.preferences}</p>
                          </div>
                        </>
                      )}
                      
                      {event.budget && (
                        <>
                          <Separator className="my-4" />
                          <div>
                            <h3 className="font-medium mb-2">Budget</h3>
                            <p className="text-muted-foreground">${event.budget}</p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-primary" />
                        AI Suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-accent/30 rounded-lg">
                        <h4 className="font-medium mb-2">Theme Ideas</h4>
                        <p className="text-sm text-muted-foreground">
                          Based on your {event.type}, we suggest a seasonal theme with natural decorations that match your venue.
                        </p>
                      </div>
                      <div className="p-4 bg-accent/30 rounded-lg">
                        <h4 className="font-medium mb-2">Vendor Recommendations</h4>
                        <p className="text-sm text-muted-foreground">
                          Check out the Vendors tab to see our AI-generated recommendations for your {event.type} event.
                        </p>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-primary" 
                          onClick={() => setActiveTab('vendors')}
                        >
                          View Vendor Recommendations
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="vendors" className="space-y-6">
                  <VendorRecommendations 
                    eventType={event.type}
                    location={event.location}
                    budget={event.budget || 1000}
                  />
                </TabsContent>
                
                <TabsContent value="history" className="space-y-6">
                  <EventHistory eventType={event.type} />
                </TabsContent>
              </Tabs>
            </motion.div>
            
            {/* Sidebar */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" onClick={() => setActiveTab('vendors')}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    View Vendor Options
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab('history')}>
                    <Download className="h-4 w-4 mr-2" />
                    Learn About This Event
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Share This Event</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Let your friends and family know about your upcoming {event.type} celebration.
                  </p>
                  <div className="flex justify-center">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        const shareText = `Join me for ${event.title} on ${event.date} at ${event.location}!`;
                        const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
                        window.open(shareUrl, '_blank');
                      }}
                      className="flex items-center"
                    >
                      Share to WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this event?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </>
  );
};

export default EventDetails;
