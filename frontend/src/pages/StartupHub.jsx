import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  X,
  PlusCircle,
  TrendingUp,
  Users,
  ChevronRight,
  Trash2,
  Edit,
} from "lucide-react";
import Navbar from "../components/Navbar";

// API service for startup data
const API_BASE_URL = "https://riise.koyeb.app";

// API functions
const fetchStartups = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/startups/`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch startups");
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
        body: JSON.stringify(startupData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add startup");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding startup:", error);
    throw error;
  }
};

const updateStartup = async (startupId, startupData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/startups/update-startup/${startupId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(startupData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update startup");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating startup:", error);
    throw error;
  }
};

const deleteStartup = async (startupId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/startups/delete-startup/${startupId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete startup");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting startup:", error);
    throw error;
  }
};

// Card for displaying startup information
const StartupCard = ({ startup, onView, onEdit, onDelete }) => {
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
            onClick={() => onEdit(startup)}
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(startup.startup_id)}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={() => onView(startup.startup_id)}
            className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm font-medium"
          >
            View <ChevronRight size={16} />
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
      setFormData({
        name: startup.name || "",
        description: startup.description || "",
        founder: startup.founder || "",
        industry: startup.industry || "",
        founded_date: startup.founded_date || "",
        status: startup.status || "Idea",
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
      const data = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

      // Add created_at only for new startups
      if (!isEditMode) {
        data.created_at = new Date().toISOString();
      }

      await onSubmit(data);
      onClose();
    } catch (error) {
      setError(
        `Failed to ${isEditMode ? "update" : "add"} startup. Please try again.`
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
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
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

// Confirmation Modal for Delete
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  startupName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Confirm Deletion
        </h2>
        <p className="mb-6 text-gray-600">
          Are you sure you want to delete "{startupName}"? This action cannot be
          undone.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
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
  const [startupToDelete, setStartupToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch startups from API
  useEffect(() => {
    const getStartups = async () => {
      try {
        const data = await fetchStartups();
        setStartups(data);
        setError(null);
      } catch (err) {
        setError("Failed to load startups. Please try again later.");
        console.error(err);
      }
    };

    getStartups();
  }, []);

  // Handle adding a new startup
  const handleAddStartup = async (newStartup) => {
    try {
      const addedStartup = await addStartup(newStartup);
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
      const updatedStartup = await updateStartup(
        startupToEdit.startup_id,
        updatedData
      );
      setStartups((prevStartups) =>
        prevStartups.map((s) =>
          s.startup_id === startupToEdit.startup_id ? updatedStartup : s
        )
      );

      // Update selected startup if it's the one being edited
      if (
        selectedStartup &&
        selectedStartup.startup_id === startupToEdit.startup_id
      ) {
        setSelectedStartup(updatedStartup);
      }

      return updatedStartup;
    } catch (error) {
      console.error("Error in handleUpdateStartup:", error);
      throw error;
    }
  };

  // Handle deleting a startup
  const handleDeleteStartup = async () => {
    try {
      await deleteStartup(startupToDelete);
      setStartups((prevStartups) =>
        prevStartups.filter((s) => s.startup_id !== startupToDelete)
      );

      // If the deleted startup was selected, clear the selection
      if (selectedStartup && selectedStartup.startup_id === startupToDelete) {
        closeDetails();
      }

      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error in handleDeleteStartup:", error);
      setError("Failed to delete startup. Please try again.");
    }
  };

  // Load selected startup from URL param
  useEffect(() => {
    if (startupId && startups.length > 0) {
      const startup = startups.find(
        (s) => s.startup_id === parseInt(startupId)
      );
      if (startup) {
        setSelectedStartup(startup);
      }
    }
  }, [startupId, startups]);

  // View startup details
  const viewStartup = (id) => {
    const startup = startups.find((s) => s.startup_id === id);
    setSelectedStartup(startup);
    navigate(`/startup-hub/${id}`);
  };

  // Edit startup
  const editStartup = (startup) => {
    setStartupToEdit(startup);
  };

  // Confirm delete startup
  const confirmDeleteStartup = (id) => {
    const startup = startups.find((s) => s.startup_id === id);
    setStartupToDelete(id);
    setShowDeleteModal(true);
  };

  // Close startup details view
  const closeDetails = () => {
    setSelectedStartup(null);
    navigate("/startup-hub");
  };

  // Get the name of the startup to delete
  const getStartupNameToDelete = () => {
    const startup = startups.find((s) => s.startup_id === startupToDelete);
    return startup ? startup.name : "";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedStartup ? (
          <div className="bg-white shadow rounded-lg">
            {/* Startup Detail View */}
            <div className="border-b border-gray-200 px-8 py-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedStartup.name}
              </h2>
              <div className="flex space-x-4">
                <button
                  onClick={() => editStartup(selectedStartup)}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  <Edit size={16} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() =>
                    confirmDeleteStartup(selectedStartup.startup_id)
                  }
                  className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
                <button
                  onClick={closeDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      About
                    </h3>
                    <p className="text-gray-600">
                      {selectedStartup.description ||
                        "No description available."}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Progress
                    </h3>
                    <StageProgressionStepper
                      currentStage={selectedStartup.status}
                    />
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Industry
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-800">
                        {selectedStartup.industry || "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Founder
                    </h3>
                    <p className="text-gray-600">
                      {selectedStartup.founder || "Not specified"}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Founded Date
                    </h3>
                    <p className="text-gray-600">
                      {selectedStartup.founded_date
                        ? new Date(
                            selectedStartup.founded_date
                          ).toLocaleDateString()
                        : "Not specified"}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Created
                    </h3>
                    <p className="text-gray-600">
                      {selectedStartup.created_at
                        ? new Date(
                            selectedStartup.created_at
                          ).toLocaleDateString()
                        : "Not specified"}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Last Updated
                    </h3>
                    <p className="text-gray-600">
                      {selectedStartup.updated_at
                        ? new Date(
                            selectedStartup.updated_at
                          ).toLocaleDateString()
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
                      key={startup.startup_id}
                      startup={startup}
                      onView={viewStartup}
                      onEdit={editStartup}
                      onDelete={confirmDeleteStartup}
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteStartup}
        startupName={getStartupNameToDelete()}
      />
    </div>
  );
}

export default StartupHub;
