// src/components/admin/ArticleList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from '../components/AdminSidebar'
import { FaBars } from 'react-icons/fa'

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdminSidebarOpen, setAdminSidebarOpen] = useState(false);
  const toggleSidebar = () => setAdminSidebarOpen((prev) => !prev);

  useEffect(() => {
    const fetchArticles = async () => {
       try {
      const token = localStorage.getItem("token"); 
      const res = await axios.get('http://localhost:5000/api/admin/articles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
        console.log("API response:", res.data);
        setArticles(res.data);
      } catch (err) {
        console.error("Failed to fetch articles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <p className="p-4">Loading articles...</p>;

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
    <div className="space-y-4">
      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        articles.map((article) => (
          <div
            key={article._id}
            className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">{article.title}</h2>
            <p className="text-sm text-gray-600 mb-2">
              Submitted by: {article.submittedBy || "Unknown"} <br />
              Submitted at: {new Date(article.submittedAt).toLocaleString()} <br />
              Status:{" "}
              <span
                className={`font-semibold ${
                  article.status === "approved"
                    ? "text-green-600"
                    : article.status === "rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {article.status}
              </span>
            </p>

            {article.tags?.length > 0 && (
              <div className="mb-2">
                {article.tags.map((tag, i) => (
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
                  article.content.length > 200
                    ? article.content.slice(0, 200) + "..."
                    : article.content,
              }}
            />

            <div className="mt-4 flex gap-4">
              <button className="text-blue-600 hover:underline">View Full</button>
            </div>
          </div>
        ))
      )}

    </div>
    </div>
    </main>
    </div>
  );
};

export default ArticleList;
