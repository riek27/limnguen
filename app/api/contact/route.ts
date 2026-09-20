import { NextResponse } from 'next/server';
import { getPage, savePage } from '@/lib/db';
import { contactDefaults } from '@/lib/defaults';

export async function GET() {
  try {
    const saved = await getPage('lnf-contact');
    const data = saved ? { ...contactDefaults, ...saved } : contactDefaults;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(contactDefaults);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await savePage('lnf-contact', body);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}