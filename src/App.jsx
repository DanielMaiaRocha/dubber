import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SingUpPage from "./pages/SingUpPage";

import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import MainPage from "./pages/MainPage";
import MyProfile from "./pages/MyProfile";
import MyCardPage from "./pages/MainPage";
import CardPage from "./pages/CardPage";
import { useEffect } from "react";
import MyCard from "./components/MyCard";

function App() {
  const { user } = useUserStore();

  const checkAuth = useUserStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={user ? <MainPage /> : <LoginPage />} />
        <Route path="/signup" element={<SingUpPage />} />
        <Route path="/myProfile" element={<MyProfile />} />
        <Route path="/myCard" element={<MyCard />} />
        <Route path="/mainPage" element={<MainPage />} />
        <Route path="/card/:id" element={<CardPage />} />
        <Route path="/myCard" element={<MyCardPage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
