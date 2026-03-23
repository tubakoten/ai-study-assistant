# 🌿 AI Study Assistant

Bu proje, öğrencilerin ders notlarını (PDF) yükleyebileceği, yapay zeka ile bu notlar üzerine sohbet edebileceği ve çalışma süreçlerini yönetebileceği modern bir web uygulamasıdır. 

Uygulama, göz yormayan **Zümrüt Yeşili (Emerald)** temasıyla tasarlanmış olup, tamamen kullanıcı odaklı bir deneyim sunar.

## ✨ Özellikler

- **PDF Not Analizi:** Ders notlarınızı yükleyin ve içeriğini anında dijital ortama aktarın.
- **AI Sohbet (Gemini):** Notlarınızla ilgili sorular sorun, özet çıkartın veya zor kavramları açıklatın.
- **Not Yönetimi:** Notlarınızı listeleyin ve ihtiyacınız olmayanları tek tıkla silin.
- **Dinamik Modüller:** Quiz oluşturucu ve Çalışma Planlayıcı sekmeleriyle genişletilebilir altyapı.
- **Modern Arayüz:** Karanlık mod ve zümrüt yeşili detaylarla şık tasarım.

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** [Next.js](https://nextjs.org/) (App Router), React, Tailwind CSS
- **Backend:** Next.js API Routes
- **Veritabanı & Depolama:** [Supabase](https://supabase.com/) (PostgreSQL & Storage)
- **Yapay Zeka:** [Google Gemini API](https://ai.google.dev/)
- **İkonlar:** Lucide React

## 🚀 Kurulum

Projeyi yerelde çalıştırmak için şu adımları izleyin:

1. Depoyu klonlayın:
   ```bash
   git clone [https://github.com/tubakoten/ai-study-assistant.git](https://github.com/tubakoten/ai-study-assistant.git)
Bağımlılıkları yükleyin:

Bash
npm install
.env.local dosyasını oluşturun ve gerekli anahtarları ekleyin:

Kod snippet'i
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
Uygulamayı başlatın:

Bash
npm run dev
👤 Geliştirici
Tuba Köten
