import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import UsersTable from "../components/UsersTable";
import { FaBars } from "react-icons/fa";
import UserProfileCard from "../components/UserProfile";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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
      alert("Role updated successfully!");
    } else {
      alert("Failed to update role: " + data.message);
    }
  } catch (err) {
    console.error("Error updating role:", err);
    alert("Server error");
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
    <div className="flex flex-1">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div
        className={`flex-1 min-h-screen bg-gray-100 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      > 
        
        {/* Dashboard Content */}
        <div className="p-6">
        {user && (
          <div className="mb-6">
             <UserProfileCard user={user} />
                 </div>
        )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
