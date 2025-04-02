import React from "react";

const HeroMainPage = () => {
  return (
    <main className="grid grid-col-8 sm:grid-cols-2 items-center justify-center mt-10">
      <div className="flex flex-col justify-center items-center ml-10 mt-10 md:ml-20">
        <h1 className="text-5xl md:text-7xl font-bold font-customFont4 -ml-10 p-4">
          DUB<span className="text-[#17a2b8] font-customFont3">BER</span>
        </h1>
        <p className="text-lg text-center justify-center items-center md:text-2xl text-zinc-700  font-Oswald mx-auto py-10">
          Welcome to DUBBER, where we redefine the art of voiceover with
          cutting-edge technology and unparalleled expertise. At DUBBER, we are
          passionate about bringing characters and stories to life through
          dynamic and immersive voice performances. Our platform merges the
          precision of advanced tools with the creativity of talented voice
          artists, ensuring that every project resonates with authenticity and
          impact.
        </p>
      </div>
      <div className="flex flex-col-2 justify-center items-center md:mt-10">
        <img
          src="/images/dublador.jpg"
          alt="/"
          className="w-[300px] h-[400px] md:w-[500px] md:h-[600px] rounded-md object-cover mt-10 md:ml-[6rem]"
        />
      </div>
    </main>
  );
};

export default HeroMainPage;
