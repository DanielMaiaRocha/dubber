import React from 'react';

const MidAboutSection = () => {
  return (
    <div className='w-full py-16 relative'>
      <div className='max-w-[1240px] mx-auto grid lg:grid-cols-3 relative z-10'>
        <div className='lg:col-span-2 mr-22 flex flex-col items-center lg:items-start'>
          <h1 className='text-5xl font-customFont3 font-semibold text-[#18e0ff]'>Who we are?</h1>
          <p className='text-xl sm:text-lg font-customFont3 font-semibold text-white my-6 sm:my-3'>
            We are a group that leads the dubbing in Brasil, now, our goal is create a way to connect the best professionals worldwide and our solution for a remote dubbing without losing the quality of the studio.
          </p>
        </div>
        <div className='my-4 hidden lg:flex flex-col sm:flex-row'>
          <img
            src="/images/logodubsol.png"
            alt="Logo"
            width={600}
            height={600}
            className="object-contain"
          />
        </div>
      </div>
      <video 
        className='w-full h-80 object-cover absolute top-0 left-0 z-0' 
        src='/video/videobg.mp4' 
        autoPlay 
        loop 
        muted 
        controlsList="nodownload nodisplayfullscreen">
      </video>
    </div>
  );
}

export default MidAboutSection;
