import React, { useState, useEffect } from "react";
import { useCardStore } from "../stores/useCardStore";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const MyCard = () => {
  const [activeTab, setActiveTab] = useState("account-general");
  const [userData, setUserData] = useState(null);

  const { selectedCard, fetchCardById, createCard, loading } = useCardStore();

  const [cardData, setCardData] = useState({
    role: "",
    shortDesc: "",
    desc: "",
    price: "",
  });

  const roles = [
    "Dubbing Actor",
    "Translator",
    "Dubbing Director",
    "Project Manager",
    "Dubbing Operator",
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/auth/profile");
        const user = response.data;

        setUserData(user);

        if (user._id) {
          await fetchCardById(user._id); // Busca o card do usuário
        }
      } catch (error) {
        toast.error("Failed to load user data.");
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (selectedCard) {
      setCardData({
        role: selectedCard.role || "",
        shortDesc: selectedCard.shortDesc || "",
        desc: selectedCard.desc || "",
        price: selectedCard.price || "",
      });
    }
  }, [selectedCard]);

  const handleSaveChanges = async () => {
    if (!cardData.role || !cardData.desc || !cardData.shortDesc || isNaN(cardData.price) || !userData?.country || !userData?.lang) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const newCardData = {
      title: userData.name,
      cover: userData.profilePic || "",
      ...cardData,
      country: userData.country,
      lang: userData.lang,
      totalStars: 0,
      starNumber: 0,
    };

    try {
      await createCard(newCardData);
      toast.success("Card saved successfully!");
    } catch (error) {
      toast.error("An error occurred while saving the card.");
    }
  };

  if (loading || !userData) return <p>Loading...</p>;

  return (
    <main className="flex justify-center items-center -mt-80 ml-32">
      <div className="container">
        <h3 className="font-bold mb-4">Card settings</h3>
        <div className="card overflow-y-auto bg-white border rounded-lg shadow-lg">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full md:w-1/4 p-4">
              <div className="list-group list-group-flush flex flex-col border-r h-[38rem]">
                <a
                  className={`list-group-item cursor-pointer rounded p-4 m-2 mb-2 w-56 ${
                    activeTab === "account-general" ? "font-bold text-white bg-[#17a2b8]" : ""
                  }`}
                  onClick={() => setActiveTab("account-general")}
                >
                  General
                </a>
              </div>
            </div>
            <div className="w-full md:w-3/4 p-4 h-[38rem]">
              <div className="tab-content mb-5">
                {activeTab === "account-general" && (
                  <div className="tab-pane fade show active">
                    <div className="flex flex-col mb-2">
                      <span className="text-lg font-bold">Card Title</span>
                      <input
                        type="text"
                        id="title"
                        className="border rounded-md w-56 p-2"
                        value={userData.name}
                        disabled
                      />
                    </div>
                    <div className="flex flex-col mb-2">
                      <span className="text-lg font-bold">Role</span>
                      <select
                        id="role"
                        className="border rounded-md w-60 p-2 bg-white"
                        value={cardData.role}
                        onChange={(e) => setCardData({ ...cardData, role: e.target.value })}
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col mb-2">
                      <span className="text-lg font-bold mb-2">Short Description</span>
                      <input
                        type="text"
                        id="shortDesc"
                        className="border rounded-md w-96 p-2"
                        value={cardData.shortDesc}
                        onChange={(e) => setCardData({ ...cardData, shortDesc: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col mb-2">
                      <span className="text-lg font-bold mb-2">Description</span>
                      <textarea
                        id="desc"
                        className="resize-none h-60 w-96 border rounded-md p-2"
                        value={cardData.desc}
                        onChange={(e) => setCardData({ ...cardData, desc: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col mb-2">
                      <span className="text-lg font-bold">Price</span>
                      <input
                        id="price"
                        type="number"
                        className="border rounded-md w-60 p-2 bg-white"
                        placeholder="Price per hour"
                        value={cardData.price}
                        onChange={(e) => setCardData({ ...cardData, price: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col mb-2">
                      <span className="text-lg font-bold">Country</span>
                      <input
                        id="country"
                        className="border rounded-md w-60 p-2 bg-white"
                        value={userData.country}
                        disabled
                      />
                    </div>
                    <div className="flex flex-col mb-2">
                      <span className="text-lg font-bold">Language</span>
                      <input
                        id="language"
                        className="border rounded-md w-60 p-2 bg-white"
                        value={userData.lang}
                        disabled
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="text-right mt-3">
          <button
            onClick={handleSaveChanges}
            className="btn btn-primary bg-[#17a2b8] text-white py-2 px-4 rounded-md"
          >
            Save changes
          </button>
        </div>
      </div>
    </main>
  );
};

export default MyCard;
