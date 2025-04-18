// src/pages/InnovationTracking.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// import "./InnovationTracking.css";

const InnovationTracking = () => {
  return (
    <div className="min-w-screen">
      <Navbar />
      <section className="py-16 px-6 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-purple-800 mb-6">
            Innovation Tracking
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Explore the latest innovations taking place within our ecosystem. This section helps you track new ideas, technologies, and projects developed by our community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow border border-purple-200">
            <h3 className="text-xl font-semibold text-purple-700 mb-2">Project Alpha</h3>
            <p className="text-sm text-gray-600">
              A brief description about innovation project Alpha and its current stage.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border border-purple-200">
            <h3 className="text-xl font-semibold text-purple-700 mb-2">Project beta</h3>
            <p className="text-sm text-gray-600">
              Details about innovation project Beta and how it's making a difference.
            </p>
          </div>
          
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default InnovationTracking;
