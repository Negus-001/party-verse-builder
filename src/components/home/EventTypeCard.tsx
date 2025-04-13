
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface EventTypeCardProps {
  title: string;
  icon: string;
  description: string;
  bgClass?: string;
  delay?: number;
}

const EventTypeCard = ({ 
  title, 
  icon, 
  description, 
  bgClass = "bg-accent", 
  delay = 0 
}: EventTypeCardProps) => {
  return (
    <Card className={cn(
      "overflow-hidden border-0 shadow-md event-card", 
      "animate-fade-in [animation-delay:var(--delay)]"
    )}
    style={{'--delay': `${delay * 100}ms`} as React.CSSProperties}>
      <div className={cn("h-32 flex items-center justify-center text-4xl", bgClass)}>
        {icon}
      </div>
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        <Link to="/create-event">
          <Button variant="outline" size="sm" className="w-full">Create {title}</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default EventTypeCard;
