import { NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export const runtime = 'nodejs';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'text/plain',
            'text/csv',
            'application/zip',
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/svg+xml',
          ],
          addRandomSuffix: true,        // ← KEY FIX: unique filename every upload
          allowOverwrite: true,         // ← also allow overwriting if same name
          maximumSizeInBytes: 500 * 1024 * 1024,
        };
      },
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(jsonResponse);
  } catch (error: any) {
    console.error('Upload token error:', error);
    return NextResponse.json(
      { error: error?.message || 'Upload failed' },
      { status: 400 }
    );
  }
}