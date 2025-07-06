// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";


const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
    const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success(data.message || "Password reset successful!");
      navigate("/login");
    } else {
      toast.error(data.message || "Failed to reset password");
    }
};

  return (
    <form onSubmit={handleSubmit} className="p-10 space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Reset Password</h1>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="border p-2 w-full"
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded">Reset Password</button>
    </form>
  );
};

export default ResetPassword;
