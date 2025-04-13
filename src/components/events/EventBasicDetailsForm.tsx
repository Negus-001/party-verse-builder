
import React from 'react';
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
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface EventBasicDetailsFormProps {
  onNextStep: () => void;
  onPrevStep: () => void;
  selectedType: string;
}

const EventBasicDetailsForm = ({ onNextStep, onPrevStep, selectedType }: EventBasicDetailsFormProps) => {
  const { toast } = useToast();
  const [eventName, setEventName] = React.useState('');
  const [eventDate, setEventDate] = React.useState<Date | undefined>(undefined);
  const [eventLocation, setEventLocation] = React.useState('');
  const [eventDescription, setEventDescription] = React.useState('');

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

  return (
    <div>
      <h2 className="text-2xl font-display font-semibold mb-6">Event Details</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="eventName">Event Name</Label>
          <Input
            id="eventName"
            placeholder={`My ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}`}
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Event Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventLocation">Location</Label>
          <Input
            id="eventLocation"
            placeholder="Event venue or address"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventDescription">Description (optional)</Label>
          <Textarea
            id="eventDescription"
            placeholder="Tell us about your event..."
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onPrevStep}>
            Back
          </Button>
          <Button type="submit">Next Step</Button>
        </div>
      </form>
    </div>
  );
};

export default EventBasicDetailsForm;
