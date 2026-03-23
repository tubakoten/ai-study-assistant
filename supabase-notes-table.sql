-- Supabase 'notes' tablosu için örnek şema
-- Bu SQL'i Supabase SQL Editor'da çalıştırın (tablo yoksa)

CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'İsimsiz Not',
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS (Row Level Security) politikaları - anon erişim için
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Herkese okuma ve ekleme izni (geliştirme için)
CREATE POLICY "Allow read notes" ON notes FOR SELECT USING (true);
CREATE POLICY "Allow insert notes" ON notes FOR INSERT WITH CHECK (true);
