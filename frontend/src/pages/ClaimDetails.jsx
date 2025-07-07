import { useState, useEffect } from 'react';
import { FaBell, FaBars, FaSpinner, FaCheckCircle, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const ClaimDetails = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [allClaims, setAllClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/claims', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setAllClaims(res.data);
      } catch (error) {
        console.error("Failed to fetch claims:", error);
      }
    };

    fetchClaims();
  }, []);

  const newClaims = allClaims.filter((claim) => claim.status === 'Processing');
  const currentClaims = allClaims.filter((claim) => claim.status === 'Reviewing');
  const reviewedClaims = allClaims.filter((claim) => claim.status === 'Reviewed');

  const fetchClaimDetails = async (claimId) => {
    try {
      setIsLoading(true);
      const res = await axios.get(`http://localhost:5000/api/claims/${claimId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSelectedClaim(res.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch claim details:", error);
      setIsLoading(false);
    }
  };

  const handleClaimClick = async (claimId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/claims/${claimId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const res = await axios.get("http://localhost:5000/api/claims", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAllClaims(res.data);
    } catch (err) {
      console.error("Failed to update claim status:", err);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 p-6 font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <button
        onClick={toggleSidebar}
        className="text-slate-700 text-2xl mb-4 focus:outline-none hover:text-slate-900 transition"
      >
        <FaBars />
      </button>

      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 🟡 Current Claims */}
          <div className="bg-white/90 backdrop-blur-md text-slate-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-yellow-600">
              <FaSpinner className="animate-spin-slow" /> Currently Reviewing
            </h3>
            <ul className="space-y-2 text-sm">
              {currentClaims.length === 0 ? (
                <li className="text-slate-400 italic">No claims under review.</li>
              ) : (
                currentClaims.map((claim) => (
                  <li key={claim._id}>
                    <Link
                      to={`/review/${claim._id}`}
                      className="block w-full text-left border border-yellow-500 text-yellow-700 font-medium px-4 py-2 rounded-full hover:bg-yellow-500 hover:text-white transition-all"
                    >
                      {claim.title}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* 🔴 New Claims */}
          <div className="bg-white/90 backdrop-blur-md text-slate-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-600">
              <FaBell className="text-red-500" /> New Claims
            </h3>
            <ul className="space-y-2 text-sm">
              {newClaims.length === 0 ? (
                <li className="text-slate-400 italic">No new claims yet.</li>
              ) : (
                newClaims.map((claim) => (
                  <li key={claim._id}>
                    <Link
                      to={`/review/${claim._id}`}
                      onClick={() => handleClaimClick(claim._id, "Reviewing")}
                      className="block w-full text-left border border-blue-500 text-blue-700 font-medium px-4 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-all"
                    >
                      {claim.title}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* 🟢 Reviewed Claims */}
          <div className="md:col-span-2 bg-white/80 backdrop-blur-md text-slate-700 p-6 rounded-2xl shadow-lg border border-green-200">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-600">
              <FaCheckCircle /> Reviewed Claims
            </h3>
            <ul className="space-y-2 text-sm">
              {reviewedClaims.length === 0 ? (
                <li className="text-slate-400 italic">No reviewed claims yet.</li>
              ) : (
                reviewedClaims.map((claim) => (
                  <li key={claim._id}>
                    <button
                      onClick={() => fetchClaimDetails(claim._id)}
                      className="block w-full text-left px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium opacity-80 hover:opacity-100"
                    >
                      {claim.title}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

        </div>
      </div>

{selectedClaim && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="relative w-full max-w-lg mx-4 md:mx-0 bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 animate-scaleIn">
      
      {/* Close Button */}
      <button
        onClick={() => setSelectedClaim(null)}
        className="absolute top-3 right-3 text-slate-600 hover:text-red-500 transition-all text-xl"
      >
        <FaTimes />
      </button>

      {/* Title */}
      <h2 className="text-xl font-bold text-green-700 mb-4">{selectedClaim.title}</h2>

      {/* Verdict Content */}
      {isLoading ? (
        <p className="text-slate-400 italic">Loading verdict...</p>
      ) : (
        <>
          <p className="text-slate-800 text-sm whitespace-pre-wrap leading-relaxed mb-4">
            {selectedClaim.verdict || "No verdict provided."}
          </p>

          {/* Edit Claim Button */}
          <button
            onClick={() => {
              setSelectedClaim(null);
              navigate(`/review/${selectedClaim._id}`);
            }}
            className="mt-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition-all"
          >
            Edit Claim
          </button>
        </>
      )}
    </div>
  </div>
)}


    </div>
  );
};

export default ClaimDetails;
