
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
    model: "gpt-3.5-turbo",
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
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json() as ChatCompletionResponse;
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating AI suggestions:", error);
    return "Sorry, I couldn't generate suggestions at this time. Please try again later.";
  }
};

export const generateEventHistory = async (eventType: string): Promise<string> => {
  const prompt = `
    Provide a brief, engaging history and cultural significance about ${eventType} celebrations.
    Include:
    1. Brief origin and evolution
    2. Cultural significance
    3. Modern practices and traditions
    4. Why this celebration remains important today
  `;

  const requestBody: ChatCompletionRequest = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a cultural historian specializing in celebrations and traditions around the world. Provide informative, engaging content that's respectful of all cultures."
      },
      {
        role: "user",
        content: prompt
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
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json() as ChatCompletionResponse;
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating event history:", error);
    return "Sorry, I couldn't retrieve information about this celebration at this time.";
  }
};

export const chatWithAssistant = async (message: string): Promise<string> => {
  const requestBody: ChatCompletionRequest = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful event planning assistant for Celebration Central. You provide concise, helpful information about event planning, celebration traditions, and our website services. Keep responses friendly and under 150 words when possible."
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
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json() as ChatCompletionResponse;
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error chatting with assistant:", error);
    return "Sorry, I'm having trouble connecting right now. Please try again later.";
  }
};
