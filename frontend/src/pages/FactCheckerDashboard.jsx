// src/pages/FactCheckerDashboard.jsx
import { useEffect, useState } from "react";

const FactCheckerDashboard = () => {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    const fetchClaims = async () => {
      const res = await fetch("http://localhost:5000/api/claims/pending");
      const data = await res.json();
      setClaims(data);
    };

    fetchClaims();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white p-6 space-y-6">
        <img src="/assets/logo.png" alt="Logo" className="w-12 h-12 mx-auto" />
        <nav className="flex flex-col gap-4 mt-4 font-medium">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Claims</a>
          <a href="#" className="hover:underline">Profile</a>
          <a href="#" className="hover:underline">Log Out</a>
        </nav>
      </div>

      {/* Main Area */}
      <div className="flex-1 bg-gray-100">
        {/* Top Navbar */}
        <div className="bg-blue-800 text-white py-3 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">VeriFy</h1>
          {/* Removed subscribe and sign in */}
          <div></div>
        </div>

        {/* Category Links */}
        <div className="bg-gray-100 border-b text-sm px-6 py-2 flex gap-6 font-semibold">
          <a href="#" className="hover:underline">LATEST</a>
          <a href="#" className="hover:underline">POLITICS</a>
          <a href="#" className="hover:underline">HEALTH</a>
          <a href="#" className="hover:underline">BUSINESS</a>
          <a href="#" className="hover:underline">ENTERTAINMENT</a>
          <a href="#" className="hover:underline">SPORTS</a>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Claims to Review</h2>
          </div>

          {claims.length === 0 ? (
            <p className="text-gray-600">No claims pending review.</p>
          ) : (
            <div className="space-y-4">
              {claims.map((claim) => (
                <div
                  key={claim._id}
                  className="bg-blue-100 px-4 py-3 rounded flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{claim.text}</p>
                    <p className="text-sm text-gray-600">Submitted by: {claim.userEmail}</p>
                  </div>
                  <div className="space-x-3">
                    <button className="text-blue-800 hover:text-blue-900">✏️ Review</button>
                    <button className="text-red-600 hover:text-red-800">🗑️ Dismiss</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FactCheckerDashboard;
