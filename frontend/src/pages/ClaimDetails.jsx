// src/components/ClaimReviewPage.jsx
import React from 'react';
import { FaBell } from 'react-icons/fa';
import { FaCheckCircle } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import { FaBars } from 'react-icons/fa';
import { useState, useEffect } from "react";

const ClaimDetails = () => {

    const [isSidebarOpen, setSidebarOpen] = useState(false);
    
      const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="relative min-h-screen bg-gray-100 p-6 font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

        

<button
  onClick={toggleSidebar}
  className="text-blue-800 text-2xl mb-4 focus:outline-none"
>
  <FaBars />
</button>
<div className={`transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
    <div className="flex flex-col md:flex-row justify-between bg-slate-100 min-h-screen p-6 gap-6 font-sans">
      
      {/* Left Side */}
      <div className="w-full md:w-2/3 space-y-6">
        {/* Current Claims */}
        <div className="bg-blue-100 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Current claims</h3>
          <div className="flex justify-between items-center py-2 border-b border-blue-200">
            <span>Claim on robbery attempt in Wananaga Road</span>
            <span className="bg-yellow-200 text-yellow-800 text-sm px-3 py-1 rounded-full">Processing</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span>Claim on new illness breakout in the coastal region</span>
            <span className="bg-orange-200 text-orange-800 text-sm px-3 py-1 rounded-full">Awaiting Final Verdict</span>
          </div>
        </div>

        {/* Reviewed Claims */}
        <div className="bg-blue-200 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-green-700 mb-4">Reviewed claims</h3>
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <span className="text-green-600 text-xl">✅</span>
              <span>Claim finished review and submitted verdict on ...</span>
            </div>
          ))}
          <button className="mt-4 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">Load more</button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/3 bg-blue-900 text-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-red-400 text-2xl">🔔</span> New Claims
        </h3>
        <ul className="list-disc pl-5 space-y-2">
          {[1, 2, 3, 4].map((_, i) => (
            <li key={i}>Claim submitted on ...</li>
          ))}
        </ul>
      </div>
    </div>
            </div>
    </div>

  );
};

export default ClaimDetails;
