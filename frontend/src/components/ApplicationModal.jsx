import { useState, useEffect } from "react";

const ApplicationModal = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState("");
  const [document, setDocument] = useState(null);
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  useEffect(() => {
    if (!isOpen) {
      setMessage("");
      setDocument(null);
      setStatus({ loading: false, success: null, error: null });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });

    const formData = new FormData();
    formData.append("message", message);
    if (document) formData.append("document", document);

    try {
      const res = await fetch("http://localhost:5000/api/applications/reader", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to apply");

      setStatus({ loading: false, success: "Application submitted!", error: null });
      setMessage("");
      setDocument(null);
    } catch (err) {
      setStatus({ loading: false, success: null, error: err.message });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 max-w-xl w-full shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6">Apply to Be a Reporter</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block font-medium text-slate-700">
            Why do you want to become a reporter?
          </label>
          <textarea
            required
            rows={5}
            className="w-full p-3 border border-slate-300 rounded-md"
            placeholder="Your motivation, experience..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <label className="block font-medium text-slate-700">
            Upload Supporting Document (PDF, DOCX, etc.)
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) => setDocument(e.target.files[0])}
            className="w-full"
          />

          <button
            type="submit"
            disabled={status.loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            {status.loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>

        {status.success && (
          <p className="text-green-600 mt-4 text-center">{status.success}</p>
        )}
        {status.error && (
          <p className="text-red-500 mt-4 text-center">{status.error}</p>
        )}
      </div>
    </div>
  );
};

export default ApplicationModal;
