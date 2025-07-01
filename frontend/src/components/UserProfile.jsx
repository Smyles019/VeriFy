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

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch('http://localhost:5000/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('User fetch failed');

        const data = await response.json();

        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          profilePicUrl: data.profilePicUrl || '',
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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageFormData = new FormData();
    imageFormData.append('profilePic', file);

    try {
      const response = await fetch('http://localhost:5000/api/users/upload-profile-pic', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: imageFormData,
      });

      const data = await response.json();

      if (response.ok) {
        const fullUrl = `http://localhost:5000/${data.profilePicUrl}`;
        setProfilePic(fullUrl);

        // ✅ Update in formData so it's saved during Save
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
    setFormData((prev) => ({
      ...prev,
      profilePicUrl: '',
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setEditMode(false);
      } else {
        console.error('Profile update failed');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  console.log("PROFILE PIC VALUE:", profilePic);


  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">Account Settings</h2>

      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300">
         {profilePic ? (
  <img
    src={profilePic}
    alt="Profile"
    className="w-full h-full object-cover"
    onError={() => setProfilePic(null)}
  />
) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
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
  className="absolute bottom-3 right-5 bg-white rounded-full p-1 shadow hover:bg-gray-100"
  title="Change Photo"
>
  <FaEdit size={20} />
</button>

        </div>
        {profilePic && (
          <button onClick={removeImage} className="mt-2 text-sm text-red-500 hover:underline">
            Remove Photo
          </button>
        )}
      </div>

      {/* Form Inputs */}
      <div className="space-y-4">
        {['firstName', 'lastName', 'email', 'phone'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700">
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
              className={`mt-1 block w-full p-2 rounded-md border ${
                editMode ? 'border-gray-300' : 'border-transparent bg-gray-100'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-center space-x-4">
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Edit Profile
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
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
