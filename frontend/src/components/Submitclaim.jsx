import React, { useState, useEffect } from "react";
import axios from "axios";

const SubmitClaim = ({ articleId, articleTitle, articleDescription }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });

  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Pre-fill from article props
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      title: articleTitle || "",
      content: articleDescription || "",
    }));
  }, [articleTitle, articleDescription]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => data.append(key, val));
      if (image) data.append("image", image);
      if (articleId) data.append("articleId", articleId); // 🔗 Linking here

      await axios.post("http://localhost:5000/api/claims", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setMessage("✅ Claim submitted!");
      setFormData({ title: "", content: "", category: "" });
      setImage(null);
    } catch (err) {
      setMessage("❌ Failed to submit claim.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded-lg shadow-md text-sm">
      <h2 className="text-xl font-semibold mb-3 text-center">Submit a Claim</h2>

      {articleId && (
        <div className="text-blue-700 text-sm mb-3 text-center">
          📎 Linked to article: <strong>{articleTitle}</strong>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select one</option>
            <option value="politics">Politics</option>
            <option value="health">Health</option>
            <option value="science">Science</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Image (optional)</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      {message && <p className="mt-3 text-center">{message}</p>}
    </div>
  );
};

export default SubmitClaim;
