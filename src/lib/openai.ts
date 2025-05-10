
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
