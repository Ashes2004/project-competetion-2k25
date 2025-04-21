import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuthToggler = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
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
    setIsAdmin(false);
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
          role: isAdmin ? "admin" : "user",
        }
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: isAdmin ? "admin" : "user",
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
      console.log("data: " , data);
      
      if (!res.ok) {
        setMessage(data.error || "Something went wrong");
      } else {
        setMessage(data.message);
        sessionStorage.setItem("userEmail", data.user.email);
        navigate('/');
        console.log("Response:", data);
       
      }
      
    } catch (error) {
      setMessage("Failed to connect to the server.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
          <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-6">
            {isSignIn ? "Welcome Back" : "Create an Account"}
          </h2>

          {message && (
            <div className="mb-4 text-center text-sm text-red-600">
              {message}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isSignIn && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 pr-10 border  rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={
                  isSignIn ? "Enter your password" : "Create a strong password"
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 mt-5" />
                ) : (
                  <Eye className="w-5 h-5 mt-5" />
                )}
              </button>
            </div>

            <div className="flex items-center">
              <input
                id="admin"
                name="admin"
                type="checkbox"
                checked={isAdmin}
                onChange={() => setIsAdmin(!isAdmin)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label
                htmlFor="admin"
                className="ml-2 block text-sm text-gray-700"
              >
                I am an admin
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
            >
              {isSignIn ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            {isSignIn ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={toggleAuth}
                  className="text-indigo-600 hover:underline font-medium"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={toggleAuth}
                  className="text-indigo-600 hover:underline font-medium"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthToggler;
