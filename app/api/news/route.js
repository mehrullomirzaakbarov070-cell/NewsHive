import { NextResponse } from 'next/server';
import { getTopHeadlines, searchNews } from '../../../lib/news';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'general';
  const q = searchParams.get('q') || '';
  const page = Number(searchParams.get('page') || '1');

  try {
    if (q) {
      const payload = await searchNews(q, page, 9);
      return NextResponse.json(payload);
    }

    const payload = await getTopHeadlines({ category, page, pageSize: 9 });
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || 'Yangiliklar ma\'lumotlari olishda xatolik yuz berdi.',
      },
      { status: error.message?.includes('limiti') ? 429 : 500 }
    );
  }
}
