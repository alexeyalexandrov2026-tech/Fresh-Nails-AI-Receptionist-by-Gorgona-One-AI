"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Здравствуйте! Я виртуальный администратор Fresh Nails. Чем могу помочь? Хотите записаться на маникюр или узнать прайс?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const [conversationId, setConversationId] = useState<string | null>(null);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const query = inputValue.trim();
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query, 
          conversation_id: conversationId 
        }),
      });

      const data = await response.json();

      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }

      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer || `[DEBUG] ${data.error || 'unknown'}: ${data.details || 'no details'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newAiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Извините, сервис временно недоступен. Попробуйте позже.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 p-4">
      <Card className="w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl border-white/50 backdrop-blur-xl bg-white/70 overflow-hidden rounded-3xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-rose-100 bg-white/50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full blur opacity-70 animate-pulse" />
              <Avatar className="h-12 w-12 border-2 border-white relative">
                <AvatarImage src="/bot-avatar.png" />
                <AvatarFallback className="bg-rose-100 text-rose-600"><Bot size={24} /></AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                Fresh Nails AI <Sparkles className="w-4 h-4 text-rose-500" />
              </h1>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                В сети
              </p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="flex flex-col gap-6 max-w-full">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <Avatar className="h-10 w-10 shrink-0 border-2 border-white shadow-sm">
                  <AvatarFallback className={msg.role === "user" ? "bg-gray-800 text-white" : "bg-rose-100 text-rose-600"}>
                    {msg.role === "user" ? <User size={20} /> : <Bot size={20} />}
                  </AvatarFallback>
                </Avatar>
                
                <div
                  className={`px-5 py-3.5 rounded-2xl max-w-[80%] shadow-sm ${
                    msg.role === "user"
                      ? "bg-gray-800 text-white rounded-tr-sm"
                      : "bg-white border border-rose-100 text-gray-800 rounded-tl-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <span className={`text-[10px] mt-2 block ${msg.role === "user" ? "text-gray-300" : "text-gray-400"}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-4 flex-row">
                <Avatar className="h-10 w-10 shrink-0 border-2 border-white shadow-sm">
                  <AvatarFallback className="bg-rose-100 text-rose-600">
                    <Bot size={20} />
                  </AvatarFallback>
                </Avatar>
                <div className="px-5 py-4 rounded-2xl bg-white border border-rose-100 rounded-tl-sm flex items-center gap-1 shadow-sm">
                  <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 bg-white/50 border-t border-rose-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3 bg-white p-2 rounded-full shadow-sm border border-rose-100 focus-within:ring-2 focus-within:ring-rose-200 focus-within:border-rose-400 transition-all"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Напишите сообщение..."
              className="flex-1 border-0 shadow-none focus-visible:ring-0 h-12 px-4 rounded-full text-base bg-transparent"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!inputValue.trim() || isTyping}
              className="h-12 w-12 rounded-full bg-rose-600 hover:bg-rose-700 text-white shrink-0 shadow-md transition-transform active:scale-95 disabled:opacity-50"
            >
              <Send size={20} className="ml-1" />
            </Button>
          </form>
        </div>

      </Card>
    </div>
  );
}
