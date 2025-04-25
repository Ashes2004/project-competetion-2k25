import React, { useState, useEffect } from 'react';
import { Search, Plus, FileText, BarChart2, PieChart, ListFilter, Trash2, Edit, Eye, Download, X, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Make sure to install axios: npm install axios
import Navbar from '../components/Navbar';

export default function ResearchDashboard() {
  const navigate = useNavigate();
  const API_BASE_URL = 'https://riise.koyeb.app/api/v1/research';

  useEffect(() => {
    const userEmail = sessionStorage.getItem('userEmail');  
    if (!userEmail || userEmail === 'undefined') {
      navigate('/auth');
    } else {
      fetchResearchPapers();
    }
  }, []);

  // State variables
  const [research, setResearch] = useState([]);
  const [filteredResearch, setFilteredResearch] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentResearch, setCurrentResearch] = useState(null);
  const [activeVisualization, setActiveVisualization] = useState('status');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filters, setFilters] = useState({
    year: 'all',
    sortBy: 'newest'
  });
  const [newResearch, setNewResearch] = useState({
    title: '',
    authors: '',
    abstract: '',
    doi: '',
    status: 'draft'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all research papers from the API
  const fetchResearchPapers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      else if(response.ok && data){
        setResearch(data);
        setFilteredResearch(data);
      } else {
        setResearch([]);
        setFilteredResearch([]);
      }
    } catch (err) {
      console.error("Error fetching research papers:", err);
      setError("Failed to load research papers. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Statistics for visualization
  const statusCounts = {
    published: research.filter(r => r.status === 'published').length,
    submitted: research.filter(r => r.status === 'submitted').length,
    draft: research.filter(r => r.status === 'draft').length
  };

  const yearCounts = research.reduce((acc, paper) => {
    const year = paper.created_at ? new Date(paper.created_at).getFullYear() : 'Unknown';
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  // Get unique years for filter
  const years = Array.from(new Set(research.map(paper => 
    paper.created_at ? new Date(paper.created_at).getFullYear() : 'Unknown'
  ))).sort((a, b) => b - a);

  // Search and filter functionality
  useEffect(() => {
    let results = [...research];
    
    // Filter by tab (status)
    if (activeTab !== 'all') {
      results = results.filter(paper => paper.status === activeTab);
    }
    
    // Filter by year
    if (filters.year !== 'all') {
      results = results.filter(paper => 
        paper.created_at && new Date(paper.created_at).getFullYear().toString() === filters.year
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(paper => 
        paper.title.toLowerCase().includes(term) ||
        paper.authors.toLowerCase().includes(term) ||
        (paper.abstract && paper.abstract.toLowerCase().includes(term)) ||
        (paper.doi && paper.doi.toLowerCase().includes(term))
      );
    }
    
    // Sort results
    if (filters.sortBy === 'newest') {
      results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (filters.sortBy === 'oldest') {
      results.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (filters.sortBy === 'title') {
      results.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    setFilteredResearch(results);
  }, [searchTerm, activeTab, research, filters]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResearch(prev => ({ ...prev, [name]: value }));
  };

  // Handle edit form input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentResearch(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission to add a new research paper
  const handleAddResearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/add-paper`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newResearch),
        credentials: 'include'
      });
      console.log(newResearch);
      
     
      
     
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      else {
        // Refresh the research papers list
        const data = await response.json();
        console.log(data);
        
        fetchResearchPapers();
        setShowAddForm(false);
        setNewResearch({
          title: '',
          authors: '',
          abstract: '',
          doi: '',
          status: 'draft'
        });
      }
    } catch (err) {
      console.error("Error adding research paper:", err);
      alert("Failed to add research paper. Please try again.");
    }
  };

  // Handle edit submission to update an existing research paper
  const handleUpdateResearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/update-paper/${currentResearch.paper_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentResearch),
        credentials: 'include'
      });
      const data = await response.json();
      console.log(currentResearch.paper_id , currentResearch);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
        else  {
        // Refresh the research papers list
        fetchResearchPapers();
        setShowEditModal(false);
        setCurrentResearch(null);
      }
    } catch (err) {
      console.error("Error updating research paper:", err);
      alert("Failed to update research paper. Please try again.");
    }
  };

  // Handle delete to remove a research paper
  const handleDeleteResearch = async (id) => {
    if (window.confirm('Are you sure you want to delete this research?')) {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.delete(`${API_BASE_URL}/delete-paper/${id}`, {
          "withCredentials": true
        });
        
        if (response.data) {
          // Refresh the research papers list
          fetchResearchPapers();
        }
      } catch (err) {
        console.error("Error deleting research paper:", err);
        alert("Failed to delete research paper. Please try again.");
      }
    }
  };

  // Handle view
  const handleViewResearch = (paper) => {
    setCurrentResearch(paper);
    setShowViewModal(true);
  };

  // Handle edit
  const handleEditResearch = (paper) => {
    setCurrentResearch({...paper});
    setShowEditModal(true);
  };

  // Handle export
  const handleExport = () => {
    const dataStr = JSON.stringify(filteredResearch, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'research-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar/>
       
      <header className="bg-indigo-600 mt-20 p-4 text-white">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Research Dashboard</h1>
          <button 
            className="bg-white text-indigo-600 px-4 py-2 rounded-lg flex items-center gap-2 font-medium hover:bg-gray-100"
            onClick={() => setShowAddForm(true)}
          >
            <Plus size={20} />
            Add Research
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 p-4">
          <nav>
            <ul className="space-y-2">
              <li className="mb-6">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Research Filters
                </h3>
                <button 
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'all' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('all')}
                >
                  <FileText size={20} />
                  All Research
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'published' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('published')}
                >
                  <FileText size={20} />
                  Published
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'submitted' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('submitted')}
                >
                  <FileText size={20} />
                  Submitted
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'draft' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('draft')}
                >
                  <FileText size={20} />
                  Drafts
                </button>
              </li>
              <li className="pt-6 pb-2">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Visualizations
                </h3>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 ${activeVisualization === 'status' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveVisualization('status')}
                >
                  <PieChart size={20} />
                  Status Distribution
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 ${activeVisualization === 'year' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveVisualization('year')}
                >
                  <BarChart2 size={20} />
                  Yearly Trends
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Search Bar */}
          <div className="mb-6 flex justify-between">
            <div className="relative w-1/2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="       Search by title, author, DOI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button 
                  className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                >
                  <ListFilter size={18} />
                  Filter
                </button>
                
                {showFilterMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg p-4 z-10 border border-gray-200">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        value={filters.year}
                        onChange={(e) => setFilters({...filters, year: e.target.value})}
                      >
                        <option value="all">All Years</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sort By
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        value={filters.sortBy}
                        onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="title">Title (A-Z)</option>
                      </select>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button 
                        className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                        onClick={() => setShowFilterMenu(false)}
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button 
                className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
                onClick={handleExport}
              >
                <Download size={18} />
                Export
              </button>
              <button 
                className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
                onClick={()=>{navigate('/research/find')}}
              >
                <Star size={18} />
                Explore More
              </button>
            </div>
          </div>

          {/* Research List */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">
                {activeTab === 'all' ? 'All Research' : 
                 activeTab === 'published' ? 'Published Research' : 
                 activeTab === 'submitted' ? 'Submitted Research' : 'Draft Research'}
              </h2>
              <p className="mt-1 text-sm text-gray-600">{filteredResearch.length} items found</p>
            </div>
            
            {isLoading ? (
              <div className="p-6 text-center text-gray-500">
                Loading research papers...
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">
                {error}
              </div>
            ) : filteredResearch.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No research papers found. Try changing your search criteria.
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredResearch.map((paper) => (
                  <li key={paper.paper_id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{paper.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{paper.authors}</p>
                        <div className="mt-2 flex items-center flex-wrap gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            paper.status === 'published' ? 'bg-green-100 text-green-800' :
                            paper.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {paper.status}
                          </span>
                          {paper.doi && (
                            <span className="text-xs text-gray-500">DOI: {paper.doi}</span>
                          )}
                          <span className="text-xs text-gray-500">
                            Created: {new Date(paper.created_at).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-gray-500">
                            Updated: {new Date(paper.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                        {paper.abstract && (
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{paper.abstract}</p>
                        )}
                      </div>
                      <div className="ml-4 flex shrink-0 space-x-2">
                        <button 
                          className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                          onClick={() => handleViewResearch(paper)}
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                          onClick={() => handleEditResearch(paper)}
                          title="Edit Research"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
                          onClick={() => handleDeleteResearch(paper.paper_id)}
                          title="Delete Research"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Visualization Section */}
          {activeVisualization === 'status' ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Research by Status</h2>
              <div className="h-64 flex items-end justify-around">
                {Object.entries(statusCounts).map(([status, count]) => (
                  <div key={status} className="flex flex-col items-center">
                    <div className="relative flex flex-col items-center">
                      <div 
                        className={`w-24 ${
                          status === 'published' ? 'bg-green-500' :
                          status === 'submitted' ? 'bg-blue-500' :
                          'bg-gray-500'
                        }`} 
                        style={{height: count ? `${count * 40}px` : '0'}}
                      ></div>
                      <span className="absolute -top-6 text-sm font-medium">{count}</span>
                    </div>
                    <span className="mt-2 text-sm font-medium capitalize">{status}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Research Publications by Year</h2>
              <div className="h-64 flex items-end justify-around">
                {Object.entries(yearCounts).map(([year, count]) => (
                  <div key={year} className="flex flex-col items-center">
                    <div className="relative flex flex-col items-center">
                      <div 
                        className="w-24 bg-indigo-500"
                        style={{height: count ? `${count * 40}px` : '0'}}
                      ></div>
                      <span className="absolute -top-6 text-sm font-medium">{count}</span>
                    </div>
                    <span className="mt-2 text-sm font-medium">{year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Add Research Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-medium text-gray-900">Add New Research</h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddResearch} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    value={newResearch.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Authors *
                  </label>
                  <input
                    type="text"
                    name="authors"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    value={newResearch.authors}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Abstract
                  </label>
                  <textarea
                    name="abstract"
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    value={newResearch.abstract}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DOI
                  </label>
                  <input
                    type="text"
                    name="doi"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    value={newResearch.doi}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    value={newResearch.status}
                    onChange={handleInputChange}
                  >
                    <option value="draft">Draft</option>
                    <option value="submitted">Submitted</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add Research
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Research Modal */}
      {showViewModal && currentResearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-medium text-gray-900">Research Details</h2>
              <button 
                onClick={() => {
                  setShowViewModal(false);
                  setCurrentResearch(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">{currentResearch.title}</h3>
                <p className="mt-2 text-lg text-gray-600">{currentResearch.authors}</p>
                
                <div className="mt-4 flex items-center gap-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    currentResearch.status === 'published' ? 'bg-green-100 text-green-800' :
                    currentResearch.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {currentResearch.status}
                  </span>
                  {currentResearch.doi && (
                    <span className="text-sm text-gray-600">DOI: {currentResearch.doi}</span>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Abstract</h4>
                <p className="text-gray-700">
                  {currentResearch.abstract || "No abstract available."}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-500">Created:</span>
                  <span className="ml-2">{new Date(currentResearch.created_at).toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Last Updated:</span>
                  <span className="ml-2">{new Date(currentResearch.updated_at).toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Paper ID:</span>
                  <span className="ml-2">{currentResearch.paper_id}</span>
                </div>
                {currentResearch.user_id && (
                  <div>
                    <span className="font-medium text-gray-500">User ID:</span>
                    <span className="ml-2">{currentResearch.user_id}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => {
                    setShowViewModal(false);
                    setCurrentResearch(null);
                  }}
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditResearch(currentResearch);
                  }}
                >
                  Edit Research
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Research Modal */}
      {showEditModal && currentResearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-medium text-gray-900">Edit Research</h2>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setCurrentResearch(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateResearch} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    value={currentResearch.title}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Authors *
                  </label>
                  <input
                    type="text"
                    name="authors"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    value={currentResearch.authors}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Abstract
                  </label>
                  <textarea
                    name="abstract"
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    value={currentResearch.abstract || ''}
                    onChange={handleEditChange}
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DOI
                  </label>
                  <input
                    type="text"
                    name="doi"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    value={currentResearch.doi || ''}
                    onChange={handleEditChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    value={currentResearch.status}
                    onChange={handleEditChange}
                  >
                    <option value="draft">Draft</option>
                    <option value="submitted">Submitted</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => {
                    setShowEditModal(false);
                    setCurrentResearch(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Update Research
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}