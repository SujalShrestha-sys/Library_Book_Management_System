import React, { useState, useEffect } from "react";
import { Bell, ChevronDown, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const quotesList = [
  "Knowledge is power.",
  "A room without books is like a body without a soul.",
  "The more that you read, the more things you will know.",
  "Reading is essential for those who seek to rise above the ordinary.",
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Cycle quotes with fade effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % quotesList.length);
        setFade(true);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center px-6 py-3 bg-white border-b border-gray-200 relative">
      {/* Motivational Quote */}
      <div className="flex-1 text-left">
        <p
          className={`text-gray-600 italic text-sm sm:text-base transition-opacity duration-300 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          "{quotesList[currentQuoteIndex]}"
        </p>
      </div>

      <div className="flex items-center gap-4 relative">
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
          <Bell className="w-5 h-5 text-gray-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
        </button>

        {/* Profile dropdown */}
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-gray-100 transition cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden text-sm font-semibold text-gray-700">
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              user?.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />
            )}
          </div>

          <div className="flex flex-col text-left">
            <span className="text-gray-800 font-medium text-sm">{user?.name}</span>
            <span className="text-gray-500 text-xs">{user?.email}</span>
          </div>

          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>

        {/* Dropdown card */}
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden z-50 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden text-sm font-semibold text-gray-700">
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-gray-800 font-medium text-sm">{user?.name}</span>
                <span className="text-gray-500 text-xs">{user?.email}</span>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
