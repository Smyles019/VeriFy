// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { toast } from "react-toastify";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

   if (res.ok) {
      toast.success(data.message);
    } else {
      toast.error(data.message || "Something went wrong");
    }

  };

  return (
    <form onSubmit={handleSubmit} className="p-10 space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Forgot Password</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border p-2 w-full"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Send Reset Link</button>
    </form>
  );
};

export default ForgotPassword;
