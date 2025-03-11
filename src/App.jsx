import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SingUpPage from "./pages/SingUpPage";

import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import MainPage from "./pages/MainPage";
import MyProfile from "./pages/MyProfile";

import CardPage from "./pages/CardPage";
import { useEffect } from "react";
import MyCardPage from "./pages/MyCardPage";
import MessagesPage from "./pages/MessagesPage";

import ChatPage from "./components/ChatPag";

function App() {
  const { user } = useUserStore();

  useEffect(() => {
    useUserStore.getState().checkAuth(); // Chamando diretamente evita re-render desnecessário
  }, []);
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={user ? <MainPage /> : <LoginPage />} />
        <Route path="/signup" element={<SingUpPage />} />
        <Route path="/myProfile" element={<MyProfile />} />
        <Route path="/mainPage" element={<MainPage />} />
        <Route path="/card/:id" element={<CardPage />} />
        <Route path="/myCard" element ={<MyCardPage />} />
        <Route path="/messages" element ={<MessagesPage />} />
        <Route path="/chat/:id" element ={<ChatPage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
