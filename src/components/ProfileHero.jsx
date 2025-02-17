import React, { useState, useEffect } from "react";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const ProfileHero = () => {
  const [activeTab, setActiveTab] = useState("account-general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/auth/profile");
        const userData = response.data;
        setName(userData.name);
        setEmail(userData.email);
        setCountry(userData.country || "");
        setLanguage(userData.lang || "");
        setProfileImage(userData.profilePic || null);
      } catch (error) {
        console.error("Erro ao carregar os dados do usuário:", error);
        toast.error("Failed to load user data.");
      }
    };

    fetchUserData();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setProfileImage(reader.result); // Armazena a imagem como Base64
      };
      reader.onerror = (error) => {
        console.error("Erro ao converter imagem para Base64:", error);
        toast.error("Failed to process image.");
      };
    }
  };

  const handleTabClick = (tab) => setActiveTab(tab);

  const handleSaveChanges = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.put("/auth/profile", {
        name,
        email,
        lang: language,
        country,
        profilePic: profileImage,
      });

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        setMessage("Dados atualizados com sucesso!");
      } else {
        toast.error("Error updating profile.");
        setMessage("Erro ao atualizar os dados.");
      }
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    try {
      const response = await axios.put("/auth/profile", {
        currentPassword,
        newPassword,
      });

      if (response.status === 200) {
        toast.success("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error("Error updating password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to update password.");
    }
  };

  return (
    <main className="flex justify-center items-center -mt-72 mb-20 ml-32">
      <div className="container">
        <h3 className="font-bold mb-4">Account settings</h3>
        <div className="card overflow-y-auto bg-white border rounded-lg shadow-lg">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full md:w-1/4 p-4">
              <div className="list-group list-group-flush flex flex-col border-r h-[38rem]">
                <button
                  className={`p-4 m-2 w-56 rounded ${
                    activeTab === "account-general"
                      ? "font-bold text-white bg-[#17a2b8]"
                      : ""
                  }`}
                  onClick={() => handleTabClick("account-general")}
                >
                  General
                </button>
                <button
                  className={`p-4 m-2 w-56 rounded ${
                    activeTab === "account-change-password"
                      ? "font-bold text-white bg-[#17a2b8]"
                      : ""
                  }`}
                  onClick={() => handleTabClick("account-change-password")}
                >
                  Change password
                </button>
              </div>
            </div>
            <div className="w-full md:w-3/4 p-4 h-[38rem]">
              {activeTab === "account-general" && (
                <div>
                  <div className="card-body flex items-center">
                    <img
                      src={profileImage || "/images/profile-bg.png"}
                      alt="Profile"
                      className="w-24 h-24 rounded-full"
                    />
                    <div className="ml-4">
                      <label className="relative cursor-pointer inline-flex items-center border border-[#17a2b8] hover:bg-[#17a2b8] hover:text-white p-2 rounded text-lg font-bold">
                        Upload new photo
                        <input
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                  <hr className="border-gray-200 m-0 w-[70rem]" />
                  <div className="card-body">
                    <div className="form-group mt-4">
                      <label className="block font-bold">Name</label>
                      <input
                        type="text"
                        className="w-96 px-3 py-2 border border-gray-300 rounded-md"
                        value={name}
                        disabled
                      />
                    </div>
                    <div className="form-group mt-4">
                      <label className="block font-bold">Email</label>
                      <input
                        type="text"
                        className="w-[30rem] px-3 py-2 border border-gray-300 rounded-md"
                        value={email}
                        disabled
                      />
                    </div>
                    <div className="form-group mt-4">
                      <label className="block font-bold">Country</label>
                      <input
                        type="text"
                        className="w-96 px-3 py-2 border border-gray-300 rounded-md"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </div>
                    <div className="form-group mt-4">
                      <label className="block font-bold">Language</label>
                      <input
                        type="text"
                        className="w-96 px-3 py-2 border border-gray-300 rounded-md"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "account-change-password" && (
                <div>
                  <div className="card-body">
                    <div className="form-group mt-4">
                      <label className="block font-bold">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-96 px-3 py-2 border border-gray-300 rounded-md"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="form-group mt-4">
                      <label className="block font-bold">New Password</label>
                      <input
                        type="password"
                        className="w-96 px-3 py-2 border border-gray-300 rounded-md"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="form-group mt-4">
                      <label className="block font-bold">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-96 px-3 py-2 border border-gray-300 rounded-md"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <div className="text-right mt-4">
                      <button type="button" className="btn bg-blue-600 text-white py-2 px-4 rounded-md" onClick={handleSavePasswordChange}>
                        Save Password
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="text-right mt-4">
                <button
                  type="button"
                  className="btn bg-blue-600 text-white py-2 px-4 rounded-md"
                  onClick={handleSaveChanges}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfileHero;
