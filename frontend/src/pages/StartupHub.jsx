import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  X,
  PlusCircle,
  TrendingUp,
  Users,
  ChevronRight,
  Edit,
  Eye,
} from "lucide-react";
import Navbar from "../components/Navbar";

// API service for startup data
const API_BASE_URL = "https://riise.koyeb.app";

// Enhanced API functions with better error handling
const fetchStartups = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/startups/`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      throw new Error(
        `Failed to fetch startups: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching startups:", error);
    return [];
  }
};

const addStartup = async (startupData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/startups/add-startup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(startupData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      throw new Error(
        `Failed to add startup: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding startup:", error);
    throw error;
  }
};

const updateStartup = async (startupId, startupData) => {
  try {
    // Remove any timestamp or internal fields
    const { updated_at, created_at, startup_id, ...cleanData } = startupData;

    const response = await fetch(
      `${API_BASE_URL}/api/v1/startups/update-startup/${startupId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Add authorization if needed
          // "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        credentials: "include",
        body: JSON.stringify(cleanData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Update response status:", response.status);
      console.error("Server error response:", errorText);
      throw new Error(`Failed to update startup: ${response.status}`);
    }

    const result = await response.json();

    // Return merged data with preserved ID
    return {
      ...cleanData,
      ...result,
      startup_id: startupId,
    };
  } catch (error) {
    console.error("Error updating startup:", error);
    throw error;
  }
};

// Added StartupViewModal component for viewing details
const StartupViewModal = ({ isOpen, onClose, startup }) => {
  if (!isOpen || !startup) return null;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 max-h-90vh overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {startup.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Status Badge */}
          <div className="mb-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium
              ${
                startup.status === "Idea"
                  ? "bg-gray-200 text-gray-700"
                  : startup.status === "Prototype"
                  ? "bg-blue-100 text-blue-700"
                  : startup.status === "MVP"
                  ? "bg-indigo-100 text-indigo-700"
                  : startup.status === "Launched"
                  ? "bg-green-100 text-green-700"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {startup.status || "Unknown"}
            </span>
          </div>

          {/* Stage Progression */}
          <div className="my-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Stage Progress
            </h3>
            <StageProgressionStepper currentStage={startup.status} />
          </div>

          {/* Details */}
          <div className="border-t pt-4">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Industry</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {startup.industry || "Not specified"}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Founder</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {startup.founder || "Not specified"}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Founded Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDate(startup.founded_date)}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Description
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {startup.description || "No description provided"}
                </dd>
              </div>

              {startup.created_at && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Record Created
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(startup.created_at)}
                  </dd>
                </div>
              )}

              {startup.updated_at && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Last Updated
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(startup.updated_at)}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

// Card for displaying startup information (updated with view button)
const StartupCard = ({ startup, onEdit, onView }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{startup.name}</h3>
          <p className="text-gray-600">{startup.industry}</p>
          <div className="mt-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium
              ${
                startup.status === "Idea"
                  ? "bg-gray-200 text-gray-700"
                  : startup.status === "Prototype"
                  ? "bg-blue-100 text-blue-700"
                  : startup.status === "MVP"
                  ? "bg-indigo-100 text-indigo-700"
                  : startup.status === "Launched"
                  ? "bg-green-100 text-green-700"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {startup.status || "Unknown"}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onView(startup)}
            className="text-indigo-600 hover:text-indigo-800"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEdit(startup)}
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <Edit size={16} />
          </button>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Users size={14} />
            <span>Founded by {startup.founder || "Unknown"}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            {startup.founded_date && (
              <span>{new Date(startup.founded_date).getFullYear()}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Startup Stage Progression component
const StageProgressionStepper = ({ currentStage }) => {
  const stages = ["Idea", "Prototype", "MVP", "Launched", "Funded"];
  const currentIndex = stages.indexOf(currentStage || "Idea");

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between w-full">
        {stages.map((stage, index) => (
          <React.Fragment key={`stage-${stage}-${index}`}>
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

// StartupFormModal component for both add and edit
const StartupFormModal = ({ isOpen, onClose, onSubmit, startup = null }) => {
  const isEditMode = !!startup;
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    founder: "",
    industry: "",
    founded_date: "",
    status: "Idea",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Initialize form with startup data if in edit mode
  useEffect(() => {
    if (isEditMode && startup) {
      // Format the date for the date input (YYYY-MM-DD)
      let formattedDate = "";
      if (startup.founded_date) {
        const date = new Date(startup.founded_date);
        formattedDate = date.toISOString().split("T")[0];
      }

      setFormData({
        name: startup.name || "",
        description: startup.description || "",
        founder: startup.founder || "",
        industry: startup.industry || "",
        founded_date: formattedDate,
        status: startup.status || "Idea",
      });
    } else {
      // Reset form when not in edit mode
      setFormData({
        name: "",
        description: "",
        founder: "",
        industry: "",
        founded_date: "",
        status: "Idea",
      });
    }
  }, [startup, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Only include the form fields, remove timestamp handling
      const submissionData = { ...formData };

      console.log(
        `${isEditMode ? "Updating" : "Adding"} startup with data:`,
        submissionData
      );
      await onSubmit(submissionData);
      onClose();
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "adding"} startup:`,
        error
      );
      setError(
        `Failed to ${isEditMode ? "update" : "add"} startup: ${
          error.message || "Please try again."
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? "Edit Startup" : "Add New Startup"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name *
            </label>
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
            <label className="block text-sm font-medium text-gray-700">
              Industry
            </label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="Idea">Idea</option>
              <option value="Prototype">Prototype</option>
              <option value="MVP">MVP</option>
              <option value="Launched">Launched</option>
              <option value="Funded">Funded</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Founder
            </label>
            <input
              type="text"
              name="founder"
              value={formData.founder}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Founded Date
            </label>
            <input
              type="date"
              name="founded_date"
              value={formData.founded_date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Adding..."
                : isEditMode
                ? "Update Startup"
                : "Add Startup"}
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
  const [startups, setStartups] = useState([]);
  const [error, setError] = useState(null);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [startupToEdit, setStartupToEdit] = useState(null);
  const [startupToView, setStartupToView] = useState(null); // Added for view feature
  const [isLoading, setIsLoading] = useState(true);

  // Fetch startups from API
  useEffect(() => {
    const getStartups = async () => {
      setIsLoading(true);
      try {
        const data = await fetchStartups();
        console.log("Fetched startups:", data);
        setStartups(data);
        setError(null);
      } catch (err) {
        setError("Failed to load startups. Please try again later.");
        console.error("Error fetching startups:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getStartups();
  }, []);

  // Handle adding a new startup
  const handleAddStartup = async (newStartup) => {
    try {
      console.log("Adding new startup:", newStartup);
      const addedStartup = await addStartup(newStartup);
      console.log("Successfully added startup:", addedStartup);
      setStartups((prevStartups) => [...prevStartups, addedStartup]);
      return addedStartup;
    } catch (error) {
      console.error("Error in handleAddStartup:", error);
      throw error;
    }
  };

  // Handle updating a startup
  const handleUpdateStartup = async (updatedData) => {
    try {
      if (!startupToEdit?.startup_id) {
        throw new Error("Invalid startup selected for update");
      }

      // Create clean update data
      const updateData = {
        ...updatedData,
        startup_id: startupToEdit.startup_id,
      };

      const updatedStartup = await updateStartup(
        startupToEdit.startup_id,
        updateData
      );

      // Update local state
      setStartups((prevStartups) =>
        prevStartups.map((s) =>
          s.startup_id === startupToEdit.startup_id ? updatedStartup : s
        )
      );

      // Clear edit mode
      setStartupToEdit(null);
      setShowAddModal(false);

      return updatedStartup;
    } catch (error) {
      console.error("Error in handleUpdateStartup:", error);
      throw error;
    }
  };

  // Edit startup
  const editStartup = (startup) => {
    console.log("Editing startup:", startup);
    setStartupToEdit(startup);
  };

  // View startup details
  const viewStartup = (startup) => {
    console.log("Viewing startup details:", startup);
    setStartupToView(startup);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Loading startups...</p>
          </div>
        ) : (
          <>
            {/* Dashboard Summary */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Startup Dashboard
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Startups */}
                <div className="bg-white rounded-lg shadow px-6 py-5">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                      <TrendingUp size={24} />
                    </div>
                    <div className="ml-5">
                      <p className="text-sm font-medium text-gray-500">
                        Total Startups
                      </p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {startups.length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Add New Button */}
                <div className="bg-white rounded-lg shadow px-6 py-5 flex justify-center items-center">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  >
                    <PlusCircle size={20} />
                    <span>Add New Startup</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Startups List */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Your Startups
              </h2>

              {startups.length === 0 ? (
                <div className="bg-white shadow rounded-lg py-8 px-6 text-center">
                  <p className="text-gray-600 mb-4">
                    You don't have any startups yet. Add your first startup to
                    get started!
                  </p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  >
                    <PlusCircle size={20} />
                    <span>Add New Startup</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {startups.map((startup) => (
                    <StartupCard
                      key={`startup-${startup.startup_id}`}
                      startup={startup}
                      onEdit={editStartup}
                      onView={viewStartup}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Add Startup Modal */}
      <StartupFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddStartup}
      />

      {/* Edit Startup Modal */}
      <StartupFormModal
        isOpen={!!startupToEdit}
        onClose={() => setStartupToEdit(null)}
        onSubmit={handleUpdateStartup}
        startup={startupToEdit}
      />

      {/* View Startup Modal */}
      <StartupViewModal
        isOpen={!!startupToView}
        onClose={() => setStartupToView(null)}
        startup={startupToView}
      />
    </div>
  );
}

export default StartupHub;
