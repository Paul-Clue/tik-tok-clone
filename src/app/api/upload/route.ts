import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createMuxAsset } from '../../../lib/mux';
// import Mux from '@mux/mux-node';
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get('video') as File;
    const name = formData.get('name') as string;

    if (!videoFile) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    // Upload to Mux
    const { playbackId, assetId } = await createMuxAsset(videoFile);

    // Create video record in database
    const video = await prisma.video.create({
      data: {
        name: name || videoFile.name,
        src: `https://stream.mux.com/${playbackId}.m3u8`,
        status: 'ready',
        provider: 'mux',
        providerMetadata: {
          mux: {
            assetId,
            playbackId,
          }
        },
        size: videoFile.size,
        sources: [{
          src: `https://stream.mux.com/${playbackId}.m3u8`,
          type: 'application/x-mpegURL'
        }],
        userId: 1, // Replace with actual user ID from auth
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    );
  }
}