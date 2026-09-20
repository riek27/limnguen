import { NextResponse } from 'next/server';
import { getPage, savePage } from '@/lib/db';
import { programsDefaults } from '@/lib/defaults';

export async function GET() {
  try {
    const saved = await getPage('lnf-programs');
    const data = saved ? { ...programsDefaults, ...saved } : programsDefaults;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(programsDefaults);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await savePage('lnf-programs', body);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}