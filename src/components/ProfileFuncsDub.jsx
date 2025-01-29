import React from "react";

const activeLink =
  "flex bg-[#17a2b8] text-white font-semibold rounded-md p-1 hover:bg-[#468089]";
const inactiveLink = "flex hover:text-zinc-600";

const ProfileFuncsDub = () => {
  const handleSignOut = () => {
    // Adicione a lógica de sign-out aqui
    console.log("Sign-out action triggered");
    window.location.href = "/login"; // Redireciona para a página de login
  };

  const handleNavigation = (path) => {
    window.location.href = path; // Navegação usando window.location
  };

  return (
    <aside className="flex flex-auto mt-32 p-5 text-black">
      <nav className="flex flex-col gap-3">
        <div onClick={() => handleNavigation("/myProfile")} className={inactiveLink}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-7 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
          <span className="text-xl p-1">My Profile</span>
        </div>
        <div onClick={() => handleNavigation("/myCard")} className={inactiveLink}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              d="M22 12C22 8.22876 22 6.34315 20.8284 5.17157C19.6569 4 17.7712 4 14 4H10C6.22876 4 4.34315 4 3.17157 5.17157C2 6.34315 2 8.22876 2 12C2 15.7712 2 17.6569 3.17157 18.8284C4.34315 20 6.22876 20 10 20H14C17.7712 20 19.6569 20 20.8284 18.8284C21.4816 18.1752 21.7706 17.3001 21.8985 16"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M10 16H6"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M14 16H12.5"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-xl p-1">My Card</span>
        </div>
        <div onClick={() => handleNavigation("/dubsol")} className={activeLink}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-7 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.737 5.1a3.375 3.375 0 0 1 2.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 0 1 .9 2.7m0 0a3 3 0 0 1-3 3m0 3h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Zm-3 6h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Z"
            />
          </svg>
          <span className="text-xl p-1">Dubsol Infos</span>
        </div>
        <button onClick={handleSignOut} className={inactiveLink}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-7 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
          <span className="text-xl p-1">Sign-out</span>
        </button>
      </nav>
    </aside>
  );
};

export default ProfileFuncsDub;
