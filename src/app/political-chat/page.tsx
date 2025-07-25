"use client";

import { useState, type FC } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { SendHorizontal } from "lucide-react";
import { ai } from "@/ai/genkit";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const PoliticalChatPage: FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your Kenyan politics expert. You can ask me about political parties, leaders, electoral processes, or any other political matters in Kenya."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
              setMessages((prev: Message[]) => [...prev, { 
    setIsLoading(true);

    try {
      const response = await ai.run(
        "chat",
        async () => {
          return `As an expert on Kenyan politics and governance, answer the following question:
      
          Question: ${userMessage}
      
          Remember to:
          1. Stay focused on Kenyan politics
          2. Be factual and non-partisan
          3. Provide verifiable information
          4. Respect all political viewpoints
          5. Use clear, simple language
      
          Answer:`;
        }
      );

            setMessages((prev: Message[]) => [...prev, { role: "assistant", content: response as string }]);
    } catch (error) {
      setMessages((prev: Message[]) => [...prev, { 
        role: "assistant", 
        content: "I apologize, but I'm having trouble connecting right now. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Card className="h-[800px] flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Political Assistant</CardTitle>
          <CardDescription>
            Your expert guide on Kenyan politics, elections, and governance
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          <ScrollArea className="flex-grow mb-4 pr-4">
            <div className="space-y-4">
                            {messages.map((message: Message, i: number) => (
                <div
                  key={i}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start gap-2 max-w-[80%] ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <div className={`h-full w-full flex items-center justify-center ${
                        message.role === "user" ? "bg-primary" : "bg-secondary"
                      }`}>
                        {message.role === "user" ? "U" : "A"}
                      </div>
                    </Avatar>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Kenyan politics..."
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PoliticalChatPage;
