import React from 'react';
import { TypeAnimation } from 'react-type-animation';

const handleLoginButtonClick = () => {
    window.location.href = "/login"; 
};  

const Hero = () => {
  return (
    <div style={{ backgroundImage: 'url("/images/fundo.png")' }} className='bg-cover bg-center'>
        <div className='max-w-[800px] mt-[-30px] w-full h-screen mx-auto text-center flex flex-col justify-center p-1'>
            <h1 className='md:text-8xl sm:text-7xl text-7xl font-bold font-customFont3 text-white'>
                Dub<span className='text-[#17a2b8]'>ber</span>
            </h1>
            <div className='p-1 mt-2 mb-5 py-4'>
                <TypeAnimation 
                    className='text-white md:text-2xl sm:text-lg text-xl font-customFont3 font-semibold'
                    style={{
                        height: '200px',
                        width: '800px',
                        textAlign: 'center',   
                    }}
                    sequence={[
                        'Your fastest way to connect your production with quality and speed, work everywhere and everyway you want.',   
                        500, 
                    ]}
                    wrapper='span'
                    speed={50}
                    repeat={Infinity}
                />
            </div>
            <button 
                onClick={handleLoginButtonClick} 
                className='bg-[#17a2b8] w-56 rounded-md p-2 md:text-lg text-xl font-customFont font-semibold mx-auto text-white hover:bg-[#468089]'
            >
                Get Started
            </button>
        </div>
    </div>
  );
}

export default Hero;
