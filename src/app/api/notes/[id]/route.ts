import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // params artık bir Promise
) {
  try {
    // Önce params'ı unwrap ediyoruz (bekliyoruz)
    const { id } = await params; 

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Not başarıyla silindi' });
  } catch (error: any) {
    console.error("Silme hatası:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}