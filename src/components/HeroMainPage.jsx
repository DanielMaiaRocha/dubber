import React from "react";

const HeroMainPage = () => {
  return (
    <main className="grid grid-col-8 sm:grid-cols-2 items-center justify-center">
      <div className="flex flex-col justify-center items-center ml-10 mt-10 md:ml-20">
        <h1 className="text-5xl md:text-7xl font-bold font-customFont4 -ml-10 p-4">
          DUB<span className="text-[#17a2b8] font-customFont3">BER</span>
        </h1>
        <p className="text-lg text-center justify-center items-center md:text-2xl text-zinc-700 font-semibold mx-auto py-10">
          Welcome to DUBBER, where we redefine the art of voiceover with
          cutting-edge technology and unparalleled expertise. At DUBBER, we are
          passionate about bringing characters and stories to life through
          dynamic and immersive voice performances. Our platform merges the
          precision of advanced tools with the creativity of talented voice
          artists, ensuring that every project resonates with authenticity and
          impact.
        </p>
        <select className="text-lg border shadow-lg text-zinc-400 mx-auto rounded-md flex items-center justify-center p-3 w-72 mr-[4.3rem] md:ml-10 md:w-96">
          <option value="#">Select the project language</option>
          <option value="#">English</option>
          <option value="#">Portuguese</option>
          <option value="#">Spanish</option>
        </select>
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
