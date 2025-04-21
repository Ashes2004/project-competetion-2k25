import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Menu, X, Bell, User, Settings, LogOut } from 'lucide-react';
import {
  PlusCircle,
  TrendingUp,
  DollarSign,
  Users,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

// Sample data for startups
const startupData = [
  {
    id: 1,
    name: "TechSolve",
    domain: "SaaS",
    stage: "MVP",
    description: "AI-powered business analytics platform",
    website: "techsolve.io",
    team: 4,
    fundingGoal: 500000,
    fundingRaised: 200000,
    techStack: ["React", "Node.js", "TensorFlow", "flask", "PostgreSQL"],
    mentors: [{ name: "Dr. X", expertise: "AI/ML", status: "In Progress" }],
    monthlyVisitors: [1000, 1500, 2000, 2800, 3200],
    milestonesAchieved: 3,
    milestonesTotal: 5,
    resources: [
      { type: "Funding", amount: "₹2,00,000", status: "Approved" },
      { type: "Mentorship", mentor: "Dr. X (AI/ML)", status: "In Progress" },
      { type: "Office Space", location: "Tech Hub", status: "Pending" },
      {
        type: "Legal Support",
        provider: "LegalEase Inc.",
        status: "Available",
      },
    ],
  },
  {
    id: 2,
    name: "GreenMobility",
    domain: "Transportation",
    stage: "Prototype",
    description: "Electric vehicle sharing platform",
    website: "greenmobility.co",
    team: 3,
    fundingGoal: 300000,
    fundingRaised: 50000,
    techStack: ["Flutter", "Firebase", "Python"],
    mentors: [
      { name: "Sarah L.", expertise: "Sustainability", status: "Approved" },
    ],
    monthlyVisitors: [500, 800, 1200],
    milestonesAchieved: 2,
    milestonesTotal: 6,
    resources: [
      { type: "Funding", amount: "₹50,000", status: "In Progress" },
      {
        type: "Mentorship",
        mentor: "Sarah L. (Sustainability)",
        status: "Approved",
      },
      { type: "Office Space", location: "Green Hub", status: "Approved" },
      { type: "Legal Support", provider: "EcoLaw Ltd.", status: "Pending" },
    ],
  },
];

// Card for displaying startup information
const StartupCard = ({ startup, onView }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{startup.name}</h3>
          <p className="text-gray-600">{startup.domain}</p>
          <div className="mt-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium
            ${
              startup.stage === "Idea"
                ? "bg-gray-200 text-gray-700"
                : startup.stage === "Prototype"
                ? "bg-blue-100 text-blue-700"
                : startup.stage === "MVP"
                ? "bg-indigo-100 text-indigo-700"
                : startup.stage === "Launched"
                ? "bg-green-100 text-green-700"
                : "bg-purple-100 text-purple-700"
            }`}
            >
              {startup.stage}
            </span>
          </div>
        </div>
        <button
          onClick={() => onView(startup.id)}
          className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm font-medium"
        >
          View <ChevronRight size={16} />
        </button>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Users size={14} />
            <span>{startup.team} members</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <span>
              ₹{startup.fundingRaised / 1000}K / ₹{startup.fundingGoal / 1000}K
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Startup Stage Progression component
const StageProgressionStepper = ({ currentStage }) => {
  const stages = ["Idea", "Prototype", "MVP", "Launched", "Funded"];
  const currentIndex = stages.indexOf(currentStage);

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between w-full">
        {stages.map((stage, index) => (
          <React.Fragment key={stage}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center
                ${
                  index <= currentIndex
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`mt-2 text-xs font-medium
                ${index <= currentIndex ? "text-indigo-600" : "text-gray-500"}`}
              >
                {stage}
              </span>
            </div>
            {index < stages.length - 1 && (
              <div
                className={`h-1 w-full 
                ${index < currentIndex ? "bg-indigo-600" : "bg-gray-200"}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Resource Allocation Card
const ResourceCard = ({ resource }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between">
        <div>
          <h3 className="font-medium">{resource.type}</h3>
          {resource.amount && (
            <p className="text-gray-700">{resource.amount}</p>
          )}
          {resource.mentor && (
            <p className="text-gray-700">{resource.mentor}</p>
          )}
          {resource.location && (
            <p className="text-gray-700">{resource.location}</p>
          )}
          {resource.provider && (
            <p className="text-gray-700">{resource.provider}</p>
          )}
        </div>
        <span
          className={`px-2 py-1 h-6 flex items-center text-xs font-medium rounded-full
          ${
            resource.status === "Approved"
              ? "bg-green-100 text-green-700"
              : resource.status === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : resource.status === "In Progress"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {resource.status}
        </span>
      </div>
    </div>
  );
};

// Analytics Chart Component
const AnalyticsChart = ({ data, title }) => {
  const maxValue = Math.max(...data);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      <div className="h-24 flex items-end space-x-2">
        {data.map((value, index) => (
          <div
            key={index}
            className="bg-indigo-500 rounded-t w-full"
            style={{
              height: `${(value / maxValue) * 100}%`,
              opacity: 0.7 + index / (data.length * 2),
            }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>Jan</span>
        <span>Mar</span>
        <span>May</span>
      </div>
    </div>
  );
};

// Progress Circle Component
const ProgressCircle = ({ achieved, total, title }) => {
  const percentage = (achieved / total) * 100;
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
      <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#6366f1"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transform -rotate-90 origin-center"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-medium">{Math.round(percentage)}%</span>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        {achieved} of {total} completed
      </div>
    </div>
  );
};

// Remove the existing AddStartupModal component and add this one
const AddStartupModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    stage: "Idea",
    description: "",
    website: "",
    team: 1,
    fundingGoal: 0,
    fundingRaised: 0,
    techStack: [],
    monthlyVisitors: [0],
    milestonesAchieved: 0,
    milestonesTotal: 5,
    resources: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTechStackChange = (e) => {
    const techs = e.target.value.split(",").map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      techStack: techs
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: Date.now()
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Add New Startup</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Domain *</label>
            <input
              type="text"
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stage *</label>
            <select
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="Idea">Idea</option>
              <option value="Prototype">Prototype</option>
              <option value="MVP">MVP</option>
              <option value="Launched">Launched</option>
              <option value="Funded">Funded</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tech Stack *</label>
            <input
              type="text"
              name="techStack"
              value={formData.techStack.join(", ")}
              onChange={handleTechStackChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="React, Node.js, MongoDB"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Funding Goal (₹) *</label>
            <input
              type="number"
              name="fundingGoal"
              value={formData.fundingGoal}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
            >
              Add Startup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function StartupHub() {
  const navigate = useNavigate();
  const { startupId } = useParams();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddStartup = (newStartup) => {
    // Add logic to handle new startup
    console.log('New startup:', newStartup);
    setShowAddModal(false);
  };

  useEffect(() => {
    if (startupId) {
      const startup = startupData.find((s) => s.id === parseInt(startupId));
      if (startup) {
        setSelectedStartup(startup);
      }
    }
  }, [startupId]);
  
  
  const viewStartup = (id) => {
    const startup = startupData.find((s) => s.id === id);
    setSelectedStartup(startup);
    navigate(`/startup-hub/${id}`); // Add this line to update the URL
  };

  const closeDetails = () => {
    setSelectedStartup(null);
    navigate("/startup-hub"); // Add this line to return to the main dashboard
  };

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
              <a href="#" className="flex-shrink-0 flex items-center">
                <span className="text-indigo-600 font-bold text-xl">
                  StartupHub
                </span>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notifications Dropdown */}
              <div className="relative" ref={notificationRef}>
                <button
                  className="p-1.5 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={20} />
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-semibold">
                        Recent Notifications
                      </h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {/* Sample notifications - replace with your actual notifications */}
                      <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                        <p className="text-sm text-gray-600">
                          New message received
                        </p>
                        <p className="text-xs text-gray-400">2 minutes ago</p>
                      </div>
                      <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                        <p className="text-sm text-gray-600">
                          Profile update successful
                        </p>
                        <p className="text-xs text-gray-400">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  className="flex items-center"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <User size={16} />
                  </div>
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <a
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="mr-3" size={16} />
                      My Account
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="mr-3" size={16} />
                      Settings
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="mr-3" size={16} />
                      Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedStartup ? (
          <div className="bg-white shadow rounded-lg">
            {/* Startup Detail View */}
            <div className="border-b border-gray-200 px-8 py-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedStartup.name}
              </h2>
              <button
                onClick={closeDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      About
                    </h3>
                    <p className="text-gray-600">
                      {selectedStartup.description}
                    </p>

                    <div className="mt-4 flex items-center">
                      <ExternalLink size={16} className="text-gray-500 mr-2" />
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        {selectedStartup.website}
                      </a>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Progress
                    </h3>
                    <StageProgressionStepper
                      currentStage={selectedStartup.stage}
                    />
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedStartup.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Analytics
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <AnalyticsChart
                        data={selectedStartup.monthlyVisitors}
                        title="Monthly Visitors"
                      />
                      <ProgressCircle
                        achieved={selectedStartup.milestonesAchieved}
                        total={selectedStartup.milestonesTotal}
                        title="Milestones"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Resources
                  </h3>
                  <div>
                    {selectedStartup.resources.map((resource, index) => (
                      <ResourceCard key={index} resource={resource} />
                    ))}
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Funding Progress
                    </h3>
                    <div className="bg-white shadow rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          ₹{selectedStartup.fundingRaised / 1000}K raised
                        </span>
                        <span className="text-sm font-medium text-gray-600">
                          ₹{selectedStartup.fundingGoal / 1000}K goal
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{
                            width: `${
                              (selectedStartup.fundingRaised /
                                selectedStartup.fundingGoal) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <div className="mt-4 text-sm text-gray-600">
                        {Math.round(
                          (selectedStartup.fundingRaised /
                            selectedStartup.fundingGoal) *
                            100
                        )}
                        % of funding goal reached
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Dashboard Overview */}
            <div className="mb-8 md:flex md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  My Startups
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage and track all your startup ventures in one place
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Startup
                </button>
              </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-8">
                {/* Startup Cards Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {startupData.map((startup) => (
                    <StartupCard
                      key={startup.id}
                      startup={startup}
                      onView={viewStartup}
                    />
                  ))}
                </div>

                {/* Overall Progress Section */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Overall Progress
                  </h2>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="p-4 bg-indigo-50 rounded-lg">
                        <h3 className="text-sm font-medium text-indigo-800 mb-1">
                          Total Startups
                        </h3>
                        <p className="text-2xl font-bold text-indigo-900">
                          {startupData.length}
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h3 className="text-sm font-medium text-green-800 mb-1">
                          Active Projects
                        </h3>
                        <p className="text-2xl font-bold text-green-900">
                          {startupData.length}
                        </p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="text-sm font-medium text-blue-800 mb-1">
                          Total Funding
                        </h3>
                        <p className="text-2xl font-bold text-blue-900">
                          ₹
                          {startupData.reduce(
                            (sum, startup) => sum + startup.fundingRaised,
                            0
                          ) / 1000}
                          K
                        </p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h3 className="text-sm font-medium text-purple-800 mb-1">
                          Mentors
                        </h3>
                        <p className="text-2xl font-bold text-purple-900">2</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Recent Activity Section */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Recent Activity
                  </h2>
                  <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
                    <div className="p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <DollarSign size={16} className="text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            New funding received for TechSolve
                          </p>
                          <p className="text-xs text-gray-500">2 days ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <TrendingUp size={16} className="text-green-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            GreenMobility reached prototype stage
                          </p>
                          <p className="text-xs text-gray-500">4 days ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <Users size={16} className="text-indigo-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            New team member added to TechSolve
                          </p>
                          <p className="text-xs text-gray-500">1 week ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        <AddStartupModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddStartup}
        />
      </div>
    </div>
  );
}

export default StartupHub;
