import React, { useState, useRef, useEffect } from 'react';
import { FaEdit, FaCamera } from 'react-icons/fa';

const UserProfile = () => {
  const fileInputRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profilePicUrl: '',
  });

  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('User fetch failed');
        const data = await res.json();
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          profilePicUrl: data.profilePicUrl || '',
          role: data.role || '',
        });
        if (data.profilePicUrl) {
          setProfilePic(`http://localhost:5000/${data.profilePicUrl}`);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageFormData = new FormData();
    imageFormData.append('profilePic', file);
    try {
      const res = await fetch('http://localhost:5000/api/users/upload-profile-pic', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: imageFormData,
      });
      const data = await res.json();
      if (res.ok) {
        const fullUrl = `http://localhost:5000/${data.profilePicUrl}`;
        setProfilePic(fullUrl);
        setFormData((prev) => ({
          ...prev,
          profilePicUrl: data.profilePicUrl,
        }));
      } else {
        console.error('Image upload failed:', data.message);
      }
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  const removeImage = () => {
    setProfilePic(null);
    setFormData((prev) => ({ ...prev, profilePicUrl: '' }));
  };

  const handleSave = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) setEditMode(false);
      else console.error('Profile update failed');
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleTagColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-600';
      case 'editor':
        return 'bg-indigo-100 text-indigo-600';
      case 'fact-checker':
        return 'bg-blue-100 text-blue-600';
      case 'reporter':
        return 'bg-emerald-100 text-emerald-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 px-6 py-8 bg-white rounded-3xl shadow-2xl border border-slate-100">
      <h2 className="text-3xl font-semibold text-center text-slate-800 mb-8">Account Settings</h2>

      {/* Profile Pic */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-36 h-36 rounded-full overflow-hidden shadow-lg ring-4 ring-slate-200">
          {profilePic ? (
            <img
              src={profilePic}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={() => setProfilePic(null)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-500">
              <FaCamera size={30} />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-3 right-4 bg-white text-slate-600 p-1 rounded-full shadow hover:bg-slate-100 transition"
            title="Change Photo"
          >
            <FaEdit size={18} />
          </button>
        </div>

        {formData.role && (
          <span
            className={`mt-3 px-4 py-1 text-sm font-medium rounded-full ${getRoleTagColor(
              formData.role
            )}`}
          >
            {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
          </span>
        )}

        {profilePic && (
          <button
            onClick={removeImage}
            className="mt-2 text-sm text-red-500 hover:underline"
          >
            Remove Photo
          </button>
        )}
      </div>

      {/* Inputs */}
      <div className="space-y-5">
        {['firstName', 'lastName', 'email', 'phone'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              {field === 'firstName'
                ? 'First Name'
                : field === 'lastName'
                ? 'Last Name'
                : field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              disabled={!editMode}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                editMode
                  ? 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              } transition`}
            />
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="mt-8 flex justify-center space-x-4">
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-5 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="px-5 py-2 bg-gray-400 text-white rounded-full hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
