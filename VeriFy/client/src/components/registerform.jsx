import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/login");
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div
      className="h-screen w-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/bg2.jpg')" }} // Make sure this is in public/
    >
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-[90%] max-w-4xl z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">
            <span className="text-black">Veri</span>
            <span className="text-blue-700">Fy</span>
          </h1>
          <p className="text-white mt-2">Welcome, Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-black">
          <div>
            <label className="block mb-1 font-semibold text-white">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter name"
              className="w-full px-4 py-3 bg-white bg-opacity-80 rounded-md outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-white">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              className="w-full px-4 py-3 bg-white bg-opacity-80 rounded-md outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-white">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full px-4 py-3 bg-white bg-opacity-80 rounded-md outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-white">Mobile No.</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter mobile number"
              className="w-full px-4 py-3 bg-white bg-opacity-80 rounded-md outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-white">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-white bg-opacity-80 rounded-md outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-white">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Enter confirm password"
              className="w-full px-4 py-3 bg-white bg-opacity-80 rounded-md outline-none"
              required
            />
          </div>

          <div className="col-span-1 sm:col-span-2 flex items-center text-white text-sm mt-2">
            <input type="checkbox" className="mr-2" required />
            <span>
              I agree to the{" "}
              <a href="#" className="text-blue-300 underline">
                Terms and Conditions
              </a>
            </span>
          </div>

          <div className="col-span-1 sm:col-span-2">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
            >
              Sign up
            </button>
          </div>

          <div className="col-span-1 sm:col-span-2 text-center text-white text-sm mt-2">
            Already have an account?{" "}
            <a href="/login" className="text-blue-300 font-medium underline">
              Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
