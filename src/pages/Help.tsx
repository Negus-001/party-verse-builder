
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, HelpCircle, BookOpen, MessageSquare, Phone } from 'lucide-react';

const Help = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would search the help content
    console.log("Searching for:", searchQuery);
  };

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3 text-center">Help Center</h1>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find answers to common questions and learn how to get the most out of PartyVerse
          </p>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input 
                  placeholder="Search for help articles..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" className="absolute right-1 top-1">
                  Search
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="faqs" className="w-full">
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="faqs" className="flex items-center">
                <HelpCircle className="mr-2 h-4 w-4" />
                FAQs
              </TabsTrigger>
              <TabsTrigger value="guides" className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Guides
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Support
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="faqs">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>Find answers to common questions about PartyVerse</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>How do I create an event?</AccordionTrigger>
                        <AccordionContent>
                          To create an event, log in to your account and click on the "Create Event" button on your dashboard. Follow the step-by-step process to select an event type, enter details, and use our AI assistant for planning suggestions.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Is PartyVerse free to use?</AccordionTrigger>
                        <AccordionContent>
                          PartyVerse offers both free and premium tiers. Basic event planning features are available for free, while our premium subscription provides access to advanced AI features, unlimited events, and priority support.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-3">
                        <AccordionTrigger>How does the AI suggestion feature work?</AccordionTrigger>
                        <AccordionContent>
                          Our AI suggestion feature analyzes your event details, preferences, and budget to provide personalized recommendations for themes, decorations, vendors, and more. Simply enter your event information and the AI will generate tailored suggestions.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-4">
                        <AccordionTrigger>Can I invite guests directly through PartyVerse?</AccordionTrigger>
                        <AccordionContent>
                          Yes! Once you create an event, you can manage your guest list and send digital invitations directly through our platform. Guests will receive email or text invitations and can RSVP online.
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-5">
                        <AccordionTrigger>How do I contact vendors through the platform?</AccordionTrigger>
                        <AccordionContent>
                          You can browse our vendor marketplace and contact vendors directly through our messaging system. Simply view a vendor's profile and click on "Contact Vendor" to start a conversation.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="guides">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Getting Started Guide</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Learn the basics of using PartyVerse for your event planning needs.</p>
                    <Button variant="outline">Read Guide</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">AI Inspiration Tutorial</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Master the art of getting the best AI-powered suggestions for your events.</p>
                    <Button variant="outline">Read Guide</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Vendor Booking Process</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Step-by-step instructions for finding and booking vendors for your event.</p>
                    <Button variant="outline">Read Guide</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Guest Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Tips for managing your guest list, sending invitations, and tracking RSVPs.</p>
                    <Button variant="outline">Read Guide</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>Need help? Our support team is here for you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col items-center text-center p-6 bg-accent/50 rounded-lg">
                      <MessageSquare className="h-12 w-12 text-primary mb-4" />
                      <h3 className="text-lg font-medium mb-2">Chat Support</h3>
                      <p className="text-muted-foreground mb-4">Get help from our team via live chat during business hours</p>
                      <Button>Start Chat</Button>
                    </div>
                    
                    <div className="flex flex-col items-center text-center p-6 bg-accent/50 rounded-lg">
                      <Phone className="h-12 w-12 text-primary mb-4" />
                      <h3 className="text-lg font-medium mb-2">Call Us</h3>
                      <p className="text-muted-foreground mb-4">Speak directly with our support team</p>
                      <Button>Call (123) 456-7890</Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-2">Email Support</h3>
                    <p className="text-muted-foreground mb-4">Send us an email and we'll get back to you within 24 hours</p>
                    <Button variant="outline">Email support@partyverse.com</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Help;
