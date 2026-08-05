import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, UserCircle } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-lg mb-6">
      {/* Left */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Dashboard
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {today}
        </p>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center bg-gray-100 dark:bg-slate-800 rounded-xl px-4 py-2 w-96">
        <Search className="w-5 h-5 text-gray-500" />

        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none ml-2 w-full text-gray-700 dark:text-white placeholder-gray-400"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <Bell
            onClick={() =>
              setShowNotifications(!showNotifications)
            }
            className="w-6 h-6 cursor-pointer text-gray-600 hover:text-indigo-600 transition"
          />

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border z-50">

              <div className="p-4 font-semibold border-b">
                Notifications
              </div>

              <div className="p-4 text-sm">
                ✅ New Order Received
              </div>

              <div className="p-4 text-sm border-t">
                📦 Product Updated Successfully
              </div>

              <div className="p-4 text-sm border-t">
                👤 New Customer Registered
              </div>

            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>

          <UserCircle
            onClick={() =>
              setShowProfile(!showProfile)
            }
            className="w-8 h-8 cursor-pointer text-indigo-600"
          />

          {showProfile && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border z-50">

              <button
                onClick={() => {
                  setShowProfile(false);
                  navigate("/profile");
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-t-2xl"
              >
                👤 My Profile
              </button>

              <button
                onClick={() => {
                  setShowProfile(false);
                  navigate("/settings");
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-100"
              >
                ⚙️ Settings
              </button>

              <button
                onClick={() => {
                  setShowProfile(false);
                  navigate("/login");
                }}
                className="w-full text-left px-4 py-3 text-red-500 hover:bg-gray-100 rounded-b-2xl"
              >
                🚪 Logout
              </button>

            </div>
          )}

        </div>

      </div>
    </header>
  );
};

export default Navbar;