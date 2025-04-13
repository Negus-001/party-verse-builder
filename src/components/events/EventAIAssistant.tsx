
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2, ChevronRight, MessageSquare } from 'lucide-react';
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

interface EventAIAssistantProps {
  onNextStep: () => void;
  onPrevStep: () => void;
  eventType: string;
}

interface Suggestion {
  id: string;
  category: string;
  text: string;
}

const mockSuggestions: Record<string, Suggestion[]> = {
  'wedding': [
    { 
      id: '1', 
      category: 'Theme', 
      text: 'Consider a rustic garden wedding with natural elements like wooden accents, wildflowers, and string lights for a romantic atmosphere.'
    },
    { 
      id: '2', 
      category: 'Decor', 
      text: 'For centerpieces, use mason jars filled with seasonal flowers and floating candles for an elegant yet affordable decoration.'
    },
    { 
      id: '3', 
      category: 'Food', 
      text: 'A family-style dinner service creates a warm, communal feel while being more cost-effective than plated dinners.'
    },
  ],
  'birthday': [
    { 
      id: '1', 
      category: 'Theme', 
      text: 'Consider a "Decades" theme where guests dress in attire from different eras - great for milestone birthdays!'
    },
    { 
      id: '2', 
      category: 'Activities', 
      text: 'Create a "Memory Lane" with photos and mementos from throughout the years, giving guests conversation starters.'
    },
    { 
      id: '3', 
      category: 'Food', 
      text: 'Instead of one large cake, consider a dessert bar with the guest of honor\'s favorite treats from throughout their life.'
    },
  ],
  'default': [
    { 
      id: '1', 
      category: 'Planning', 
      text: 'Start by defining your budget and guest list early to guide all your other decisions.'
    },
    { 
      id: '2', 
      category: 'Venue', 
      text: 'Consider non-traditional venues that match your style - art galleries, botanical gardens, or historical buildings can offer unique atmospheres.'
    },
    { 
      id: '3', 
      category: 'Experience', 
      text: 'Create memorable moments with interactive elements like photo booths, live demonstrations, or personalized party favors.'
    },
  ]
};

const EventAIAssistant = ({ onNextStep, onPrevStep, eventType }: EventAIAssistantProps) => {
  const { toast } = useToast();
  const [prompt, setPrompt] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);

  React.useEffect(() => {
    // Load initial suggestions based on event type
    if (eventType in mockSuggestions) {
      setSuggestions(mockSuggestions[eventType]);
    } else {
      setSuggestions(mockSuggestions['default']);
    }
  }, [eventType]);

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

    // Simulate API call to AI service
    setTimeout(() => {
      const newSuggestions = [
        {
          id: Date.now().toString(),
          category: 'Custom Suggestion',
          text: `Based on your request for "${prompt}", here's a personalized idea: Consider incorporating interactive elements that engage guests personally, like custom games or activities related to ${eventType} traditions but with modern twists.`
        },
        ...suggestions.slice(0, 2)
      ];
      
      setSuggestions(newSuggestions);
      setIsGenerating(false);
      setPrompt('');
      
      toast({
        title: "Suggestions generated",
        description: "We've created personalized suggestions for your event",
      });
    }, 2000);
  };

  const handleSaveSuggestions = () => {
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-semibold">AI Event Assistant</h2>
      <p className="text-muted-foreground">
        Get personalized suggestions for your {eventType} from our AI assistant. Ask about themes, decorations, activities, or anything else you need help with.
      </p>
      
      <Card className="border-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
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
              className="min-h-[120px]"
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
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => setPrompt(example)}
                  >
                    {example}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating} 
            className="w-full"
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

      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">AI Suggestions</CardTitle>
            <CardDescription>
              Personalized ideas for your {eventType}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="space-y-2">
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-accent/50">
                      {suggestion.category}
                    </Badge>
                  </div>
                  <div className="flex">
                    <div className="mr-2 mt-1">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm">{suggestion.text}</p>
                  </div>
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrevStep}>
          Back
        </Button>
        <Button onClick={handleSaveSuggestions}>
          Save and Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EventAIAssistant;
