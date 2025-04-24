import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Eye, EyeOff, UserCircle, Mail, Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuthToggler = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const toggleAuth = () => {
    setIsSignIn(!isSignIn);
    setMessage("");
    setFormData({
      name: "",
      email: "",
      password: "",
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const url = isSignIn
      ? "https://riise.koyeb.app/api/v1/users/login"
      : "https://riise.koyeb.app/api/v1/users/signup";

    const payload = isSignIn
      ? {
          email: formData.email,
          password: formData.password,
          role: "user",
        }
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "user",
        };

    try {
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setMessage(data.error || "Something went wrong");
      } else {
        setMessage(data.message);
        sessionStorage.setItem("userEmail", data.user.email);
        navigate('/');
      }
    } catch (error) {
      setMessage("Failed to connect to the server.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center px-4">
        <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <h2 className="text-3xl font-bold text-center">
              {isSignIn ? "Welcome Back" : "Join Us Today"}
            </h2>
            <p className="text-center text-indigo-100 mt-2">
              {isSignIn 
                ? "Sign in to access your account" 
                : "Create an account to get started"
              }
            </p>
          </div>

          <div className="p-8">
            {message && (
              <div className="mb-6 p-3 rounded-lg text-center text-sm font-medium bg-red-50 text-red-600 border border-red-200">
                {message}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {!isSignIn && (
                <div className="relative">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <UserCircle className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="      John Doe"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="relative">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder={
                      isSignIn ? "Enter your password" : "Create a strong password"
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="group relative w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <span className="flex items-center justify-center">
                  {isSignIn ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                {isSignIn ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      onClick={toggleAuth}
                      className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-colors"
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={toggleAuth}
                      className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-colors"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthToggler;