
import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="w-full bg-white shadow-md ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                M
              </span>
            </div>

            <h1 className="text-xl font-bold text-gray-800">
              Mail Sender
            </h1>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">


            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500
              hover:bg-red-600 text-white font-medium transition"
            >
              Logout
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


