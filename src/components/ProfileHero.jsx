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
        setCurrentPassword(userData.password || ""); 
      } catch (error) {
        console.error("Erro ao carregar os dados do usuário:", error);
        toast.error("Failed to load user data.");
      }
    };

    fetchUserData();
  }, []);

  const handleTabClick = (tab) => setActiveTab(tab);

  const handleSaveChanges = async () => {
    const updatedUserData = {
      name,
      email,
      lang: language,
      country: country,
      profilePic: profileImage,
    };

    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.put("/auth/profile", updatedUserData);

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        setMessage("Dados atualizados com sucesso!");
      } else {
        toast.error("Error updating profile.");
        setMessage("Erro ao atualizar os dados.");
      }
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      setMessage("Erro ao enviar os dados.");
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
                <a
                  className={`list-group-item cursor-pointer rounded p-4 m-2 mb-2 w-56 ${
                    activeTab === "account-change-password"
                      ? "font-bold text-white bg-[#17a2b8]"
                      : ""
                  }`}
                  onClick={() => handleTabClick("account-change-password")}
                >
                  Change password
                </a>
              </div>
            </div>
            <div className="w-full md:w-3/4 p-4 h-[38rem]">
              <div className="tab-content">
                {activeTab === "account-general" && (
                  <div className="tab-pane fade show active">
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
                            onChange={(e) => setProfileImage(e.target.files[0])}
                          />
                        </label>
                      </div>
                    </div>
                    <hr className="border-gray-200 m-0 w-[70rem]" />
                    <div className="card-body">
                      <div className="form-group mt-4">
                        <label className="form-label block">Name</label>
                        <input
                          type="text"
                          className="form-control w-96 px-3 py-2 border border-gray-300 rounded-md"
                          value={name}
                          disabled
                        />
                      </div>
                      <div className="form-group mt-4">
                        <label className="form-label block">E-mail</label>
                        <input
                          type="text"
                          className="form-control w-[30rem] px-3 py-2 border border-gray-300 rounded-md"
                          value={email}
                          disabled
                        />
                      </div>
                      <div className="flex flex-col mb-3">
                        <label>Country</label>
                        <input
                          type="text"
                          className="rounded border border-gray-300 w-96 p-2 bg-white font-customFont2"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col mb-3">
                        <label>Language</label>
                        <input
                          type="text"
                          className="rounded border border-gray-300 w-96 p-2 bg-white font-customFont2"
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "account-change-password" && (
                  <div className="tab-pane fade show active">
                    <h4 className="font-bold mb-4">Change Password</h4>
                    <div className="form-group mb-4">
                      <label className="block mb-1">Current Password</label>
                      <input
                        type="password"
                        className="form-control w-96 px-3 py-2 border border-gray-300 rounded-md"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="form-group mb-4">
                      <label className="block mb-1">New Password</label>
                      <input
                        type="password"
                        className="form-control w-96 px-3 py-2 border border-gray-300 rounded-md"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="form-group mb-4">
                      <label className="block mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control w-96 px-3 py-2 border border-gray-300 rounded-md"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <button
                      className="btn bg-blue-600 text-white py-2 px-4 rounded-md"
                      onClick={handleSavePasswordChange}
                    >
                      Save Password
                    </button>
                  </div>
                )}
              </div>
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
