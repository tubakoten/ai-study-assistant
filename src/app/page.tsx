"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FileText,
  ClipboardList,
  Calendar,
  Upload,
  FileStack,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { Chatbox, type ChatMessage } from "@/components/Chatbox";

const SIDEBAR_ITEMS = [
  { id: "notes", label: "Notlarım", icon: FileText },
  { id: "quiz", label: "Quiz", icon: ClipboardList },
  { id: "planner", label: "Planlayıcı", icon: Calendar },
] as const;

type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

type ActiveTab = "notes" | "quiz" | "planner";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("notes");
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch("/api/notes");
      if (!res.ok) throw new Error("Notlar yüklenemedi");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      setNotes([]);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const deleteNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Bu notu silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Silme işlemi başarısız");
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (selectedNote?.id === id) setSelectedNote(null);
    } catch (err) {
      alert("Hata: Not silinemedi.");
    }
  };

  const handleUpload = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Sadece PDF dosyaları desteklenmektedir");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/notes/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Yükleme başarısız");
      setNotes((prev) => [data, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendChatMessage = useCallback(async (message: string) => {
    if (!selectedNote) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: message };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, noteContent: selectedNote.content }),
      });
      const data = await res.json();
      const assistantMsg: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: data.text || "" };
      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setChatMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: "AI yanıt veremedi." }]);
    } finally {
      setIsChatLoading(false);
    }
  }, [selectedNote]);

  return (
    <div className="flex min-h-screen bg-[#0f1113] text-zinc-100 font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-zinc-800 bg-[#16181a]">
        <div className="flex h-20 items-center border-b border-zinc-800 px-8">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-white">AI Study</span> <span className="text-emerald-500">Assistant</span>
          </h1>
        </div>
        <nav className="flex flex-1 flex-col gap-2 p-4">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as ActiveTab)}
                className={`flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  isActive ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30" : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-200"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-emerald-500" : "text-zinc-500"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className={`ml-64 flex-1 p-10 transition-all ${isChatOpen ? "mr-[420px]" : ""}`}>
        
        {activeTab === "notes" && (
          <div className="max-w-4xl mx-auto">
            <header className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white">Notlarım</h2>
                <p className="text-zinc-500 mt-2">Ders notlarını yükle ve yapay zeka ile çalışmaya başla.</p>
              </div>
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  isChatOpen ? "bg-emerald-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                <MessageSquare className="h-5 w-5" /> {isChatOpen ? "Sohbeti Kapat" : "AI Sohbet"}
              </button>
            </header>

            {/* Dosya Yükleme */}
            <div
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if(f) handleUpload(f); }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              className={`mb-12 h-48 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                isDragging ? "border-emerald-500 bg-emerald-500/5" : "border-zinc-800 bg-zinc-900/30 hover:border-emerald-500/40"
              }`}
            >
              <input type="file" accept="application/pdf" onChange={(e) => { const f = e.target.files?.[0]; if(f) handleUpload(f); }} className="absolute inset-0 opacity-0 cursor-pointer" />
              {isLoading ? (
                <div className="animate-pulse text-emerald-500 font-bold">PDF Analiz Ediliyor...</div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-10 w-10 text-zinc-600 mb-3" />
                  <p className="text-zinc-400 font-medium">Dosyayı buraya bırakın veya tıklayın</p>
                </div>
              )}
            </div>

            {/* Not Listesi */}
            <div className="grid gap-4">
              <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Son Notlar</h3>
              {notes.length === 0 ? (
                <div className="bg-zinc-900/20 rounded-2xl p-10 text-center border border-zinc-800/50">
                   <FileStack className="mx-auto h-12 w-12 text-zinc-800 mb-4" />
                   <p className="text-zinc-600">Henüz bir not yüklemediniz.</p>
                </div>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNote(note)}
                    className={`group flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer ${
                      selectedNote?.id === note.id ? "bg-emerald-500/10 border-emerald-500/40 ring-1 ring-emerald-500/20" : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`p-3 rounded-xl ${selectedNote?.id === note.id ? "bg-emerald-500/20" : "bg-zinc-800"}`}>
                        <FileText className={`h-6 w-6 ${selectedNote?.id === note.id ? "text-emerald-500" : "text-emerald-700"}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-200">{note.title}</h4>
                        <p className="text-xs text-zinc-500 mt-1 uppercase tracking-tighter">{new Date(note.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button onClick={(e) => deleteNote(note.id, e)} className="p-2 text-zinc-700 hover:text-red-500 transition-colors">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "quiz" && (
          <div className="max-w-4xl mx-auto text-center py-20">
            <div className="bg-emerald-500/10 h-20 w-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <ClipboardList className="h-10 w-10 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">AI Quiz Merkezi</h2>
            <p className="text-zinc-500 mb-8 max-w-md mx-auto">Notlarınızdan otomatik testler ve quizler oluşturacak modül yakında burada olacak.</p>
            <div className="inline-block px-6 py-2 rounded-full border border-zinc-800 text-zinc-600 text-sm font-medium bg-zinc-900/50">Geliştirme aşamasındaki modül.</div>
          </div>
        )}

        {activeTab === "planner" && (
          <div className="max-w-4xl mx-auto text-center py-20">
            <div className="bg-emerald-500/10 h-20 w-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-10 w-10 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Çalışma Planlayıcı</h2>
            <p className="text-zinc-500 mb-8 max-w-md mx-auto">Sınav tarihlerinize göre size özel AI destekli çalışma takvimi hazırlıyoruz.</p>
            <div className="inline-block px-6 py-2 rounded-full border border-zinc-800 text-zinc-600 text-sm font-medium bg-zinc-900/50">Geliştirme aşamasındaki modül.</div>
          </div>
        )}
      </main>

      <Chatbox
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        selectedNote={selectedNote}
        messages={chatMessages}
        isLoading={isChatLoading}
        onSendMessage={sendChatMessage}
        onQuickAction={(p) => sendChatMessage(p)}
      />
    </div>
  );
}