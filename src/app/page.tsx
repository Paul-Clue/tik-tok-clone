// import Image from "next/image";
import Video from 'next-video';
import demoVideo from '../../videos/mase.mp4';

export default function Home() {
  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <div className='w-1/4 h-full'>
        {/* <Video src='../../videos/demo-1.mp4' /> */}
        <Video src={demoVideo} />
      </div>
    </div>
  );
}
