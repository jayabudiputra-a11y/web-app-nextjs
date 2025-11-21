import { NextRequest, NextResponse } from 'next/server';
import { fetchNewsExternal } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || 'Google topic:"financial and economic news" sentiment:negative';
    const ts = searchParams.get('ts') || undefined;

    const data = await fetchNewsExternal(query, ts);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
