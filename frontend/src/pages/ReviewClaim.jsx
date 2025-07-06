import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";

const verdictColors = {
  True: "bg-green-100 text-green-800",
  False: "bg-red-100 text-red-800",
  Misleading: "bg-yellow-100 text-yellow-800",
  Satire: "bg-purple-100 text-purple-800",
  Commentary: "bg-gray-200 text-gray-800",
};

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Reviewed: "bg-green-100 text-green-800",
  Reviewing: "bg-gray-200 text-gray-800",
};

const ClaimReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [claim, setClaim] = useState(null);
  const [article, setArticle] = useState(null);

  const [verdict, setVerdict] = useState("");
  const [status, setStatus] = useState("Pending");
  const [sources, setSources] = useState([""]);
  const [notes, setNotes] = useState("");
  const [evidence, setEvidence] = useState(null);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/claims/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setClaim(res.data);

        if (res.data.article) {
          const articleRes = await axios.get(
            `http://localhost:5000/api/articles/${res.data.article}`
          );
          setArticle(articleRes.data);
          console.log("Claim data:", res.data);
        }
      } 
      catch (err) {
        console.error("Failed to fetch claim or article:", err);
      }
    };

    fetchClaim();
    console.log("Fetched article:", article);
  }, [id]);

  const handleAddSource = () => {
    setSources([...sources, ""]);
  };

  const handleSourceChange = (index, value) => {
    const updated = [...sources];
    updated[index] = value;
    setSources(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("verdict", verdict);
    formData.append("status", status);
    formData.append("notes", notes);
    sources.forEach(source => formData.append("sources", source));
    if (evidence) formData.append("evidence", evidence);

    try {
      await axios.post(
        `http://localhost:5000/api/claims/${id}/review`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Review submitted successfully!");
      navigate("/claimdetails");
    } catch (err) {
      console.error("Failed to submit review:", err);
      toast.error("Error submitting review");
    }
  };

  if (!claim) return <p className="text-center p-10">Loading claim...</p>;

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
        <h1 className="text-2xl font-bold text-blue-800 mb-4">Review Claim</h1>

        {/* Claim Info */}
        <div className="bg-white shadow rounded p-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">{claim.title}</h2>
          <p className="text-sm italic text-gray-600 mb-2">Category: {claim.category}</p>
          <p className="text-base text-gray-700 mb-4">{claim.content}</p>
          <p className="text-sm text-gray-500">
            Submitted by: {claim.user?.email || "Unknown"} on{" "}
            {new Date(claim.createdAt).toLocaleDateString()}
          </p>

          {claim.image && (
            <div className="mt-4">
              <img
                src={`http://localhost:5000/${claim.image}`}
                alt="Uploaded claim"
                className="max-h-60 rounded border"
              />
            </div>
          )}

          <span
            className={`inline-block mt-4 px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}
          >
            Status: {status}
          </span>
        </div>

{article && (
  <div className="bg-white shadow rounded p-4 my-6">
    <h2 className="text-xl font-semibold mb-2">🔗 Linked Article</h2>
    <Link
      to={`/article/${article._id}`}
      className="text-blue-600 underline font-medium"
    >
      Read full article ↗
    </Link>

    <div className="mt-3">
      <h3 className="text-lg font-bold">{article.title}</h3>

      {article.image && (
        <img
          src={`http://localhost:5000/uploads/${article.image}`}
          alt={article.title}
          className="mb-3 max-h-60 object-cover rounded"
        />
      )}

      <p className="text-sm text-gray-500 mb-1">
        By: {article.submittedBy} on {new Date(article.createdAt).toLocaleDateString()}
      </p>
      
<p className="text-base text-gray-700">
  {article.description?.length > 150
    ? article.description.slice(0, 150) + '...'
    : article.description}
</p>
      <div
        className="prose prose-sm mt-4 max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </div>
  </div>
)}

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded p-6">
          <div>
            <label className="block font-medium mb-1 text-gray-700">Verdict</label>
            <select
              className="w-full border p-2 rounded"
              value={verdict}
              onChange={(e) => setVerdict(e.target.value)}
              required
            >
              <option value="">Select a verdict</option>
              <option>True</option>
              <option>False</option>
              <option>Misleading</option>
              <option>Satire</option>
              <option>Commentary</option>
            </select>
            {verdict && (
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${verdictColors[verdict]}`}
              >
                {verdict}
              </span>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Status</label>
            <select
              className="w-full border p-2 rounded"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="Pending">Pending</option>
              <option value="Reviewing">Reviewing</option>
              <option value="Reviewed">Reviewed</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Sources</label>
            {sources.map((source, idx) => (
              <input
                key={idx}
                type="url"
                placeholder="https://example.com"
                value={source}
                onChange={(e) => handleSourceChange(idx, e.target.value)}
                className="w-full border p-2 rounded mb-2"
              />
            ))}
            <button
              type="button"
              onClick={handleAddSource}
              className="text-blue-600 text-sm"
            >
              + Add another source
            </button>
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Reviewer Notes</label>
            <textarea
              rows="4"
              className="w-full border p-2 rounded"
              placeholder="Add your explanation here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Upload Evidence (Optional)
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setEvidence(e.target.files[0])}
            />
            {evidence && (
              <p className="text-sm text-green-700 mt-1">Attached: {evidence.name}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClaimReview;
