import { useState } from 'react'
import { FaEdit, FaTrashAlt, FaBars } from 'react-icons/fa'
import logo from '../assets/logo1.png'
import { Link } from 'react-router-dom';

const drafts = [
  "Robbery attempt in Ngara Road",
  "Outbreak of mysterious illness in the coastal region",
  "Fuel prices reported to increase this month"
];


const ReporterDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

 return (
    <div className="relative min-h-screen font-sans">
      {/* Hamburger Button */}
      <button
        className="fixed top-4 left-4 z-40 text-blue-800 text-2xl"
        onClick={() => setSidebarOpen(true)}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-blue-800 text-white flex flex-col z-30 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex items-center justify-center h-16 border-b border-blue-700">
          <img className='w-12'src={logo}/>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-4">
          <Link to="/" className="block hover:bg-blue-700 rounded px-3 py-2">Home</Link>
          <a href="#" className="block hover:bg-blue-700 rounded px-3 py-2">My Articles</a>
          <a href="#" className="block hover:bg-blue-700 rounded px-3 py-2">Claims</a>
          <a href="#" className="block hover:bg-blue-700 rounded px-3 py-2">Profile</a>
          <a href="#" className="block hover:bg-blue-700 rounded px-3 py-2">Log Out</a>
        </nav>
      </div>

      {/* Overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="md:ml-64 p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your drafts</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + New Article
          </button>
        </div>

        <div className="space-y-4">
          {drafts.map((title, idx) => (
            <div key={idx} className="bg-blue-100 px-4 py-3 rounded flex justify-between items-center">
              <p>{title}</p>
              <div className="space-x-4">
                <button className="text-gray-700 hover:text-blue-800">
                  <FaEdit />
                </button>
                <button className="text-gray-700 hover:text-red-600">
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};


export default ReporterDashboard