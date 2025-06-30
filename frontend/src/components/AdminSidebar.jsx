// src/components/AdminSidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  return (
     <div
      className={`absolute top-20 left-0 bg-blue-900 text-white w-64 z-30 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out h-[calc(100vh-70px)] overflow-y-auto shadow-lg`}
    >
      {/* Exit Button (Sticky at top) */}
      <div className="sticky top-0 bg-blue-900 z-10 flex items-center justify-between p-4 border-b border-blue-700">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <button
          onClick={toggleSidebar}
          className="text-white hover:text-red-300"
        >
          <FaTimes />
        </button>
      </div>
      <nav className="p-4 flex flex-col space-y-4">
        <Link to="/adminDashboard" className="hover:text-blue-300">Account</Link>
        <Link to="/admin/users" className="hover:text-blue-300">Users</Link>
        <Link to="/admin/claims" className="hover:text-blue-300">Claims</Link>
        <Link to="/admin/fact-checkers" className="hover:text-blue-300">Fact Checkers</Link>
        <Link to="/admin/reporters" className="hover:text-blue-300">Reporters</Link>
      </nav>
    </div>
  );
};

export default AdminSidebar;
