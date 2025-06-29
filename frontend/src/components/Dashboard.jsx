// src/components/DashboardLayout.jsx
import { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        !e.target.closest("#hamburger-icon")
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex relative">
      {/* Hamburger Icon */}
      <button
        id="hamburger-icon"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        className="absolute top-4 left-4 z-50 text-2xl p-2 bg-white rounded-lg shadow-md md:hidden"
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-40 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:flex`}
      >
        <div className="p-4 space-y-4">
          <h2 className="text-xl font-bold">Fact Checker</h2>
          <nav className="flex flex-col space-y-2">
            <a href="#" className="hover:text-yellow-300">Dashboard</a>
            <a href="#" className="hover:text-yellow-300">Claims</a>
            <a href="#" className="hover:text-yellow-300">Settings</a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen p-6 md:ml-64 bg-gray-100">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
