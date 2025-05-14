
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { generateAIEventSuggestions } from '@/lib/openai';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Inspiration = () => {
  const [selectedEventType, setSelectedEventType] = useState('wedding');
  const [preferences, setPreferences] = useState('');
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eventTypes = [
    { id: 'wedding', label: 'Wedding' },
    { id: 'birthday', label: 'Birthday' },
    { id: 'corporate', label: 'Corporate' },
    { id: 'party', label: 'Party' },
    { id: 'babyshower', label: 'Baby Shower' },
    { id: 'graduation', label: 'Graduation' },
    { id: 'anniversary', label: 'Anniversary' },
  ];

  const generateSuggestions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const suggestionsText = await generateAIEventSuggestions(selectedEventType, preferences);
      setSuggestions(suggestionsText);
    } catch (err) {
      console.error("Error generating suggestions:", err);
      setError("Failed to generate suggestions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateSuggestions();
  }, []);

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen py-24 px-6 bg-gradient-to-b from-background to-accent/10">
        <div className="container max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 bg-gradient-to-r from-primary to-purple-400 text-transparent bg-clip-text">
              Get Inspired for Your Event
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover creative ideas and unique suggestions for your celebration
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar - Controls */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-primary" />
                    AI Inspiration Generator
                  </CardTitle>
                  <CardDescription>
                    Get personalized event suggestions using our AI assistant
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Event Type</label>
                    <Tabs 
                      defaultValue={selectedEventType} 
                      value={selectedEventType}
                      onValueChange={setSelectedEventType}
                      className="w-full"
                    >
                      <TabsList className="w-full grid grid-cols-2 h-auto">
                        {eventTypes.slice(0, 4).map(type => (
                          <TabsTrigger 
                            key={type.id} 
                            value={type.id}
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                          >
                            {type.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      
                      <TabsList className="w-full grid grid-cols-3 mt-2 h-auto">
                        {eventTypes.slice(4).map(type => (
                          <TabsTrigger 
                            key={type.id} 
                            value={type.id}
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                          >
                            {type.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="preferences" className="text-sm font-medium">
                      Additional Preferences (Optional)
                    </label>
                    <Input
                      id="preferences"
                      placeholder="e.g., outdoor, eco-friendly, formal..."
                      value={preferences}
                      onChange={(e) => setPreferences(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Add specific preferences to get more tailored suggestions
                    </p>
                  </div>
                  
                  <Button 
                    onClick={generateSuggestions} 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Ideas
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Main Content - Suggestions */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>
                    Event Suggestions for {selectedEventType.charAt(0).toUpperCase() + selectedEventType.slice(1)}
                  </CardTitle>
                  {preferences && (
                    <CardDescription>
                      With preferences: {preferences}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading && (
                    <div className="py-8 text-center space-y-4">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                      <p className="text-muted-foreground">
                        Our AI is creating personalized suggestions for your {selectedEventType}...
                      </p>
                    </div>
                  )}
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {!loading && !error && suggestions && (
                    <div className="prose dark:prose-invert max-w-none">
                      <ReactMarkdown>
                        {suggestions}
                      </ReactMarkdown>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Inspiration;
