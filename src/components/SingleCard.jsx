import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useCardStore } from "../stores/useCardStore";

const SingleCard = () => {
  const { id } = useParams();
  const { selectedCard, fetchCardById, loading } = useCardStore();
  const videoRef = useRef(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const loadCardData = async () => {
      try {
        await fetchCardById(id);
      } catch (error) {
        console.error("Error loading card:", error);
      }
    };
    loadCardData();
  }, [id, fetchCardById]);

  useEffect(() => {
    if (!selectedCard?.video) {
      setVideoLoading(false);
      return;
    }

    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleLoadStart = () => {
      setVideoLoading(true);
      setVideoError(false);
    };

    const handleLoadedData = () => {
      setVideoLoading(false);
      videoElement.play().catch(e => console.log("Autoplay prevented:", e));
    };

    const handleError = () => {
      setVideoLoading(false);
      setVideoError(true);
    };

    videoElement.addEventListener('loadstart', handleLoadStart);
    videoElement.addEventListener('loadeddata', handleLoadedData);
    videoElement.addEventListener('error', handleError);

    videoElement.load();

    return () => {
      videoElement.removeEventListener('loadstart', handleLoadStart);
      videoElement.removeEventListener('loadeddata', handleLoadedData);
      videoElement.removeEventListener('error', handleError);
    };
  }, [selectedCard?.video]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2">Loading card details...</p>
        </div>
      </div>
    );
  }

  if (!selectedCard) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Card not found.</p>
      </div>
    );
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
    billingMethod,
  } = selectedCard;

  const rating = starNumber > 0 ? (totalStars / starNumber).toFixed(1) : "0.0";
  const starsCount = Math.round(starNumber > 0 ? totalStars / starNumber : 0);

  const getBillingSuffix = (method) => {
    switch (method) {
      case "hour":
        return "/hr";
      case "minute":
        return "/min";
      case "loop":
        return "/loop";
      default:
        return "";
    }
  };

  return (
    <div className="flex justify-center mt-20 mb-20 px-4">
      <div className="w-full max-w-[1400px] pt-8 pb-0 gap-12 flex flex-col lg:flex-row">
        {/* Left Section */}
        <div className="flex flex-col gap-5 flex-1">
          <span className="font-semibold text-sm text-gray-500">
            {role || "No role specified"}
          </span>
          <h1 className="font-bold text-2xl">{title || "No title"}</h1>

          <div className="flex items-center gap-4">
            <img
              src={cover || "/images/profile-bg.png"}
              alt={title || "Profile"}
              className="rounded-full w-28 h-28 object-cover"
              loading="eager"
            />
            <div>
              <span className="block font-medium">{title || "No title"}</span>
              <div className="flex items-center mt-1">
                {[...Array(starsCount)].map((_, i) => (
                  <img
                    key={i}
                    src="/images/star.png"
                    alt="star"
                    className="w-5 h-5"
                    loading="eager"
                  />
                ))}
                <span className="ml-1 text-sm">{rating}</span>
              </div>
            </div>
          </div>

          {/* Video Player Section */}
          <div className="mt-4 relative">
            {video ? (
              <>
                <video
                  ref={videoRef}
                  key={`video-${video}`}
                  controls
                  autoPlay
                  muted
                  preload="auto"
                  className={`w-full max-w-[800px] h-auto max-h-[500px] bg-black rounded-lg ${videoLoading ? 'invisible' : 'visible'}`}
                  playsInline
                  disablePictureInPicture
                  disableRemotePlayback
                >
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {videoLoading && (
                  <div className="absolute inset-0 w-full max-w-[800px] h-[450px] flex items-center justify-center bg-gray-200 rounded-lg">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-2"></div>
                      <p className="text-gray-600 font-medium">Loading video...</p>
                    </div>
                  </div>
                )}

                {videoError && (
                  <div className="absolute inset-0 w-full max-w-[800px] h-[450px] flex items-center justify-center bg-gray-200 rounded-lg">
                    <p className="text-red-500 font-medium">Failed to load video</p>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full max-w-[800px] h-[450px] flex items-center justify-center bg-gray-200 rounded-lg">
                <p className="text-gray-600 font-medium">No video available</p>
              </div>
            )}
          </div>

          {/* Descrição completa */}
          <div className="mt-6">
            <h2 className="font-semibold text-lg mb-2">About Me</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {desc || "No description available."}
            </p>
          </div>

          <div className="mt-6 border border-gray-300 rounded-lg p-6">
            <h2 className="font-semibold text-lg mb-4">About The Professional</h2>
            <div className="flex items-center gap-4">
              <img
                src={cover || "/images/profile-bg.png"}
                alt={title || "Profile"}
                className="rounded-full w-24 h-24 object-cover"
                loading="eager"
              />
              <div>
                <span className="block font-medium">{title || "No title"}</span>
                <div className="flex items-center mt-1">
                  {[...Array(starsCount)].map((_, i) => (
                    <img
                      key={i}
                      src="/images/star.png"
                      alt="star"
                      className="w-5 h-5"
                      loading="eager"
                    />
                  ))}
                  <span className="ml-1 text-sm">{rating}</span>
                </div>
                <button className="mt-2 font-semibold bg-[#17a2b8] text-white rounded-md px-4 py-2 hover:bg-[#138496] transition">
                  Chat Me
                </button>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-3">Services & Features</h3>
              {features?.length > 0 ? (
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{feature || "No feature specified"}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No features available</p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm">
                <span className="font-medium">Revisions:</span> {revisionNumber || "N/A"}
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium">Language:</span> {lang || "N/A"}
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium">Country:</span> {country || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:w-[350px] flex-shrink-0">
          <div className="border border-gray-300 rounded-lg p-5 sticky top-20">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Let's Talk!</h3>
              <h2 className="text-2xl font-bold mt-1">
                ${price || 0}
                <span className="text-base text-gray-600">
                  {getBillingSuffix(billingMethod)}
                </span>
              </h2>
            </div>
            <p className="text-gray-700 mb-4">{shortDesc || "No description available."}</p>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/images/clock.png"
                alt="clock"
                className="w-6 h-6"
                loading="eager"
              />
              <span className="text-sm">Chat for booking</span>
            </div>
            <button className="w-full bg-[#17a2b8] font-semibold py-2 rounded-md text-white hover:bg-[#138496] transition">
              Chat Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCard;
