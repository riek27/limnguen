import { NextResponse } from 'next/server';
import { getPage } from '@/lib/db';
import crypto from 'crypto';
import {
  checkRateLimit,
  recordFailedAttempt,
  clearAttempts,
  getClientIp,
} from '@/lib/rateLimit';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateKey = `login:${ip}`;

    // 1. Check rate limit BEFORE doing anything else
    const status = checkRateLimit(rateKey);
    if (!status.allowed) {
      const minutes = Math.floor(status.retryAfterSeconds / 60);
      const seconds = status.retryAfterSeconds % 60;
      const timeStr =
        minutes > 0
          ? `${minutes}m ${seconds}s`
          : `${seconds}s`;
      return NextResponse.json(
        {
          success: false,
          blocked: true,
          retryAfterSeconds: status.retryAfterSeconds,
          error: `Too many failed attempts. Please try again in ${timeStr}.`,
        },
        { status: 429 }
      );
    }

    // 2. Parse credentials
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    // 3. Load settings and verify
    const settings = (await getPage('lnf-settings')) || {};
    const storedUsername = settings?.account?.username || 'limnguen';
    const storedHash = settings?.account?.passwordHash || '';
    const fallbackHash = hashPassword('Foundation2019');
    const expectedHash = storedHash || fallbackHash;
    const candidateHash = hashPassword(password);

    if (username === storedUsername && candidateHash === expectedHash) {
      // Success — clear any failed attempts for this IP
      clearAttempts(rateKey);
      return NextResponse.json({ success: true });
    }

    // 4. Failed — record it and return remaining attempts
    const after = recordFailedAttempt(rateKey);

    if (!after.allowed) {
      const minutes = Math.floor(after.retryAfterSeconds / 60);
      const seconds = after.retryAfterSeconds % 60;
      const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
      return NextResponse.json(
        {
          success: false,
          blocked: true,
          retryAfterSeconds: after.retryAfterSeconds,
          error: `Too many failed attempts. You are blocked for ${timeStr}.`,
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        remainingAttempts: after.remainingAttempts,
        error: `Invalid username or password. ${after.remainingAttempts} attempt${
          after.remainingAttempts === 1 ? '' : 's'
        } remaining.`,
      },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Authentication error.' },
      { status: 500 }
    );
  }
}