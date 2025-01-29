import Image from "next/image";
import React, { useEffect, useState } from "react";

const CardPage = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
   
    fetch("http://localhost:8800/api/cards")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="flex justify-center mt-20">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center mt-20">Something went wrong!</div>
    );
  }

  return (
    <div id="page" className="flex justify-center mt-20 mb-20">
      <div
        id="container"
        className="w-[1400px] pt-8 pb-0 gap-12 flex flex-wrap"
      >
        {/* Seção Esquerda */}
        <div id="left" className="flex flex-col flex-none gap-5">
          <span className="font-semibold text-sm text-[#555]">
            {data.category}
          </span>
          <h1 className="font-bold text-2xl">{data.name}</h1>
          <div>
            <div className="flex gap-3 items-center pb-3">
              <Image
                src={data.image || "/images/profile-bg.png"}
                alt={data.name}
                width={250}
                height={250}
                className="rounded-full w-28 h-28 object-cover"
              />
              <span id="Name" className="font-semibold text-lg">
                {data.profession}
              </span>
              <div id="stars" className="flex flex-row gap-1">
                {[...Array(data.rating)].map((_, i) => (
                  <Image
                    key={i}
                    src="/images/star.png"
                    alt="star"
                    width={20}
                    height={20}
                  />
                ))}
                <span className="font-bold text-[#ffc108]">{data.rating}</span>
              </div>
            </div>
            <video
              controls
              className="w-[50rem] h-[32rem] flex items-center justify-center object-contain"
            >
              <source src={data.video || "/video/default.mp4"} />
            </video>
            <h2 className="py-4 font-semibold text-lg">About me</h2>
            <p className="font-light text-md text-[#555] leading-6 max-w-[36rem]">
              {data.shortDesc}
            </p>
            <div id="seller" className="mt-12 flex flex-col gap-3 w-[32rem]">
              <h2 className="font-semibold text-lg">About the professional</h2>
              <div className="flex items-center gap-5">
                <Image
                  src={data.image || "/images/profile-bg.png"}
                  alt={data.name}
                  width={250}
                  height={250}
                  className="rounded-full w-24 h-24 object-cover items-center"
                />
                <div className="flex flex-col gap-3">
                  <h1 className="font-semibold text-md">{data.name}</h1>
                  <div id="stars" className="flex flex-row gap-1">
                    {[...Array(data.rating)].map((_, i) => (
                      <Image
                        key={i}
                        src="/images/star.png"
                        alt="star"
                        width={20}
                        height={20}
                      />
                    ))}
                    <span className="font-semibold text-[#ffc108]">
                      {data.rating}
                    </span>
                  </div>
                  <button className="border border-black font-semibold text-black rounded-md mt-2 p-1">
                    Chat me
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Box com detalhes adicionais */}
          <div
            id="box"
            className="border border-[lightgray] rounded-sm p-5 mt-5"
          >
            <div id="items" className="flex flex-wrap justify-between">
              {data.details && data.details.length > 0 ? (
                data.details.map((item, index) => (
                  <div
                    key={index}
                    id="item"
                    className="flex flex-col w-72 gap-2 mb-3"
                  >
                    <span id="title" className="text-md text-[gray]">
                      {item.title}
                    </span>
                    <span id="desc" className="font-semibold text-md">
                      {item.description}
                    </span>
                  </div>
                ))
              ) : (
                <span>No details available</span>
              )}
            </div>
            <hr className="h-0 border border-[lightgray] mb-2" />
            <p className="mt-2 text-[#555]">
              {data.additionalInfo || "No additional information provided."}
            </p>
          </div>
        </div>

        {/* Seção Direita */}
        <div
          id="right"
          className="flex flex-col flex-initial border border-[lightgray] p-5 rounded-md gap-5 sticky top-40 max-h-[350px]"
        >
          <div id="price" className="flex justify-between">
            <h2 className="text-lg font-semibold">Let&apos;s Talk!</h2>
            <h3 className="text-lg font-semibold">${data.price}/hr</h3>
          </div>
          <p className="text-lg font-light text-[#555]">{data.description}</p>
          <div id="datails">
            <div id="item" className="flex flex-row gap-2">
              <Image
                src="/images/clock.png"
                alt="clock"
                width={25}
                height={25}
              />
              <span className="text-md text-[#555] font-bold">
                Chat for booking
              </span>
            </div>
          </div>
          {/*<div id="features" className="flex flex-col gap-2">
            {data.features.map((feature, index) => (
              <div key={index} id="item" className="flex flex-row gap-2">
                <Image
                  src="/images/check.png"
                  alt="check"
                  width={25}
                  height={25}
                />
                <span>{feature}</span>
              </div>
            ))}
          </div>*/}
          <button className="bg-[#17a2b8] p-1 rounded-md text-white">
            Chat here
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardPage;
