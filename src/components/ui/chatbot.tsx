"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: 'Hello! I\'m your Sauti Ya Watu assistant. I can help you navigate the app and explain what each feature does. Try asking me about politicians, sentiment analysis, or campaign advice!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `You are a helpful assistant for Sauti Ya Watu, a Kenyan political platform. User asks: ${userInput}. Explain the app features and navigation.` 
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessages(prev => [...prev, { role: 'bot', content: result.response }]);
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      // Fallback to simple responses
      let botResponse = '';
      const query = userInput.toLowerCase();

      if (query.includes('politician') || query.includes('profile')) {
        botResponse = 'The Politicians section lets you explore detailed profiles of Kenyan political leaders. You can view their track records, academic background, and generate AI-powered analysis of their performance.';
      } else if (query.includes('sentiment') || query.includes('analysis')) {
        botResponse = 'Sentiment Analysis uses AI to analyze public opinion about politicians from social media and news sources. It shows positive, negative, and neutral sentiment percentages.';
      } else if (query.includes('campaign') || query.includes('advice')) {
        botResponse = 'Campaign Advice generates AI-powered strategic recommendations for politicians based on real-time political data, trending topics, and public sentiment.';
      } else {
        botResponse = 'Sauti Ya Watu is a comprehensive platform for Kenyan election data and political analysis. You can explore politician profiles, analyze public sentiment, get campaign advice, and participate in demo voting.';
      }
      
      setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 h-12 w-12 md:h-14 md:w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        {isOpen ? <X className="h-5 w-5 md:h-6 md:w-6" /> : <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />}
      </Button>

      {/* Chatbot Window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 left-4 md:bottom-24 md:right-6 md:left-auto md:w-96 h-[400px] md:h-[500px] shadow-xl z-40">
          <CardHeader className="pb-2 md:pb-3">
            <CardTitle className="text-base md:text-lg">Sauti Ya Watu Assistant</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-full p-3 md:p-4">
            <div className="flex-1 overflow-y-auto space-y-2 md:space-y-3 mb-3 pr-1 md:pr-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-2 md:p-3 rounded-lg text-xs leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-3 md:ml-6'
                      : 'bg-muted mr-3 md:mr-6'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="bg-muted mr-3 md:mr-6 p-2 md:p-3 rounded-lg text-xs flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about the app..."
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 text-sm"
              />
              <Button onClick={handleSend} size="icon" disabled={isLoading} className="h-9 w-9 md:h-10 md:w-10">
                <Send className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}