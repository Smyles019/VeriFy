// src/components/AdminSidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";


const AdminSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
    const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // hard reload to login page
  };
  return (
     <div
  className={`absolute left-0 top-0 w-64 bg-white z-40 transform transition-transform duration-300 ease-in-out h-[calc(100vh-70px)] overflow-y-auto shadow-lg ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  }`}
>
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h2 className="text-lg font-bold text-blue-800">Admin Panel</h2>
        <button
          onClick={onClose}
          className="text-xl text-gray-700"
        >
          <FaTimes />
        </button>
      </div>
      <nav className="p-4 flex flex-col space-y-4">
        <Link to="/adminDashboard" className="hover:text-blue-300">Account</Link>
        <Link to="/admin/users" className="hover:text-blue-300">Users</Link>
        <Link to="/admin/articles" className="hover:text-blue-300">Articles</Link>
         <Link to="/admin/claims" className="hover:text-blue-300">Claims</Link>
          <Link to="/admin/flagged-articles" className="hover:text-blue-300">Flagged articles</Link>
        <Link to="/admin/applications" className="hover:text-blue-300">Reporter applications</Link>
        <Link to="logout" onClick={handleLogout} className="hover:text-blue-300">Logout</Link>
      </nav>
    </div>
  );
};

export default AdminSidebar;
