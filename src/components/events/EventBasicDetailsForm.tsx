
import React, { useState } from 'react';
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
import { CalendarIcon, Users, DollarSign } from 'lucide-react';
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

const EventBasicDetailsForm = ({ onNextStep, onPrevStep, selectedType }: EventBasicDetailsFormProps) => {
  const { toast } = useToast();
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [guests, setGuests] = useState(50);
  const [budget, setBudget] = useState<number>(1000);
  const [timeOfDay, setTimeOfDay] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventName || !eventDate || !eventLocation) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    // Here we would save the event details to a state manager or context
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
          <Label htmlFor="eventName">Event Name</Label>
          <Input
            id="eventName"
            placeholder={`My ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}`}
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
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
                  !eventDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {eventDate ? format(eventDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={eventDate}
                onSelect={setEventDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="timeOfDay">Time of Day</Label>
          <Select onValueChange={setTimeOfDay}>
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
          <Label htmlFor="eventLocation">Location</Label>
          <Input
            id="eventLocation"
            placeholder="Event venue or address"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            required
            className="transition-all focus:ring-2 focus:ring-primary/30"
          />
        </motion.div>

        <motion.div className="space-y-4" variants={itemVariants}>
          <div className="flex items-center justify-between">
            <Label htmlFor="guests">Number of Guests: {guests}</Label>
            <span className="text-sm text-muted-foreground bg-accent px-2 py-1 rounded-md">{guests}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Users className="text-muted-foreground" size={16} />
            <Slider
              id="guests"
              min={1}
              max={500}
              step={1}
              value={[guests]}
              onValueChange={(values) => setGuests(values[0])}
              className="flex-1"
            />
          </div>
        </motion.div>

        <motion.div className="space-y-4" variants={itemVariants}>
          <div className="flex items-center justify-between">
            <Label htmlFor="budget">Event Budget: ${budget}</Label>
            <span className="text-sm text-muted-foreground bg-accent px-2 py-1 rounded-md">${budget}</span>
          </div>
          <div className="flex items-center space-x-4">
            <DollarSign className="text-muted-foreground" size={16} />
            <Slider
              id="budget"
              min={100}
              max={50000}
              step={100}
              value={[budget]}
              onValueChange={(values) => setBudget(values[0])}
              className="flex-1"
            />
          </div>
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="eventDescription">Description (optional)</Label>
          <Textarea
            id="eventDescription"
            placeholder="Tell us about your event..."
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
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
