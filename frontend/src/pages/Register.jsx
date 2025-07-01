import React from "react";
import { useNavigate } from "react-router-dom";


const Register = () => {

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  const form = e.target;
  const firstName = form[0].value.trim();
const lastName = form[1].value.trim();

const data = {
  firstName,
  lastName,
  username: `${firstName}${lastName}`.toLowerCase(), // e.g., janedoe
  email: form[2].value,
  phone: form[3].value,
  password: form[4].value,
};


  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      alert("Registered successfully!");
      navigate("/login");
    } else {
      alert(result.error || "Registration failed");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};


  return (
    <div
      className="h-screen w-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/bg1.jpg')" }} 
    >
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-[80%] max-w-3xl z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">
            <span className="text-black">Veri</span>
            <span className="text-blue-700">Fy</span>
          </h1>
          <p className="text-white mt-2">Welcome, Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-black">
          <div>
            <label className="block mb-1 font-semibold text-white">First Name</label>
            <input
              type="text"
              placeholder="Enter name"
              className="w-full px-4 py-3 bg-white bg-opacity-80 rounded-md outline-none"
              required
              onhandleChange={(e) => e.target.value}
              name="firstName"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-white">Last Name</label>
            <input
              type="text"
              placeholder="Enter last name"
              className="w-full px-4 py-3 bg-white bg-opacity-80 rounded-md outline-none"
              required
              onhandleChange={(e) => e.target.value}
              name="lastName"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-white">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full px-4 py-3 bg-white bg-opacity-80 rounded-md outline-none"
              required
              onhandleChange={(e) => e.target.value}
              name="email"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-white">Mobile No.</label>
            <input
              type="tel"
              placeholder="Enter mobile number"
              className="w-full px-4 py-3 bg-white bg-opacity-80 rounded-md outline-none"
              required
              onhandleChange={(e) => e.target.value}
              name="phone"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-white">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-white bg-opacity-80 rounded-md outline-none"
              required
              onhandleChange={(e) => e.target.value}
              name="password"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-white">Confirm Password</label>
            <input
              type="password"
              placeholder="Enter confirm password"
              className="w-full px-4 py-3 bg-white bg-opacity-80 rounded-md outline-none"
              required
              onhandleChange={(e) => e.target.value}
              name="confirmPassword"
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

export default Register;
