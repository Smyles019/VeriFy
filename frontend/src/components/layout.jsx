// src/components/Layout.js
import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="bg-blue-700 text-white py-4 px-6 shadow-md">
        <h1 className="text-xl font-bold">VeriFy</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>&copy; {new Date().getFullYear()} VeriFy. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
