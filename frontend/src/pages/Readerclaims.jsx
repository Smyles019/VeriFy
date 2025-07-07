import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBars } from "react-icons/fa";
import ReaderSidebar from "../components/ReaderSidebar";
import SubmitClaim from "../components/Submitclaim";

const ReaderClaims = () => {
  const [claims, setClaims] = useState([]);
  const [isReaderSidebarOpen, setReaderSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggleSidebar = () => setReaderSidebarOpen((prev) => !prev);

  useEffect(() => {
  const fetchMyClaims = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/claims/my-claims", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setClaims(res.data);
    } catch (error) {
      console.error("Error fetching your claims:", error);
    }
  };

  fetchMyClaims();
}, []);

  return (
    <div className="relative min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <ReaderSidebar
        isOpen={isReaderSidebarOpen}
        onClose={() => setReaderSidebarOpen(false)}
      />

      {/* Top bar with toggle */}
      <div className="p-4">
        <button
          onClick={toggleSidebar}
          className="text-blue-800 text-2xl mb-4 focus:outline-none"
        >
          <FaBars />
        </button>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${isReaderSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="flex flex-col md:flex-row justify-between bg-slate-100 min-h-screen p-6 gap-6">
          <div className="w-full md:w-2/3 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">📝 My Claims</h2>
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                + Submit Claim
              </button>
            </div>

            {/* Claims List */}
            {claims.length === 0 ? (
              <p className="text-gray-600">You haven’t submitted any claims yet.</p>
            ) : (
              <div className="space-y-4">
                {claims.map((claim) => (
            <div
  key={claim._id}
  className="bg-white p-4 shadow rounded-lg border border-gray-200"
>
  <h3 className="font-bold text-lg">{claim.title}</h3>
  <p className="text-sm text-gray-700 mb-2">{claim.content}</p>

  <span
    className={`inline-block px-2 py-1 text-sm font-medium rounded-full ${
      claim.status === "Reviewed"
        ? "bg-green-100 text-green-700"
        : claim.status === "Processing"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-gray-100 text-gray-700"
    }`}
  >
    {claim.status}
  </span>

  {/* Review Details */}
  {claim.status === "Reviewed" && (
    <div className="mt-4 bg-gray-50 border-l-4 border-green-500 p-3 rounded">
      <h4 className="font-semibold text-green-800 mb-2">Review Summary</h4>

      {claim.verdict && (
        <p className="text-sm mb-1">
          <span className="font-medium">Verdict:</span> {claim.verdict}
        </p>
      )}

      {claim.notes && (
        <p className="text-sm mb-1">
          <span className="font-medium">Reviewer Notes:</span> {claim.notes}
        </p>
      )}

      {claim.sources && claim.sources.length > 0 && (
        <div className="text-sm mb-1">
          <span className="font-medium">Sources:</span>
          <ul className="list-disc list-inside text-blue-600 underline">
            {claim.sources.map((src, idx) => (
              <li key={idx}>
                <a href={src} target="_blank" rel="noopener noreferrer">
                  {src}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {claim.evidence && (
        <p className="text-sm text-blue-700 mt-2">
          <span className="font-medium">Evidence:</span>{" "}
          <a
            href={`http://localhost:5000/${claim.evidence}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View Attachment
          </a>
        </p>
      )}
    </div>
  )}
</div>

                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for submitting claim */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative">
            <button
              className="absolute top-2 right-4 text-xl font-bold text-gray-500 hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <SubmitClaim />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReaderClaims;
