import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Star, Calendar, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for vendors
const vendors = [
  {
    id: '1',
    name: 'Elegant Occasions',
    type: 'Event Planner',
    location: 'Los Angeles, CA',
    rating: 4.9,
    reviews: 124,
    price: '$$$',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf',
    description: 'Full-service event planning for weddings and corporate events'
  },
  {
    id: '2',
    name: 'Sweet Moments Bakery',
    type: 'Catering',
    location: 'San Diego, CA',
    rating: 4.8,
    reviews: 89,
    price: '$$',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    description: 'Custom cakes and desserts for all occasions'
  },
  {
    id: '3',
    name: 'Forever Florals',
    type: 'Florist',
    location: 'San Francisco, CA',
    rating: 5.0,
    reviews: 76,
    price: '$$$',
    image: 'https://images.unsplash.com/photo-1501426026826-31c667bdf23d',
    description: 'Stunning floral arrangements for weddings and events'
  },
  {
    id: '4',
    name: 'Sound Studios DJ',
    type: 'Entertainment',
    location: 'Sacramento, CA',
    rating: 4.7,
    reviews: 52,
    price: '$$',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
    description: 'Professional DJ services for parties and corporate events'
  },
  {
    id: '5',
    name: 'Capture Moments',
    type: 'Photography',
    location: 'Fresno, CA',
    rating: 4.9,
    reviews: 118,
    price: '$$$',
    image: 'https://images.unsplash.com/photo-1553374402-559e8346137c',
    description: 'Award-winning photography for special moments'
  },
  {
    id: '6',
    name: 'Grand Vista Venues',
    type: 'Venue',
    location: 'Napa Valley, CA',
    rating: 4.8,
    reviews: 95,
    price: '$$$$',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3',
    description: 'Beautiful venues with stunning views for weddings and events'
  },
];

const Vendors = () => {
  const [searchTerm, setSearchTerm] = React.useState('');

  // Filter vendors based on search term
  const filteredVendors = vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen py-24 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Find Vendors</h1>
              <p className="text-muted-foreground">Discover and connect with the perfect vendors for your event</p>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search vendors by name, type, or location..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Vendors</TabsTrigger>
              <TabsTrigger value="venue">Venues</TabsTrigger>
              <TabsTrigger value="catering">Catering</TabsTrigger>
              <TabsTrigger value="entertainment">Entertainment</TabsTrigger>
              <TabsTrigger value="photography">Photography</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVendors.map(vendor => (
                  <Card key={vendor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <Link to={`/vendor/${vendor.id}`}>
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={vendor.image} 
                          alt={vendor.name} 
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </Link>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <Badge variant="outline" className="bg-accent/50">
                          {vendor.type}
                        </Badge>
                        <span className="text-sm font-medium">{vendor.price}</span>
                      </div>
                      <CardTitle className="mt-2 flex justify-between items-start">
                        <Link to={`/vendor/${vendor.id}`} className="hover:text-primary transition-colors hover:underline">
                          {vendor.name}
                        </Link>
                      </CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin size={14} className="mr-1" />
                        {vendor.location}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{vendor.description}</p>
                      
                      <div className="flex items-center mt-3">
                        <div className="flex items-center">
                          <Star size={14} className="text-yellow-500 fill-yellow-500" />
                          <span className="ml-1 text-sm font-medium">{vendor.rating}</span>
                        </div>
                        <span className="mx-1 text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{vendor.reviews} reviews</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link to={`/vendor/${vendor.id}`} className="w-full">
                        <Button variant="outline" className="w-full group">
                          View Details
                          <ArrowUpRight size={14} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Other tab contents would be similar but filtered */}
            <TabsContent value="venue">
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Venue filter coming soon</p>
                <Button variant="outline">View All Vendors</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="catering">
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Catering filter coming soon</p>
                <Button variant="outline">View All Vendors</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="entertainment">
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Entertainment filter coming soon</p>
                <Button variant="outline">View All Vendors</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="photography">
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Photography filter coming soon</p>
                <Button variant="outline">View All Vendors</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Vendors;
