import React from 'react';

const handleLoginButtonClick = () => {
  window.location.href = "/login"; 
};  

const AboutSection = () => {
  return (
    <div className='w-full bg-white py-16 px-4'>
        <div className='max-w-[1240px] mx-auto grid md:grid-cols-2'>
          <img 
            src="/images/microfone.png"
            className='rounded-md my-4'
            alt='microphone'
            width={430}
            height={430}
          />
          <div className='flex flex-col justify-center'>
            <h1 className='text-4xl md:text-3xl font-customFont font-bold text-[#17a2b8] mx-auto p-2'>How to start working with Dubber:</h1>
            <p className='text-xl md:text-lg font-semibold font-customFont text-[#454343] mx-auto p-4 py-7'>
              It's simple! Create your account, search for all your needs, make your own casting, schedule an appointment in our system, and start your project with all the support we give.
            </p>
            <button 
              onClick={handleLoginButtonClick} 
              className='bg-[#17a2b8] w-56 rounded-md p-2 md:text-lg text-xl font-customFont font-semibold mx-auto my-5 text-white hover:bg-[#468089]'
            >
              Get Started
            </button>
          </div>
        </div>
    </div>
  );
}

export default AboutSection;
