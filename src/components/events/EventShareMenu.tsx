
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Share, Link, Copy, Check, WhatsApp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EventItem } from '@/context/EventContext';

interface EventShareMenuProps {
  event: EventItem;
}

const EventShareMenu = ({ event }: EventShareMenuProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const shareUrl = `${window.location.origin}/event/${event.id}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      toast({
        title: "Link copied to clipboard",
        description: "You can now paste and share this link",
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  const handleWhatsAppShare = () => {
    const text = `Join me for ${event.title} on ${event.date} at ${event.location}! Details: `;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + shareUrl)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Join me for ${event.title} on ${event.date} at ${event.location}!`,
        url: shareUrl,
      })
      .catch(console.error);
    } else {
      // Fallback
      handleCopyLink();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="p-2">
          <p className="text-sm font-medium mb-1">Share this event</p>
          <div className="flex items-center space-x-1">
            <Input 
              value={shareUrl}
              readOnly
              className="text-xs h-8"
            />
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8" 
              onClick={handleCopyLink}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleWhatsAppShare} className="cursor-pointer">
          <WhatsApp className="mr-2 h-4 w-4" />
          Share on WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          <Link className="mr-2 h-4 w-4" />
          Copy link
        </DropdownMenuItem>
        {navigator.share && (
          <DropdownMenuItem onClick={handleShare} className="cursor-pointer">
            <Share className="mr-2 h-4 w-4" />
            Share via...
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EventShareMenu;
