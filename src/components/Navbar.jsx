import { LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";
import axios from "../lib/axios";

const Navbar = () => {
  const { user, logout, setUser } = useUserStore();
  const isAdmin = user?.role === "admin";

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("/images/profile-bg.png");

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get("/auth/profile");
      const userData = response.data;

      if (userData.profilePic) {
        setProfileImage(userData.profilePic);
      }

      setUser(userData);
    } catch (error) {
      console.error("Erro ao buscar os dados do usuário:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-white bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center">
          <Link to={user ? "/mainPage" : "/"}>
            <img src="/images/logo.png" width={70} height={70} alt="logo" />
          </Link>

          <nav className="flex flex-wrap items-center gap-4">
            <Link
              to={user ? "/mainPage" : "/"}
              className="text-gray-700 hover:text-gray-500 text-lg font-semibold transition duration-300 ease-in-out"
            >
              Home
            </Link>

            {user ? (
              <>
                <Link
                  to={"/myProfile"}
                  className="text-gray-700 hover:text-gray-500 text-lg font-semibold transition duration-300 ease-in-out"
                >
                  My Profile
                </Link>
                <Link
                  to={"/bookings"}
                  className="text-gray-700 hover:text-gray-500 text-lg font-semibold transition duration-300 ease-in-out"
                >
                  Bookings
                </Link>
                <Link
                  to={"/messages"}
                  className="text-gray-700 hover:text-gray-500 text-lg font-semibold transition duration-300 ease-in-out"
                >
                  Chat
                </Link>

                <div className="relative">
                  <button
                    onClick={toggleMenu}
                    className="flex items-center focus:outline-none"
                  >
                    <img
                      src={profileImage}
                      alt="User profile"
                      className="inline-block w-16 h-16 rounded-full group-hover:opacity-80"
                    />
                  </button>
                  {menuOpen && (
                    <div className="absolute flex flex-col justify-center items-center right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                      <Link
                        to="/editProfile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        Edit Profile
                      </Link>
                      <Link
                        to="/myProfile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                        }}
                        className="bg-[#17a2b8] hover:bg-[#468089] text-white py-2 px-4 rounded-md flex items-center justify-center transition duration-300 ease-in-out font-semibold mb-2"
                      >
                        <LogOut size={18} className="mr-1 mt-1" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to={"#about"}
                  className="text-gray-700 hover:text-gray-500 text-lg font-semibold transition duration-300 ease-in-out"
                >
                  About
                </Link>
                <Link
                  to={"#services"}
                  className="text-gray-700 hover:text-gray-500 text-lg font-semibold transition duration-300 ease-in-out"
                >
                  Services
                </Link>
                <Link
                  to={"#contact"}
                  className="text-gray-700 hover:text-gray-500 text-lg font-semibold transition duration-300 ease-in-out"
                >
                  Contact
                </Link>
                <Link
                  to={"/login"}
                  className="bg-[#17a2b8] hover:bg-[#468089] text-white py-2 px-4 rounded-md flex items-center justify-center transition duration-300 ease-in-out font-semibold"
                >
                  <LogIn className="mr-1 mt-1" size={16} />
                  Login
                </Link>
              </>
            )}
          </nav>

          {isAdmin && (
            <Link
              className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center"
              to={"/secret-dashboard"}
            >
              <Lock className="inline-block mr-1" size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
