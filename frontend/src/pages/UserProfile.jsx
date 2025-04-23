import { useState } from 'react';
import { User, Mail, Award, BookOpen, LogOut, Check, AlertCircle } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
export default function UserProfile() {
  const [profile] = useState({
    email: "ashes@gmail.com",
    h_index: 0,
    i10_index: 0,
    id_card_url: null,
    is_verified: false,
    name: "ashes das",
    role: "user",
    scholar_id: null,
    total_citations: 0
  });
const navigate = useNavigate();
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
      
     
      navigate("/");
      
      console.log("Logout successful:", response.data);
    } catch (error) {
      console.error("Logout failed:", error);
      
      // Even if the API call fails, still clear client-side data
      sessionStorage.clear();
      localStorage.clear();
      clearAllCookies();
      
    
      navigate("/");
    }
  };


  return (
    <div><Navbar/>
    <div className="max-w-md mx-auto bg-white rounded-xl justify-center mt-12 shadow-md overflow-hidden md:max-w-2xl">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">User Profile</h1>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1 bg-white text-blue-600 px-3 py-1 rounded-md text-sm font-semibold hover:bg-blue-50"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 rounded-full p-4">
            <User size={32} className="text-blue-600" />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
            <div className="flex items-center text-sm text-gray-500">
              <span className="capitalize">{profile.role}</span>
              {profile.is_verified ? (
                <div className="flex items-center ml-2 text-green-600">
                  <Check size={16} />
                  <span className="ml-1">Verified</span>
                </div>
              ) : (
                <div className="flex items-center ml-2 text-amber-600">
                  <AlertCircle size={16} />
                  <span className="ml-1">Not Verified</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Mail size={20} className="text-gray-600" />
            <span className="ml-3 text-gray-700">{profile.email}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-gray-500 text-sm mb-1">
                <BookOpen size={16} className="mr-1" />
                Citations
              </div>
              <p className="text-2xl font-bold text-gray-800">{profile.total_citations}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-gray-500 text-sm mb-1">
                <Award size={16} className="mr-1" />
                h-index
              </div>
              <p className="text-2xl font-bold text-gray-800">{profile.h_index}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-gray-500 text-sm mb-1">
              <Award size={16} className="mr-1" />
              i10-index
            </div>
            <p className="text-2xl font-bold text-gray-800">{profile.i10_index}</p>
          </div>

          {profile.scholar_id ? (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-gray-500 text-sm mb-1">
                Scholar ID
              </div>
              <p className="text-gray-800">{profile.scholar_id}</p>
            </div>
          ) : (
            <div className="bg-gray-100 p-4 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 text-center">No Scholar ID connected</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}