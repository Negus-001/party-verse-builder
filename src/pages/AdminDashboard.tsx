
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getEventTypeColor, formatEventDate } from '@/utils/eventHelpers';
import { EventItem } from '@/context/EventContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usersIcon, Calendar, CheckCheck, Clock, Database, Loader2, MailCheck, Settings, ShieldAlert, User, Users } from 'lucide-react';

const AdminDashboard = () => {
  const { currentUser, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect non-admin users
    if (!loading && !isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAdmin) return;
      
      setIsLoading(true);
      try {
        // Fetch all events
        const eventsQuery = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
        const eventsSnapshot = await getDocs(eventsQuery);
        const eventsData = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as EventItem));
        setEvents(eventsData);

        // Fetch all users
        const usersQuery = query(collection(db, 'users'));
        const usersSnapshot = await getDocs(usersQuery);
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);

        // Fetch all vendors
        const vendorsQuery = query(collection(db, 'users'), 
          // In a real app, you would use where('role', '==', 'vendor')
          // But for demo purposes, we'll just use the entire users collection
        );
        const vendorsSnapshot = await getDocs(vendorsQuery);
        const vendorsData = vendorsSnapshot.docs
          .filter(doc => doc.data().role === 'vendor')
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        setVendors(vendorsData);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-background via-accent/20 to-background">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage events, users, and vendors</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-4">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Events</p>
                    <h3 className="text-2xl font-bold">{events.length}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <h3 className="text-2xl font-bold">{users.length}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-4">
                    <ShieldAlert className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Vendors</p>
                    <h3 className="text-2xl font-bold">{vendors.length}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="events" className="w-full">
            <TabsList className="w-full max-w-md mx-auto mb-8">
              <TabsTrigger value="events" className="flex-1">Events</TabsTrigger>
              <TabsTrigger value="users" className="flex-1">Users</TabsTrigger>
              <TabsTrigger value="vendors" className="flex-1">Vendors</TabsTrigger>
            </TabsList>
            
            <Card className="bg-card/50 backdrop-blur-sm border-2">
              <TabsContent value="events" className="m-0">
                <CardHeader>
                  <CardTitle>All Events</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Event Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Creator</TableHead>
                            <TableHead>Guests</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {events.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8">
                                No events found
                              </TableCell>
                            </TableRow>
                          ) : (
                            events.map((event) => (
                              <TableRow key={event.id}>
                                <TableCell className="font-medium">{event.title}</TableCell>
                                <TableCell>
                                  <Badge className={getEventTypeColor(event.type)}>
                                    {event.type}
                                  </Badge>
                                </TableCell>
                                <TableCell>{formatEventDate(event.date)}</TableCell>
                                <TableCell>{event.createdBy}</TableCell>
                                <TableCell>{event.guests}</TableCell>
                                <TableCell>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => navigate(`/event/${event.id}`)}
                                  >
                                    View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </TabsContent>

              <TabsContent value="users" className="m-0">
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8">
                                No users found
                              </TableCell>
                            </TableRow>
                          ) : (
                            users.map((user) => (
                              <TableRow key={user.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center">
                                    <Avatar className="h-8 w-8 mr-2">
                                      <AvatarFallback>{user.email?.charAt(0) || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <span>{user.displayName || 'User'}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                  <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'vendor' ? 'outline' : 'secondary'}>
                                    {user.role || 'user'}
                                  </Badge>
                                </TableCell>
                                <TableCell>{user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown'}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="bg-green-100 text-green-800">
                                    Active
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm">Manage</Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </TabsContent>

              <TabsContent value="vendors" className="m-0">
                <CardHeader>
                  <CardTitle>Vendor Management</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Vendor</TableHead>
                            <TableHead>Services</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {vendors.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8">
                                No vendors found
                              </TableCell>
                            </TableRow>
                          ) : (
                            vendors.map((vendor) => (
                              <TableRow key={vendor.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center">
                                    <Avatar className="h-8 w-8 mr-2">
                                      <AvatarImage src={vendor.profileImage} />
                                      <AvatarFallback>{vendor.businessName?.charAt(0) || 'V'}</AvatarFallback>
                                    </Avatar>
                                    <span>{vendor.businessName || vendor.displayName || 'Vendor'}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {vendor.services?.map((service: string) => (
                                      <Badge key={service} variant="outline" className="bg-primary/10 text-primary">{service}</Badge>
                                    )) || 'No services listed'}
                                  </div>
                                </TableCell>
                                <TableCell>{vendor.email}</TableCell>
                                <TableCell>
                                  <Badge variant={vendor.verified ? 'default' : 'outline'} className={vendor.verified ? 'bg-green-100 text-green-800' : ''}>
                                    {vendor.verified ? 'Verified' : 'Pending'}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm" onClick={() => navigate(`/vendor/${vendor.id}`)}>
                                    View Profile
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
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

export default AdminDashboard;
