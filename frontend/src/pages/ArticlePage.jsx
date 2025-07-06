import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaThumbsUp, FaThumbsDown, FaFlag, FaTrash} from 'react-icons/fa';
import SubmitClaim from '../components/Submitclaim';

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState(null)

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [flagCount, setFlagCount] = useState(0);
  const [flagged, setFlagged] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [claim, setClaim] = useState(null);

  useEffect(() => {
     const token = localStorage.getItem("token");
  if (token) {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    setUserId(decoded.id);
  }

    const fetchArticle = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/articles/${id}`);
        const data = res.data;
        setArticle(data);
        setLikes(data.likes?.length || 0);
        setDislikes(data.dislikes?.length || 0);
        setFlagged(data.flags?.includes(data.currentUserId)); // optional
      } catch (error) {
        setError("Failed to load article");
      } finally {
        setLoading(false);
      }
    };
    
      const fetchClaim = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/claims/article/${id}`);
      setClaim(res.data);
    } catch (err) {
      console.log("No reviewed claim for this article or failed to fetch.");
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/articles/${id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to load comments");
    }
  };

  fetchArticle();
  fetchClaim();
  fetchComments();
  
  }, [id]);

  const handleCommentSubmit = async (e) => {
  e.preventDefault();
  if (!newComment.trim()) return;

  try {
    const res = await axios.post(
      `http://localhost:5000/api/articles/${id}/comments`,
      { text: newComment },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setComments([...comments, res.data]);
    setNewComment("");
  } catch (err) {
    console.error("Failed to post comment", err.response?.data || err.message);
  }
};

const handleDeleteComment = async (commentId) => {
  try {
    await axios.delete(`http://localhost:5000/api/articles/${id}/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setComments(comments.filter((comment) => comment._id !== commentId));
  } catch (err) {
    console.error("Failed to delete comment:", err.response?.data || err.message);
  }
};



  const toggleLike = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/articles/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
    } catch (err) {
      console.error("Like failed:", err.response?.data || err.message);
    }
  };

  const toggleDislike = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/articles/${id}/dislike`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
    } catch (err) {
      console.error("Dislike failed:", err.response?.data || err.message);
    }
  };

  const toggleFlag = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/articles/${id}/flag`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFlagged(res.data.flagged);
      setFlagCount(res.data.flagCount);
    } catch (err) {
      console.error("Flag failed:", err.response?.data || err.message);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading article...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{article.title}</h1>

      {article.image && (
        <img
          src={`http://localhost:5000/uploads/${article.image}`}
          alt={article.title}
          className="w-full h-auto mb-4 rounded"
        />
      )}

      <p className="text-gray-700 mb-2">{article.description}</p>

      <div className="text-sm text-gray-500 flex justify-between items-center mb-4">
        <span className="uppercase font-semibold">{article.submittedBy}</span>
        <span>{new Date(article.createdAt).toLocaleDateString('en-GB')}</span>
      </div>

      <hr className="my-4" />

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
      {claim && (
  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6 rounded shadow">
    <h3 className="text-lg font-semibold text-yellow-700">
      🧐 Fact Check Verdict: {claim.verdict}
    </h3>

    {claim.sources?.length > 0 && claim.sources[0] !== "" && (
      <div className="mt-2">
        <h4 className="font-medium text-sm text-gray-700 mb-1">Sources:</h4>
        <ul className="list-disc list-inside text-sm text-blue-800">
          {claim.sources.map((src, index) => (
            <li key={index}>
              <a href={src} target="_blank" rel="noopener noreferrer" className="underline">
                {src}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
)}

      {/* === INTERACTIONS BELOW ARTICLE === */}
      <div className="mt-10 border-t pt-6 space-y-6">

        <div>
  {claim ? (
    <p className="text-green-700 font-semibold">
      ✅ A claim has already been submitted and reviewed for this article.
    </p>
  ) : (
    <button
      onClick={() => setShowModal(true)}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      Submit a Claim
    </button>
  )}
</div>
        {/* Like / Dislike / Flag */}
        <div className="flex gap-6 items-center">
          <button
            onClick={toggleLike}
            className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition"
          >
            <FaThumbsUp /> {likes}
          </button>

          <button
            onClick={toggleDislike}
            className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition"
          >
            <FaThumbsDown /> {dislikes}
          </button>

          <button
  onClick={toggleFlag}
  className={`flex items-center gap-1 ${
    flagged ? 'text-yellow-600' : 'text-gray-600'
  } hover:text-yellow-600 transition`}
>
  <FaFlag /> {flagged ? "Flagged" : "Flag"}
</button>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Comments</h2>

          <form onSubmit={handleCommentSubmit} className="mb-4">
            <textarea
              className="w-full p-2 border rounded mb-2"
              rows="3"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Leave a comment..."
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Post Comment
            </button>
          </form>

          <ul className="space-y-2">
  {comments.map((comment) => (
    <li key={comment._id} className="bg-gray-100 p-3 rounded relative">
      <div className="text-sm text-gray-600 mb-1">
        {comment.user?.firstName || "Anonymous"} •{" "}
        {new Date(comment.createdAt).toLocaleString()}
      </div>
      <div>{comment.text}</div>
      
      {comment.user?._id === userId && (
  <button
    onClick={() => handleDeleteComment(comment._id)}
    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
    title="Delete comment"
  >
    <FaTrash />
  </button>
)}

    </li>
  ))}
</ul>

        </div>
      </div>
{showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative">
            <button
              className="absolute top-2 right-4 text-xl font-bold text-gray-500 hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <SubmitClaim articleId={article._id || article.id} articleTitle={article.title}/>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlePage;
