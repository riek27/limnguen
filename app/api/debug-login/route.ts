import { NextResponse } from 'next/server';
import { getPage } from '@/lib/db';
import crypto from 'crypto';

function hash(p: string) {
  return crypto.createHash('sha256').update(p).digest('hex');
}

export async function GET() {
  try {
    const url = process.env.DATABASE_URL || '';

    // What does the server see?
    const urlPreview = url
      ? `${url.slice(0, 40)}...${url.slice(-20)}`
      : 'NOT SET';
    const urlLength = url.length;
    const hasChannelBinding = url.includes('channel_binding');
    const hasUselibpqcompat = url.includes('uselibpqcompat');

    // Try to fetch settings
    let settings: any = null;
    let dbError: string | null = null;
    try {
      settings = await getPage('lnf-settings');
    } catch (e: any) {
      dbError = e?.message || 'unknown error';
    }

    // What's the stored username/hash?
    const storedUsername = settings?.account?.username || null;
    const storedHash = settings?.account?.passwordHash || null;

    // Test both password candidates
    const testFoundation2019 = hash('Foundation2019');
    const testLImnguen2020 = hash('lImnguen2020');

    return NextResponse.json({
      env: {
        DATABASE_URL_preview: urlPreview,
        DATABASE_URL_length: urlLength,
        has_channel_binding: hasChannelBinding,
        has_uselibpqcompat: hasUselibpqcompat,
      },
      db: {
        error: dbError,
        settings_row_exists: settings !== null,
        stored_username: storedUsername,
        stored_hash_prefix: storedHash ? storedHash.slice(0, 16) + '...' : null,
      },
      password_test: {
        Foundation2019_matches:
          storedHash ? testFoundation2019 === storedHash : 'no hash in DB',
        lImnguen2020_matches:
          storedHash ? testLImnguen2020 === storedHash : 'no hash in DB',
        fallback_would_be: !storedHash ? hash('Foundation2019').slice(0, 16) : null,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ fatal: e?.message }, { status: 500 });
  }
}