
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchInnovations, fetchDashboardSummary, deleteInnovation } from '../api/innovationService';
import DashboardSummary from '../components/DashboardSummary';
import InnovationForm from '../components/InnovationForm'; 
import './Innovation.css'; 
import Navbar from '../components/Navbar';
const Innovation = () => {
  const [innovations, setInnovations] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [showForm, setShowForm] = useState(false);
  const [selectedInnovation, setSelectedInnovation] = useState(null);
  const [filters, setFilters] = useState({
    domain: '',
    level: '',
    status: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [filters]);



  useEffect(()=>{
       const userEmail =  sessionStorage.getItem('userEmail');  
       if (!userEmail || userEmail == 'undefined') {
        navigate('/auth')
       }
  },[])
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch innovations with applied filters
      const innovationsData = await fetchInnovations(filters);
      setInnovations(innovationsData);
      
      // Fetch dashboard summary statistics
      const summaryData = await fetchDashboardSummary();
      setSummary(summaryData);
      
      setError(null);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load innovations data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddNew = () => {
    setSelectedInnovation(null);
    setShowForm(true);
  };

  const handleEdit = (innovation) => {
    setSelectedInnovation(innovation);
    setShowForm(true);
  };

  const handleView = (id) => {
    navigate(`/innovations/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this innovation?")) {
      try {
        await deleteInnovation(id);
        loadData(); // Reload data after deletion
      } catch (err) {
        console.error("Error deleting innovation:", err);
        setError("Failed to delete innovation.");
      }
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    loadData(); // Reload data after form submission
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'draft': return 'status-badge draft';
      case 'submitted': return 'status-badge submitted';
      case 'approved': return 'status-badge approved';
      default: return 'status-badge';
    }
  };

  if (loading && !innovations.length) {
    return (
      <div className="flex justify-center items-center p-8">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
    );
  }

  return (
    <div>
      <Navbar/>
      <div className='h-24'></div>
    <div className="innovation-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Innovation Management</h1>
          <p>Track, manage, and analyze innovation projects</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-primary" 
            onClick={handleAddNew}
          >
            Add New Innovation
          </button>
        </div>
      </div>

      {error && (
        <div className="error-alert">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => handleTabChange('summary')}
          >
            Dashboard
          </button>
          <button 
            className={`tab ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => handleTabChange('list')}
          >
            All Innovations
          </button>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'summary' && summary && (
          <DashboardSummary summary={summary} />
        )}

        {activeTab === 'list' && (
          <div className="innovations-list-container">
            <div className="filters-section">
              <div className="filters-grid">
                <div className="filter-item">
                  <label htmlFor="domain-filter">Domain</label>
                  <select 
                    id="domain-filter"
                    name="domain"
                    value={filters.domain}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Domains</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Environment">Environment</option>
                  </select>
                </div>

                <div className="filter-item">
                  <label htmlFor="level-filter">Level</label>
                  <select 
                    id="level-filter"
                    name="level"
                    value={filters.level}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Levels</option>
                    <option value="institute">Institute</option>
                    <option value="state">State</option>
                    <option value="national">National</option>
                  </select>
                </div>

                <div className="filter-item">
                  <label htmlFor="status-filter">Status</label>
                  <select 
                    id="status-filter"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="submitted">Submitted</option>
                    <option value="approved">Approved</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="table-container">
              <table className="innovations-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Domain</th>
                    <th>Level</th>
                    <th>Status</th>
                    <th>Submitted On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {innovations.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        <p>No innovations found matching your criteria</p>
                      </td>
                    </tr>
                  ) : (
                    innovations.map((innovation) => (
                      <tr key={innovation.innovation_id}>
                        <td className="title-cell">{innovation.title}</td>
                        <td >{innovation.user_id || 'N/A'}</td>
                        <td>{innovation.domain || 'N/A'}</td>
                        <td>{innovation.level || 'N/A'}</td>
                        <td>
                          <span className={getStatusClass(innovation.status)}>
                            {innovation.status ? innovation.status.charAt(0).toUpperCase() + innovation.status.slice(1) : 'N/A'}
                          </span>
                        </td>
                        <td>{innovation.submitted_on || 'Not submitted'}</td>
                        <td className="actions-cell">
                          <button 
                            className="btn-icon view" 
                            onClick={() => handleView(innovation.innovation_id)}
                            title="View Details"
                          >
                            View
                          </button>
                          <button 
                            className="btn-icon edit" 
                            onClick={() => handleEdit(innovation)}
                            title="Edit"
                          >
                            Edit
                          </button>
                          <button 
                            className="btn-icon delete" 
                            // onClick={() => handleDelete(innovation.innovation_id)}
                            title="Delete"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-backdrop" onClick={handleFormCancel}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedInnovation ? 'Edit Innovation' : 'Add New Innovation'}</h2>
              <button className="close-btn" onClick={handleFormCancel}>×</button>
            </div>
            <div className="modal-body">
              <InnovationForm 
                innovation={selectedInnovation} 
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Innovation;