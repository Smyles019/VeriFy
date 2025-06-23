import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1 className="text-2xl p-5">Welcome to VeriFy</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<h1 className="text-2xl p-5">404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
