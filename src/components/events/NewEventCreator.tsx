
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Loader2, CalendarIcon, Check, MapPin, Users, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEvents } from '@/context/EventContext';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import EventTypeSelector from '@/components/events/EventTypeSelector';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EventFormData = {
  title: string;
  date: Date | null;
  timeOfDay: string;
  location: string;
  locationDetails?: string;
  guests: number;
  budget: number;
  description: string;
  type: string;
};

const NewEventCreator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addEvent } = useEvents();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'type' | 'details'>('type');

  const form = useForm<EventFormData>({
    defaultValues: {
      title: '',
      date: null,
      timeOfDay: '',
      location: '',
      locationDetails: '',
      guests: 50,
      budget: 1000,
      description: '',
      type: '',
    },
  });

  const handleSelectEventType = (type: string) => {
    setSelectedType(type);
    form.setValue('type', type);
    form.setValue('title', `My ${type.charAt(0).toUpperCase() + type.slice(1)}`);
    setCurrentView('details');
  };

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    try {
      // Format the date as a string
      const formattedDate = data.date ? format(data.date, 'yyyy-MM-dd') : '';
      
      // Add the event
      const eventId = await addEvent({
        title: data.title,
        date: formattedDate,
        location: data.location,
        description: data.description,
        type: selectedType || '',
        guests: data.guests,
        preferences: `Budget: $${data.budget}, Time: ${data.timeOfDay}, Location details: ${data.locationDetails || 'None provided'}`,
        budget: data.budget,
      });
      
      toast({
        title: "Event created successfully!",
        description: "Your event has been created and saved.",
      });
      
      // Navigate to the event details page
      navigate(`/event/${eventId}`);
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error creating event",
        description: "There was a problem creating your event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 bg-gradient-to-r from-primary to-purple-400 text-transparent bg-clip-text">
          Create Your Event
        </h1>
        <p className="text-muted-foreground">
          Let's plan something amazing together
        </p>
      </motion.div>

      {currentView === 'type' ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Card className="p-6 shadow-md border-2">
            <h2 className="text-2xl font-semibold mb-6">What type of event are you planning?</h2>
            <EventTypeSelector
              selectedType={selectedType}
              onSelectType={handleSelectEventType}
            />
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          <Card className="p-6 shadow-md border-2">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <span className="mr-2 p-1.5 bg-primary/10 text-primary rounded-full">
                    <Check size={18} />
                  </span>
                  Event Type: {selectedType && selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
                </h2>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setCurrentView('type')}
                  className="text-primary hover:text-primary/80 hover:bg-primary/5 px-0"
                >
                  Change event type
                </Button>
              </motion.div>

              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="title">Event Name</Label>
                <Input
                  id="title"
                  placeholder={selectedType ? `My ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}` : 'Event Name'}
                  {...form.register("title", { required: true })}
                  className="transition-all focus:ring-2 focus:ring-primary/30"
                />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="date">Event Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        id="date"
                        className={cn(
                          "w-full justify-start text-left font-normal transition-all",
                          !form.watch("date") && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.watch("date") ? format(form.watch("date")!, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.watch("date") || undefined}
                        onSelect={(date) => form.setValue("date", date)}
                        initialFocus
                        className="p-3"
                      />
                    </PopoverContent>
                  </Popover>
                </motion.div>

                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="timeOfDay">Time of Day</Label>
                  <Select 
                    onValueChange={(value) => form.setValue("timeOfDay", value)}
                    defaultValue={form.watch("timeOfDay")}
                  >
                    <SelectTrigger id="timeOfDay" className="w-full">
                      <SelectValue placeholder="Select time of day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="morning">Morning (8:00 AM - 12:00 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12:00 PM - 5:00 PM)</SelectItem>
                        <SelectItem value="evening">Evening (5:00 PM - 9:00 PM)</SelectItem>
                        <SelectItem value="night">Night (9:00 PM - Late)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>

              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="location">Location</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <Input
                    id="location"
                    placeholder="Event venue or address"
                    {...form.register("location", { required: true })}
                    className="transition-all focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </motion.div>

              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="locationDetails">Location Details (Optional)</Label>
                <Input
                  id="locationDetails"
                  placeholder="Floor, room number, or special directions"
                  {...form.register("locationDetails")}
                  className="transition-all focus:ring-2 focus:ring-primary/30"
                />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div className="space-y-4" variants={itemVariants}>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="guests">Number of Guests</Label>
                    <span className="text-sm text-muted-foreground bg-accent px-2 py-1 rounded-md">
                      {form.watch("guests")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Users className="text-muted-foreground" size={16} />
                    <Slider
                      id="guests"
                      min={1}
                      max={500}
                      step={1}
                      value={[form.watch("guests")]}
                      onValueChange={(values) => form.setValue("guests", values[0])}
                      className="flex-1"
                    />
                  </div>
                </motion.div>

                <motion.div className="space-y-4" variants={itemVariants}>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="budget">Event Budget</Label>
                    <span className="text-sm text-muted-foreground bg-accent px-2 py-1 rounded-md">
                      ${form.watch("budget")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <DollarSign className="text-muted-foreground" size={16} />
                    <Slider
                      id="budget"
                      min={100}
                      max={50000}
                      step={100}
                      value={[form.watch("budget")]}
                      onValueChange={(values) => form.setValue("budget", values[0])}
                      className="flex-1"
                    />
                  </div>
                </motion.div>
              </div>

              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us about your event..."
                  {...form.register("description")}
                  rows={4}
                  className="transition-all focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </motion.div>

              <motion.div className="pt-4" variants={itemVariants}>
                <Button 
                  type="submit" 
                  className="w-full transition-all hover:scale-105 hover:shadow-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Event...
                    </>
                  ) : (
                    "Create Event"
                  )}
                </Button>
              </motion.div>
            </form>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default NewEventCreator;
