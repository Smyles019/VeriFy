import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  

  useEffect(() => {
    const checkAuth = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    setIsLoggedIn(!!token && !!userData);
    setUser(userData ? JSON.parse(userData) : null);
  };

    checkAuth(); // Initial check on load

    // Listen for changes
    window.addEventListener("storage", checkAuth);
    window.addEventListener("login", checkAuth);
    window.addEventListener("logout", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("login", checkAuth);
      window.removeEventListener("logout", checkAuth);
    };
  }, []);

  const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login'; // hard reload to login page
};

  const goToDashboard = () => {
    switch (user?.role) {
      case "admin":
        navigate("/admin");
        break;
      case "reporter":
        navigate("/reporter");
        break;
      case "fact-checker":
        navigate("/fact-checker");
        break;
      case "editor":
        navigate("/editor");
        break;
      default:
        navigate("/reader");
    }
  };


  return (
    <>
      {/* Top blue section */}
      <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center">
        {/* Left: Logo */}
        <div className="flex items-center space-x-4">
  <Link to="/">
    <img className="w-12 cursor-pointer" src={logo} alt="logo" />
  </Link>
</div>

        {/* Center: Title */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold">
          VeriFy
        </h1>

        {/* Right: Search + Auth buttons */}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search"
            className="rounded-md px-3 py-1 text-black focus:outline-none"
          />

          {isLoggedIn ? (
  <>
    <FaUserCircle
      title={user?.firstName || "Account"}
      className="text-2xl cursor-pointer hover:text-gray-300"
      onClick={() => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.role) {
    switch (user.role) {
      case "admin":
        navigate("/adminDashboard");
        break;
      case "reporter":
        navigate("/reporterDashboard");
        break;
      case "fact-checker":
        navigate("/factcheckerDashboard");
        break;
      case "editor":
        navigate("/editorDashboard");
        break;
      default:
        navigate("/readerDashboard");
    }
  } else {
    navigate("/login");
  }
}}
    />
    <button
      onClick={() => {
       localStorage.removeItem("token");
       localStorage.removeItem("user");
       window.dispatchEvent(new Event("logout")); // optional: for cross-tab sync
       window.location.href = "/login";
      }}
      className="bg-black text-white px-4 py-1 rounded hover:bg-gray-900"
    >
      Logout
    </button>
  </>
) : (
  <>
              <Link to="/register">
                <button className="bg-black text-white px-4 py-1 rounded">
                  Subscribe
                </button>
              </Link>
              <Link to="/login" className="underline">
                Sign in
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Bottom white section with nav links */}
      <div className="bg-gray-100 text-black px-6 py-2 flex justify-center space-x-6 text-sm font-medium">
        <Link to="/">LATEST</Link>
        <Link to="/">POLITICS</Link>
        <Link to="/">HEALTH</Link>
        <Link to="/">BUSINESS</Link>
        <Link to="/">ENTERTAINMENT</Link>
        <Link to="/">SPORTS</Link>
      </div>
    </>
  );
};

export default Navbar;
