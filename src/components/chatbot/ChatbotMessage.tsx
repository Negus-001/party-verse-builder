
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';

interface ChatbotMessageProps {
  message: string;
  isBot: boolean;
}

const ChatbotMessage = ({ message, isBot }: ChatbotMessageProps) => {
  // Process markdown in bot messages
  const processedMessage = React.useMemo(() => {
    if (!isBot) return message;
    
    // Fix asterisks and other markdown formatting issues
    return message
      // Replace escaped asterisks with temporary placeholders
      .replace(/\\\*/g, '___ASTERISK___')
      // Handle *text* formatting to work properly with markdown
      .replace(/\*([^*]+)\*/g, '**$1**')
      // Replace temporary placeholders back to asterisks
      .replace(/___ASTERISK___/g, '*');
  }, [message, isBot]);

  return (
    <div className={cn(
      "flex gap-3 p-4 text-sm",
      isBot ? "bg-muted/50 rounded-lg" : ""
    )}>
      <Avatar className="h-8 w-8 shrink-0 mt-1">
        {isBot ? (
          <>
            <AvatarImage src="/bot-avatar.png" alt="Assistant" />
            <AvatarFallback className="bg-primary/20 text-primary">
              <Bot size={16} />
            </AvatarFallback>
          </>
        ) : (
          <AvatarFallback className="bg-muted">
            <User size={16} />
          </AvatarFallback>
        )}
      </Avatar>
      
      <div className="leading-relaxed">
        {isBot ? (
          <ReactMarkdown 
            className="prose prose-sm dark:prose-invert max-w-none"
            components={{
              // Style links and other elements as needed
              a: ({ node, ...props }) => (
                <a 
                  {...props} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:no-underline"
                />
              ),
              // Custom styling for code blocks
              code: ({ node, ...props }) => (
                <code 
                  {...props}
                  className="bg-muted px-1 py-0.5 rounded text-xs"
                />
              ),
              // Style lists properly
              ul: ({ node, ...props }) => (
                <ul 
                  {...props}
                  className="list-disc pl-4 space-y-1 my-2"
                />
              ),
              ol: ({ node, ...props }) => (
                <ol 
                  {...props}
                  className="list-decimal pl-4 space-y-1 my-2"
                />
              ),
            }}
          >
            {processedMessage}
          </ReactMarkdown>
        ) : (
          <p>{message}</p>
        )}
      </div>
    </div>
  );
};

export default ChatbotMessage;
