// src/pages/FactCheckerDashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReaderSidebar from "../components/ReaderSidebar";
import { FaBars } from "react-icons/fa";
import UserProfileCard from "../components/UserProfile";

const ReaderDashboard = () => {
    const [user, setUser] = useState(null);
  const [isReaderSidebarOpen, setReaderSidebarOpen] = useState(false);

  const toggleSidebar = () => setReaderSidebarOpen((prev) => !prev);
 useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <ReaderSidebar isOpen={isReaderSidebarOpen} onClose={() => setReaderSidebarOpen(false)} />

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="text-blue-800 text-2xl m-4 focus:outline-none"
      >
        <FaBars />
      </button>

      {/* Main Content */}
      <main
  className={`transition-all duration-300 ${
    isReaderSidebarOpen ? "ml-64" : "ml-0"
  } p-6 bg-blue-50 min-h-screen`}
>
  <div className="flex flex-col lg:flex-row gap-6">
    {/* Left Section */}
    <div className="flex-1 space-y-6">
      
      {user && (
  <div className="mb-6">
    <UserProfileCard user={user} />
  </div>
)}
    </div>
  </div>
</main>
    </div>
  );
};

export default ReaderDashboard;
