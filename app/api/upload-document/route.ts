import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Compute a human-friendly size BEFORE upload
    const sizeKB = file.size / 1024;
    const sizeMB = sizeKB / 1024;
    const sizeLabel =
      sizeMB >= 1
        ? `${sizeMB.toFixed(1)} MB`
        : `${Math.max(1, Math.round(sizeKB))} KB`;

    const ext = (file.name.split('.').pop() || '').toUpperCase();

    // Vercel Blob requires a unique pathname — add a timestamp prefix
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const pathname = `documents/${Date.now()}-${safeName}`;

    // Upload to Vercel Blob
    const blob = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return NextResponse.json({
      url: blob.url,
      fileType: ext,
      fileSize: sizeLabel,
    });
  } catch (error: any) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: error?.message || 'Upload failed' },
      { status: 500 }
    );
  }
}