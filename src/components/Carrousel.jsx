import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings = {  
  infinite: true,
  slidesToShow: 5,
  slidesToScroll: 1,
  autoplay: true,
  speed: 2000,
  autoplaySpeed: 1300,
  cssEase: "linear",    
  breakpoint: 1024,
  arrows: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1
      }
    }
  ]
};

const Carrousel = () => {
  return (
    <div className="relative max-w-sreen=lg mx-auto w-full ">
      <h1 className='mx-auto justify-center text-[black] font-bold font-sans text-5xl flex p-2 border-b-8 rounded-sm border-[#17a2b8]'>
        Customers
      </h1>
      <div className='relative px-4 md:px-0 block pt-30 pt-md-0'>
        <Slider {...settings} className='p-7 max-w-[1240px] mx-auto'> 
          {[
            { src: "/images/netflix.png", alt: "Netflix", width: 150, height: 100 },
            { src: "/images/amazon.png", alt: "Amazon", width: 80, height: 100 },
            { src: "/images/disney.jpg", alt: "Disney", width: 100, height: 100 },
            { src: "/images/warner.svg", alt: "Warner", width: 100, height: 100 },
            { src: "/images/crunchyroll.png", alt: "Crunchyroll", width: 170, height: 100 },
            { src: "/images/dwa.png", alt: "DreamWorks Animation", width: 140, height: 100 },
            { src: "/images/deluxe.png", alt: "Deluxe", width: 80, height: 100 },
            { src: "/images/iyunno.jpg", alt: "Iyunno", width: 130, height: 100 },
            { src: "/images/zap.png", alt: "Zap", width: 100, height: 100 },
            { src: "/images/onegai.png", alt: "Onegai", width: 80, height: 100 },
            { src: "/images/pixelogic.jpg", alt: "Pixelogic", width: 150, height: 100 },
            { src: "/images/audible.png", alt: "Audible", width: 130, height: 100 },
            { src: "/images/baybus.jpg", alt: "Baybus", width: 210, height: 120 },
            { src: "/images/futura.png", alt: "Futura", width: 90, height: 100 },
            { src: "/images/globolivros.png", alt: "Globo Livros", width: 120, height: 100 },
            { src: "/images/hbo.png", alt: "HBO", width: 100, height: 100 },
            { src: "/images/lionsgate.svg", alt: "Lionsgate", width: 180, height: 100 },
            { src: "/images/mattel.png", alt: "Mattel", width: 80, height: 100 },
            { src: "/images/mgm.png", alt: "MGM", width: 150, height: 100 },
            { src: "/images/nbcu.svg", alt: "NBC Universal", width: 200, height: 100 },
          ].map((image, index) => (
            <div key={index} className="mx-2">
              <img
                className="object-contain mx-auto"
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default Carrousel;
