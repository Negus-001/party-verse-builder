
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getEventTypeColor, formatEventDate } from '@/utils/eventHelpers';
import { Calendar, Loader2, Package, Settings, Star, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface VendorService {
  id?: string;
  name: string;
  description: string;
  price: string;
  category: string;
}

const VendorDashboard = () => {
  const { currentUser, userData, isVendor, loading } = useAuth();
  const navigate = useNavigate();
  const [matchedEvents, setMatchedEvents] = useState<any[]>([]);
  const [services, setServices] = useState<VendorService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newService, setNewService] = useState<VendorService>({
    name: '',
    description: '',
    price: '',
    category: 'catering'
  });

  useEffect(() => {
    // Redirect non-vendor users
    if (!loading && !isVendor) {
      navigate('/dashboard');
    }
  }, [isVendor, loading, navigate]);

  useEffect(() => {
    const fetchVendorData = async () => {
      if (!isVendor || !currentUser) return;
      
      setIsLoading(true);
      try {
        // Fetch vendor services
        const servicesQuery = query(
          collection(db, 'vendorServices'), 
          where('vendorId', '==', currentUser.uid)
        );
        const servicesSnapshot = await getDocs(servicesQuery);
        const servicesData = servicesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as VendorService[];
        setServices(servicesData);

        // Fetch events that match vendor services
        // In a real app, this would be a more complex query
        // For demo, we'll get all events and filter client-side
        const eventsQuery = query(collection(db, 'events'));
        const eventsSnapshot = await getDocs(eventsQuery);
        const eventsData = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Filter events that match vendor services
        // This is a simple implementation - in a real app you'd have a proper matching algorithm
        const vendorCategories = userData?.services || [];
        const matchingEvents = eventsData.filter(event => 
          vendorCategories.includes(event.type) || 
          (event.preferences && vendorCategories.some(cat => 
            event.preferences.toLowerCase().includes(cat.toLowerCase())
          ))
        );
        
        setMatchedEvents(matchingEvents);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
        toast({
          title: "Error",
          description: "Failed to load vendor data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorData();
  }, [isVendor, currentUser, userData]);

  const handleServiceChange = (field: string, value: string) => {
    setNewService(prev => ({ ...prev, [field]: value }));
  };

  const handleAddService = () => {
    // In a real app, you'd save this to Firestore
    // For the demo, we'll just add it to local state
    const serviceWithId = {
      ...newService,
      id: `temp-${Date.now()}`
    };
    setServices(prev => [...prev, serviceWithId]);
    
    toast({
      title: "Service Added",
      description: `${newService.name} has been added to your services.`
    });
    
    // Reset form
    setNewService({
      name: '',
      description: '',
      price: '',
      category: 'catering'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isVendor) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-background via-accent/20 to-background">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold">Vendor Dashboard</h1>
            <p className="text-muted-foreground">Manage your services and view matched events</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-4">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Your Services</p>
                    <h3 className="text-2xl font-bold">{services.length}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-4">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Matched Events</p>
                    <h3 className="text-2xl font-bold">{matchedEvents.length}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-4">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <h3 className="text-2xl font-bold">4.8/5</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="services" className="w-full">
            <TabsList className="w-full max-w-md mx-auto mb-8">
              <TabsTrigger value="services" className="flex-1">Your Services</TabsTrigger>
              <TabsTrigger value="events" className="flex-1">Matched Events</TabsTrigger>
              <TabsTrigger value="add" className="flex-1">Add Service</TabsTrigger>
            </TabsList>
            
            <Card className="bg-card/50 backdrop-blur-sm border-2">
              <TabsContent value="services" className="m-0">
                <CardHeader>
                  <CardTitle>Your Services</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : services.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">You haven't added any services yet.</p>
                      <Button onClick={() => document.querySelector('[data-value="add"]')?.click()}>
                        Add Your First Service
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {services.map((service) => (
                        <Card key={service.id} className="overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                              <Badge>{service.category}</Badge>
                            </div>
                            <p className="text-muted-foreground mb-4 text-sm">{service.description}</p>
                            <div className="flex justify-between items-center">
                              <p className="font-semibold">${service.price}</p>
                              <Button variant="outline" size="sm">Edit</Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </TabsContent>

              <TabsContent value="events" className="m-0">
                <CardHeader>
                  <CardTitle>Events Matching Your Services</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : matchedEvents.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No matching events found at the moment.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {matchedEvents.map((event) => (
                        <Card key={event.id} className="overflow-hidden">
                          <div className="h-36 bg-accent relative">
                            {event.image && (
                              <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                            <div className="absolute top-2 right-2">
                              <Badge className={getEventTypeColor(event.type)}>
                                {event.type}
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-6">
                            <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center text-muted-foreground">
                                <Calendar size={14} className="mr-2" />
                                {formatEventDate(event.date)}
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <Users size={14} className="mr-2" />
                                {event.guests} guests
                              </div>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                              <Badge variant="outline" className="bg-primary/10">
                                Match: {userData?.services?.includes(event.type) ? '100%' : '80%'}
                              </Badge>
                              <Button variant="outline" size="sm">Contact</Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </TabsContent>

              <TabsContent value="add" className="m-0">
                <CardHeader>
                  <CardTitle>Add New Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6 max-w-xl mx-auto">
                    <div className="space-y-2">
                      <Label htmlFor="service-name">Service Name</Label>
                      <Input 
                        id="service-name" 
                        placeholder="e.g., Wedding Photography Package" 
                        value={newService.name}
                        onChange={(e) => handleServiceChange('name', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="service-category">Category</Label>
                      <Select 
                        value={newService.category}
                        onValueChange={(value) => handleServiceChange('category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="catering">Catering</SelectItem>
                          <SelectItem value="photography">Photography</SelectItem>
                          <SelectItem value="venue">Venue</SelectItem>
                          <SelectItem value="decoration">Decoration</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="transportation">Transportation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="service-description">Description</Label>
                      <Textarea 
                        id="service-description" 
                        placeholder="Describe your service in detail"
                        rows={4}
                        value={newService.description}
                        onChange={(e) => handleServiceChange('description', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="service-price">Price (USD)</Label>
                      <Input 
                        id="service-price" 
                        placeholder="e.g., 499.99" 
                        type="text"
                        value={newService.price}
                        onChange={(e) => handleServiceChange('price', e.target.value)}
                      />
                    </div>

                    <Button onClick={handleAddService} className="w-full">
                      Add Service
                    </Button>
                  </div>
                </CardContent>
              </TabsContent>
            </Card>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default VendorDashboard;
