import { promises as fs } from 'fs';
import path from 'path';
import type { VideoType } from '@/types/video';

export async function getAllVideos(): Promise<VideoType[]> {
  try {
    const videosDirectory = path.join(process.cwd(), 'videos');
    const files = await fs.readdir(videosDirectory);
    
    // Filter for .json files (next-video metadata files)
    const videoMetadataFiles = files.filter(file => file.endsWith('.mp4.json'));
    
    // Read and parse each metadata file
    const videos = await Promise.all(
      videoMetadataFiles.map(async (filename) => {
        const filePath = path.join(videosDirectory, filename);
        const content = await fs.readFile(filePath, 'utf8');
        const metadata = JSON.parse(content);
        
        // Extract the video name from the metadata filename
        const videoName = filename.replace('.mp4.json', '');
        
        return {
          name: videoName,
          ...metadata
        };
      })
    );

    return videos;
  } catch (error) {
    console.error('Error loading videos:', error);
    return [];
  }
}