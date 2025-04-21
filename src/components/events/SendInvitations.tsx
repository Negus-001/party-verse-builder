
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sendEventInvitation } from '@/lib/emailService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Plus, Trash2, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SendInvitationsProps {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventDescription?: string;
}

const SendInvitations = ({ eventId, eventTitle, eventDate, eventLocation, eventDescription }: SendInvitationsProps) => {
  const [emails, setEmails] = useState<string[]>(['']);
  const [senderName, setSenderName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddEmail = () => {
    setEmails([...emails, '']);
  };

  const handleRemoveEmail = (index: number) => {
    const newEmails = [...emails];
    newEmails.splice(index, 1);
    setEmails(newEmails);
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleSendInvitations = async () => {
    const validEmails = emails.filter(email => email.trim() !== '');
    
    if (!senderName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    if (validEmails.length === 0) {
      alert('Please enter at least one valid email address');
      return;
    }
    
    setIsLoading(true);
    
    const invites = validEmails.map(email => ({
      recipientEmail: email,
      senderName,
      eventTitle,
      eventDate,
      eventLocation,
      eventDescription,
      eventId
    }));
    
    await sendEventInvitation(invites);
    setIsLoading(false);
  };

  return (
    <Card className="border-2 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Send className="mr-2 h-5 w-5 text-primary" />
          Send Invitations
        </CardTitle>
        <CardDescription>
          Invite your guests to {eventTitle}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="senderName">Your Name</Label>
          <Input 
            id="senderName" 
            placeholder="Enter your name" 
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
          />
        </div>
        
        <div className="space-y-4">
          <Label>Guest Emails</Label>
          <AnimatePresence>
            {emails.map((email, index) => (
              <motion.div 
                key={index}
                className="flex items-center space-x-2 mb-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Input 
                  placeholder="guest@email.com" 
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveEmail(index)}
                  disabled={emails.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddEmail}
            className="flex items-center"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Another Guest
          </Button>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleSendInvitations} 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Invitations
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SendInvitations;
