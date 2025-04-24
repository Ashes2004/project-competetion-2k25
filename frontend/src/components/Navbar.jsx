import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import axios from "axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = sessionStorage.getItem("userEmail");
    setIsLoggedIn(!!userEmail);

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const clearAllCookies = () => {
    const cookies = document.cookie.split(';');
    const domain = window.location.hostname;
    
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      
      if (name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain};`;
        
        if (domain.indexOf('.') !== -1) {
          const rootDomain = domain.substring(domain.indexOf('.'));
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${rootDomain};`;
        }
        
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/api/;`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/auth/;`;
      }
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post("https://riise.koyeb.app/api/v1/users/logout", {}, {
        withCredentials: true
      });
      
      sessionStorage.removeItem("userEmail");
      sessionStorage.clear();
      localStorage.clear();
      
      clearAllCookies();
      
      setIsLoggedIn(false);
      setIsUserMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      
      sessionStorage.clear();
      localStorage.clear();
      clearAllCookies();
      
      setIsLoggedIn(false);
      setIsUserMenuOpen(false);
      navigate("/");
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "py-2 bg-gradient-to-r from-indigo-900/95 to-purple-900/95 backdrop-blur-md shadow-lg" : "py-4 bg-transparent"
    }`}>
      <div className="container mx-auto flex justify-between items-center px-4 md:px-8">
        {/* Logo and Title */}
        <Link to="/" className="flex items-center space-x-2 group">
          <img
            src="/RIISE Logo White.png"
            alt="Riise Logo"
            className="h-12 w-12 object-contain transition-transform group-hover:scale-110"
          />
          <span className="text-blue-700  font-bold text-xl hidden sm:block">RIISE</span>
        </Link>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white p-2 rounded-full hover:bg-white/10 focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex  space-x-1 items-center">
          <NavLink to="/research">Research</NavLink>
          <NavLink to="/ipr">IPR</NavLink>
          <NavLink to="/innovations">Innovation</NavLink>
          <NavLink to="/startup">Start-up</NavLink>
          <NavLink to="/about">About Us</NavLink>

          {isLoggedIn ? (
            <div className="relative ml-2">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-1 text-gray-800 px-3 py-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="User menu"
              >
                <User size={20} />
                <ChevronDown size={16} className={`transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`} />
              </button>
              
              {/* User dropdown menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                  <Link 
                    to="/user/profile" 
                    className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 transition-colors"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="ml-2 text-white text-sm bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-2 px-5 rounded-full shadow-md hover:shadow-lg transition-all"
            >
              Register Now
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-4 px-4 py-4 bg-gradient-to-b from-indigo-900/95 to-purple-900/95 backdrop-blur-md rounded-b-xl">
          <div className="space-y-3 flex flex-col">
            <MobileNavLink to="/research" onClick={() => setIsOpen(false)}>Research</MobileNavLink>
            <MobileNavLink to="/ipr" onClick={() => setIsOpen(false)}>IPR</MobileNavLink>
            <MobileNavLink to="/innovations" onClick={() => setIsOpen(false)}>Innovation</MobileNavLink>
            <MobileNavLink to="/startups" onClick={() => setIsOpen(false)}>Start-up</MobileNavLink>
            <MobileNavLink to="/about" onClick={() => setIsOpen(false)}>About Us</MobileNavLink>

            {isLoggedIn ? (
              <div className="border-t border-white/10 pt-3 mt-2">
                <Link 
                  to="/user/profile" 
                  className="flex items-center text-gray-800 hover:text-gray-500 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={18} className="mr-2 text-gray-900" /> Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center text-red-400 hover:text-red-300 py-2 w-full text-left"
                >
                  <LogOut size={18} className="mr-2" /> Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="inline-block text-white text-sm bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-2 px-6 mt-3 rounded-full shadow-md transition-all text-center"
                onClick={() => setIsOpen(false)}
              >
                Register Now
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Desktop navigation link component
const NavLink = ({ to, children }) => (
  <Link 
    to={to} 
    className="relative text-gray-600 hover:text-gray-800 px-3 py-2 text-sm font-medium transition-colors group"
  >
    {children}
    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
  </Link>
);

// Mobile navigation link component
const MobileNavLink = ({ to, children, onClick }) => (
  <Link 
    to={to} 
    className="block text-gray-200 hover:text-white py-2 transition-colors"
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Navbar;