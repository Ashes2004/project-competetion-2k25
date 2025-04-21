import { useState } from "react";
import { Users, Lightbulb, Award, Rocket, Heart, Globe } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Aboutus() {
  const [activeTab, setActiveTab] = useState("mission");

  const teamMembers = [
    {
      name: "Atul Singh Chauhan",
      role: "Backend Developer",
      bio: "With over 15 years of experience in technology innovation management, Dr. Mehta contributes to building user-friendly interfaces and ensuring the platform's responsiveness.",
    },
    {
      name: "Ashes ",
      role: "Frontend Developer",
      bio: "Priya specializes in designing intuitive interfaces, working closely with UX teams to deliver seamless user experiences.",
    },
    {
      name: "Ankur Goswami",
      role: "Backend Developer",
      bio: "Arjun brings expertise in server-side development and database management, ensuring robust performance and security.",
    },
    {
      name: "Aniket Ghsoh",
      role: "Frontend Developer",
      bio: "Anisha focuses on crafting scalable and maintainable UI components using modern frontend technologies.",
    },
    {
      name: "Arindam Das",
      role: "Frontend Developer",
      bio: "Vikram leads the backend team, architecting APIs and integrating complex systems for smooth operation.",
    },
    {
      name: "Pragya",
      role: "Frontend Developer",
      bio: "With a keen eye for design and functionality, Meena ensures consistent frontend development across all modules.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-xl max-w-2xl mx-auto">
            At the heart of our platform, we serve as the unified hub for
            research, intellectual property rights, innovation, and start-up
            management.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="container mx-auto mt-8 px-4">
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab("mission")}
            className={`px-6 py-2 rounded-full ${
              activeTab === "mission"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Our Mission
          </button>
          <button
            onClick={() => setActiveTab("team")}
            className={`px-6 py-2 rounded-full ${
              activeTab === "team" ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
          >
            Our Team
          </button>
          <button
            onClick={() => setActiveTab("vision")}
            className={`px-6 py-2 rounded-full ${
              activeTab === "vision"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Our Vision
          </button>
        </div>

        {/* Mission Section */}
        {activeTab === "mission" && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex justify-center mb-6">
                <div className="bg-indigo-100 rounded-full p-3">
                  <Heart className="text-indigo-600" size={32} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Our Mission
              </h2>
              <p className="text-gray-700 text-lg text-center">
                We strive to connect researchers, innovators, entrepreneurs, and
                resource providers through a seamless digital experience,
                breaking down barriers and accelerating growth across the
                innovation ecosystem.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <Lightbulb className="text-indigo-500" size={28} />
                  </div>
                  <h3 className="font-semibold mb-2">Innovation</h3>
                  <p className="text-gray-600">
                    Fostering new ideas and creative solutions through
                    collaborative platforms
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <Award className="text-indigo-500" size={28} />
                  </div>
                  <h3 className="font-semibold mb-2">Excellence</h3>
                  <p className="text-gray-600">
                    Promoting high standards in research, IPR management and
                    entrepreneurship
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <Rocket className="text-indigo-500" size={28} />
                  </div>
                  <h3 className="font-semibold mb-2">Growth</h3>
                  <p className="text-gray-600">
                    Accelerating the development of ideas from concept to
                    market-ready solutions
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Team Section */}
        {activeTab === "team" && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex justify-center mb-6">
                <div className="bg-indigo-100 rounded-full p-3">
                  <Users className="text-indigo-600" size={32} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center mb-10">Our Team</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-6 transition-all hover:shadow-md"
                  >
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-indigo-600 font-bold text-xl">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-center">
                      {member.name}
                    </h3>
                    <p className="text-indigo-600 text-center mb-3">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-center">{member.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Vision Section */}
        {activeTab === "vision" && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex justify-center mb-6">
                <div className="bg-indigo-100 rounded-full p-3">
                  <Globe className="text-indigo-600" size={32} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Our Vision
              </h2>
              <p className="text-gray-700 text-lg text-center mb-8">
                We envision a world-class innovation hub where groundbreaking
                ideas flow seamlessly from research to market implementation,
                creating economic opportunity and solving critical challenges.
              </p>

              <div className="bg-indigo-50 p-6 rounded-lg">
                <p className="text-gray-700 italic text-center">
                  "By bringing transparency, efficiency, and connectivity to the
                  innovation ecosystem, we're building the foundation for the
                  next generation of world-changing ideas."
                </p>
              </div>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-l-4 border-indigo-500 pl-4">
                  <h3 className="font-semibold mb-2">Unified Platform</h3>
                  <p className="text-gray-600">
                    Creating a centralized hub for research, IPR, innovation,
                    and start-ups to thrive together
                  </p>
                </div>
                <div className="border-l-4 border-indigo-500 pl-4">
                  <h3 className="font-semibold mb-2">Streamlined Management</h3>
                  <p className="text-gray-600">
                    Simplifying processes to save time and resources while
                    improving outcomes
                  </p>
                </div>
                <div className="border-l-4 border-indigo-500 pl-4">
                  <h3 className="font-semibold mb-2">Data-Driven Decisions</h3>
                  <p className="text-gray-600">
                    Enabling smart resource allocation through transparent
                    information sharing
                  </p>
                </div>
                <div className="border-l-4 border-indigo-500 pl-4">
                  <h3 className="font-semibold mb-2">Collaborative Growth</h3>
                  <p className="text-gray-600">
                    Connecting stakeholders to accelerate innovation and
                    entrepreneurship
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
