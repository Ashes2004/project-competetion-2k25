import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import axios from "axios";

const Homenav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = sessionStorage.getItem("userEmail");
    setIsLoggedIn(!!userEmail);
  }, []);

  const clearAllCookies = () => {
    // Get all cookies
    const cookies = document.cookie.split(';');
    
    // Get the current domain
    const domain = window.location.hostname;
    
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      
      if (name) {
        // Clear with multiple combinations of path and domain to ensure complete removal
        // Root path
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
        
        // With domain
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain};`;
        
        // For subdomains
        if (domain.indexOf('.') !== -1) {
          const rootDomain = domain.substring(domain.indexOf('.'));
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${rootDomain};`;
        }
        
        // Various paths that might be used
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/api/;`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/auth/;`;
      }
    }
  };

  const handleLogout = async () => {
    try {
      // Configure axios to include credentials (cookies)
      const response = await axios.post("https://riise.koyeb.app/api/v1/users/logout", {}, {
        withCredentials: true // This ensures cookies are sent with the request
      });
      
      // Clear client-side storage
      sessionStorage.removeItem("userEmail");
      sessionStorage.clear();
      localStorage.clear(); // Also clear localStorage in case anything is stored there
      
      // Clear cookies that are accessible via JavaScript
      clearAllCookies();
      
      setIsLoggedIn(false);
      setShowPopup(false);
      navigate("/");
      
      console.log("Logout successful:", response.data);
    } catch (error) {
      console.error("Logout failed:", error);
      
      // Even if the API call fails, still clear client-side data
      sessionStorage.clear();
      localStorage.clear();
      clearAllCookies();
      
      setIsLoggedIn(false);
      setShowPopup(false);
      navigate("/");
    }
  };

  return (
    <nav className="bg-transparent py-4 px-4 md:px-8 relative">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/RIISE Logo White.png"
            alt="Riise Logo"
            className="h-20 w-20 object-contain"
          />
        </Link>

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
          <Link to="/innovation" className="text-gray-300 hover:text-blue-500">
            Innovation
          </Link>
          <Link to="/startups" className="text-gray-300 hover:text-blue-500">
            Start-up
          </Link>
          <Link to="/about" className="text-gray-300 hover:text-blue-500">
            About Us
          </Link>

          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowPopup(!showPopup)}
                className="text-gray-300"
              >
                <User size={24} />
              </button>
              {showPopup && (
                <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md p-2 z-50">
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="text-blue-100 text-sm bg-red-700 hover:bg-blue-800 py-2 px-3 rounded-3xl"
            >
              Register Now
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-4 px-4 space-y-3">
          <Link
            to="/#research"
            className="block text-gray-300 hover:text-blue-500"
          >
            Research
          </Link>
          <Link to="/#ipr" className="block text-gray-300 hover:text-blue-500">
            IPR
          </Link>
          <Link
            to="/#innovation"
            className="block text-gray-300 hover:text-blue-500"
          >
            Innovation
          </Link>
          <Link
            to="/#startup"
            className="block text-gray-300 hover:text-blue-500"
          >
            Start-up
          </Link>
          <Link
            to="/#about"
            className="block text-gray-300 hover:text-blue-500"
          >
            About Us
          </Link>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 block"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/auth"
              className="inline-block text-blue-100 text-sm bg-red-700 hover:bg-blue-800 py-2 px-4 rounded-3xl"
            >
              Register Now
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Homenav;