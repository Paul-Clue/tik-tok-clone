// import Image from "next/image";
// import Video from 'next-video';
// import demoVideo from '../../videos/demo-1.mp4';

// interface VideoMetadata {
//   id: string;
//   title: string;
//   description: string;
//   muxPlaybackId: string;  // Reference to actual video on Mux
//   uploadedAt: Date;
//   userId: string;
// }

// export default function Home() {
//   return (
//     <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
//       <div className='w-1/4 h-full'>
//         {/* <Video src='../../videos/demo-1.mp4' /> */}
//         <Video src={demoVideo} />
//       </div>
//     </div>
//   );
// }

'use client';

import Video from 'next-video';
// import { getAllVideos } from '@/lib/videos';
import { useEffect, useState } from 'react';
// import type { VideoType } from '@/types/video';
import VideoUpload from '@/components/VideoUpload';

interface VideoMetadata {
  name: string;
  src: string;
  poster: string;
  // Add other properties as needed
}

export default function Home() {
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/videos')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch videos');
        return res.json();
      })
      .then((data) => {
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
    // <div className="h-screen w-full bg-black">
    <main className='fixed inset-0 bg-black'>
      <VideoUpload />
      <div className='snap-both snap-mandatory h-full overflow-y-scroll'>
        {videos.map((video) => (
          <div
            key={video.name}
            // className="snap-start h-screen w-full flex items-center justify-center relative"
            className='snap-center w-full bg-red-500 h-screen flex items-center justify-center mt-[50px]'
          >
            {/* <div className="w-full max-w-[500px] aspect-[9/16] relative"> */}
            {/* <div className="w-[350px] h-[calc(100vh-120px)] mt-[-230px] relative bg-black"> */}
            <div className='w-[350px] h-[618px] mt-0 relative bg-black border-2 border-slate-400'>
              {video.src ? (
                <Video
                  src={video.src}
                  // poster={video.poster}
                  // className="w-full h-[700px] object-cover"
                  // className="object-cove"
                  className='absolute inset-0 w-full h-full object-cover'
                  controls={true}
                  // autoPlay
                  // muted
                  loop
                />
              ) : (
                <div>Video source not available</div>
              )}

              {/* Video Info Overlay */}
              {/* <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <h2 className="text-white text-lg font-semibold">{video.name}</h2>
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

// export default function Home() {
//   const [videos, setVideos] = useState<VideoType[]>([]);

//   useEffect(() => {
//     fetch('/api/videos')
//       .then(res => res.json())
//       .then(data => setVideos(data));
//   }, []);

//   return (
//     <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
//       {videos.map((video) => (
//         <div key={video.name}>
//           <h2>{video.name}</h2>
//           <Video
//             src={`/videos/${video.name}.mp4`}
//             poster={video.poster}
//           />
//         </div>
//       ))}
//     </div>
//   );
// }
