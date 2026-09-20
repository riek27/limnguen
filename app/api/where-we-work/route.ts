import { NextResponse } from 'next/server';
import { getPage, savePage } from '@/lib/db';
import { whereDefaults } from '@/lib/defaults';

export async function GET() {
  try {
    const saved = await getPage('lnf-where-we-work');
    const data = saved ? { ...whereDefaults, ...saved } : whereDefaults;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(whereDefaults);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await savePage('lnf-where-we-work', body);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}