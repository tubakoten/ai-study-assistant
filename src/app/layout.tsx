import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { FileText, ClipboardList, Calendar } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Study Assistant",
  description: "AI supported study tool",
};

const SIDEBAR_ITEMS = [
  { id: "notes", label: "Notlarım", icon: FileText, href: "/" },
  { id: "quiz", label: "Quiz", icon: ClipboardList, href: "/quiz" },
  { id: "planner", label: "Planlayıcı", icon: Calendar, href: "/planner" },
] as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0f1113] text-zinc-100`}>
        <div className="flex min-h-screen">
          {/* Sidebar - Artık Global layout'ta */}
          <aside className="fixed left-0 top-0 z-40 flex h-full w-56 flex-col border-r border-zinc-800 bg-[#16181a]">
            <div className="flex h-16 items-center border-b border-zinc-800 px-6">
              <h1 className="text-lg font-bold tracking-tight">
                <span className="text-white">AI Study</span>{" "}
                <span className="text-emerald-500">Assistant</span>
              </h1>
            </div>
            <nav className="flex flex-1 flex-col gap-1 p-3">
              {SIDEBAR_ITEMS.map((item) => {
                const Icon = item.icon;
                // Not: Hangi sayfanın aktif olduğunu burada anlamak için usePathname gerekir.
                // Şimdilik test için basit bırakıyorum, teslimden sonra usePathname ekleriz.
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-100"
                  >
                    <Icon className="h-5 w-5 text-zinc-500 group-hover:text-emerald-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Sayfa İçerikleri Buraya Gelecek */}
          <main className="flex-1 ml-56 transition-all">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}