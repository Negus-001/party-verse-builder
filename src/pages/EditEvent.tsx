
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEvents } from '@/context/EventContext';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Save, Loader2 } from 'lucide-react';

const EditEvent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEvent, updateEvent } = useEvents();
  
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    type: '',
    guests: 0,
    image: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (id) {
      const eventData = getEvent(id);
      if (eventData) {
        setFormData({
          title: eventData.title,
          date: eventData.date,
          location: eventData.location,
          description: eventData.description,
          type: eventData.type,
          guests: eventData.guests,
          image: eventData.image || ''
        });
      } else {
        navigate('/events');
      }
    }
  }, [id, getEvent, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) || 0 : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setIsLoading(true);
    try {
      await updateEvent(id, formData);
      navigate(`/event/${id}`);
    } catch (error) {
      console.error("Error updating event:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen py-24 px-6">
        <div className="container mx-auto max-w-3xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/event/${id}`)}
            className="mb-6 hover:bg-background"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Event
          </Button>
          
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 slide-in-bottom">Edit Event</h1>
            <p className="text-muted-foreground slide-in-bottom delay-100">Make changes to your event details</p>
          </div>
          
          <Card className="border-2 slide-in-bottom delay-200">
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter event title"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          placeholder="Event date"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="Event location"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Event Type</Label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="wedding">Wedding</option>
                        <option value="birthday">Birthday</option>
                        <option value="corporate">Corporate</option>
                        <option value="graduation">Graduation</option>
                        <option value="babyshower">Baby Shower</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="guests">Number of Guests</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="guests"
                          name="guests"
                          type="number"
                          value={formData.guests}
                          onChange={handleChange}
                          placeholder="Number of guests"
                          className="pl-10"
                          min={0}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your event"
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="Enter image URL (optional)"
                    />
                    
                    {formData.image && (
                      <div className="mt-2 rounded-md overflow-hidden h-48">
                        <img 
                          src={formData.image} 
                          alt="Event preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/600x400?text=Image+Not+Found';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="button" variant="outline" className="mr-2" onClick={() => navigate(`/event/${id}`)}>
                    Cancel
                  </Button>
                  
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default EditEvent;
