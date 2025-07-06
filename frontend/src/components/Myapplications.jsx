import { useEffect, useState } from "react";
import ApplicationModal from "./ApplicationModal"; // 👈 adjust path if needed
import { useNavigate } from "react-router-dom";
import ReaderSidebar from '../components/ReaderSidebar';
import {FaBars } from 'react-icons/fa';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [isReaderSidebarOpen, setReaderSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
 
   const toggleSidebar = () => setReaderSidebarOpen((prev) => !prev);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await fetch("http://localhost:5000/api/applications/my-applications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setApplications(data);
    };
    fetchHistory();
  }, []);

  const mostRecent = applications[0];
  const canApply = applications.length === 0 || mostRecent?.status === "rejected";

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">My Reporter Applications</h2>
        {canApply && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Apply
          </button>
        )}
      </div>

      {applications.length === 0 ? (
        <p className="text-gray-600">You haven't applied yet.</p>
      ) : (
        <ul className="space-y-4">
          {applications.map((app) => (
            <li key={app._id} className="border p-4 rounded-md shadow-sm">
              <p><strong>Message:</strong> {app.message}</p>
              <p><strong>Status:</strong>{" "}
                <span className={`capitalize ${
                  app.status === "approved"
                    ? "text-green-600"
                    : app.status === "rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}>{app.status}</span>
              </p>
              <p className="text-sm text-gray-500">
                {new Date(app.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* 👇 Modal is here */}
      <ApplicationModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
              </div>
            </div>
          </div>
    

  );
};

export default MyApplications;
