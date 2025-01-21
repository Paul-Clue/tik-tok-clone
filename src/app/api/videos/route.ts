import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

async function getAllVideos() {
  try {
    const videosDirectory = path.join(process.cwd(), 'videos');
    const files = await fs.readdir(videosDirectory);
    
    const videoMetadataFiles = files.filter(file => 
      file.endsWith('.mp4.json') && 
      !file.startsWith('.')
    );
    
    const videos = await Promise.all(
      videoMetadataFiles.map(async (filename) => {
        try {
          const filePath = path.join(videosDirectory, filename);
          const content = await fs.readFile(filePath, 'utf8');
          const metadata = JSON.parse(content);
          
          const videoName = filename.replace('.mp4.json', '');
          
          return {
            name: videoName,
            src: metadata.sources?.[0]?.src || null,
            poster: metadata.poster || null,
            ...metadata
          };
        } catch (error) {
          console.error(`Error processing ${filename}:`, error);
          return null;
        }
      })
    );

    return videos.filter(Boolean);
  } catch (error) {
    console.error('Error loading videos:', error);
    return [];
  }
}

export async function GET() {
  const videos = await getAllVideos();
  return NextResponse.json(videos);
}