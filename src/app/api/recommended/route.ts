import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

// interface VideoScore {
//   id: number;
//   score: number;
// }

export async function GET() {
  try {
    const session = await auth();
    const userId = session.userId;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const videos = await prisma.video.findMany({
      where: {
        status: 'ready',
      },
      orderBy: [
        { createdAt: 'desc' },
      ],
      take: 10, 
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    const scoredVideos = videos.map((video) => {
      let score = 1.0;

      const ageInHours =
        (Date.now() - video.createdAt.getTime()) / (1000 * 60 * 60);
      score *= Math.exp(-ageInHours / 24);

      score *= 1.1;

      return {
        ...video,
        score,
      };
    });

    const recommendedVideos = scoredVideos
      .sort((a, b) => b.score - a.score)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ score, ...video }) => video);

    return NextResponse.json(recommendedVideos);
  } catch (error) {
    console.error('Recommendation error:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}
