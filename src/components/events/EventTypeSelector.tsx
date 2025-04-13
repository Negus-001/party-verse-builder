
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EventType {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface EventTypeSelectorProps {
  selectedType: string | null;
  onSelectType: (typeId: string) => void;
}

const EVENT_TYPES: EventType[] = [
  {
    id: 'wedding',
    name: 'Wedding',
    icon: '💍',
    description: 'Plan your perfect wedding day',
  },
  {
    id: 'birthday',
    name: 'Birthday',
    icon: '🎂',
    description: 'Create a memorable birthday celebration',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    icon: '🏢',
    description: 'Organize professional events',
  },
  {
    id: 'babyshower',
    name: 'Baby Shower',
    icon: '👶',
    description: 'Plan a celebration for a little one',
  },
  {
    id: 'graduation',
    name: 'Graduation',
    icon: '🎓',
    description: 'Celebrate academic achievements',
  },
  {
    id: 'houseparty',
    name: 'House Party',
    icon: '🏠',
    description: 'Host the perfect house party',
  }
];

const EventTypeSelector = ({ selectedType, onSelectType }: EventTypeSelectorProps) => {
  return (
    <div>
      <h2 className="text-2xl font-display font-semibold mb-6">Select Event Type</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {EVENT_TYPES.map((type) => (
          <Card 
            key={type.id} 
            className={cn(
              "cursor-pointer transition-all hover:border-primary hover:shadow-md",
              selectedType === type.id ? "border-2 border-primary ring-2 ring-primary/20" : ""
            )}
            onClick={() => onSelectType(type.id)}
          >
            <CardContent className="p-4 flex items-start space-x-4">
              <div className="text-3xl">{type.icon}</div>
              <div>
                <h3 className="font-semibold">{type.name}</h3>
                <p className="text-muted-foreground text-sm">{type.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventTypeSelector;
