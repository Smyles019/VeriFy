import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        const { token, user } = data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        if (user.role === "reporter") {
          localStorage.setItem("reporterName", user.fullName || user.email);
        }

       window.dispatchEvent(new Event("login"));
      toast.success("Logged in successfully!");

        switch (user.role) {
          case "admin": navigate("/adminDashboard"); break;
          case "reporter": navigate("/reporterDashboard"); break;
          case "fact-checker": navigate("/factcheckerDashboard"); break;
          case "editor": navigate("/editorDashboard"); break;
          default: navigate("/readerDashboard"); break;
        }
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  // ... rest of your JSX (unchanged)


  
  return (
    <div
      className="h-screen w-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/bg1.jpg')" }} 
    >
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-[90%] max-w-md z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">
            <span className="text-black">Veri</span>
            <span className="text-blue-700">Fy</span>
          </h1>
          <p className="text-white mt-2">Log in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-black text-sm">
          <div>
            <label className="block mb-1 font-semibold text-white">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full px-4 py-3 bg-white bg-opacity-80 rounded-md outline-none"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-white">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-white bg-opacity-80 rounded-md outline-none"
              required
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-between items-center text-white text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
               <Link to="/forgot-password" className="text-blue-300 underline hover:text-blue-400">
               
                Forgot password?
              </Link>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
            >
              Log In
            </button>
          </div>

          <div className="text-center text-white text-sm mt-2">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-300 font-medium underline">
              Register
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
