import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

function checkAuth(request) {
  const cookie = request.cookies.get('chore_auth');
  return cookie?.value === process.env.FAMILY_PIN;
}

// GET all data (current week + history index + summaries)
export async function GET(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key) {
      // Get single key
      const value = await kv.get(key);
      return NextResponse.json({ value });
    }

    // Get bulk: history index + all summaries
    const historyIndex = (await kv.get('history-index')) || [];
    const summaries = {};
    for (const wk of historyIndex) {
      const s = await kv.get(`summary:${wk}`);
      if (s) summaries[wk] = s;
    }
    return NextResponse.json({ historyIndex, summaries });
  } catch (err) {
    console.error('GET error:', err);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

// POST to write a key/value
export async function POST(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { key, value } = await request.json();
    if (!key) return NextResponse.json({ error: 'Key required' }, { status: 400 });
    await kv.set(key, value);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('POST error:', err);
    return NextResponse.json({ error: 'Failed to write data' }, { status: 500 });
  }
}
