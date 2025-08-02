import React, { useState } from "react";
import logo from "../assets/doubleshasalogo.png"; // Update path if different

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div>
          <img
            src={logo}
            alt="DoubleShasa"
            className="w-28 md:w-20" // logo size reduced ~25%
          />
        </div>

        {/* Hamburger menu */}
        <div
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <button className="text-gray-800 focus:outline-none">
            {menuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <ul className={`md:flex md:items-center md:space-x-6 absolute md:static top-20 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none transition-all duration-300 ease-in-out z-50 ${
          menuOpen ? "block" : "hidden"
        }`}>
          {["Home", "Services", "Projects", "Testimonials", "Contact"].map(
            (item, index) => (
              <li
                key={index}
                className="py-3 px-6 md:py-0 md:px-0 hover:text-[#00adef] cursor-pointer text-gray-800 text-lg md:text-base text-center"
              >
                {item}
              </li>
            )
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
