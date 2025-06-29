import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { FaBars } from "react-icons/fa";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [claims, setClaims] = useState([]);
  const [users, setUsers] = useState([]);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClaims: 0,
    factCheckers: 0,
    reporters: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingClaims, setLoadingClaims] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

useEffect(() => {
  const fetchData = async () => {
    try {
      const statsRes = await fetch('http://localhost:5000/api/admin/stats');
      const statsData = await statsRes.json();
      setStats(statsData);

      const usersRes = await fetch('http://localhost:5000/api/admin/users');
      const usersData = await usersRes.json();
      setUsers(usersData);

      const claimsRes = await fetch('http://localhost:5000/api/admin/claims');
      const claimsData = await claimsRes.json();
      setClaims(claimsData);
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
        {/* Top bar */}
        <div className="flex items-center p-4 shadow bg-white">
          <button className="text-2xl mr-4" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Analytics Cards */}
          {loadingStats ? (
            <p className="text-center text-gray-600">Loading stats...</p>
          ) : (
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-white p-4 shadow rounded-md text-center">
                <h3 className="text-lg font-semibold">Total Users</h3>
                <p className="text-2xl text-blue-600">{stats.totalUsers}</p>
              </div>
              <div className="bg-white p-4 shadow rounded-md text-center">
                <h3 className="text-lg font-semibold">Total Claims</h3>
                <p className="text-2xl text-blue-600">{stats.totalClaims}</p>
              </div>
              <div className="bg-white p-4 shadow rounded-md text-center">
                <h3 className="text-lg font-semibold">Fact-Checkers</h3>
                <p className="text-2xl text-blue-600">{stats.factCheckers}</p>
              </div>
              <div className="bg-white p-4 shadow rounded-md text-center">
                <h3 className="text-lg font-semibold">Reporters</h3>
                <p className="text-2xl text-blue-600">{stats.reporters}</p>
              </div>
            </section>
          )}

         <section className="mt-10">
  <h2 className="text-2xl font-semibold mb-4">Users</h2>
  <ul className="space-y-4">
    {users.map((user) => (
      <li key={user._id} className="bg-white shadow p-4 rounded">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Current Role:</strong> {user.role}</p>

        <div className="flex gap-4 items-center mt-2">
          <select
            className="border border-gray-300 rounded px-2 py-1"
            value={user.role}
            onChange={(e) => handleRoleChange(user._id, e.target.value)}
          >
            {["reader", "reporter", "fact-checker", "editor", "admin"].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <button
            onClick={() => handleRoleUpdate(user._id, user.role)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Update Role
          </button>
        </div>
      </li>
    ))}
  </ul>
</section>



          {/* Claims */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Claims</h2>
            {loadingClaims ? (
              <p className="text-center text-gray-600">Loading claims...</p>
            ) : claims.length === 0 ? (
              <p className="text-center text-gray-600">No claims found.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {claims.map((claim) => (
                  <div key={claim._id} className="bg-white shadow p-4 rounded-md">
                    <h3 className="font-bold text-lg">{claim.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Status: {claim.status}
                    </p>
                    <div className="flex gap-2">
                      <button className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600">
                        Assign
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
