import React from "react";
import { useNavigate } from "react-router-dom";

function Card({
  cover,
  title,
  role,
  description,
  country,
  lang,
  price,
  totalStars,
  starNumber,
}) {
  const navigate = useNavigate();
  const rating = starNumber > 0 ? Math.min(5, totalStars) : 0;

  return (
    <div className="md:w-[70%] max-h-80 md:flex mx-auto my-auto rounded-xl border cursor-pointer overflow-hidden">
      <div
        className="w-96 h-52 md:h-80 rounded-l-xl relative bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${cover})` }}
      ></div>
      <div className="flex flex-col justify-between p-4 text-black flex-1">
        <div>
          <div className="flex flex-row justify-between">
            <h5 className="text-2xl font-semibold mb-1">{title}</h5>
            <h5 className="text-xl font-semibold mb-1">
              {price}
              <span className="font-customFont1 font-normal text-gray-600">
                /hr
              </span>
            </h5>
          </div>
          <div className="flex flex-row justify-between">
            <h6 className="text-sm font-semibold mb-2">{role}</h6>
            <div className="flex items-center gap-1">
              <img src="/images/star.png" alt="Star" width={20} height={20} />
              <span className="font-bold text-[#ffc108]">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>
          <p className="text-[#ADB7BE] text-ellipsis overflow-hidden">
            {description}
          </p>
        </div>
        <div className="mt-4">
          <p className="flex items-center mb-2">
            <img
              src="/images/lang.svg"
              alt="Language icon"
              width={24}
              height={24}
              className="mr-2"
            />
            <span>{lang}</span>
          </p>
          <p className="flex items-center">
            <img
              src="/images/location.svg"
              alt="Location icon"
              width={24}
              height={24}
              className="mr-2"
            />
            <span>{country}</span>
          </p>
        </div>
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => navigate("/bookings")}
            className="border rounded-md w-32 p-2 font-bold text-center bg-[#17a2b8] text-white"
          >
            Appointment
          </button>
          <button
            onClick={() => navigate("/chat")}
            className="border rounded-md w-28 p-2 font-bold text-center"
          >
            Chat
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
  