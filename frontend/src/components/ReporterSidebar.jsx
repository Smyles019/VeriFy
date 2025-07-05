// src/components/Sidebar.jsx
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import React from "react";


const ReporterSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login'; // hard reload to login page
};

  return (
    <div
      className={`absolute left-0 top-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ${
    isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h2 className="text-lg font-bold text-blue-800">Menu</h2>
        <button onClick={onClose}>
          <FaTimes className="text-xl text-gray-700" />
        </button>
      </div>
      <ul className="p-4 space-y-4">
        <li><a href="/" className="text-blue-700 hover:underline">Home</a></li>
        <li><a href="/reporterdashboard" className="text-blue-700 hover:underline">Account</a></li>
        <li><a href="#" className="text-blue-700 hover:underline">My Articles</a></li>
        <li><a href="/myclaims" className="text-blue-700 hover:underline">My Claims</a></li>
        <li><a href="/login" onClick={handleLogout} className="text-blue-700 hover:underline">Logout</a></li>
        <li><a href="/help" className="text-blue-700 hover:underline">Help</a></li>


      </ul>
    </div>
  );
};

export default ReporterSidebar;
