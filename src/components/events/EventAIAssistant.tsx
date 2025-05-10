
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2, ChevronRight, MessageSquare, Check, BookOpen } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { generateAIEventSuggestions } from '@/lib/openai';
import EventHistory from './EventHistory';

interface EventAIAssistantProps {
  onNextStep: () => void;
  onPrevStep: () => void;
  eventType: string;
  eventDetails?: {
    title: string;
    date: string;
    location: string;
    guests: number;
    budget?: number;
    preferences?: string;
  };
}

interface Suggestion {
  id: string;
  category: string;
  text: string;
}

const EventAIAssistant = ({ onNextStep, onPrevStep, eventType, eventDetails }: EventAIAssistantProps) => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [initialSuggestionsLoaded, setInitialSuggestionsLoaded] = useState(false);
  const [showEventHistory, setShowEventHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load initial suggestions automatically
    const loadInitialSuggestions = async () => {
      // Only load once
      if (initialSuggestionsLoaded) return;
      
      setIsGenerating(true);
      setError(null);
      
      try {
        // Use provided eventDetails or fallback to stored/default values
        const details = eventDetails || {
          title: sessionStorage.getItem('eventTitle') || `My ${eventType.charAt(0).toUpperCase() + eventType.slice(1)}`,
          date: sessionStorage.getItem('eventDate') || "2025-08-15",
          location: sessionStorage.getItem('eventLocation') || "Celebration Venue",
          guests: Number(sessionStorage.getItem('eventGuests')) || 50,
          budget: Number(sessionStorage.getItem('eventBudget')) || 2000
        };
        
        const aiResponse = await generateAIEventSuggestions(eventType, details);
        
        // Parse the AI response into suggestion categories
        if (aiResponse) {
          const parsedSuggestions = parseAIResponse(aiResponse);
          setSuggestions(parsedSuggestions);
          setInitialSuggestionsLoaded(true);
          
          toast({
            title: "Suggestions generated",
            description: "We've created personalized ideas for your event",
          });
        } else {
          throw new Error("Failed to generate suggestions");
        }
      } catch (error) {
        console.error("Error generating initial suggestions:", error);
        setError("We couldn't connect to our AI service. Please try again or enter your own prompt.");
        
        // Fallback suggestions
        setSuggestions([
          {
            id: '1',
            category: 'Theme',
            text: 'Consider a classic elegance theme with soft neutrals and accent metallics for a sophisticated atmosphere.'
          },
          {
            id: '2',
            category: 'Décor',
            text: 'String lights and floral centerpieces create an inviting ambiance while staying within budget.'
          },
          {
            id: '3',
            category: 'Entertainment',
            text: 'A professional DJ who can double as an MC will keep your event flowing smoothly and guests entertained.'
          },
        ]);
        setInitialSuggestionsLoaded(true);
      } finally {
        setIsGenerating(false);
      }
    };

    loadInitialSuggestions();
  }, [eventType, toast, initialSuggestionsLoaded, eventDetails]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a prompt to generate suggestions",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Use provided eventDetails or fallback to stored/default values
      const details = eventDetails || {
        title: sessionStorage.getItem('eventTitle') || `My ${eventType.charAt(0).toUpperCase() + eventType.slice(1)}`,
        date: sessionStorage.getItem('eventDate') || "2025-08-15",
        location: sessionStorage.getItem('eventLocation') || "Celebration Venue",
        guests: Number(sessionStorage.getItem('eventGuests')) || 50,
        preferences: prompt
      };
      
      const response = await generateAIEventSuggestions(eventType, details);
      
      if (response) {
        // Parse the AI response
        const newSuggestions = parseAIResponse(response);
        setSuggestions(newSuggestions);
        
        setPrompt('');
        
        toast({
          title: "New suggestions generated",
          description: "We've updated your event ideas based on your request",
        });
      } else {
        throw new Error("Failed to generate suggestions");
      }
    } catch (error) {
      console.error("Error generating suggestions:", error);
      setError("We couldn't connect to our AI service. Please try again later.");
      
      toast({
        title: "Error",
        description: "Failed to generate suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const parseAIResponse = (aiText: string): Suggestion[] => {
    const result: Suggestion[] = [];
    
    // First try to identify markdown sections
    const markdownSections = aiText.split(/(?=##\s+)/);
    if (markdownSections.length > 1) {
      markdownSections.forEach((section, index) => {
        // Extract the header which will be our category
        const headerMatch = section.match(/^##\s+(.*)/);
        if (headerMatch) {
          const category = headerMatch[1].trim();
          // Remove the header from content
          const content = section.replace(/^##\s+.*\n/, '').trim();
          
          // Split content by bullet points or numbered items if they exist
          const items = content.split(/\n\s*[-*]\s+|\n\s*\d+\.\s+/).filter(Boolean);
          
          if (items.length > 1) {
            // Add each bullet point as a separate suggestion
            items.forEach((item, subIndex) => {
              if (item.trim()) {
                result.push({
                  id: `ai-${index}-${subIndex}`,
                  category,
                  text: item.trim()
                });
              }
            });
          } else {
            // Add the whole content as one suggestion
            result.push({
              id: `ai-${index}`,
              category,
              text: content
            });
          }
        }
      });
    }
    
    // If markdown parsing didn't work well, fall back to the old parsing method
    if (result.length < 2) {
      // Clear existing results to start fresh
      result.length = 0;
      
      // Split by numbered sections or bullet points
      const sections = aiText.split(/\d+\.\s|\n\s*-\s+|\n\n/).filter(Boolean);
      
      let currentCategory = "";
      
      sections.forEach((section, index) => {
        const trimmed = section.trim();
        
        // Skip empty sections
        if (!trimmed) return;
        
        // Check if this looks like a category header
        if (trimmed.toUpperCase() === trimmed && trimmed.length < 30) {
          currentCategory = trimmed;
          return;
        }
        
        // If there's a colon early in the text, it might be a category:content format
        const colonIndex = trimmed.indexOf(':');
        if (colonIndex > 0 && colonIndex < 20) {
          const possibleCategory = trimmed.substring(0, colonIndex).trim();
          const content = trimmed.substring(colonIndex + 1).trim();
          
          result.push({
            id: `ai-${index}`,
            category: possibleCategory,
            text: content
          });
        } else if (currentCategory) {
          // Use the current category if we found one earlier
          result.push({
            id: `ai-${index}`,
            category: currentCategory,
            text: trimmed
          });
        } else {
          // If we can't determine a category, use a generic one
          const categories = ["Theme", "Décor", "Food", "Entertainment", "Special Touch"];
          result.push({
            id: `ai-${index}`,
            category: categories[index % categories.length],
            text: trimmed
          });
        }
      });
    }
    
    return result;
  };

  const handleSaveSuggestions = () => {
    // Store suggestions in session storage for use in later steps
    try {
      sessionStorage.setItem('eventSuggestions', JSON.stringify(suggestions));
    } catch (err) {
      console.error("Error saving suggestions to session storage:", err);
    }
    
    toast({
      title: "Suggestions saved",
      description: "Your AI suggestions have been saved to your event plan",
    });
    onNextStep();
  };

  const promptExamples = [
    `Ideas for a unique ${eventType} venue`,
    `Budget-friendly ${eventType} decoration ideas`,
    `Entertainment options for a ${eventType}`,
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-display font-semibold">AI Event Assistant</h2>
        <p className="text-muted-foreground">
          Get personalized suggestions for your {eventType} from our AI assistant. Ask about themes, decorations, activities, or anything else you need help with.
        </p>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card className="border-2 transition-all hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary animate-pulse-slow" />
              Ask AI for Suggestions
            </CardTitle>
            <CardDescription>
              Describe what kind of help you need for your event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="E.g., 'I need theme ideas for a rustic outdoor wedding' or 'Suggest entertainment for a 40th birthday party'"
                className="min-h-[120px] transition-all focus:ring-2 focus:ring-primary/30 resize-none"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Try asking about:</p>
                <div className="flex flex-wrap gap-2">
                  {promptExamples.map((example, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => setPrompt(example)}
                    >
                      {example}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                  {error}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating} 
              className="w-full transition-all hover:scale-105 duration-200"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating suggestions...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Suggestions
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <AnimatePresence>
        {!showEventHistory && suggestions.length > 0 && (
          <motion.div 
            variants={itemVariants}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-2 transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                    AI Suggestions
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEventHistory(true)}
                    className="flex items-center space-x-1 text-xs"
                  >
                    <BookOpen className="h-3 w-3 mr-1" />
                    <span>Learn About {eventType.charAt(0).toUpperCase() + eventType.slice(1)} Traditions</span>
                  </Button>
                </div>
                <CardDescription>
                  Personalized ideas for your {eventType}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <motion.div 
                      key={suggestion.id}
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-primary/10">
                          {suggestion.category}
                        </Badge>
                      </div>
                      <div className="flex">
                        <div className="mr-2 mt-1">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-sm">{suggestion.text}</p>
                      </div>
                      {index < suggestions.length - 1 && <Separator className="my-2" />}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {showEventHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEventHistory(false)}
                className="absolute top-2 right-2 z-10"
              >
                Back to Suggestions
              </Button>
              <EventHistory eventType={eventType} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="flex justify-between pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevStep}
          className="transition-transform hover:scale-105"
        >
          Back
        </Button>
        <Button 
          onClick={handleSaveSuggestions}
          className="transition-all hover:scale-105 hover:shadow-md group"
        >
          Save and Continue
          <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default EventAIAssistant;
