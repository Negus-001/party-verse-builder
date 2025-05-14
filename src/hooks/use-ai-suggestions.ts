
import { useState } from 'react';
import { useToast } from './use-toast';

interface EventDetails {
  title: string;
  date: string;
  location: string;
  guests: number;
  budget?: number;
  preferences?: string;
}

interface AISuggestionResult {
  isGenerating: boolean;
  error: string | null;
  generateSuggestions: (eventType: string, details: EventDetails) => Promise<string | null>;
}

export const useAISuggestions = (): AISuggestionResult => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateSuggestions = async (eventType: string, details: EventDetails): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Create a prompt based on event details
      const prompt = `
        Generate creative ideas and suggestions for a ${eventType} event with the following details:
        - Event: ${details.title}
        - Date: ${details.date}
        - Location: ${details.location}
        - Number of guests: ${details.guests}
        ${details.budget ? `- Budget: $${details.budget}` : ''}
        ${details.preferences ? `- Preferences: ${details.preferences}` : ''}
        
        Please provide suggestions for themes, decorations, food, entertainment, and any special touches that would make this event memorable.
        Format the response in markdown with clear headers (##) for each category.
      `;
      
      // This is a placeholder for the actual API call
      // In a real application, this would make a request to the OpenAI API
      const aiResponse = await mockGenerateResponse(prompt, eventType);
      return aiResponse;
    } catch (error) {
      console.error("Error generating AI suggestions:", error);
      setError("Failed to generate suggestions. Please try again later.");
      toast({
        title: "Error",
        description: "Could not generate AI suggestions at this time.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };
  
  return { isGenerating, error, generateSuggestions };
};

// Mock function to simulate AI response
// In production, this would be replaced with a real API call
async function mockGenerateResponse(prompt: string, eventType: string): Promise<string> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Based on event type, return different suggestions
  if (eventType.toLowerCase().includes('wedding')) {
    return `
## Theme Ideas
- Romantic Garden Wedding
- Classic Elegance
- Rustic Chic
- Modern Minimalist

## Decoration Suggestions
- Use string lights and floral arches for a magical ambiance
- Create personalized welcome signs and seating charts
- Incorporate seasonal flowers in centerpieces
- Use fabric draping and strategic lighting for venue transformation

## Food & Beverage
- Consider a plated dinner for a formal feel
- Offer signature cocktails named after the couple
- Include a dessert station with various options beyond cake
- Accommodate dietary restrictions with clearly labeled options

## Entertainment
- Live band for ceremony, DJ for reception
- Photo booth with custom props
- Interactive activities like guest advice cards
- Consider a surprise performance or exit (sparklers, live painter)

## Special Touches
- Personalized vows and ceremony readings
- Welcome bags for out-of-town guests
- Custom wedding hashtag for social media
- Memory table honoring loved ones
    `;
  } else if (eventType.toLowerCase().includes('birthday')) {
    return `
## Theme Ideas
- Elegant Garden Party
- Vintage Glamour
- Modern Minimalist
- Favorite Hobby or Decade

## Decor Suggestions
- Use string lights and floral arrangements for a warm atmosphere
- Create photo walls with memories from throughout the years
- Incorporate personalized signage and table settings
- Consider a focal centerpiece like a dramatic balloon installation

## Food & Beverage
- Consider a buffet style service for flexibility
- Include both alcoholic and non-alcoholic signature drinks
- Dessert station with variety of options
- Food stations representing favorite cuisines or childhood favorites

## Entertainment
- Live music or DJ for atmosphere
- Interactive activities like photo booths
- Consider lawn games if outdoors
- Slideshow of photos throughout the years

## Special Touches
- Personalized party favors for guests
- Grand entrance or exit moment
- Custom lighting effects
- Meaningful toasts and speeches
    `;
  } else {
    return `
## Theme Ideas
- Seasonal Celebration
- Industry or Company Values Themed
- Interactive Experience
- Destination-inspired Decor

## Decoration Suggestions
- Strategic lighting to transform the venue
- Company colors incorporated subtly in decor
- Interactive elements that highlight achievements
- Professionally designed signage and wayfinding

## Food & Beverage
- Upscale food stations instead of traditional buffet
- Local specialties or chef-curated menu
- Signature cocktails tied to company branding
- Dietary accommodations clearly labeled

## Entertainment
- Background music that builds throughout the event
- Interactive entertainment like close-up magicians
- Photo or video opportunities with professional setup
- Awards or recognition ceremony segment

## Special Touches
- Branded, useful takeaway gifts
- Digital or physical guest book for memories
- Surprise moment or special announcement
- Follow-up with professional photos after the event
    `;
  }
}
