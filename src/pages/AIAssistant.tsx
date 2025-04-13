
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Send, Bot, MessageCircle, Loader2, Stars } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AIAssistant = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setLoading(true);
    
    try {
      // Simulate AI response for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      setResponse(`Here are some suggestions for your event "${prompt}":\n\n• Choose a theme that aligns with the event's purpose\n• Consider the venue layout for optimal guest flow\n• Plan for interactive activities to engage attendees\n• Create a detailed timeline to keep the event on schedule\n• Prepare a backup plan for any potential issues`);
      toast({
        title: "AI Response Generated",
        description: "Check out the suggestions for your event!",
      });
    } catch (error) {
      console.error("Error generating AI response:", error);
      toast({
        title: "Error",
        description: "Failed to generate AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const examplePrompts = [
    "Suggest decoration ideas for a garden wedding",
    "Give me a checklist for a corporate conference",
    "Help me plan a menu for a birthday party",
    "What entertainment works best for a family reunion?",
  ];

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)]" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[40vh] w-[40vh] bg-primary/20 rounded-full blur-[100px] animate-pulse-soft" />
        </div>
        
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-primary animate-float" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 slide-in-bottom">AI Event Assistant</h1>
            <p className="text-muted-foreground max-w-xl slide-in-bottom delay-100">
              Get personalized event planning assistance and creative ideas with our AI-powered tool
            </p>
          </div>
          
          <Card className="border-2 slide-in-bottom delay-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Event Planning Assistant
              </CardTitle>
              <CardDescription>
                Describe your event or ask for specific suggestions to get personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="chat">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="chat" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="templates" className="flex items-center gap-2">
                    <Stars className="h-4 w-4" />
                    Templates
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="chat">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <Textarea 
                          placeholder="Describe your event or ask for specific planning advice..." 
                          className="min-h-[120px] resize-y"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Try asking about:</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {examplePrompts.map((examplePrompt, index) => (
                            <Button 
                              key={index} 
                              variant="outline" 
                              size="sm"
                              type="button"
                              onClick={() => setPrompt(examplePrompt)}
                              disabled={loading}
                              className="text-xs"
                            >
                              {examplePrompt}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full flex items-center gap-2"
                        disabled={loading || !prompt.trim()}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Get Suggestions
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                  
                  {response && !loading && (
                    <div className="mt-6 p-4 bg-accent/50 rounded-lg border animate-fade-in">
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        AI Suggestions
                      </p>
                      <div className="whitespace-pre-line text-sm">
                        {response}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="templates">
                  <div className="grid gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Wedding Planner</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Complete wedding planning checklist with timeline and vendor suggestions
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">
                          Use Template
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Corporate Event</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Professional conference or business meeting planning guide
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">
                          Use Template
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Birthday Party</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Fun celebration ideas for any age with entertainment options
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">
                          Use Template
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default AIAssistant;
