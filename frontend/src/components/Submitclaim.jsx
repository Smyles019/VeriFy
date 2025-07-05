import React, { useState } from "react";
import axios from "axios";

const SubmitClaim = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

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
