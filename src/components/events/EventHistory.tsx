
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { generateEventHistory } from '@/lib/openai';
import { motion } from 'framer-motion';
import { Book, Loader2 } from 'lucide-react';

interface EventHistoryProps {
  eventType: string;
}

const EventHistory = ({ eventType }: EventHistoryProps) => {
  const [history, setHistory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const historyContent = await generateEventHistory(eventType);
        setHistory(historyContent);
      } catch (error) {
        console.error('Error fetching event history:', error);
        setHistory('Could not load historical information for this event type. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [eventType]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-2 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Book className="mr-2 h-5 w-5 text-primary" />
            About {eventType.charAt(0).toUpperCase() + eventType.slice(1)} Celebrations
          </CardTitle>
          <CardDescription>
            Learn about the history, traditions, and significance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Loading historical information...</span>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[85%]" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[88%]" />
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none text-sm space-y-4">
              {history?.split('\n\n').map((paragraph, i) => (
                <p key={i} className="leading-relaxed">{paragraph}</p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EventHistory;
