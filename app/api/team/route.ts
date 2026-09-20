import { NextResponse } from 'next/server';
import { getPage, savePage } from '@/lib/db';
import { teamDefaults } from '@/lib/defaults';

export async function GET() {
  try {
    const saved = await getPage('lnf-team');
    const data = saved ? { ...teamDefaults, ...saved } : teamDefaults;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(teamDefaults);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await savePage('lnf-team', body);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}