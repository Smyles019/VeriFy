// src/pages/FactCheckerDashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { FaBars } from "react-icons/fa";
import UserProfileCard from "../components/UserProfile";

const FactCheckerDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    const fetchClaims = async () => {
      
    };

    fetchClaims();
  }, []);

  const [user, setUser] = useState(null);

useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
}, []);


  return (
    <div className="relative min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

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
    isSidebarOpen ? "ml-64" : "ml-0"
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

export default FactCheckerDashboard;
