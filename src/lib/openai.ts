
// Use provided OpenAI API key from user
const OPENAI_API_KEY = "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";

interface ChatCompletionRequest {
  model: string;
  messages: {
    role: "system" | "user" | "assistant";
    content: string;
  }[];
}

interface ChatCompletionResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

const handleOpenAIError = (error: any): string => {
  console.error("OpenAI API error:", error);
  
  if (error.error?.type === "insufficient_quota") {
    return "Our AI service is currently at capacity. Please try again in a few minutes.";
  }
  
  if (error.error?.code === "rate_limit_exceeded") {
    return "Too many requests. Please wait a moment before trying again.";
  }
  
  return "I'm having trouble connecting. Please try again in a moment.";
};

export const generateAIEventSuggestions = async (
  eventType: string, 
  eventDetails: {
    title: string;
    date: string;
    location: string;
    guests: number;
    budget?: number;
    preferences?: string;
  }
): Promise<string> => {
  const prompt = `
    Generate creative suggestions for a ${eventType} event with the following details:
    - Title: ${eventDetails.title}
    - Date: ${eventDetails.date}
    - Location: ${eventDetails.location}
    - Number of Guests: ${eventDetails.guests}
    ${eventDetails.budget ? `- Budget: $${eventDetails.budget}` : ''}
    ${eventDetails.preferences ? `- Special preferences: ${eventDetails.preferences}` : ''}
    
    Please provide:
    1. Theme ideas (3)
    2. Decor suggestions
    3. Food & beverage recommendations
    4. Entertainment ideas
    5. Special touches to make this event memorable
  `;

  const requestBody: ChatCompletionRequest = {
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an expert event planner with years of experience creating memorable events. Your suggestions should be creative, practical, and tailored to the specific event type and details provided. Format your response in clear sections with headers and bullet points where appropriate."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  };

  try {
    console.log("Making OpenAI API request for suggestions:", { eventType, requestBody });
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error response:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json() as ChatCompletionResponse;
    console.log("OpenAI API response received.");
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating AI suggestions:", error);
    // Return a more helpful error message with fallback content
    return `
# Event Suggestions for ${eventType}

## Theme Ideas
- Elegant Garden Party
- Vintage Glamour
- Modern Minimalist

## Decor Suggestions
- Use string lights and floral arrangements for a warm atmosphere
- Create photo walls for memorable pictures
- Incorporate personalized signage and table settings

## Food & Beverage
- Consider a buffet style service for flexibility
- Include both alcoholic and non-alcoholic signature drinks
- Dessert station with variety of options

## Entertainment
- Live music or DJ for atmosphere
- Interactive activities like photo booths
- Consider lawn games if outdoors

## Special Touches
- Personalized party favors for guests
- Grand entrance or exit moment
- Custom lighting effects

(Note: The AI assistant is currently unavailable. These are general suggestions.)
    `;
  }
};

export const generateEventHistory = async (eventType: string): Promise<string> => {
  const prompt = `
    Provide a detailed, engaging history and cultural significance about ${eventType} celebrations.
    Include:
    1. Origin and historical evolution of this celebration type
    2. Cultural significance across different societies
    3. Traditional practices and how they've evolved
    4. Modern interpretations and importance in today's society
    5. Interesting facts and traditions associated with this celebration type
    
    Write in an engaging, informative style that helps event planners understand the deeper meaning behind this type of celebration.
  `;

  const requestBody: ChatCompletionRequest = {
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a cultural historian specializing in celebrations and traditions around the world. Provide informative, engaging content that's respectful of all cultures and traditions. Include specific details, historical context, and interesting facts that would help someone planning such an event."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  };

  try {
    console.log("Making OpenAI API request for event history:", { eventType });
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error response:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json() as ChatCompletionResponse;
    console.log("OpenAI API response received for event history");
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating event history:", error);
    // Return a fallback response with generic information
    return `
# History of ${eventType.charAt(0).toUpperCase() + eventType.slice(1)} Celebrations

## Origins
The tradition of ${eventType} celebrations dates back many centuries and has evolved across various cultures. These gatherings have historically served as important social milestones.

## Cultural Significance
${eventType.charAt(0).toUpperCase() + eventType.slice(1)} celebrations hold deep cultural meaning in most societies, often marking important transitions or honoring special relationships.

## Traditional Practices
Traditional ${eventType} ceremonies typically involved family gatherings, special foods, and customs specific to the local culture. Many of these traditions continue today.

## Modern Interpretations
Today's ${eventType} celebrations blend traditional elements with contemporary preferences, allowing for more personalization and creative expression.

## Interesting Facts
- Different cultures celebrate ${eventType}s with unique customs and rituals
- The modern form of ${eventType} celebrations began to take shape in the 20th century
- There are regional variations in how ${eventType}s are celebrated around the world

(Note: The AI assistant is currently unavailable. This is general information about ${eventType} celebrations.)
    `;
  }
};

export const chatWithAssistant = async (message: string): Promise<string> => {
  const requestBody: ChatCompletionRequest = {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are the helpful event planning assistant for Celebration Central. You provide informative, specific answers about event planning, celebration traditions, and our website services. Focus on giving practical advice and specific suggestions for event planning. Always be friendly, professional, and engaging. Format your responses with markdown for better readability and avoid using asterisks for emphasis (use bold or headers instead)."
      },
      {
        role: "user",
        content: message
      }
    ]
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return handleOpenAIError(errorData);
    }

    const data = await response.json() as ChatCompletionResponse;
    return data.choices[0].message.content;
  } catch (error) {
    // Return a helpful fallback response
    return `
# Hello from Celebration Central

I'm currently having trouble connecting to my knowledge base. Here are some general tips that might help:

## Event Planning Basics
- Start with a clear budget and guest list
- Book venues early, especially for popular dates
- Consider hiring professionals for complex events
- Don't forget to plan for weather contingencies for outdoor events

## Our Services
- Celebration Central helps you plan various types of events
- We connect you with qualified vendors
- Our platform offers planning tools and checklists
- We provide AI-powered suggestions for your events

Please try asking your question again later when our connection is restored.
    `;
  }
};
