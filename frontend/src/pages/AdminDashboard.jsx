import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { FaBars } from "react-icons/fa";
import UserProfileCard from "../components/UserProfile";
import { toast } from "react-toastify";



const AdminDashboard = () => { 
  const [users, setUsers] = useState([]);
 const [isAdminSidebarOpen, setAdminSidebarOpen] = useState(false);

  const toggleSidebar = () => setAdminSidebarOpen((prev) => !prev);

useEffect(() => {
  const fetchData = async () => {
    try {
    
      const usersRes = await fetch('http://localhost:5000/api/admin/users');
      const usersData = await usersRes.json();
      setUsers(usersData);

    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  fetchData();
}, []);

// Store updated roles in local state
const handleRoleChange = (userId, newRole) => {
  setUsers((prevUsers) =>
    prevUsers.map((u) =>
      u._id === userId ? { ...u, role: newRole } : u
    )
  );
};

const handleRoleUpdate = async (userId, newRole) => {
  try {
    const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Role updated successfully!");
    } else {
      toast.error("Failed to update role: " + data.message);
    }
  } catch (err) {
    console.error("Error updating role:", err);
    toast.error("Server error");
  }
};

  const [user, setUser] = useState(null);

useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
}, []);



  return (
    <div className="relative min-h-screen bg-gray-100 font-sans flex flex-col">
      {/* Sidebar */}
      <AdminSidebar isOpen={isAdminSidebarOpen} onClose={() => setAdminSidebarOpen(false)} />

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
    isAdminSidebarOpen ? "ml-64" : "ml-0"
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

export default AdminDashboard;
