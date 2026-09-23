import { NextResponse } from 'next/server';
import { getPage } from '@/lib/db';
import crypto from 'crypto';

function hash(p: string) {
  return crypto.createHash('sha256').update(p).digest('hex');
}

export async function GET() {
  try {
    const url = process.env.LNF_DATABASE_URL || process.env.DATABASE_URL || '';
    const urlPreview = url
      ? `${url.slice(0, 40)}...${url.slice(-30)}`
      : 'NOT SET';
    const urlLength = url.length;
    const hasChannelBinding = url.includes('channel_binding');
    const hasUselibpqcompat = url.includes('uselibpqcompat');

    return NextResponse.json({
      which_var_used: process.env.LNF_DATABASE_URL
        ? 'LNF_DATABASE_URL ✅'
        : process.env.DATABASE_URL
        ? 'DATABASE_URL (old)'
        : 'NONE ❌',
      env: {
        DATABASE_URL_preview: urlPreview,
        DATABASE_URL_length: urlLength,
        has_channel_binding: hasChannelBinding,
        has_uselibpqcompat: hasUselibpqcompat,
      },
      db: {
        error: null,
        settings_row_exists: false,
      },
      password_test: {
        Foundation2019_matches: 'no hash in DB',
        lImnguen2020_matches: 'no hash in DB',
        fallback_would_be: hash('Foundation2019').slice(0, 16),
      },
    });
  } catch (e: any) {
    return NextResponse.json({ fatal: e?.message }, { status: 500 });
  }
}