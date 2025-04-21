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
        content: "You are an expert event planner with years of experience creating memorable events. Your suggestions should be creative, practical, and tailored to the specific event type and details provided."
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
    console.log("OpenAI API response received:", data);
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating AI suggestions:", error);
    return "Sorry, I couldn't generate suggestions at this time. Please try again later.";
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
    return "Sorry, I couldn't retrieve information about this celebration at this time.";
  }
};

export const chatWithAssistant = async (message: string): Promise<string> => {
  const requestBody: ChatCompletionRequest = {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are the helpful event planning assistant for Celebration Central. You provide informative, specific answers about event planning, celebration traditions, and our website services. Focus on giving practical advice and specific suggestions for event planning. Always be friendly, professional, and engaging."
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
    return handleOpenAIError(error);
  }
};
