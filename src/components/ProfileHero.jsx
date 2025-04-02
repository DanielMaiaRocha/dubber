import React, { useState, useEffect } from "react";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useCardStore } from "../stores/useCardStore";
import {
  User,
  MessageSquare,
  LogOut,
  X,
  Menu,
  ChevronDown,
  ChevronUp,
  Video,
  Upload,
  DollarSign,
  Globe,
  Languages,
  FileText,
  Briefcase,
  Mail,
  Save,
  Lock,
  Loader2,
  Info,
} from "lucide-react";

const Profile = () => {
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
  const [userData, setUserData] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const {
    userCard,
    fetchUserCard,
    clearUserCard,
    loading: cardLoading,
    createCard,
    updateCard,
  } = useCardStore();
  const [cardData, setCardData] = useState({
    role: "",
    shortDesc: "",
    desc: "",
    price: "",
    revisionNumber: 0,
    features: [],
    video: "",
  });
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [resetKey, setResetKey] = useState(0);

  const roles = [
    "Dubbing Actor",
    "Translator",
    "Dubbing Director",
    "Project Manager",
    "Dubbing Operator",
  ];

  useEffect(() => {
    const resetAllStates = () => {
      setName("");
      setEmail("");
      setCountry("");
      setLanguage("");
      setProfileImage(null);
      setUserData(null);
      setIsSeller(false);
      setCardData({
        role: "",
        shortDesc: "",
        desc: "",
        price: "",
        revisionNumber: 0,
        features: [],
        video: "",
      });
      setVideoFile(null);
      setVideoPreview(null);
      clearUserCard();
    };

    const fetchUserData = async () => {
      try {
        resetAllStates();
        const response = await axios.get("/auth/profile");
        const user = response.data;

        setUserData(user);
        setName(user.name);
        setEmail(user.email);
        setCountry(user.country || "");
        setLanguage(user.lang || "");
        setProfileImage(user.profilePic || null);
        setIsSeller(user.isSeller || false);

        if (user.isSeller) {
          await fetchUserCard();
        }
      } catch (error) {
        toast.error("Failed to load user data.");
      }
    };

    fetchUserData();
  }, [resetKey, fetchUserCard, clearUserCard]);

  useEffect(() => {
    if (userCard) {
      setCardData({
        role: userCard.role || "",
        shortDesc: userCard.shortDesc || "",
        desc: userCard.desc || "",
        price: userCard.price || "",
        revisionNumber: userCard.revisionNumber || 0,
        features: userCard.features || [],
        video: userCard.video?.[0]?.url || userCard.video || "",
      });
    } else {
      setCardData({
        role: "",
        shortDesc: "",
        desc: "",
        price: "",
        revisionNumber: 0,
        features: [],
        video: "",
      });
    }
  }, [userCard]);

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

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        toast.error("O arquivo de vídeo deve ter no máximo 100MB.");
        return;
      }

      setVideoFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setVideoPreview(reader.result);
      };
      reader.onerror = () => {
        toast.error("Failed to process video.");
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

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSaveCardChanges = async () => {
    if (
      !cardData.role ||
      !cardData.desc ||
      !cardData.shortDesc ||
      isNaN(cardData.price)
    ) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setLoading(true);
      
      const videoBase64 = videoFile ? await convertFileToBase64(videoFile) : cardData.video;
      
      const cardDataToSend = {
        title: userData.name,
        role: cardData.role,
        shortDesc: cardData.shortDesc,
        desc: cardData.desc,
        price: cardData.price,
        country: country || userData.country,
        lang: language || userData.lang,
        revisionNumber: cardData.revisionNumber,
        features: cardData.features,
        cover: profileImage,
        video: videoBase64
      };

      if (userCard) {
        await updateCard(userCard._id, cardDataToSend);
        toast.success("Card atualizado com sucesso!");
      } else {
        await createCard(cardDataToSend);
        toast.success("Card criado com sucesso!");
      }
      
      // Atualiza o estado do vídeo após o sucesso
      if (videoFile) {
        setCardData(prev => ({...prev, video: videoBase64}));
        setVideoFile(null);
        setVideoPreview(null);
      }
    } catch (error) {
      toast.error(error.message || "Erro ao salvar o card.");
      console.error("Detalhes do erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await axios.post("/auth/logout");
      setResetKey((prev) => prev + 1);
      navigate("/login");
    } catch (error) {
      toast.error("Error during logout");
    }
  };

  if (cardLoading || !userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-[#17a2b8]" size={48} />
      </div>
    );
  }

  return (
    <div
      key={resetKey}
      className="flex flex-col md:flex-row min-h-screen p-4 md:p-8 mt-40 md:mt-24"
    >
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden p-2 bg-[#17a2b8] text-white rounded-md mb-4 flex items-center gap-2"
      >
        {isMobileMenuOpen ? (
          <>
            <X size={20} />
            <span>Close Menu</span>
          </>
        ) : (
          <>
            <Menu size={20} />
            <span>Open Menu</span>
          </>
        )}
      </button>

      <aside
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-white rounded-lg shadow-md p-4 mb-4 md:mb-0 md:mr-4`}
      >
        <nav className="flex flex-col gap-3">
          <Link
            to="/myProfile"
            className="flex items-center p-2 text-gray-700 hover:bg-[#17a2b8] hover:text-white rounded-md transition-colors gap-2"
          >
            <User size={20} />
            <span className="text-lg">My Profile</span>
          </Link>
          <Link
            to="/chat"
            className="flex items-center p-2 text-gray-700 hover:bg-[#17a2b8] hover:text-white rounded-md transition-colors gap-2"
          >
            <MessageSquare size={20} />
            <span className="text-lg">Chats</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center p-2 text-gray-700 hover:bg-[#17a2b8] hover:text-white rounded-md transition-colors gap-2"
          >
            <LogOut size={20} />
            <span className="text-lg">Sign-out</span>
          </button>
        </nav>
      </aside>

      <div className="flex-1 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Account Settings
        </h2>

        <div className="flex w-full border-b">
          <button
            className={`flex-1 py-3 text-lg font-semibold flex items-center justify-center gap-2 ${
              activeTab === "account-general"
                ? "border-b-4 border-[#17a2b8] text-[#17a2b8]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("account-general")}
          >
            <User size={20} />
            General
          </button>
          <button
            className={`flex-1 py-3 text-lg font-semibold flex items-center justify-center gap-2 ${
              activeTab === "account-change-password"
                ? "border-b-4 border-[#17a2b8] text-[#17a2b8]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("account-change-password")}
          >
            <Lock size={20} />
            Password
          </button>
          {isSeller && (
            <button
              className={`flex-1 py-3 text-lg font-semibold flex items-center justify-center gap-2 ${
                activeTab === "my-card"
                  ? "border-b-4 border-[#17a2b8] text-[#17a2b8]"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("my-card")}
            >
              <Briefcase size={20} />
              My Card
            </button>
          )}
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
                <label className="cursor-pointer bg-[#17a2b8] text-white px-4 py-2 rounded-md flex items-center gap-2">
                  <Upload size={18} />
                  Upload New Photo
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold md:flex items-center gap-2">
                  <User size={18} />
                  Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-md bg-gray-100"
                  value={name}
                  disabled
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold md:flex items-center gap-2">
                  <Mail size={18} />
                  Email
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-md bg-gray-100"
                  value={email}
                  disabled
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold md:flex items-center gap-2">
                  <Globe size={18} />
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
                <label className="block text-gray-700 font-semibold md:flex items-center gap-2">
                  <Languages size={18} />
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
                className="w-full bg-[#17a2b8] text-white py-3 rounded-md font-semibold hover:bg-[#17a2b8] transition md:flex items-center justify-center gap-2"
                onClick={handleSaveChanges}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === "account-change-password" && (
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold md:flex items-center gap-2">
                  <Lock size={18} />
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
                <label className="block text-gray-700 font-semibold md:flex items-center gap-2">
                  <Lock size={18} />
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
                <label className="block text-gray-700 font-semibold md:flex items-center gap-2">
                  <Lock size={18} />
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
                className="w-full bg-[#17a2b8] text-white py-3 rounded-md font-semibold hover:bg-[#17a2b8] transition md:flex items-center justify-center gap-2"
                onClick={handleSavePasswordChange}
              >
                <Save size={20} />
                Save Password
              </button>
            </div>
          )}

          {activeTab === "my-card" && isSeller && (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1 md:flex items-center gap-2">
                  <User size={16} />
                  Card Title
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md bg-gray-100"
                  value={userData?.name || ""}
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1 md:flex items-center gap-2">
                  <Briefcase size={16} />
                  Role
                </label>
                <select
                  className="w-full p-2 border rounded-md bg-white"
                  value={cardData.role}
                  onChange={(e) =>
                    setCardData({ ...cardData, role: e.target.value })
                  }
                >
                  <option value="">Select your role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1 md:flex items-center gap-2">
                  <FileText size={16} />
                  Short Description
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={cardData.shortDesc}
                  onChange={(e) =>
                    setCardData({ ...cardData, shortDesc: e.target.value })
                  }
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1 md:flex items-center gap-2">
                  <FileText size={16} />
                  Description
                </label>
                <textarea
                  className="w-full p-2 border rounded-md h-24 resize-none"
                  value={cardData.desc}
                  onChange={(e) =>
                    setCardData({ ...cardData, desc: e.target.value })
                  }
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1 md:flex items-center gap-2">
                  <DollarSign size={16} />
                  Price
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  placeholder="Price per hour"
                  value={cardData.price}
                  onChange={(e) =>
                    setCardData({ ...cardData, price: e.target.value })
                  }
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1 md:flex items-center gap-2">
                  <Globe size={16} />
                  Country
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md bg-gray-100"
                  value={userData?.country || ""}
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1 md:flex items-center gap-2">
                  <Languages size={16} />
                  Language
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md bg-gray-100"
                  value={userData?.lang || ""}
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1 md:flex items-center gap-2">
                  <Video size={16} />
                  Upload Video
                </label>
                <label className="w-full p-2 border rounded-md flex items-center gap-2 cursor-pointer">
                  <Upload size={16} />
                  <span>Choose video file</span>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoUpload}
                  />
                </label>
                {videoPreview && (
                  <div className="mt-2">
                    <video controls className="w-full rounded-md">
                      <source src={videoPreview} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                      <Info size={14} />
                      File size: {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>

              {cardData.video && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1 md:flex items-center gap-2">
                    <Video size={16} />
                    Current Video
                  </label>
                  <div className="mb-2">
                    <video controls className="w-full rounded-md">
                      <source src={cardData.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <button
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                      onClick={() => setCardData({...cardData, video: ""})}
                    >
                      Remove Video
                    </button>
                  </div>
                </div>
              )}

              <button
                className="w-full bg-[#17a2b8] text-white py-3 rounded-md font-semibold hover:bg-[#17a2b8] transition flex items-center justify-center gap-2"
                onClick={handleSaveCardChanges}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;