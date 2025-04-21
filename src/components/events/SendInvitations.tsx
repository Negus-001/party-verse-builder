
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { sendEventInvitation } from '@/lib/emailService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Plus, Trash2, Send, Loader2, Mail, Check } from 'lucide-react';
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
  const [personalMessage, setPersonalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

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

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSendInvitations = async () => {
    const validEmails = emails.filter(email => email.trim() !== '' && validateEmail(email));
    
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
      eventDescription: personalMessage || eventDescription,
      eventId
    }));
    
    const success = await sendEventInvitation(invites);
    if (success) {
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 5000);
    }
    setIsLoading(false);
  };

  return (
    <Card className="border-2 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardTitle className="flex items-center">
          <Mail className="mr-2 h-5 w-5 text-primary" />
          Send Invitations
        </CardTitle>
        <CardDescription>
          Invite your guests to {eventTitle}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-5 pt-5">
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Label htmlFor="senderName">Your Name</Label>
          <Input 
            id="senderName" 
            placeholder="Enter your name" 
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            className="transition-all focus:ring-2 focus:ring-primary/30"
          />
        </motion.div>
        
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Label htmlFor="personalMessage">Personal Message (Optional)</Label>
          <Textarea
            id="personalMessage"
            placeholder="Add a personal note to your invitation..."
            value={personalMessage}
            onChange={(e) => setPersonalMessage(e.target.value)}
            className="min-h-[100px] resize-none transition-all focus:ring-2 focus:ring-primary/30"
          />
        </motion.div>
        
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label>Guest Emails</Label>
          <AnimatePresence>
            {emails.map((email, index) => (
              <motion.div 
                key={`email-${index}`}
                className="flex items-center space-x-2 mb-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Input 
                  placeholder="guest@email.com" 
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  className={`flex-1 transition-all focus:ring-2 focus:ring-primary/30 ${!validateEmail(email) && email.length > 0 ? 'border-red-300' : ''}`}
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
            className="flex items-center gap-1 hover:bg-accent/50 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Another Guest
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-accent/30 p-4 rounded-md text-sm border border-accent/50"
        >
          <h4 className="font-medium mb-1">Event Details</h4>
          <ul className="space-y-1 text-muted-foreground">
            <li><strong>Event:</strong> {eventTitle}</li>
            <li><strong>Date:</strong> {eventDate}</li>
            <li><strong>Location:</strong> {eventLocation}</li>
            {eventDescription && <li><strong>Description:</strong> {eventDescription}</li>}
          </ul>
        </motion.div>
      </CardContent>
      
      <CardFooter>
        <AnimatePresence mode="wait">
          {sentSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-full bg-green-500/10 text-green-700 p-3 rounded-md border border-green-200 flex items-center justify-center"
            >
              <Check className="h-4 w-4 mr-2" />
              Invitations sent successfully!
            </motion.div>
          ) : (
            <Button 
              onClick={handleSendInvitations} 
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all hover:shadow-md hover:scale-[1.02]"
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
          )}
        </AnimatePresence>
      </CardFooter>
    </Card>
  );
};

export default SendInvitations;
