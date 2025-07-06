import { useState, useEffect } from 'react';
import { FaBell, FaBars, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const ClaimDetails = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [allClaims, setAllClaims] = useState([]);

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

  // Categorize claims by status
  const newClaims = allClaims.filter((claim) => claim.status === 'Processing');
  const currentClaims = allClaims.filter((claim) => claim.status === 'Reviewing');
  const reviewedClaims = allClaims.filter((claim) => claim.status === 'Reviewed');

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

    // Refresh claims after update
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
    <div className="relative min-h-screen bg-gray-100 p-6 font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <button
        onClick={toggleSidebar}
        className="text-blue-800 text-2xl mb-4 focus:outline-none"
      >
        <FaBars />
      </button>

      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-100 p-4 font-sans">
          
          {/* 🟡 Current Claims */}
          <div className="bg-yellow-100 text-gray-800 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaSpinner className="text-yellow-500 animate-spin-slow" /> Current Claims
            </h3>
            <ul className="space-y-2 text-sm">
              {currentClaims.length === 0 ? (
                <li className="text-gray-600 italic">No claims under review.</li>
              ) : (
                currentClaims.map((claim) => (
                  <li key={claim._id}>
                    <Link
                      to={`/review/${claim._id}`}
                      className="underline hover:text-blue-600 transition"
                    >
                      {claim.title}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* 🔴 New Claims */}
          <div className="bg-blue-900 text-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaBell className="text-red-400" /> New Claims
            </h3>
            <ul className="space-y-2 text-sm">
              {newClaims.length === 0 ? (
                <li className="text-gray-300 italic">No new claims yet.</li>
              ) : (
                newClaims.map((claim) => (
                  <li key={claim._id}>
                    <Link
  to={`/review/${claim._id}`}
  onClick={() => handleClaimClick(claim._id, "Reviewing")} // ✅ fixed
  className="underline hover:text-yellow-300 transition"
>
  {claim.title}
</Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* 🟢 Reviewed Claims */}
          <div className="md:col-span-2 bg-green-100 text-gray-900 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaCheckCircle className="text-green-500" /> Reviewed Claims
            </h3>
            <ul className="space-y-2 text-sm">
              {reviewedClaims.length === 0 ? (
                <li className="text-gray-600 italic">No reviewed claims yet.</li>
              ) : (
                reviewedClaims.map((claim) => (
                  <li key={claim._id}>
                    <Link
                      to={`/review/${claim._id}`}
                      className="underline hover:text-green-700 transition"
                    >
                      {claim.title}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimDetails;
