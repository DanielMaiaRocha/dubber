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
        setProfileImage(reader.result);
      };
      reader.onerror = () => {
        toast.error("Failed to process image.");
      };
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);

    try {
      await axios.put("/auth/profile", {
        name,
        email,
        lang: language,
        country,
        profilePic: profileImage,
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Error updating profile.");
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
      await axios.put("/auth/profile", {
        currentPassword,
        newPassword,
      });

      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Failed to update password.");
    }
  };

  return (
<div className="flex flex-col items-center -mt-72 p-6 w-full max-w-4xl mx-auto bg-white shadow-lg rounded-xl">
<h2 className="text-2xl font-bold text-gray-800">Account Settings</h2>

      <div className="flex w-full mt-6 border-b">
        <button
          className={`flex-1 py-3 text-lg font-semibold ${
            activeTab === "account-general"
              ? "border-b-4 border-[#17a2b8] text-[#17a2b8]"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("account-general")}
        >
          General
        </button>
        <button
          className={`flex-1 py-3 text-lg font-semibold ${
            activeTab === "account-change-password"
              ? "border-b-4 border-[#17a2b8] text-[#17a2b8]"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("account-change-password")}
        >
          Change Password
        </button>
      </div>

      <div className="w-full mt-6">
        {activeTab === "account-general" && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img
                src={profileImage || "/images/profile-bg.png"}
                alt="Profile"
                className="w-20 h-20 rounded-full border"
              />
              <label className="cursor-pointer bg-[#17a2b8] text-white px-4 py-2 rounded-md">
                Upload New Photo
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">Name</label>
              <input
                type="text"
                className="w-full p-3 border rounded-md bg-gray-100"
                value={name}
                disabled
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">Email</label>
              <input
                type="text"
                className="w-full p-3 border rounded-md bg-gray-100"
                value={email}
                disabled
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">
                Country
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-md"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">
                Language
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-md"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
            </div>

            <button
              className="w-full bg-[#17a2b8] text-white py-3 rounded-md font-semibold hover:bg-[#17a2b8]"
              onClick={handleSaveChanges}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        {activeTab === "account-change-password" && (
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold">
                Current Password
              </label>
              <input
                type="password"
                className="w-full p-3 border rounded-md"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">
                New Password
              </label>
              <input
                type="password"
                className="w-full p-3 border rounded-md"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">
                Confirm New Password
              </label>
              <input
                type="password"
                className="w-full p-3 border rounded-md"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              className="w-full bg-[#17a2b8] text-white py-3 rounded-md font-semibold hover:bg-[#17a2b8]"
              onClick={handleSavePasswordChange}
            >
              Save Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHero;
