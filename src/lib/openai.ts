
// Fetch OpenAI API Key from environment variable
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function chatWithAssistant(userMessage: string): Promise<string> {
  try {
    console.log("Sending request to OpenAI API");
    
    if (!OPENAI_API_KEY) {
      console.error("OpenAI API key is missing");
      return "I'm sorry, I'm not able to process your request at the moment due to configuration issues.";
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an event planning assistant for Celebration Central. Provide helpful, detailed responses to questions about planning events, celebrations, parties, weddings, and other gatherings. Format your responses with clear sections and bullet points for readability.",
          },
          { role: "user", content: userMessage },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
      return "I apologize, but I encountered an issue while processing your request. Please try again later.";
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error in OpenAI request:", error);
    return "I apologize, but I encountered an error while processing your request. Please try again later.";
  }
}

// Generate AI suggestions for events based on event type and preferences
export async function generateAIEventSuggestions(eventType: string, preferences?: string): Promise<string> {
  try {
    if (!OPENAI_API_KEY) {
      console.error("OpenAI API key is missing");
      return "Unable to generate suggestions due to configuration issues.";
    }

    const userPrompt = `Generate practical suggestions for a ${eventType} event${
      preferences ? ` with these preferences: ${preferences}` : ''
    }. Include sections for theme ideas, decor suggestions, food & beverage options, entertainment ideas, and special touches. Format your response in markdown with clear headings and bullet points.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert event planner providing creative and practical suggestions for various types of events. Your responses should be formatted in markdown with clear sections and bullet points.",
          },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
      return "# Unable to Generate Suggestions\n\nI apologize, but I encountered an issue while generating event suggestions. Please try again later.";
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating AI event suggestions:", error);
    return "# Error\n\nUnable to generate suggestions at this time. Please try again later.";
  }
}

// Generate historical and cultural context for different event types
export async function generateEventHistory(eventType: string): Promise<string> {
  try {
    if (!OPENAI_API_KEY) {
      console.error("OpenAI API key is missing");
      return "Unable to generate historical information due to configuration issues.";
    }

    const userPrompt = `Provide interesting historical and cultural context about ${eventType} celebrations. Include information about the origin, significance, traditional practices, how they've evolved over time, and any interesting facts. Format the response as paragraphs of readable text, avoiding bullet points.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a cultural historian specializing in celebrations and traditions across different cultures. Provide informative, engaging content about various types of celebrations.",
          },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
      return "I apologize, but I encountered an issue while retrieving historical information. Please try again later.";
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating event history:", error);
    return "Unable to retrieve historical information at this time. Please try again later.";
  }
}

// Generate vendor recommendations based on event type and preferences
export async function generateVendorRecommendations(eventType: string, location: string, budget: number): Promise<any[]> {
  try {
    if (!OPENAI_API_KEY) {
      console.error("OpenAI API key is missing");
      return [];
    }

    const userPrompt = `Generate 5 fictional but realistic vendor recommendations for a ${eventType} event in ${location} with a budget of $${budget}. For each vendor, provide: name, type (e.g., caterer, photographer, decorator), brief description, price range (cheap, moderate, expensive), and a list of 3 key services they offer. Format as structured data that can be parsed to JSON.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a vendor recommendation system that outputs structured, realistic data about event vendors. Output the data in a format that can be easily parsed to JSON.",
          },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
      return [];
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      // Try to parse the JSON directly if it's well-formatted
      if (content.includes('```json')) {
        const jsonString = content.split('```json')[1].split('```')[0].trim();
        return JSON.parse(jsonString);
      } else if (content.startsWith('[') && content.endsWith(']')) {
        return JSON.parse(content);
      } else {
        // Fallback to a simple array of sample vendors
        return [
          {
            name: "Elegant Eats Catering",
            type: "Caterer",
            description: "Specializing in gourmet food options for special events",
            priceRange: "moderate",
            services: ["Custom menu creation", "Staff service", "Setup and cleanup"]
          },
          {
            name: "Floral Fantasy",
            type: "Decorator",
            description: "Creating beautiful floral arrangements and decorations",
            priceRange: "moderate",
            services: ["Custom floral arrangements", "Event space decoration", "Rental items"]
          },
          {
            name: "Snapshot Studios",
            type: "Photographer",
            description: "Capturing your special moments with professional photography",
            priceRange: "expensive",
            services: ["Event photography", "Photo editing", "Digital image delivery"]
          }
        ];
      }
    } catch (error) {
      console.error("Error parsing vendor recommendations:", error);
      return [];
    }
  } catch (error) {
    console.error("Error generating vendor recommendations:", error);
    return [];
  }
}
