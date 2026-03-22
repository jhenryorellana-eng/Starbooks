"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { createAIProvider } from "@/lib/ai-provider";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatbotProps {
  chapterTitle: string;
  bookTitle: string;
  aiContext: string;
}

export function AIChatbot({ chapterTitle, bookTitle, aiContext }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const provider = useRef(createAIProvider());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await provider.current.chat(updatedMessages, aiContext);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Lo siento, hubo un error. Intenta de nuevo.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white/[0.02] border border-border-subtle overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border-subtle flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-accent-primary" />
        <span className="text-sm font-medium text-text-primary">
          Preguntale a la IA
        </span>
        <span className="text-xs text-text-muted ml-auto hidden sm:inline">
          {chapterTitle}
        </span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[500px]"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <Bot className="h-10 w-10 text-text-muted/30 mb-3" />
            <p className="text-sm text-text-muted">
              Pregunta lo que quieras sobre este capitulo
            </p>
            <p className="text-xs text-text-muted/60 mt-1">
              &quot;{chapterTitle}&quot; — {bookTitle}
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <div className="shrink-0 h-7 w-7 rounded-full bg-accent-primary/20 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5 text-accent-primary" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-accent-primary/20 text-text-primary rounded-br-md"
                    : "bg-white/[0.04] text-text-secondary rounded-bl-md"
                )}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="shrink-0 h-7 w-7 rounded-full bg-white/[0.08] flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-text-muted" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex gap-3">
            <div className="shrink-0 h-7 w-7 rounded-full bg-accent-primary/20 flex items-center justify-center">
              <Bot className="h-3.5 w-3.5 text-accent-primary" />
            </div>
            <div className="bg-white/[0.04] rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-text-muted/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 rounded-full bg-text-muted/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 rounded-full bg-text-muted/40 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border-subtle">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu pregunta..."
            rows={1}
            className="flex-1 resize-none rounded-xl bg-white/[0.04] border border-border-subtle px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary/40 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="shrink-0 h-10 w-10 rounded-xl bg-accent-primary flex items-center justify-center text-bg-primary disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
