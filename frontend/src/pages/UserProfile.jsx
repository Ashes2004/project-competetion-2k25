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
  RefreshCw,
  Lightbulb,
  FileText,
  Briefcase,
  Zap,
  Shield,
  Download
} from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";


export default function UserProfile() {
  const [profile, setProfile] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [scholarId, setScholarId] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminSuccess, setAdminSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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

  const handleExportReport = async () => {
    try {
      setIsExporting(true);
      
      // Make the GET request to the export endpoint
      const response = await axios.get(
        "https://riise.koyeb.app/api/v1/export/user",
        {
          withCredentials: true,
          responseType: 'blob', // Important for handling file downloads
        }
      );
      
      // Create a download link for the received file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${profile.name}_report.pdf`); // or whatever file format is returned
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Export failed:", error);
      // Optionally show an error notification to the user
    } finally {
      setIsExporting(false);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setError("");
  };

  const openAdminModal = () => {
    setShowAdminModal(true);
    setSecretKey("");
    setAdminError("");
    setAdminSuccess(false);
  };

  const closeAdminModal = () => {
    setShowAdminModal(false);
    setSecretKey("");
    setAdminError("");
  };

  const handleScholarIdChange = (e) => {
    setScholarId(e.target.value);
  };

  const handleSecretKeyChange = (e) => {
    setSecretKey(e.target.value);
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

  const handleAdminSubmit = async () => {
    // Validate secret key
    if (!secretKey.trim()) {
      setAdminError("Secret key cannot be empty");
      return;
    }
    
    setIsSubmitting(true);
    setAdminError("");
    setAdminSuccess(false);
    
    try {
      // Check if the secret key matches
      if (secretKey === "S3cREt") {
        // Make API call to update user role to admin
        const response = await axios.put(
          "https://riise.koyeb.app/api/v1/users/update_profile",
          { role: "admin" },
          { withCredentials: true }
        );
        
        // Update the profile state with the new role
        setProfile(prev => ({
          ...prev,
          role: "admin"
        }));
        
        setAdminSuccess(true);
        
        // Fetch updated profile info
        const updatedProfile = await fetch("https://riise.koyeb.app/api/v1/users/profile", {
          credentials: "include",
        });
        const data = await updatedProfile.json();
        setProfile(data.profile);
        
        // Close modal after a delay to show success message
        setTimeout(() => {
          closeAdminModal();
        }, 2000);
      } else {
        setAdminError("Invalid secret key");
      }
    } catch (error) {
      console.error("Failed to update user role:", error);
      setAdminError(error.response?.data?.message || "Failed to update user role");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stats card component for consistent styling
  const StatCard = ({ icon, label, value, bgColor, textColor }) => {
    const Icon = icon;
    return (
      <div className={`${bgColor} rounded-xl p-4 shadow-md transition-transform hover:scale-105`}>
        <div className="flex items-center mb-2">
          <div className={`p-2 rounded-full ${textColor} bg-white bg-opacity-30`}>
            <Icon size={20} />
          </div>
          <span className="ml-2 text-sm font-medium text-white">{label}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold text-white">{value}</p>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${textColor} bg-white bg-opacity-20`}>
            {value > 0 ? <Zap size={16} /> : <X size={16} />}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 pb-8">
      <Navbar />
      <div className="h-24"></div>
      <div className="max-w-md mx-auto bg-white rounded-xl justify-center shadow-lg overflow-hidden md:max-w-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">User Profile</h1>

            <div className="flex gap-2">
            {profile && profile.role === 'admin' &&  <button
                onClick={openAdminModal}
                className="flex items-center gap-1 bg-amber-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-amber-600 transition-colors"
              >
                <Shield size={16} />
                Admin Verification
              </button>}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-white text-blue-600 px-3 py-1 rounded-md text-sm font-semibold hover:bg-blue-50 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {profile && (
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 rounded-full p-4 shadow-md">
                <User size={36} className="text-blue-600" />
              </div>
              <div className="ml-4 flex-grow">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {profile.name}
                  </h2>
                  <button
                    onClick={handleExportReport}
                    disabled={isExporting}
                    className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-green-700 transition-colors"
                  >
                    {isExporting ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Download size={16} />
                    )}
                    {isExporting ? "Exporting..." : "Export Report"}
                  </button>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <span className={`capitalize ${profile.role === 'admin' ? 'text-amber-500 font-semibold' : ''}`}>
                    {profile.role}
                    {profile.role === 'admin' && <Shield size={14} className="ml-1 inline" />}
                  </span>
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

            <div className="space-y-6">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg shadow-sm">
                <Mail size={20} className="text-gray-600" />
                <span className="ml-3 text-gray-700">{profile.email}</span>
              </div>

              {/* Academic Stats Section */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
                  <Award size={18} className="mr-2 text-indigo-600" />
                  Academic Metrics
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <StatCard 
                    icon={BookOpen} 
                    label="Citations" 
                    value={profile.total_citations} 
                    bgColor="bg-gradient-to-br from-blue-500 to-blue-700"
                    textColor="text-blue-600"
                  />
                  <StatCard 
                    icon={Award} 
                    label="h-index" 
                    value={profile.h_index} 
                    bgColor="bg-gradient-to-br from-purple-500 to-purple-700"
                    textColor="text-purple-600"
                  />
                  <StatCard 
                    icon={Award} 
                    label="i10-index" 
                    value={profile.i10_index} 
                    bgColor="bg-gradient-to-br from-indigo-500 to-indigo-700"
                    textColor="text-indigo-600"
                  />
                </div>
              </div>

              {/* Professional Stats Section */}
              {profile.stats && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
                    <Briefcase size={18} className="mr-2 text-indigo-600" />
                    Professional Portfolio
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard 
                      icon={Lightbulb} 
                      label="Innovations" 
                      value={profile.stats.innovations} 
                      bgColor="bg-gradient-to-br from-amber-500 to-amber-700"
                      textColor="text-amber-600"
                    />
                    <StatCard 
                      icon={FileText} 
                      label="IPR" 
                      value={profile.stats.ipr} 
                      bgColor="bg-gradient-to-br from-emerald-500 to-emerald-700"
                      textColor="text-emerald-600"
                    />
                    <StatCard 
                      icon={BookOpen} 
                      label="Research" 
                      value={profile.stats.research} 
                      bgColor="bg-gradient-to-br from-cyan-500 to-cyan-700"
                      textColor="text-cyan-600"
                    />
                    <StatCard 
                      icon={Briefcase} 
                      label="Startups" 
                      value={profile.stats.startups} 
                      bgColor="bg-gradient-to-br from-fuchsia-500 to-fuchsia-700"
                      textColor="text-fuchsia-600"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-row gap-x-4 mt-6">
                {profile.scholar_id ? (
                  <div className="bg-gray-50 p-4 rounded-lg w-2/3 shadow-sm border border-gray-200">
                    <div className="flex items-center text-gray-500 text-sm mb-1">
                      <BookOpen size={16} className="mr-1 text-indigo-600" />
                      Scholar ID
                    </div>
                    <p className="text-gray-800 font-medium">{profile.scholar_id}</p>
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
                    className="flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-800 w-1/3 text-white px-3 py-3 rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-indigo-900 transition-all duration-200 shadow-md"
                  >
                    <RefreshCw size={20} className="animate-pulse" />
                    <span>Update ID</span>
                  </button>
                ) : (
                  <button
                    onClick={openModal}
                    className="flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 w-1/3 text-white px-3 py-3 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-900 transition-all duration-200 shadow-md"
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

      {/* Modal for Admin Mode */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Shield size={20} className="mr-2 text-amber-500" />
                Admin Authentication
              </h3>
              <button
                onClick={closeAdminModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700 mb-1">
                Secret Key
              </label>
              <input
                type="password"
                id="secretKey"
                value={secretKey}
                onChange={handleSecretKeyChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter administrator secret key"
              />
              {adminError && <p className="mt-2 text-sm text-red-600">{adminError}</p>}
              {adminSuccess && (
                <div className="mt-2 p-2 bg-green-100 border border-green-300 text-green-700 rounded-md flex items-center">
                  <Check size={16} className="mr-1" />
                  Admin access granted! Updating role...
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={closeAdminModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAdminSubmit}
                disabled={isSubmitting || adminSuccess}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  isSubmitting || adminSuccess
                    ? "bg-amber-400"
                    : "bg-amber-500 hover:bg-amber-600"
                } transition-colors duration-200 flex items-center`}
              >
                {isSubmitting ? (
                  <>Verifying...</>
                ) : adminSuccess ? (
                  <>
                    <Check size={16} className="mr-1" />
                    Success
                  </>
                ) : (
                  <>Verify</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}