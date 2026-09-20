import { NextResponse } from 'next/server';
import { getPage, savePage } from '@/lib/db';
import { settingsDefaults } from '@/lib/defaults';

export async function GET() {
  try {
    const saved = await getPage('lnf-settings');
    const data = saved ? { ...settingsDefaults, ...saved } : settingsDefaults;
    if (data.account) data.account = { username: data.account.username, passwordHash: '' };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(settingsDefaults);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const existing = (await getPage('lnf-settings')) || {};

    const incoming = { ...body };
    if (incoming.account) {
      incoming.account = {
        username: incoming.account.username || existing?.account?.username || 'limnguen',
        passwordHash: incoming.account.passwordHash
          ? incoming.account.passwordHash
          : existing?.account?.passwordHash || '',
      };
    }

    await savePage('lnf-settings', incoming);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}