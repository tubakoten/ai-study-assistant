"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageSquare, Send, Sparkles } from "lucide-react";

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
    <div className="fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l border-zinc-800 bg-[#1a1a1c] shadow-2xl sm:w-[420px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-[#252528] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-[#FDB912]/10 p-1.5">
            <MessageSquare className="h-5 w-5 text-[#FDB912]" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-100">AI Asistan</h3>
            <p className="text-xs text-zinc-500">
              {selectedNote ? selectedNote.title : "Not seçin"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
        >
          Kapat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && !selectedNote && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-zinc-800/80 p-4">
              <Sparkles className="h-10 w-10 text-[#FDB912]/60" />
            </div>
            <p className="text-sm font-medium text-zinc-400">
              Bir not seçin ve AI ile sohbet edin
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              Hazır butonları kullanın veya kendi sorunuzu yazın
            </p>
          </div>
        )}
        {messages.length === 0 && selectedNote && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-zinc-500">
              &ldquo;{selectedNote.title}&rdquo; notu seçildi
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              Aşağıdaki butonlardan birini tıklayın
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                msg.role === "user"
                  ? "bg-[#A90432]/30 text-zinc-100"
                  : "bg-[#252528] text-zinc-200"
              }`}
            >
              <p className="whitespace-pre-wrap break-words text-sm">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="mb-4 flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl bg-[#252528] px-4 py-2.5">
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-[#FDB912]"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-[#A90432]"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-[#FDB912]"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {selectedNote && (
        <div className="border-t border-zinc-800 bg-[#252528]/60 px-4 py-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Hızlı İşlemler
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.id}
                onClick={() => onQuickAction(action.prompt)}
                disabled={isLoading}
                className="rounded-lg border border-zinc-700 bg-[#1a1a1c] px-3 py-2 text-left text-xs font-medium text-zinc-300 transition-all hover:border-[#FDB912]/50 hover:bg-[#FDB912]/5 hover:text-[#FDB912] disabled:opacity-50"
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
        className="border-t border-zinc-800 bg-[#252528] p-4"
      >
        <div className="flex gap-2">
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
            placeholder={
              selectedNote ? "Sorunuzu yazın..." : "Önce bir not seçin"
            }
            disabled={!selectedNote || isLoading}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-zinc-700 bg-[#1a1a1c] px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-[#FDB912]/50 focus:outline-none focus:ring-1 focus:ring-[#FDB912]/30 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!selectedNote || isLoading || !inputValue.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#A90432] text-white transition-colors hover:bg-[#A90432]/90 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
