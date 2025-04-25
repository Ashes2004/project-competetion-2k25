import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Award,
  BookOpen,
  LogOut,
  Check,
  AlertCircle,
  X,
  Plus,
  RefreshCw
} from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";


export default function UserProfile() {
  const [profile, setProfile] = useState();
  const [showModal, setShowModal] = useState(false);
  const [scholarId, setScholarId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const resp = await fetch("https://riise.koyeb.app/api/v1/users/profile", {
        credentials: "include",
      });
      const data = await resp.json();
      console.log(data);
      setProfile(data.profile);
      if (data.profile.scholar_id) {
        setScholarId(data.profile.scholar_id);
      }
    };

    fetchUserData();
  }, []);

  const navigate = useNavigate();

  const clearAllCookies = () => {
    // Get all cookies
    const cookies = document.cookie.split(";");
    
    // General cookie clearing logic as before
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      
      if (name) {
        // Basic cookie deletion
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/Cookies;`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/Cookies; domain=${window.location.hostname};`;
      }
    }
    
    // Specifically target the access_token with the exact domain
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/Cookies; domain=riise.koyeb.app;";
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/Cookies; domain=.riise.koyeb.app;";
    
    // Try with secure flag variations
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/Cookies; domain=riise.koyeb.app; secure;";
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/Cookies; domain=.riise.koyeb.app; secure;";
    
    // Try with SameSite variations
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=riise.koyeb.app; SameSite=None; secure;";
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/Cookies; domain=riise.koyeb.app; SameSite=Lax;";
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/Cookies; domain=riise.koyeb.app; SameSite=Strict;";
  };

  const handleLogout = async () => {
    try {
      // Configure axios to include credentials (cookies)
      const response = await axios.post(
        "https://riise.koyeb.app/api/v1/users/logout",
        {},
        {
          withCredentials: true, // This ensures cookies are sent with the request
        }
      );

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


  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setError("");
  };

  const handleScholarIdChange = (e) => {
    setScholarId(e.target.value);
  };

  const handleSubmit = async () => {
    // Validate scholar ID (basic validation)
    if (!scholarId.trim()) {
      setError("Scholar ID cannot be empty");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      
      // Implement the API call to update or add the scholar ID
      console.log("scholerid : ", scholarId);
     
      const response = await axios.put(
        "https://riise.koyeb.app/api/v1/users/update_profile",
        { scholar_id: scholarId },
        { withCredentials: true }
      );
      
      // Update the profile state with the new scholar ID
      setProfile(prev => ({
        ...prev,
        scholar_id: scholarId
      }));
      
      // Close the modal
      closeModal();
     
      // You might want to fetch updated stats after changing scholar ID
      const updatedProfile = await fetch("https://riise.koyeb.app/api/v1/users/profile", {
        credentials: "include",
      });
      const data = await updatedProfile.json();
      setProfile(data.profile);
    } catch (error) {
      console.error("Failed to update Scholar ID:", error);
      setError(error.response?.data?.message || "Failed to update Scholar ID");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <Navbar />
      <div className="h-24"></div>
      <div className="max-w-md mx-auto bg-white rounded-xl justify-center shadow-md overflow-hidden md:max-w-2xl">
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

        {profile && (
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 rounded-full p-4">
                <User size={32} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {profile.name}
                </h2>
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
                  <p className="text-2xl font-bold text-gray-800">
                    {profile.total_citations}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-500 text-sm mb-1">
                    <Award size={16} className="mr-1" />
                    h-index
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {profile.h_index}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-500 text-sm mb-1">
                  <Award size={16} className="mr-1" />
                  i10-index
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {profile.i10_index}
                </p>
              </div>
              <div className="flex flex-row gap-x-4">
                {profile.scholar_id ? (
                  <div className="bg-gray-50 p-4 rounded-lg w-2/3">
                    <div className="flex items-center text-gray-500 text-sm mb-1">
                      Scholar ID
                    </div>
                    <p className="text-gray-800">{profile.scholar_id}</p>
                  </div>
                ) : (
                  <div className="bg-gray-100 p-4 rounded-lg w-2/3 border border-dashed border-gray-300">
                    <p className="text-gray-500 text-center">
                      No Scholar ID connected
                    </p>
                  </div>
                )}

                {profile.scholar_id ? (
                  <button
                    onClick={openModal}
                    className="flex flex-col items-center justify-center gap-2 bg-indigo-600 w-1/3 text-white px-3 py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-md"
                  >
                    <RefreshCw size={20} className="animate-pulse" />
                    <span>Update ID</span>
                  </button>
                ) : (
                  <button
                    onClick={openModal}
                    className="flex flex-col items-center justify-center gap-2 bg-blue-600 w-1/3 text-white px-3 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md"
                  >
                    <Plus size={20} />
                    <span>Add ID</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for adding/updating Scholar ID */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {profile?.scholar_id ? "Update Scholar ID" : "Add Scholar ID"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <label htmlFor="scholarId" className="block text-sm font-medium text-gray-700 mb-1">
                Google Scholar ID
              </label>
              <input
                type="text"
                id="scholarId"
                value={scholarId}
                onChange={handleScholarIdChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Scholar ID"
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  isSubmitting
                    ? "bg-blue-400"
                    : "bg-blue-600 hover:bg-blue-700"
                } transition-colors duration-200`}
              >
                {isSubmitting
                  ? "Saving..."
                  : profile?.scholar_id
                  ? "Update"
                  : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}