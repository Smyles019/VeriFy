import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AdminSidebar from '../components/AdminSidebar';
import { FaBars } from 'react-icons/fa';

const FlaggedArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [isAdminSidebarOpen, setAdminSidebarOpen] = useState(false);
  const toggleSidebar = () => setAdminSidebarOpen((prev) => !prev);

  useEffect(() => {
    const fetchFlagged = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/articles/flagged", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setArticles(res.data);
      } catch (err) {
        console.error("Failed to load flagged articles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlagged();
  }, []);

  if (loading) return <div className="p-8">Loading flagged articles...</div>;

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
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🚩 Flagged Articles</h1>

      {articles.length === 0 ? (
        <p className="text-gray-600">No flagged articles found.</p>
      ) : (
        <ul className="space-y-4">
          {articles.map((article) => (
            <li key={article._id} className="bg-white p-4 rounded shadow">
              <Link
                to={`/article/${article._id}`}
                className="text-blue-600 font-semibold text-lg hover:underline"
              >
                {article.title}
              </Link>
              <p className="text-sm text-gray-500 mt-1">
                Submitted by {article.submittedBy} •{" "}
                {new Date(article.createdAt).toLocaleDateString("en-GB")}
              </p>
       <p className="mt-2 text-yellow-700 font-medium">
  🚩 {article.flagCount} flag{article.flagCount !== 1 && "s"}
 </p>

              <p className="mt-2 text-gray-700">{article.description?.slice(0, 150)}...</p>
            </li>
          ))}
        </ul>
      )}
      </div>
   </main>
  </div>
  );
};

export default FlaggedArticles;
