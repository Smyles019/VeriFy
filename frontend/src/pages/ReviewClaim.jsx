// src/pages/ClaimReview.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ClaimReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [claim, setClaim] = useState(null);
  const [verdict, setVerdict] = useState("");
  const [sources, setSources] = useState([""]);
  const [notes, setNotes] = useState("");
  const [evidence, setEvidence] = useState(null);

  useEffect(() => {
    // Placeholder: replace with actual fetch logic
    setClaim({
      id,
      text: "COVID-19 vaccines contain microchips.",
      submittedBy: "user@example.com",
      date: "2025-06-27",
    });
  }, [id]);

  const handleAddSource = () => {
    setSources([...sources, ""]);
  };

  const handleSourceChange = (index, value) => {
    const updated = [...sources];
    updated[index] = value;
    setSources(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      verdict,
      notes,
      sources: sources.filter((s) => s.trim() !== ""),
      evidence, // This would be sent as a file upload
    };
    console.log("Review Submitted:", formData);
    alert("Review submitted (mock)");
    navigate("/factchecker"); // Redirect after submission
  };

  if (!claim) return <p className="text-center p-10">Loading claim...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-800">Review Claim</h1>

      <div className="bg-white shadow rounded p-4 mb-6">
        <p className="text-lg font-medium text-gray-800">{claim.text}</p>
        <p className="text-sm text-gray-500 mt-2">
          Submitted by: {claim.submittedBy} on {claim.date}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded p-6">
        {/* Verdict */}
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
        </div>

        {/* Sources */}
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
          <button type="button" onClick={handleAddSource} className="text-blue-600 text-sm">
            + Add another source
          </button>
        </div>

        {/* Notes */}
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

        {/* Evidence Upload */}
        <div>
          <label className="block font-medium mb-1 text-gray-700">Upload Evidence (Optional)</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setEvidence(e.target.files[0])}
          />
          {evidence && (
            <p className="text-sm text-green-700 mt-1">
              Attached: {evidence.name}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ClaimReview;
