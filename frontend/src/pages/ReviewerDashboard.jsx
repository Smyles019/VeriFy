import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ReviewerDashboard = () => {
  const [claims, setClaims] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/claims/pending");
        const data = await res.json();
        setClaims(data);
      } catch (err) {
        console.error("Error fetching claims", err);
      }
    };

    fetchClaims();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Reviewer Dashboard</h1>

      {claims.length === 0 ? (
        <p>No pending claims.</p>
      ) : (
        <div className="grid gap-4">
          {claims.map((claim) => (
            <div
              key={claim._id}
              className="bg-white shadow p-4 rounded border cursor-pointer hover:bg-blue-50 transition"
              onClick={() => navigate(`/review/${claim._id}`)}
            >
              <h2 className="text-xl font-semibold">{claim.title}</h2>
              <p className="text-gray-600">{claim.content.slice(0, 100)}...</p>
              <p className="text-sm text-gray-400 mt-1">Submitted by: {claim.author?.email || "Unknown"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewerDashboard;
