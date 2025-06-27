// src/pages/ReviewClaim.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ReviewClaim = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [verdict, setVerdict] = useState("");
  const [sources, setSources] = useState("");

  useEffect(() => {
    const fetchClaim = async () => {
      const res = await fetch(`http://localhost:5000/api/claims/${id}`);
      const data = await res.json();
      setClaim(data);
    };
    fetchClaim();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5000/api/claims/${id}/verdict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verdict, sources }),
    });

    if (res.ok) {
      alert("Verdict submitted");
      navigate("/dashboard/reviewer");
    } else {
      alert("Failed to submit verdict");
    }
  };

  if (!claim) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{claim.title}</h1>
      <p className="mb-4">{claim.content}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={verdict}
          onChange={(e) => setVerdict(e.target.value)}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select Verdict</option>
          <option value="true">True</option>
          <option value="false">False</option>
          <option value="misleading">Misleading</option>
          <option value="commentary">Commentary</option>
        </select>

        <textarea
          placeholder="Sources / Notes"
          value={sources}
          onChange={(e) => setSources(e.target.value)}
          className="w-full p-2 border rounded"
          rows="4"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Verdict
        </button>
      </form>
    </div>
  );
};

export default ReviewClaim;
