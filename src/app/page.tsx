'use client';

import MuxPlayer from '@mux/mux-player-react';
import { useEffect, useState } from 'react';
import VideoUpload from '@/components/VideoUpload';
import {
  useUser,
  // useAuth,
  SignedIn,
  UserButton,
  SignedOut,
  SignInButton,
} from '@clerk/nextjs';

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
  const { isSignedIn } = useUser();
  // const { userId } = useAuth();

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
  // useEffect(() => {
  //   // Change from /api/video to /api/recommended
  //   fetch('/api/recommended')
  //     .then(async (res) => {
  //       if (!res.ok) {
  //         throw new Error(`HTTP error! status: ${res.status}`);
  //       }
  //       return res.json();
  //     })
  //     .then((data) => {
  //       console.log('Recommended videos:', data);
  //       setVideos(data);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error('Error fetching recommendations:', err);
  //       setError(err.message);
  //       setLoading(false);
  //     });
  // }, []);

  if (loading) return <div className='text-white'>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className='fixed inset-0 bg-black'>
      {isSignedIn ? (
        <>
          <SignedIn>
            <div className='fixed top-4 right-4 z-50'>
              <div className='bg-black/80 p-2 rounded-lg border border-gray-700'>
                <UserButton />
              </div>
            </div>
          </SignedIn>
          <VideoUpload />
          <div className='snap-both snap-mandatory h-full overflow-y-scroll'>
            {videos.map((video) => (
              <div
                key={video.name}
                className='snap-center w-full bg-black h-screen flex items-center justify-center mt-[50px]'
              >
                <div className='w-[350px] h-[618px] mt-0 relative bg-black border-2 border-slate-400'>
                  {video.src ? (
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
        </>
      ) : (
        <div className='bg-gray-900 flex items-center justify-center h-full'>
          <SignedOut>
            <div className='z-50'>
              <div className='bg-black/80 p-2 rounded-lg border border-gray-700'>
                <SignInButton />
              </div>
            </div>
          </SignedOut>
          {/* <SignedIn>
            <div className='fixed top-4 right-4 z-50'>
              <div className='bg-black/80 p-2 rounded-lg border border-gray-700'>
                <UserButton />
              </div>
            </div>
          </SignedIn> */}
        </div>
      )}
    </main>
  );
}
