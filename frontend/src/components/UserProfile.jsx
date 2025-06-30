// src/pages/AccountPage.jsx
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const roleColors = {
  admin: "bg-red-600",
  reporter: "bg-blue-600",
  "fact-checker": "bg-green-600",
  editor: "bg-purple-600",
  reader: "bg-gray-600",
};

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        firstName: storedUser.firstName || "",
        lastName: storedUser.lastName || "",
        phone: storedUser.phone || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setEditMode(false);
    alert("Profile updated (locally)!");
  };

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto my-10 bg-white p-8 rounded-lg shadow-md">
      {/* Avatar + Role */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
          <FaUserCircle className="text-6xl" />
        </div>
        <h2 className="text-2xl font-bold mt-4">
          {user.firstName} {user.lastName}
        </h2>
        <span className={`px-3 py-1 mt-2 rounded-full text-white text-sm capitalize ${roleColors[user.role] || "bg-gray-600"}`}>
          {user.role}
        </span>
      </div>

      {/* Info + Edit */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="font-medium">Email:</span>
          <span>{user.email}</span>
        </div>

        {editMode ? (
          <>
            <div className="flex justify-between">
              <label className="font-medium">First Name:</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="border px-2 py-1 rounded text-right"
              />
            </div>
            <div className="flex justify-between">
              <label className="font-medium">Last Name:</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="border px-2 py-1 rounded text-right"
              />
            </div>
            <div className="flex justify-between">
              <label className="font-medium">Phone:</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="border px-2 py-1 rounded text-right"
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between">
              <span className="font-medium">Phone:</span>
              <span>{user.phone || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Created:</span>
              <span> {user.createdAt && !isNaN(new Date(user.createdAt))
    ? new Date(user.createdAt).toDateString()
    : "N/A"}</span>
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 text-right">
        {editMode ? (
          <>
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded mr-2 hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
