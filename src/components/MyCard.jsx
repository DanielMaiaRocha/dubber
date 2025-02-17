import React, { useState, useEffect } from "react";
import { useCardStore } from "../stores/useCardStore";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const MyCard = () => {
  const [activeTab, setActiveTab] = useState("account-general");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    country: "",
    language: "",
    profilePic: "",
  });

  const { createCard, loading } = useCardStore();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/auth/profile");
        const user = response.data;
        setUserData({
          name: user.name,
          email: user.email,
          country: user.country || "",
          language: user.lang || "",
          profilePic: user.profilePic || "",
        });
      } catch (error) {
        toast.error("Failed to load user data.");
      }
    };

    fetchUserData();
  }, []);

  const handleTabClick = (tab) => setActiveTab(tab);

  const handleSaveChanges = async () => {
    const role = document.getElementById("role").value.trim();
    const desc = document.getElementById("desc").value.trim();
    const shortDesc = document.getElementById("shortDesc").value.trim();
    const price = parseFloat(document.getElementById("price").value);

    if (!role || !desc || !shortDesc || isNaN(price) || !userData.country || !userData.language) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const cardData = {
      title: userData.name,
      cover: userData.profilePic,
      role,
      desc,
      shortDesc,
      price,
      country: userData.country,
      lang: userData.language,
      totalStars: 0,
      starNumber: 0,
    };

    try {
      await createCard(cardData);
      toast.success("Card created successfully!");
    } catch (error) {
      toast.error("An error occurred while saving the card.");
    }
  };

  if (loading) return <p>Loading...</p>;

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
                  onClick={() => handleTabClick("account-general")}
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
                      <select id="role" className="border rounded-md w-60 p-2 bg-white">
                        <option value="Dubbing Actor">Dubbing Actor</option>
                        <option value="Translator">Translator</option>
                        <option value="Dubbing Director">Dubbing Director</option>
                        <option value="Project Manager">Project Manager</option>
                        <option value="Dubbing Operator">Dubbing Operator</option>
                      </select>
                    </div>
                    <div className="flex flex-col mb-2">
                      <span className="text-lg font-bold mb-2">Short Description</span>
                      <input type="text" id="shortDesc" className="border rounded-md w-96 p-2" />
                    </div>
                    <div className="flex flex-col mb-2">
                      <span className="text-lg font-bold mb-2">Description</span>
                      <textarea id="desc" className="resize-none h-60 w-96 border rounded-md p-2"></textarea>
                    </div>
                    <div className="flex flex-col mb-2">
                      <span className="text-lg font-bold">Price</span>
                      <input
                        id="price"
                        type="number"
                        className="border rounded-md w-60 p-2 bg-white"
                        placeholder="Price per hour"
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
                        value={userData.language}
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
