// src/components/admin/AdminClaimList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { FaBars } from "react-icons/fa";

const AdminClaimList = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/claims", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClaims(res.data);
      } catch (err) {
        console.error("Failed to fetch claims:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  if (loading) return <p className="p-4">Loading claims...</p>;

  // Filter claims based on dropdown
  const filteredClaims =
    filterStatus === "All"
      ? claims
      : claims.filter((claim) => claim.status === filterStatus);

  return (
    <div className="relative min-h-screen bg-gray-100 font-sans flex flex-col">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="text-blue-800 text-2xl m-4 focus:outline-none"
      >
        <FaBars />
      </button>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } p-6 bg-blue-50 min-h-screen`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Claims</h1>

            {/* Filter Dropdown */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border rounded bg-white"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Reviewing">Reviewing</option>
              <option value="Reviewed">Reviewed</option>
            </select>
          </div>

          {/* Claims List */}
          <div className="space-y-4">
            {filteredClaims.length === 0 ? (
              <p className="text-gray-500">No claims found.</p>
            ) : (
              filteredClaims.map((claim) => (
                <div
                  key={claim._id}
                  className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition"
                >
                  <h2 className="text-lg font-semibold">{claim.title}</h2>
                  <p className="text-sm text-gray-600 mb-2">
                    Submitted by: {claim.submittedBy?.email || "Unknown"} <br />
                    Submitted at: {new Date(claim.submittedAt).toLocaleString()} <br />
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        claim.status === "approved"
                          ? "text-green-600"
                          : claim.status === "rejected"
                          ? "text-red-600"
                          : claim.status === "reviewing"
                          ? "text-blue-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {claim.status}
                    </span>
                  </p>

                  {claim.tags?.length > 0 && (
                    <div className="mb-2">
                      {claim.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="inline-block bg-blue-100 text-blue-600 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div
                    className="text-gray-800 mt-2"
                    dangerouslySetInnerHTML={{
                      __html:
                        claim.content?.length > 200
                          ? claim.content.slice(0, 200) + "..."
                          : claim.content || "<i>No content</i>",
                    }}
                  />

                  {/* Optional view button */}
                  {/* 
                  <div className="mt-4">
                    <button
                      onClick={() => navigate(`/admin/claims/${claim._id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      View Full
                    </button>
                  </div> 
                  */}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminClaimList;
