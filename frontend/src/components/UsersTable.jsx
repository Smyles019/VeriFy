import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AdminSidebar from '../components/AdminSidebar'
import { FaBars } from 'react-icons/fa'
import { ToastContainer } from 'react-toastify';


const UsersTable = () => {
  const [users, setUsers] = useState([])
  const [isAdminSidebarOpen, setAdminSidebarOpen] = useState(false);
  
    const toggleSidebar = () => setAdminSidebarOpen((prev) => !prev);


useEffect(() => {
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token"); 
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("✅ Real data:", res.data)
      setUsers(res.data)
    } catch (err) {
      console.error('🔥 API call failed:', err)
      setUsers([])
    }
  }

  fetchUsers()
}, [])

const handleRoleChange = async (userId, newRole) => {
  try {
    const token = localStorage.getItem("token");

await axios.put(
  `http://localhost:5000/api/users/${userId}/role`,
  { role: newRole },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
    console.log('✅ Role updated successfully')
  } catch (err) {
    console.error('❌ Failed to update role:', err)
    toast.error('Failed to update role');
  }
}

const handleDeleteUser = async (userId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this user?")
  if (!confirmDelete) return

  try {
    const token = localStorage.getItem("token");

await axios.delete(`http://localhost:5000/api/users/${userId}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
    setUsers(prevUsers => prevUsers.filter(user => user._id !== userId))
    console.log('🗑️ User deleted successfully')
  } catch (err) {
    console.error('❌ Error deleting user:', err.response?.data || err.message)
    toast.error('Failed to delete user');
  }
}


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
     <main
  className={`transition-all duration-300 ${
    isAdminSidebarOpen ? "ml-64" : "ml-0"
  } p-6 bg-blue-50 min-h-screen`}
>
  <div className="flex flex-col lg:flex-row gap-6">

    <div className="flex-1 p-4">
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">
  {user.firstName || user.lastName
    ? `${user.firstName?.[0]?.toUpperCase() + user.firstName?.slice(1) || ''} ${user.lastName?.[0]?.toUpperCase() + user.lastName?.slice(1) || ''}`.trim()
    : '—'}
</td>

                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.phone || '-'}</td> {/* Add this */}
                <td className="px-6 py-4 whitespace-nowrap">
  <select
    value={user.role}
    onChange={(e) => handleRoleChange(user._id, e.target.value)}
    className="border border-gray-300 rounded px-2 py-1 text-sm"
  >
    <option value="reader">Reader</option>
    <option value="reporter">Reporter</option>
    <option value="fact-checker">Fact Checker</option>
    <option value="editor">Editor</option>
    <option value="admin">Admin</option>
  </select>
</td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {user.active ? (
                    <span className="text-green-600 font-medium">Active</span>
                  ) : (
                    <span className="text-red-600 font-medium">Inactive</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button
  onClick={() => handleDeleteUser(user._id)}
  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
>
  Delete
</button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    </main>
  </div>
  )
}

export default UsersTable
