"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageSquare, Send, Sparkles, X } from "lucide-react";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatboxProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedNote: { id: string; title: string; content: string } | null;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onQuickAction: (prompt: string) => void;
};

const QUICK_ACTIONS = [
  {
    id: "summarize",
    label: "Bu notu özetle",
    prompt:
      "Bu ders notunu kısaca ve anlaşılır şekilde özetle. Ana başlıkları ve önemli noktaları vurgula.",
  },
  {
    id: "questions",
    label: "Bana bu nottan 3 soru sor",
    prompt:
      "Bu ders notuna dayanarak beni test etmek için 3 soru hazırla. Cevaplarını da ayrıca ver.",
  },
  {
    id: "formulas",
    label: "Önemli formülleri çıkar",
    prompt:
      "Bu nottaki önemli formülleri, denklemleri ve matematiksel ifadeleri listeleyerek çıkar. Her birinin ne işe yaradığını kısaca açıkla.",
  },
] as const;

export function Chatbox({
  isOpen,
  onClose,
  selectedNote,
  messages,
  isLoading,
  onSendMessage,
  onQuickAction,
}: ChatboxProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed && !isLoading) {
        onSendMessage(trimmed);
        setInputValue("");
      }
    },
    [inputValue, isLoading, onSendMessage]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l border-zinc-800 bg-[#16181a] shadow-2xl sm:w-[420px]">
      {/* Header - Emerald Theme */}
      <div className="flex h-20 items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-emerald-500/10 p-2">
            <MessageSquare className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-zinc-100">AI Asistan</h3>
            <p className="truncate text-xs text-zinc-500">
              {selectedNote ? selectedNote.title : "Not seçin"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && !selectedNote && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-zinc-800/80 p-5">
              <Sparkles className="h-10 w-10 text-emerald-500/40" />
            </div>
            <p className="text-sm font-semibold text-zinc-400">
              Bir not seçin ve AI ile çalışın 🌿
            </p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/10"
                  : "bg-zinc-800/80 text-zinc-200"
              }`}
            >
              <p className="whitespace-pre-wrap break-words">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl bg-zinc-800/80 px-4 py-3">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {selectedNote && (
        <div className="border-t border-zinc-800 bg-zinc-900/30 px-6 py-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
            Hızlı Aksiyonlar
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.id}
                onClick={() => onQuickAction(action.prompt)}
                disabled={isLoading}
                className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-400 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:text-emerald-400 disabled:opacity-50"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-zinc-800 bg-[#16181a] p-6"
      >
        <div className="flex gap-3">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={selectedNote ? "Mesajınızı yazın..." : "Önce bir not seçin"}
            disabled={!selectedNote || isLoading}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!selectedNote || isLoading || !inputValue.trim()}
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white transition-all hover:bg-emerald-500 disabled:opacity-30 disabled:grayscale shadow-lg shadow-emerald-900/20"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
