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
    profileImage: null,
  });
  const [videoSrc, setVideoSrc] = useState(""); // Armazenar o vídeo
  const [error, setError] = useState("");
  const { cards, createCard, loading } = useCardStore();

  useEffect(() => {
    // Função para buscar os dados do usuário
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/auth/profile");
        const user = response.data;
        setUserData({
          name: user.name,
          email: user.email,
          country: user.country || "",
          language: user.lang || "",
          profileImage: user.profilePic || null,
        });
      } catch (error) {
        toast.error("Failed to load user data.");
      }
    };

    fetchUserData();
  }, []);

  const handleTabClick = (tab) => setActiveTab(tab);

  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;

      if (fileType.startsWith("video/")) {
        const localVideoURL = URL.createObjectURL(file);
        setVideoSrc(localVideoURL); // Atualiza a URL do vídeo
        setError("");
      } else {
        setError("Please select a valid video file.");
      }
    }
  };

  const handleSaveChanges = async () => {
    const updatedData = {
      title: document.getElementById("title").value,
      role: document.getElementById("role").value,
      desc: document.getElementById("desc").value,
      price: document.getElementById("price").value,
      country: userData.country, // Usa o país do estado
      lang: userData.language, // Usa o idioma do estado
      video: videoSrc, // Incluí o vídeo como parte do card
    };

    try {
      await createCard(updatedData);
      toast.success("Changes saved successfully!");
    } catch (error) {
      toast.error("An error occurred while saving changes.");
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
                    activeTab === "account-general"
                      ? "font-bold text-white bg-[#17a2b8]"
                      : ""
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
                  <div className="tab-pane fade show active" id="account-general">
                    <div className="flex flex-col mb-2">
                      <span className="text-lg font-bold">Card Title</span>
                      <input
                        type="text"
                        id="title"
                        className="border rounded-md w-56 p-2"
                        defaultValue={userData.name} // Preenche com o nome do usuário
                      />
                    </div>
                    <div className="flex flex-col mb-2">
                      <span className="text-lg font-bold">Role</span>
                      <select
                        id="role"
                        className="border rounded-md w-60 p-2 bg-white"
                      >
                        <option value="Dubbing Actor">Dubbing Actor</option>
                        <option value="Translator">Translator</option>
                        <option value="Dubbing Director">Dubbing Director</option>
                        <option value="Project Manager">Project Manager</option>
                        <option value="Dubbing Operator">Dubbing Operator</option>
                      </select>
                    </div>
                    <div className="flex flex-col mb-2">
                      <span className="text-lg font-bold mb-2">Description</span>
                      <textarea
                        id="desc"
                        className="resize-none h-60 w-96 border rounded-md p-2"
                      ></textarea>
                    </div>
                    <div className="flex flex-col mb-2">
                      <span className="text-lg font-bold">Price</span>
                      <input
                        id="price"
                        className="border rounded-md w-60 p-2 bg-white"
                        placeholder="Price per hour"
                      />
                    </div>
                    <div className="flex flex-col mb-2">
                      <span className="text-lg font-bold">Country</span>
                      <input
                        id="country"
                        className="border rounded-md w-60 p-2 bg-white"
                        value={userData.country} // Preenche com o país do usuário
                        disabled
                      />
                    </div>
                    <div className="flex flex-col mb-2">
                      <span className="text-lg font-bold">Language</span>
                      <input
                        id="language"
                        className="border rounded-md w-60 p-2 bg-white"
                        value={userData.language} // Preenche com o idioma do usuário
                        disabled
                      />
                    </div>
                    <div className="flex flex-col mb-2">
                      <span className="text-lg font-bold">Upload Video</span>
                      <input
                        type="file"
                        className="border rounded-md w-60 p-2 bg-white"
                        accept="video/*"
                        onChange={handleVideoChange}
                      />
                      {videoSrc && (
                        <div className="mt-2">
                          <video width="100%" controls>
                            <source src={videoSrc} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                      {error && <p className="text-red-500">{error}</p>}
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
          &nbsp;
          <button
            type="button"
            className="btn btn-default border border-gray-300 bg-transparent text-gray-700 py-2 px-4 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
};

export default MyCard;
