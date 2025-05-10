
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Users, DollarSign, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EventBasicDetailsFormProps {
  onNextStep: () => void;
  onPrevStep: () => void;
  selectedType: string;
}

export interface EventFormData {
  title: string;
  date: Date | undefined;
  timeOfDay: string;
  location: string;
  locationDetails?: string;
  guests: number;
  budget: number;
  description: string;
}

const EventBasicDetailsForm = ({ onNextStep, onPrevStep, selectedType }: EventBasicDetailsFormProps) => {
  const { toast } = useToast();
  const [eventData, setEventData] = useState<EventFormData>({
    title: '',
    date: undefined,
    timeOfDay: '',
    location: '',
    locationDetails: '',
    guests: 50,
    budget: 1000,
    description: ''
  });

  // Load any previously saved data from sessionStorage
  useEffect(() => {
    const savedData = sessionStorage.getItem('eventFormData');
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        
        // Convert date string back to Date object if it exists
        if (parsedData.date) {
          parsedData.date = new Date(parsedData.date);
        }
        
        setEventData(prevData => ({
          ...prevData,
          ...parsedData
        }));
      } catch (error) {
        console.error("Error parsing saved event data:", error);
      }
    } else if (selectedType) {
      // Set a default title based on the type if no saved data
      setEventData(prevData => ({
        ...prevData,
        title: `My ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}`
      }));
    }
  }, [selectedType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setEventData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventData.title || !eventData.date || !eventData.location) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    // Save the form data to sessionStorage
    try {
      sessionStorage.setItem('eventFormData', JSON.stringify(eventData));
      sessionStorage.setItem('eventTitle', eventData.title);
      sessionStorage.setItem('eventDate', eventData.date?.toISOString() || '');
      sessionStorage.setItem('eventLocation', eventData.location);
      sessionStorage.setItem('eventGuests', eventData.guests.toString());
      sessionStorage.setItem('eventBudget', eventData.budget.toString());
    } catch (error) {
      console.error("Error saving event data:", error);
    }

    onNextStep();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2 className="text-2xl font-display font-semibold mb-6">Event Details</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="title">Event Name</Label>
          <Input
            id="title"
            placeholder={`My ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}`}
            value={eventData.title}
            onChange={handleInputChange}
            required
            className="transition-all focus:ring-2 focus:ring-primary/30"
          />
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <Label>Event Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal transition-all",
                  !eventData.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {eventData.date ? format(eventData.date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={eventData.date}
                onSelect={(date) => setEventData(prev => ({ ...prev, date }))}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="timeOfDay">Time of Day</Label>
          <Select 
            value={eventData.timeOfDay} 
            onValueChange={(value) => setEventData(prev => ({ ...prev, timeOfDay: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select time of day" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Time of Day</SelectLabel>
                <SelectItem value="morning">Morning (8:00 AM - 12:00 PM)</SelectItem>
                <SelectItem value="afternoon">Afternoon (12:00 PM - 5:00 PM)</SelectItem>
                <SelectItem value="evening">Evening (5:00 PM - 9:00 PM)</SelectItem>
                <SelectItem value="night">Night (9:00 PM - Late)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="location">Location</Label>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Input
              id="location"
              placeholder="Event venue or address"
              value={eventData.location}
              onChange={handleInputChange}
              required
              className="transition-all focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </motion.div>
        
        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="locationDetails">Location Details (Optional)</Label>
          <Input
            id="locationDetails"
            placeholder="Floor, room number, or special directions"
            value={eventData.locationDetails || ''}
            onChange={handleInputChange}
            className="transition-all focus:ring-2 focus:ring-primary/30"
          />
        </motion.div>

        <motion.div className="space-y-4" variants={itemVariants}>
          <div className="flex items-center justify-between">
            <Label htmlFor="guests">Number of Guests</Label>
            <span className="text-sm text-muted-foreground bg-accent px-2 py-1 rounded-md">{eventData.guests}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Users className="text-muted-foreground" size={16} />
            <Slider
              id="guests"
              min={1}
              max={500}
              step={1}
              value={[eventData.guests]}
              onValueChange={(values) => setEventData(prev => ({ ...prev, guests: values[0] }))}
              className="flex-1"
            />
          </div>
        </motion.div>

        <motion.div className="space-y-4" variants={itemVariants}>
          <div className="flex items-center justify-between">
            <Label htmlFor="budget">Event Budget</Label>
            <span className="text-sm text-muted-foreground bg-accent px-2 py-1 rounded-md">${eventData.budget}</span>
          </div>
          <div className="flex items-center space-x-4">
            <DollarSign className="text-muted-foreground" size={16} />
            <Slider
              id="budget"
              min={100}
              max={50000}
              step={100}
              value={[eventData.budget]}
              onValueChange={(values) => setEventData(prev => ({ ...prev, budget: values[0] }))}
              className="flex-1"
            />
          </div>
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            placeholder="Tell us about your event..."
            value={eventData.description}
            onChange={handleInputChange}
            rows={4}
            className="transition-all focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </motion.div>

        <motion.div className="flex justify-between pt-4" variants={itemVariants}>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onPrevStep}
            className="transition-transform hover:scale-105"
          >
            Back
          </Button>
          <Button 
            type="submit" 
            className="transition-all hover:scale-105 hover:shadow-md"
          >
            Next Step
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default EventBasicDetailsForm;
