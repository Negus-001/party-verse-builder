
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Sparkles, Lightbulb, BookOpen, Copy, ThumbsUp, Download, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateAIEventSuggestions } from '@/lib/openai';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Inspiration = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [eventType, setEventType] = useState('wedding');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  
  // Predefined prompts by event type
  const predefinedPrompts = {
    wedding: [
      "Suggest themes for a summer beach wedding with 80 guests.",
      "What are some unique wedding reception activities for guests?",
      "Help me plan a rustic barn wedding on a budget of $15,000."
    ],
    birthday: [
      "Ideas for a surprise 40th birthday party.",
      "What are some creative themes for a child's 10th birthday?",
      "Help me plan an outdoor birthday celebration for 30 people."
    ],
    corporate: [
      "Suggest team-building activities for a corporate retreat.",
      "Ideas for a tech company holiday party with 100 employees.",
      "Help me plan a product launch event that will impress investors."
    ],
    socialGathering: [
      "Unique ideas for a summer backyard party.",
      "What are some fun themes for a housewarming party?",
      "Help me plan a casual reunion for old friends."
    ]
  };
  
  const handlePromptSelect = (prePrompt: string) => {
    setPrompt(prePrompt);
  };
  
  const handleGetInspiration = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a prompt or select one from the suggestions.",
        variant: "destructive",
      });
      return;
    }
    
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please log in to use the AI inspiration feature.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const mockEventDetails = {
        title: `${eventType.charAt(0).toUpperCase() + eventType.slice(1)} Event`,
        date: "2024-12-25",
        location: "California",
        guests: 50,
        preferences: prompt
      };
      
      const suggestion = await generateAIEventSuggestions(eventType, mockEventDetails);
      setResult(suggestion);
    } catch (error) {
      console.error("Error generating AI suggestions:", error);
      toast({
        title: "Error",
        description: "Failed to generate suggestions. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied!",
      description: "Suggestions copied to clipboard",
    });
  };

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">AI Event Inspiration</h1>
              <p className="text-muted-foreground">Get creative ideas and planning assistance for your next event</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="mr-2 h-5 w-5 text-primary" />
                    Get AI Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventType">Event Type</Label>
                    <Select 
                      value={eventType} 
                      onValueChange={setEventType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="birthday">Birthday</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="socialGathering">Social Gathering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="prompt">Describe what you need help with</Label>
                    <Textarea 
                      id="prompt"
                      placeholder="E.g., I need ideas for a rustic wedding with 100 guests and a $15,000 budget..."
                      className="min-h-[120px]"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleGetInspiration}
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 
                      "Generating Ideas..." : 
                      <>
                        <Lightbulb className="mr-2 h-4 w-4" />
                        Get Inspiration
                      </>
                    }
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 text-primary" />
                    Prompt Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {predefinedPrompts[eventType as keyof typeof predefinedPrompts].map((prePrompt, index) => (
                    <div 
                      key={index} 
                      className="p-3 border rounded-lg mb-3 cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => handlePromptSelect(prePrompt)}
                    >
                      <p className="text-sm">{prePrompt}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            {/* Results Section */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                    AI Suggestions
                  </CardTitle>
                  {result && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleCopyToClipboard}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Saved",
                            description: "Suggestions saved to your favorites"
                          });
                        }}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="pt-4">
                  {result ? (
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap">
                        {result.split('\n').map((line, i) => (
                          <p key={i} className={line.match(/^\d+\.|\*/) ? 'mb-1' : 'mb-4'}>
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center h-[400px] text-muted-foreground">
                      <Sparkles className="h-16 w-16 mb-4 opacity-20" />
                      <h3 className="text-lg font-medium mb-2">No suggestions generated yet</h3>
                      <p className="max-w-md">
                        Select an event type, enter a prompt or choose from our suggestions, and click "Get Inspiration" to receive AI-powered event ideas.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Inspiration;
