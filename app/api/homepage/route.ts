import { NextResponse } from 'next/server';
import { getPage, savePage } from '@/lib/db';
import { homepageDefaults } from '@/lib/defaults';

export async function GET() {
  try {
    const saved = await getPage('lnf-homepage');
    const data = saved ? { ...homepageDefaults, ...saved } : homepageDefaults;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(homepageDefaults);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await savePage('lnf-homepage', body);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}