// src/pages/RegistrationSuccess.jsx
import { Link } from "react-router-dom";

const RegistrationSuccess = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-3xl font-bold mb-4">🎉 Registration Successful!</h1>
    <p className="mb-6 text-gray-700">You're all set. You can now log in.</p>
    <Link to="/login" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
      Go to Login
    </Link>
  </div>
)

export default RegistrationSuccess
