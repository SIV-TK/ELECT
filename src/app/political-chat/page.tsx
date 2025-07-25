"use client";

import { useState, useRef, useEffect, type FC } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SendHorizontal, AlertCircle, Bot, User, Sparkles, RefreshCw, MessageSquare, Zap } from "lucide-react";
import Markdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  isError?: boolean;
}

const MAX_MESSAGE_LENGTH = 500;
const TYPING_SPEED = 20; // ms per character

const PoliticalChatPage: FC = () => {
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialWelcome: Message = {
    id: "welcome",
    role: "assistant",
    content: "👋 Hello! I'm your Kenyan politics expert. You can ask me about:\n\n" +
      "- Political parties and their histories\n" +
      "- Current and past political leaders\n" +
      "- Electoral processes and systems\n" +
      "- Government structures and policies\n" +
      "- Historical political events\n\n" +
      "How can I help you today with Sauti Ya Watu?",
    timestamp: Date.now()
  };
  const [messages, setMessages] = useState<Message[]>([initialWelcome]);
  const [chatStopped, setChatStopped] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [displayedContent, setDisplayedContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, displayedContent]);

  const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const simulateTyping = (content: string) => {
    setIsTyping(true);
    setDisplayedContent(""); // Clear previous content
    let currentIndex = 0;

    console.log('Starting typing simulation for content:', content);

    const typingInterval = setInterval(() => {
      if (currentIndex <= content.length) {
        const newContent = content.slice(0, currentIndex);
        console.log('Typing progress:', currentIndex, '/', content.length);
        setDisplayedContent(newContent);
        currentIndex++;
      } else {
        console.log('Typing simulation complete');
        clearInterval(typingInterval);
        setIsTyping(false);
        setDisplayedContent(content); // Ensure final content is set
      }
    }, TYPING_SPEED);

    return () => {
      console.log('Cleaning up typing simulation');
      clearInterval(typingInterval);
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (chatStopped) return;
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      toast({
        title: "Empty message",
        description: "Please enter a message before sending.",
        variant: "destructive",
      });
      return;
    }
    if (trimmedInput.length > MAX_MESSAGE_LENGTH) {
      toast({
        title: "Message too long",
        description: `Please limit your message to ${MAX_MESSAGE_LENGTH} characters.`,
        variant: "destructive",
      });
      return;
    }
    if (isLoading || isTyping) {
      return;
    }
    const messageId = generateMessageId();
    setInput("");
    setMessages((prev) => [...prev, {
      id: messageId,
      role: "user",
      content: trimmedInput,
      timestamp: Date.now()
    }]);
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: trimmedInput }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (!data.response) {
        throw new Error('Invalid response format');
      }
      const assistantMessageId = generateMessageId();
      const newMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: data.response,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, newMessage]);
      simulateTyping(data.response);
    } catch (error) {
      const errorId = generateMessageId();
      setMessages((prev) => [...prev, {
        id: errorId,
        role: "assistant",
        content: "I apologize, but I'm experiencing technical difficulties. Please try again.",
        timestamp: Date.now(),
        isError: true
      }]);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-background z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl rounded-2xl border border-primary/20 bg-card overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(circle at top right, rgba(var(--primary-rgb)/0.03), transparent 70%), radial-gradient(circle at bottom left, rgba(var(--secondary-rgb)/0.03), transparent 70%)'
        }}
      >
        <div className="px-6 pt-6 pb-4 border-b border-primary/10 bg-gradient-to-r from-background/90 to-background/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-inner">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-headline text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Political Assistant</h2>
                <p className="text-muted-foreground text-sm">Your expert guide on Kenyan politics</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setMessages([initialWelcome])}
                className="gap-2 hover:bg-background/80 border-primary/20 hover:border-primary/30 transition-all duration-200"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Reset
              </Button>
              <Button 
                variant={chatStopped ? "default" : "destructive"} 
                size="sm" 
                onClick={() => setChatStopped(s => !s)}
                className="gap-2"
              >
                {chatStopped ? "Resume Chat" : "Stop Chat"}
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {["Who is the current president?", "Tell me about ODM party", "How does voting work in Kenya?"].map((suggestion) => (
              <Button 
                key={suggestion} 
                variant="outline" 
                size="sm" 
                className="bg-primary/5 border-primary/10 hover:bg-primary/10 text-xs rounded-full px-4 transition-all duration-200 hover:shadow-md"
                onClick={() => {
                  if (!isLoading && !isTyping && !chatStopped) {
                    setInput(suggestion);
                  }
                }}
                disabled={isLoading || isTyping || chatStopped}
              >
                <Zap className="h-3 w-3 mr-1.5 text-primary" />
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-background/50 to-background/30">
          <ScrollArea className="flex-1 px-6 py-6 overflow-y-auto">
            <div className="space-y-8 max-w-3xl mx-auto">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-start gap-3 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <Avatar className={cn(
                        "h-10 w-10 flex-shrink-0 ring-2 shadow-md",
                        message.role === "user" 
                          ? "ring-primary/20 bg-gradient-to-br from-primary/20 to-primary/10" 
                          : "ring-secondary/20 bg-gradient-to-br from-secondary/20 to-secondary/10"
                      )}>
                        {message.role === "user" ? (
                          <>
                            <AvatarImage src="https://placehold.co/100x100.png" />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </>
                        ) : (
                          <>
                            <AvatarFallback className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      
                      <div
                        className={cn(
                          "rounded-2xl px-6 py-4 break-words min-w-[50px] shadow-md",
                          message.role === "user" 
                            ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-tr-sm" 
                            : message.isError
                              ? "bg-gradient-to-br from-destructive/20 to-destructive/10 text-destructive rounded-tl-sm border border-destructive/20" 
                              : "bg-gradient-to-br from-card to-card/95 text-foreground rounded-tl-sm border border-primary/10"
                        )}
                        style={{ wordBreak: "break-word", maxWidth: "100%" }}
                      >
                        {message.role === "assistant" && message === messages[messages.length - 1] && isTyping ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none overflow-x-auto whitespace-pre-wrap">
                            <Markdown>{displayedContent || ""}</Markdown>
                            <div className="mt-2 flex">
                              <span className="inline-flex gap-1.5">
                                <span className="h-2 w-2 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: "0ms" }}></span>
                                <span className="h-2 w-2 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: "150ms" }}></span>
                                <span className="h-2 w-2 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></span>
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="prose prose-sm dark:prose-invert max-w-none overflow-x-auto whitespace-pre-wrap">
                            <Markdown>{message.content}</Markdown>
                          </div>
                        )}
                        
                        {message.isError && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <span>Error occurred while processing your request</span>
                          </div>
                        )}
                        
                        <div className="mt-2 text-xs opacity-60 text-right">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && !isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-secondary/20 shadow-md bg-gradient-to-br from-secondary/20 to-secondary/10">
                      <AvatarFallback className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="bg-gradient-to-br from-card to-card/95 rounded-2xl rounded-tl-sm px-6 py-4 border border-primary/10 shadow-md">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <span className="h-2 w-2 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: "0ms" }}></span>
                          <span className="h-2 w-2 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></span>
                          <span className="h-2 w-2 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: "600ms" }}></span>
                        </div>
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} className="h-4" />
            </div>
          </ScrollArea>
          
          <div className="px-6 pb-6 pt-4 bg-gradient-to-t from-background to-background/90 backdrop-blur-sm border-t border-primary/10 sticky bottom-0 z-20">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-3xl mx-auto">
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={chatStopped ? "Chatbot is currently paused" : "Ask about Kenyan politics..."}
                    disabled={isLoading || isTyping || chatStopped}
                    maxLength={MAX_MESSAGE_LENGTH}
                    className="flex-grow bg-card/80 border-primary/20 focus-visible:ring-primary/30 pr-12 shadow-sm h-12 text-base"
                  />
                  {input.trim() && !isLoading && !isTyping && !chatStopped && (
                    <Button 
                      type="submit" 
                      size="icon"
                      className="absolute right-1.5 top-1.5 h-9 w-9 rounded-full bg-primary hover:bg-primary/90 transition-all duration-200"
                    >
                      <SendHorizontal className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground px-1">
                <div>
                  {chatStopped && <span className="text-amber-500 font-medium">Chat is currently paused</span>}
                </div>
                <div>
                  {input.length}/{MAX_MESSAGE_LENGTH} characters
                </div>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PoliticalChatPage;
