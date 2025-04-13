
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Star, Phone, Mail, Globe, Clock, ArrowLeft, Check, Share2, Heart, MessageSquare, Calendar as CalendarIcon, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

// Mock data for vendor details
const vendorData = {
  '1': {
    id: '1',
    name: 'Elegant Occasions',
    type: 'Event Planner',
    location: 'Los Angeles, CA',
    address: '123 Beverly Blvd, Los Angeles, CA 90210',
    rating: 4.9,
    reviews: 124,
    price: '$$$',
    phone: '(310) 555-1234',
    email: 'info@elegantoccasions.com',
    website: 'www.elegantoccasions.com',
    hours: 'Mon-Fri: 9AM-5PM, Sat: 10AM-3PM',
    description: 'Elegant Occasions is a full-service event planning company specializing in luxury weddings, corporate events, and social gatherings. With over 15 years of experience, our team of passionate planners creates memorable experiences tailored to your unique vision.',
    services: [
      'Full-service event planning',
      'Day-of coordination',
      'Vendor management',
      'Budget planning',
      'Venue selection',
      'Theme development',
      'Timeline creation',
      'On-site management'
    ],
    images: [
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3',
      'https://images.unsplash.com/photo-1507504031003-b417219a0fde'
    ],
    specialties: ['Weddings', 'Corporate Events', 'Galas', 'Social Events']
  },
  '2': {
    id: '2',
    name: 'Sweet Moments Bakery',
    type: 'Catering',
    location: 'San Diego, CA',
    address: '456 Harbor Dr, San Diego, CA 92101',
    rating: 4.8,
    reviews: 89,
    price: '$$',
    phone: '(619) 555-7890',
    email: 'orders@sweetmomentsbakery.com',
    website: 'www.sweetmomentsbakery.com',
    hours: 'Tue-Sat: 8AM-6PM, Sun: 9AM-3PM',
    description: 'Sweet Moments Bakery creates beautiful, delicious cakes and desserts for all special occasions. From wedding cakes to birthday cupcakes, our pastry chefs use the finest ingredients to craft edible works of art that taste as good as they look.',
    services: [
      'Custom cakes',
      'Cupcakes and dessert tables',
      'Wedding cakes',
      'Special dietary options (gluten-free, vegan)',
      'Cake tastings',
      'Delivery and setup'
    ],
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff',
      'https://images.unsplash.com/photo-1535141192574-5d4897c12636',
      'https://images.unsplash.com/photo-1621303837174-89db7bccf373',
      'https://images.unsplash.com/photo-1562777717-dc81ec97d022'
    ],
    specialties: ['Wedding Cakes', 'Cupcakes', 'Dessert Tables', 'Custom Cookies']
  }
  // Additional vendors would be defined here
};

const VendorDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  const vendor = id ? vendorData[id as keyof typeof vendorData] : undefined;
  
  const handleContact = () => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please log in to contact vendors.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    toast({
      title: "Message Sent",
      description: `Your inquiry has been sent to ${vendor?.name}.`,
    });
  };
  
  const handleBook = () => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please log in to book vendors.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    navigate('/create-event', { state: { selectedVendor: vendor?.id }});
  };
  
  if (!vendor) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen py-24 px-6">
          <div className="container mx-auto text-center">
            <h1 className="text-2xl font-semibold mb-4">Vendor Not Found</h1>
            <p className="mb-6">The vendor you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/vendors')}>
              Browse All Vendors
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/vendors')}
            className="mb-6 hover:bg-background"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vendors
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Gallery */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="col-span-2 row-span-2">
                  <img 
                    src={vendor.images[0]} 
                    alt={vendor.name} 
                    className="h-full w-full object-cover rounded-lg"
                  />
                </div>
                {vendor.images.slice(1, 4).map((image, index) => (
                  <div key={index} className="overflow-hidden rounded-lg">
                    <img 
                      src={image} 
                      alt={`${vendor.name} ${index + 1}`}
                      className="h-40 w-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
              
              {/* Vendor Info */}
              <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <Badge variant="outline" className="mb-2 bg-accent/50">
                      {vendor.type}
                    </Badge>
                    <h1 className="text-3xl font-display font-bold">{vendor.name}</h1>
                    <div className="flex items-center mt-2 text-muted-foreground">
                      <MapPin size={16} className="mr-1" />
                      {vendor.location}
                      <span className="mx-2">•</span>
                      <div className="flex items-center">
                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                        <span className="ml-1 font-medium">{vendor.rating}</span>
                        <span className="ml-1">({vendor.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => {
                      toast({
                        title: "Vendor saved",
                        description: "Added to your favorites"
                      });
                    }}>
                      <Heart size={16} className="mr-1" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast({
                        title: "Link copied",
                        description: "Vendor link copied to clipboard"
                      });
                    }}>
                      <Share2 size={16} className="mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Tabs */}
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="w-full justify-start mb-6">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="faqs">FAQs</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">About {vendor.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>{vendor.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Address</p>
                            <p className="text-muted-foreground">{vendor.address}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Phone</p>
                            <p className="text-muted-foreground">{vendor.phone}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-muted-foreground">{vendor.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Globe className="h-5 w-5 mr-3 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Website</p>
                            <p className="text-muted-foreground">{vendor.website}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-4">
                        <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Business Hours</p>
                          <p className="text-muted-foreground">{vendor.hours}</p>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="font-medium mb-2">Specialties</h3>
                        <div className="flex flex-wrap gap-2">
                          {vendor.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="services" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Services Offered</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {vendor.services.map((service, index) => (
                          <li key={index} className="flex items-center">
                            <Check size={16} className="mr-2 text-primary" />
                            {service}
                          </li>
                        ))}
                      </ul>
                      
                      <div className="mt-8">
                        <h3 className="font-medium mb-2">Pricing</h3>
                        <p className="flex items-center">
                          <DollarSign size={16} className="mr-1" />
                          Price Range: {vendor.price}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Contact vendor for detailed pricing information.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reviews" className="min-h-[200px] flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">Reviews coming soon</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="faqs" className="min-h-[200px] flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">FAQs coming soon</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="shadow-md border-2">
                <CardHeader>
                  <CardTitle className="text-lg">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full"
                    onClick={handleContact}
                  >
                    <MessageSquare size={16} className="mr-2" />
                    Contact Vendor
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleBook}
                  >
                    <CalendarIcon size={16} className="mr-2" />
                    Book Now
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Similar Vendors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">
                      Similar vendors feature coming soon
                    </p>
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

export default VendorDetails;
