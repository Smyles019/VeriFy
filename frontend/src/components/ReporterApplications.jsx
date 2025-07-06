import { useEffect, useState } from "react";
import axios from 'axios'
import AdminSidebar from '../components/AdminSidebar'
import { FaBars } from 'react-icons/fa'

const ReaderApplications = () => {
  const [applications, setApplications] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAdminSidebarOpen, setAdminSidebarOpen] = useState(false);
    
  const toggleSidebar = () => setAdminSidebarOpen((prev) => !prev);
  

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:5000/api/applications/reader", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setApplications(data);
    };
    fetchData();
  }, []);

  const filtered = statusFilter === "all"
    ? applications
    : applications.filter((app) => app.status === statusFilter);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/applications/reader/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      // update state locally
      setApplications((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 font-sans flex flex-col">
      {/* Sidebar */}
      <AdminSidebar isOpen={isAdminSidebarOpen} onClose={() => setAdminSidebarOpen(false)} />

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="text-blue-800 text-2xl m-4 focus:outline-none"
      >
        <FaBars />
      </button>
     <main
  className={`transition-all duration-300 ${
    isAdminSidebarOpen ? "ml-64" : "ml-0"
  } p-6 bg-blue-50 min-h-screen`}
>
  <div className="flex flex-col lg:flex-row gap-6">

    <div className="flex-1 p-4">
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Reporter Applications</h2>

      {/* Filter Tabs */}
      <div className="flex gap-3 mb-6">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-1 rounded-md border text-sm ${
              statusFilter === status
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 border-blue-600"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Application List */}
      <div className="space-y-4">
        {filtered.map((app) => (
          <div
            key={app._id}
            className="bg-white border rounded-lg p-4 shadow-sm"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() =>
                setExpandedId(expandedId === app._id ? null : app._id)
              }
            >
              <p className="font-semibold">
                {app.user?.firstName} {app.user?.lastName} —{" "}
                <span
                  className={`capitalize ${
                    app.status === "approved"
                      ? "text-green-600"
                      : app.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {app.status}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                {new Date(app.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Expanded Details */}
            {expandedId === app._id && (
              <div className="mt-4 space-y-2 text-sm">
                <p><strong>Email:</strong> {app.user?.email}</p>
                <p><strong>Phone:</strong> {app.user?.phone || "—"}</p>
                <p><strong>Message:</strong> {app.message}</p>
                {app.document && (
  <a
    href={`http://localhost:5000/${app.document.replace(/\\/g, "/")}`}
    target="_blank"
    rel="noreferrer"
    className="text-blue-600 underline block mt-2"
  >
    View Supporting Document
  </a>
)}

                {/* Approve/Reject Buttons */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleStatusChange(app._id, "approved")}
                    disabled={app.status === "approved"}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(app._id, "rejected")}
                    disabled={app.status === "rejected"}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
  </div>
</main>
</div>
  );
};

export default ReaderApplications;
