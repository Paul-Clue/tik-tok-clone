import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface VideoData {
  name: string;
  src: string;
  poster: string | null;
  status: string;
  user: {
    id: number;
  };
  providerMetadata: {
    mux: {
      assetId?: string | undefined;
      playbackId?: string | undefined;
      poster?: string | undefined;
    };
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sources: any;
}

export async function GET() {
  try {
    const videos = (await prisma.video.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        name: true,
        src: true,
        poster: true,
        status: true,
        providerMetadata: true,
        sources: true,
        user: {
          select: {
            id: true,
          }
        }
      },
    })) as VideoData[];

    const formattedVideos = videos.map((video) => ({
      name: video.name,
      src: video.src,
      status: video.status,
      userId: video.user.id,
      assetId: video.providerMetadata?.mux?.assetId || null,
      playbackId: video.providerMetadata?.mux?.playbackId || null,
      poster: video.providerMetadata?.mux?.poster || null,
    }));

    return NextResponse.json(formattedVideos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
