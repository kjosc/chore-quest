import { NextResponse } from 'next/server';

export async function POST(request) {
  const { pin } = await request.json();
  const expectedPin = process.env.FAMILY_PIN;

  if (!expectedPin) {
    return NextResponse.json({ error: 'PIN not configured' }, { status: 500 });
  }

  if (pin === expectedPin) {
    const response = NextResponse.json({ success: true });
    // Set cookie for 90 days
    response.cookies.set('chore_auth', expectedPin, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 90,
      path: '/',
    });
    return response;
  }

  return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
}

export async function GET(request) {
  const cookie = request.cookies.get('chore_auth');
  const isAuthed = cookie?.value === process.env.FAMILY_PIN;
  return NextResponse.json({ authenticated: isAuthed });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('chore_auth');
  return response;
}
