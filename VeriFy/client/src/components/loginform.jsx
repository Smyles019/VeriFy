import React from "react";

const LoginForm = () => {
  return (
    <div
      className="h-screen w-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/bg2.jpg')" }} // Ensure bg2.jpg is in /public
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

        <form className="space-y-6 text-black text-sm">
          <div>
            <label className="block mb-1 font-semibold text-white">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full px-4 py-3 bg-white bg-opacity-80 rounded-md outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-white">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-white bg-opacity-80 rounded-md outline-none"
              required
            />
          </div>

          <div className="flex justify-between items-center text-white text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <a href="/forgot-password" className="text-blue-300 underline hover:text-blue-400">
              Forgot password?
            </a>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
            >
              Sign In
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

export default LoginForm;
