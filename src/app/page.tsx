'use client';

import MuxPlayer from '@mux/mux-player-react';
import { useEffect, useState } from 'react';
import VideoUpload from '@/components/VideoUpload';

interface VideoMetadata {
  name: string;
  src: string;
  status: string;
  playbackId?: string | undefined;
  assetId?: string | undefined;
  poster?: string | undefined;
  userId?: string | undefined;
}

export default function Home() {
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   fetch('/api/videos')
  //     .then((res) => {
  //       if (!res.ok) throw new Error('Failed to fetch videos');
  //       return res.json();
  //     })
  //     .then((data) => {
  //       setVideos(data);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error('Error fetching videos:', err);
  //       setError(err.message);
  //       setLoading(false);
  //     });
  // }, []);

  useEffect(() => {
    // fetch('/api/videos/')
    fetch('/api/video/')
      .then(async (res) => {
        console.log('Response:', res);
        const contentType = res.headers.get('content-type');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text();
          console.error('Received non-JSON response:', text);
          throw new Error('Received non-JSON response');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Received data:', data);
        setVideos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching videos:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className='text-white'>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className='fixed inset-0 bg-black'>
      <VideoUpload />
      <div className='snap-both snap-mandatory h-full overflow-y-scroll'>
        {videos.map((video) => (
          <div
            key={video.name}
            className='snap-center w-full bg-red-500 h-screen flex items-center justify-center mt-[50px]'
          >
            <div className='w-[350px] h-[618px] mt-0 relative bg-black border-2 border-slate-400'>
              {video.src  ? (
                <MuxPlayer
                  playbackId={video.playbackId}
                  metadata={{
                    video_id: video.assetId,
                    video_title: video.name,
                    viewer_user_id: video.userId,
                  }}
                />
              ) : (
                <div>Video source not available</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
