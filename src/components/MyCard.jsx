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
    revisionNumber: 0,
    features: [],
    video: [],
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
          await fetchCardById(user._id);
        }
      } catch (error) {
        toast.error("Failed to load user data.");
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (selectedCard && userData && selectedCard.userId === userData._id) {
      setCardData({
        role: selectedCard.role || "",
        shortDesc: selectedCard.shortDesc || "",
        desc: selectedCard.desc || "",
        price: selectedCard.price || "",
        revisionNumber: selectedCard.revisionNumber || 0,
        features: selectedCard.features || [],
        video: selectedCard.video || [],
      });
    } else {
      setCardData({
        role: "",
        shortDesc: "",
        desc: "",
        price: "",
        revisionNumber: 0,
        features: [],
        video: [],
      });
    }
  }, [selectedCard, userData]);

  const handleSaveChanges = async () => {
    if (!cardData.role || !cardData.desc || !cardData.shortDesc || isNaN(cardData.price) || !userData?.country || !userData?.lang) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const newCardData = {
      userId: userData._id,
      title: userData.name,
      cover: userData.profilePic || "/default-cover.jpg",
      ...cardData,
      country: userData.country,
      lang: userData.lang,
      totalStars: 0,
      starNumber: 0,
      price: Number(cardData.price),
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">Card Settings</h2>
        
        <div className="border-b mb-4">
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === "account-general" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"}`} 
            onClick={() => setActiveTab("account-general")}
          >
            General
          </button>
        </div>

        {activeTab === "account-general" && (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Card Title</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md bg-gray-100" 
                value={userData.name} 
                disabled 
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Role</label>
              <select 
                className="w-full p-2 border rounded-md bg-white" 
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

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Short Description</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md" 
                value={cardData.shortDesc} 
                onChange={(e) => setCardData({ ...cardData, shortDesc: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Description</label>
              <textarea 
                className="w-full p-2 border rounded-md h-24 resize-none" 
                value={cardData.desc} 
                onChange={(e) => setCardData({ ...cardData, desc: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Price</label>
              <input 
                type="number" 
                className="w-full p-2 border rounded-md" 
                placeholder="Price per hour" 
                value={cardData.price} 
                onChange={(e) => setCardData({ ...cardData, price: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Country</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md bg-gray-100" 
                value={userData.country} 
                disabled 
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">Language</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md bg-gray-100" 
                value={userData.lang} 
                disabled 
              />
            </div>

            {/* Exibir vídeos cadastrados */}
            {cardData.video.length > 0 && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">Videos</label>
                {cardData.video.map((vid, index) => (
                  <video key={index} controls className="w-full rounded-md">
                    <source src={vid.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ))}
              </div>
            )}

            <div className="text-right">
              <button 
                onClick={handleSaveChanges} 
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Save changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCard;
