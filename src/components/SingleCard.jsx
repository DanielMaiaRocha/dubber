import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCardStore } from "../stores/useCardStore";

const SingleCard = () => {
  const { id } = useParams();
  const { selectedCard, fetchCardById, loading } = useCardStore();

  useEffect(() => {
    fetchCardById(id);
  }, [id, fetchCardById]);

  if (loading) {
    return <div className="flex justify-center mt-20">Loading...</div>;
  }

  if (!selectedCard) {
    return <div className="flex justify-center mt-20">Card not found.</div>;
  }

  const {
    title,
    desc,
    totalStars,
    starNumber,
    price,
    cover,
    shortDesc,
    revisionNumber,
    features,
    lang,
    country,
    role,
    video,
  } = selectedCard;

  return (
    <div id="page" className="flex justify-center mt-20 mb-20">
      <div id="container" className="w-[1400px] pt-8 pb-0 gap-12 flex flex-wrap">
        {/* Seção Esquerda */}
        <div id="left" className="flex flex-col flex-none gap-5">
          <span className="font-semibold text-sm text-[#555]">
            {role || "No role specified"}
          </span>
          <h1 className="font-bold text-2xl">{title || "No title"}</h1>
          <div className="user">
            <img
              src={cover || "/images/profile-bg.png"}
              alt={title || "Profile"}
              width={250}
              height={250}
              className="rounded-full w-28 h-28 object-cover"
            />
            <span>{title || "No title"}</span>
            <div className="stars flex items-center">
              {[...Array(Math.round(totalStars / Math.max(1, starNumber)))].map((_, i) => (
                <img key={i} src="/images/star.png" alt="star" width={20} height={20} />
              ))}
              <span>{(totalStars / Math.max(1, starNumber)).toFixed(1) || "0.0"}</span>
            </div>
          </div>

          {/* Player de Vídeo ou Placeholder */}
          {video && video.length > 0 ? (
            <video
              controls
              className="w-[50rem] h-[32rem] flex items-center justify-center object-contain"
            >
              <source src={video[0].url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-[50rem] h-[32rem] flex items-center justify-center bg-gray-300 text-gray-700 font-semibold text-lg rounded-md">
              No video available
            </div>
          )}

          <h2 className="font-semibold text-lg">About Me</h2>
          <p>{desc || "No description available."}</p>

          <div className="seller border border-gray-300 rounded-sm p-4">
            <h2 className="mb-4 font-semibold">About The Professional</h2>
            <div className="user">
              <img
                src={cover || "/images/profile-bg.png"}
                alt={title || "Profile"}
                width={250}
                height={250}
                className="rounded-full w-24 h-24 object-cover"
              />
              <div className="info">
                <span>{title || "No title"}</span>
                <div className="stars flex items-center">
                  {[...Array(Math.round(totalStars / Math.max(1, starNumber)))].map((_, i) => (
                    <img key={i} src="/images/star.png" alt="star" width={20} height={20} />
                  ))}
                  <span>{(totalStars / Math.max(1, starNumber)).toFixed(1) || "0.0"}</span>
                </div>
                <button className="font-semibold bg-[#17a2b8] text-white rounded-md mt-2 mb-2 p-1 w-40">
                  Chat Me
                </button>
              </div>
            </div>
            <div className="box">
              <div className="items font-semibold">
                {features && features.length > 0 ? (
                  features.map((feature, index) => (
                    <div key={index} className="item">
                      <span className="title">Feature:</span>
                      <span className="desc">{feature || "No feature specified"}</span>
                    </div>
                  ))
                ) : (
                  <span>No features available</span>
                )}
              </div>
              <hr />
              <p>Revisions: {revisionNumber || "N/A"}</p>
              <p>Language: {lang || "N/A"}</p>
              <p>Country: {country || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Seção Direita */}
        <div
          id="right"
          className="flex flex-col flex-initial border border-[lightgray] p-5 rounded-md gap-5 sticky top-40 max-h-[250px] w-[450px]"
        >
          <div className="price">
            <h3>Let&apos;s Talk!</h3>
            <h2>${price || 0}/hr</h2>
          </div>
          <p>{shortDesc || "No description available."}</p>
          <div className="details">
            <div className="item">
              <img src="/images/clock.png" alt="clock" width={25} height={25} />
              <span>Chat for booking</span>
            </div>
          </div>
          <button className="bg-[#17a2b8] font-semibold p-1 rounded-md text-white">
            Chat Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleCard;
