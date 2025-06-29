// src/pages/FactCheckerDashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { FaBars } from "react-icons/fa";

const FactCheckerDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/claims/pending");
        const data = await res.json();
        setClaims(data);
      } catch (error) {
        console.error("Failed to fetch claims:", error);
      }
    };

    fetchClaims();
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
      
      {/* 🔷 Current Claims */}
      <div className="bg-blue-100 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Current claims</h2>

        {claims.length === 0 ? (
          <p className="text-gray-500">No current claims available.</p>
        ) : (
          claims.slice(0, 2).map((claim, index) => (
            <div key={claim._id || index} className="flex justify-between items-center mb-2">
              <p>{claim.text}</p>
              <span className={`px-3 py-1 text-sm rounded-full ${
                index === 0
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-orange-100 text-orange-800"
              }`}>
                {index === 0 ? "Researching" : "Awaiting final verdict"}
              </span>
            </div>
          ))
        )}
      </div>

      {/* 🟩 Reviewed Claims */}
      <div className="bg-blue-200 p-6 rounded shadow">
        <h2 className="text-xl font-semibold text-green-800 mb-4">Reviewed claims</h2>

        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <span className="text-green-600 text-xl">✔️</span>
            <p>Claim finished review and submitted verdict on ...</p>
          </div>
        ))}

        <div className="text-center mt-4">
          <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">
            Load more
          </button>
        </div>
      </div>
    </div>

    {/* 🔔 New Claims Notification Panel */}
    <div className="w-full lg:w-[300px] bg-blue-800 text-white p-6 rounded-2xl shadow">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🔔</span>
        <h2 className="text-xl font-semibold">New Claims</h2>
      </div>

      <ul className="list-disc ml-6 space-y-2">
        <li>Claim submitted on ...</li>
        <li>Claim submitted on ...</li>
        <li>Claim submitted on ...</li>
        <li>Claim submitted on ...</li>
      </ul>
    </div>
  </div>
</main>
    </div>
  );
};

export default FactCheckerDashboard;
