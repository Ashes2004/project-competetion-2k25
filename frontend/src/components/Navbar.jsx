import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-transparent py-4 px-8 ">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-700">
            Research & Innovation Hub
          </div>
          <div className="space-x-6">
            <a href="#research" className="text-gray-300 hover:text-blue-500">
              Research
            </a>
            <a href="#ipr" className="text-gray-300 hover:text-blue-500">
              IPR
            </a>
            <a href="#innovation" className="text-gray-300 hover:text-blue-500">
              Innovation
            </a>
            <a href="#startup" className="text-gray-300 hover:text-blue-500">
              Start-up
            </a>
            <a href="#about" className="text-gray-300 hover:text-blue-500">
              About Us
            </a>
            <a
              href="#register"
              className="text-blue-100 text-sm bg-red-700 hover:bg-blue-800 py-2 px-3 rounded-3xl"
            >
              Register Now
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
