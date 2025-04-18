import React, { useState } from "react";
import Navbar from "../components/Navbar";

const AuthToggler = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  const toggleAuth = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
          <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-6">
            {isSignIn ? "Welcome Back" : "Create an Account"}
          </h2>

          {isSignIn ? (
            <form className="space-y-5">
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
                  className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
              >
                Sign In
              </button>
            </form>
          ) : (
            <form className="space-y-5">
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
                  className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="John Doe"
                />
              </div>
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
                  className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Create a strong password"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
              >
                Sign Up
              </button>
            </form>
          )}

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
