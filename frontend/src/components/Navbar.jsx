import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-transparent py-4 px-4 md:px-8">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-700">
          Research & Innovation Hub
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-300 focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/research" className="text-gray-300 hover:text-blue-500">
            Research
          </Link>
          <Link to="/ipr" className="text-gray-300 hover:text-blue-500">
            IPR
          </Link>
          <Link to="/innovation-tracking" className="text-gray-300 hover:text-blue-500">
            Innovation
          </Link>
          <Link to="/startup-hub" className="text-gray-300 hover:text-blue-500">
            Start-up
          </Link>
          <Link to="/#about" className="text-gray-300 hover:text-blue-500">
            About Us
          </Link>
          <Link
            to="/auth"
            className="text-blue-100 text-sm bg-red-700 hover:bg-blue-800 py-2 px-3 rounded-3xl"
          >
            Register Now
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-4 px-4 space-y-3">
          <Link to="/#research" className="block text-gray-300 hover:text-blue-500">
            Research
          </Link>
          <Link to="/#ipr" className="block text-gray-300 hover:text-blue-500">
            IPR
          </Link>
          <Link to="/#innovation" className="block text-gray-300 hover:text-blue-500">
            Innovation
          </Link>
          <Link to="/#startup" className="block text-gray-300 hover:text-blue-500">
            Start-up
          </Link>
          <Link to="/#about" className="block text-gray-300 hover:text-blue-500">
            About Us
          </Link>
          <Link
            to="/auth"
            className="inline-block text-blue-100 text-sm bg-red-700 hover:bg-blue-800 py-2 px-4 rounded-3xl"
          >
            Register Now
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
