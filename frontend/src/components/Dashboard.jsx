import React, { useState, useEffect } from 'react';
import InnovationList from './InnovationList';
import InnovationForm from './InnovationForm';
import DashboardSummary from './DashboardSummary';
import { fetchInnovations, fetchDashboardSummary } from '../api/innovationService';

const Dashboard = () => {
  const [innovations, setInnovations] = useState([]);
  const [summary, setSummary] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [filters, setFilters] = useState({
    domain: '',
    level: '',
    status: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedInnovation, setSelectedInnovation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [filters]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch innovations with filters
      const innovationsData = await fetchInnovations(filters);
      setInnovations(Array.isArray(innovationsData) ? innovationsData : 
                    (innovationsData.innovations || []));
      
      // Only fetch summary data when on summary tab or when first loading
      if (activeTab === 'summary' || !summary) {
        const summaryData = await fetchDashboardSummary();
        setSummary(summaryData);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("Failed to load data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleInnovationSelect = (innovation) => {
    setSelectedInnovation(innovation);
    setShowForm(true);
  };

  const handleFormClose = (refresh = false) => {
    setSelectedInnovation(null);
    setShowForm(false);
    if (refresh) {
      loadDashboardData();
    }
  };

  const handleAddNew = () => {
    setSelectedInnovation(null);
    setShowForm(true);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'summary' && !summary) {
      loadDashboardData();
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-md p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Innovation Management Dashboard</h1>
          <button 
            onClick={handleAddNew} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Innovation
          </button>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button 
                className={`py-4 px-6 font-medium text-sm border-b-2 focus:outline-none ${
                  activeTab === 'summary' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleTabChange('summary')}
              >
                Dashboard Summary
              </button>
              <button 
                className={`py-4 px-6 font-medium text-sm border-b-2 focus:outline-none ${
                  activeTab === 'list' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleTabChange('list')}
              >
                Innovations List
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-red-500 text-center">
                  <p className="text-lg font-medium">{error}</p>
                  <button 
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={loadDashboardData}
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <>
                {activeTab === 'summary' && (
                  <DashboardSummary summary={summary} />
                )}
                
                {activeTab === 'list' && (
                  <div>
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                        <select 
                          value={filters.domain} 
                          onChange={(e) => handleFilterChange('domain', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="">All Domains</option>
                          <option value="Technology">Technology</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Education">Education</option>
                          <option value="Agriculture">Agriculture</option>
                          <option value="Environment">Environment</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                        <select 
                          value={filters.level} 
                          onChange={(e) => handleFilterChange('level', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="">All Levels</option>
                          <option value="institute">Institute</option>
                          <option value="state">State</option>
                          <option value="national">National</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select 
                          value={filters.status} 
                          onChange={(e) => handleFilterChange('status', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="">All Status</option>
                          <option value="draft">Draft</option>
                          <option value="submitted">Submitted</option>
                          <option value="approved">Approved</option>
                        </select>
                      </div>
                    </div>
                    
                    {innovations.length > 0 ? (
                      <InnovationList 
                        innovations={innovations} 
                        onSelect={handleInnovationSelect} 
                        onRefresh={loadDashboardData} 
                      />
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-gray-500 mb-4">No innovations found matching your criteria</p>
                        <button
                          onClick={handleAddNew}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                        >
                          Add New Innovation
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-screen overflow-y-auto">
            <InnovationForm 
              innovation={selectedInnovation} 
              onClose={handleFormClose} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;