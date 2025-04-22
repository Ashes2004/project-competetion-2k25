import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, FileText, Plus, Search, TrendingUp, Users, Award, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function IPRDashboard() {
  const [showFilingPage, setShowFilingPage] = useState(false);
  const [iprData, setIprData] = useState([]);
  const [startups, setStartups] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch IPR data when component mounts
  useEffect(() => {
    const fetchIprData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/v1/ipr/');
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        setIprData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching IPR data:', err);
      }
    };

    // For startups and users, we could use separate API endpoints
    // For this example, I'll use mock data for these since we weren't provided with endpoints
    setStartups([
      { startup_id: 1, name: 'TechInnovate' },
      { startup_id: 2, name: 'QuantumLeap' },
      { startup_id: 3, name: 'UrbanSmart' },
      { startup_id: 4, name: 'EcoSolutions' }
    ]);

    setUsers([
      { user_id: 1, name: 'John Smith' },
      { user_id: 2, name: 'Sarah Johnson' },
      { user_id: 3, name: 'Michael Chen' }
    ]);

    fetchIprData();
  }, []);

  // Add a new IPR record
  const handleAddIpr = async (newIpr) => {
    try {
      const response = await fetch('/api/v1/ipr/add-ipr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newIpr),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const addedIpr = await response.json();
      setIprData(prevData => [...prevData, addedIpr]);
      setShowFilingPage(false);
    } catch (err) {
      console.error('Error adding new IPR:', err);
      alert(`Failed to add new IPR: ${err.message}`);
    }
  };

  // Update an existing IPR record
  const handleUpdateIpr = async (updatedIpr) => {
    try {
      const response = await fetch(`/api/v1/ipr/update-ipr/${updatedIpr.ipr_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedIpr),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const updatedIprData = await response.json();
      setIprData(prevData => 
        prevData.map(ipr => ipr.ipr_id === updatedIprData.ipr_id ? updatedIprData : ipr)
      );
    } catch (err) {
      console.error('Error updating IPR:', err);
      alert(`Failed to update IPR: ${err.message}`);
    }
  };

  // Delete an IPR record
  const handleDeleteIpr = async (iprId) => {
    if (!window.confirm("Are you sure you want to delete this IPR record? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/ipr/delete-ipr/${iprId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      // Remove the deleted IPR from state
      setIprData(prevData => prevData.filter(ipr => ipr.ipr_id !== iprId));
    } catch (err) {
      console.error('Error deleting IPR:', err);
      alert(`Failed to delete IPR: ${err.message}`);
    }
  };

  // Toggle between dashboard and filing page
  const toggleFilingPage = () => {
    setShowFilingPage(!showFilingPage);
  };

  // Filter IPR data based on selected filters
  const filteredIprData = iprData.filter(ipr => {
    const matchesType = filterType === 'all' || ipr.ipr_type === filterType;
    const matchesStatus = filterStatus === 'all' || ipr.status === filterStatus;
    return matchesType && matchesStatus;
  });

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto animate-spin"></div>
        <p className="mt-4 text-gray-700">Loading IPR data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {showFilingPage ? (
        <IprFilingPage 
          onSubmit={handleAddIpr} 
          onCancel={toggleFilingPage} 
          startups={startups}
          users={users}
        />
      ) : (
        <Dashboard 
          iprData={filteredIprData} 
          startups={startups}
          users={users}
          onNewIpr={toggleFilingPage}
          onUpdateIpr={handleUpdateIpr}
          onDeleteIpr={handleDeleteIpr}
          filterType={filterType}
          setFilterType={setFilterType}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
      )}
    </div>
  );
}

function Dashboard({ 
  iprData, 
  startups, 
  users, 
  onNewIpr,
  onUpdateIpr,
  onDeleteIpr,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus 
}) {
  // Prepare data for charts
  const typeData = prepareTypeData(iprData);
  const statusData = prepareStatusData(iprData);
  const startupData = prepareStartupData(iprData, startups);
  const timelineData = prepareTimelineData(iprData);
  
  // Get unique IPR types and statuses for filters
  const iprTypes = ['all', ...new Set(iprData.map(ipr => ipr.ipr_type))];
  const iprStatuses = ['all', ...new Set(iprData.map(ipr => ipr.status))];

  return (
    <div>
    <Navbar/>
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">IPR Dashboard</h1>
        <button 
          onClick={onNewIpr}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus size={20} className="mr-2" />
          File New IPR
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap items-center gap-6">
        <div className="flex items-center">
          <Filter size={20} className="text-gray-500 mr-2" />
          <span className="font-medium">Filters:</span>
        </div>
        
        <div>
          <label className="mr-2">Type:</label>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="border rounded p-1"
          >
            {iprTypes.map(type => (
              <option key={type} value={type}>{type === 'all' ? 'All Types' : type}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="mr-2">Status:</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded p-1"
          >
            {iprStatuses.map(status => (
              <option key={status} value={status}>{status === 'all' ? 'All Statuses' : status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <SummaryCard 
          title="Total IPRs" 
          value={iprData.length} 
          icon={<FileText size={24} className="text-blue-500" />}
          color="bg-blue-100"
        />
        <SummaryCard 
          title="Pending IPRs" 
          value={iprData.filter(ipr => ipr.status === 'Pending').length} 
          icon={<Calendar size={24} className="text-yellow-500" />}
          color="bg-yellow-100" 
        />
        <SummaryCard 
          title="Approved IPRs" 
          value={iprData.filter(ipr => ipr.status === 'Approved').length}
          icon={<Award size={24} className="text-green-500" />} 
          color="bg-green-100"
        />
        <SummaryCard 
          title="Associated Startups" 
          value={new Set(iprData.map(ipr => ipr.related_startup_id)).size}
          icon={<TrendingUp size={24} className="text-purple-500" />}
          color="bg-purple-100" 
        />
      </div>

      {/* Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="IPR by Type">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="IPR Status Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getStatusColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="IPR by Startup">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={startupData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="IPR Filing Timeline">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* IPRs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">IPR Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filing Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Startup</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {iprData.map((ipr) => (
                <tr key={ipr.ipr_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ipr.ipr_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ipr.ipr_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ipr.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ipr.ipr_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ipr.filing_date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(ipr.status)}`}>
                      {ipr.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getStartupName(startups, ipr.related_startup_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          // This would typically open an edit modal or page
                          alert(`Edit functionality for IPR #${ipr.ipr_id} would be implemented here`);
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => onDeleteIpr(ipr.ipr_id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {iprData.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No IPR records found. Click "File New IPR" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
}

function IprFilingPage({ onSubmit, onCancel, startups, users }) {
  const [formData, setFormData] = useState({
    ipr_type: 'Patent',
    title: '',
    ipr_number: '',
    filing_date: '',
    status: 'Pending',
    related_startup_id: 1,
    user_id: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'related_startup_id' || name === 'user_id' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClear = () => {
    setFormData({
      ipr_type: 'Patent',
      title: '',
      ipr_number: '',
      filing_date: '',
      status: 'Pending',
      related_startup_id: 1,
      user_id: 1
    });
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Submit New Intellectual Property Right</h1>
          <p className="text-blue-100 mt-1">Complete the form below to register a new IPR</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* IPR Type */}
            <div>
              <label htmlFor="ipr_type" className="block text-sm font-medium text-gray-700 mb-1">
                IPR Type <span className="text-red-500">*</span>
              </label>
              <select
                id="ipr_type"
                name="ipr_type"
                value={formData.ipr_type}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              >
                <option value="Patent">Patent</option>
                <option value="Trademark">Trademark</option>
                <option value="Copyright">Copyright</option>
                <option value="Industrial Design">Industrial Design</option>
                <option value="Trade Secret">Trade Secret</option>
              </select>
            </div>
            
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                placeholder="Enter the IPR title"
              />
            </div>
            
            {/* IPR Number */}
            <div>
              <label htmlFor="ipr_number" className="block text-sm font-medium text-gray-700 mb-1">
                IPR Number (if available)
              </label>
              <input
                type="text"
                name="ipr_number"
                id="ipr_number"
                value={formData.ipr_number}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                placeholder="e.g., PT12345678"
              />
            </div>

            {/* Filing Date */}
            <div>
              <label htmlFor="filing_date" className="block text-sm font-medium text-gray-700 mb-1">
                Filing Date
              </label>
              <input
                type="date"
                name="filing_date"
                id="filing_date"
                value={formData.filing_date}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              />
            </div>
            
            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              >
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            
            {/* Related Startup */}
            <div>
              <label htmlFor="related_startup_id" className="block text-sm font-medium text-gray-700 mb-1">
                Related Startup
              </label>
              <select
                id="related_startup_id"
                name="related_startup_id"
                value={formData.related_startup_id}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              >
                {startups.map(startup => (
                  <option key={startup.startup_id} value={startup.startup_id}>
                    {startup.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* User ID - normally would be automatically set from logged-in user */}
            <div>
              <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-1">
                Filing User <span className="text-red-500">*</span>
              </label>
              <select
                id="user_id"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              >
                {users.map(user => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Helpful information */}
          <div className="mt-8 p-4 bg-blue-50 rounded-md border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Filing Guidelines</h3>
            <ul className="text-xs text-blue-700 list-disc pl-5 space-y-1">
              <li>Ensure your title is descriptive and accurately represents the IPR</li>
              <li>For patents, consider including a brief abstract of the invention</li>
              <li>Trademarks should have clear descriptions of goods and services</li>
              <li>Providing accurate filing dates helps track prosecution timelines</li>
              <li>Consult with legal counsel for specific filing requirements</li>
            </ul>
          </div>
          
          {/* Action buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear Form
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit IPR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helper Components
function SummaryCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`rounded-full p-3 ${color}`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-gray-500 text-sm">{title}</h3>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">{title}</h2>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

// Helper Functions
function prepareTypeData(iprData) {
  const typeCounts = {};
  iprData.forEach(ipr => {
    if (typeCounts[ipr.ipr_type]) {
      typeCounts[ipr.ipr_type]++;
    } else {
      typeCounts[ipr.ipr_type] = 1;
    }
  });
  
  return Object.keys(typeCounts).map(type => ({
    name: type,
    count: typeCounts[type]
  }));
}

function prepareStatusData(iprData) {
  const statusCounts = {};
  iprData.forEach(ipr => {
    if (statusCounts[ipr.status]) {
      statusCounts[ipr.status]++;
    } else {
      statusCounts[ipr.status] = 1;
    }
  });
  
  return Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status]
  }));
}

function prepareStartupData(iprData, startups) {
  const startupCounts = {};
  iprData.forEach(ipr => {
    const startupId = ipr.related_startup_id;
    if (startupId) {
      if (startupCounts[startupId]) {
        startupCounts[startupId]++;
      } else {
        startupCounts[startupId] = 1;
      }
    }
  });
  
  return Object.keys(startupCounts).map(startupId => {
    const startup = startups.find(s => s.startup_id === parseInt(startupId, 10));
    return {
      name: startup ? startup.name : `Startup ${startupId}`,
      count: startupCounts[startupId]
    };
  });
}

function prepareTimelineData(iprData) {
  // Group IPRs by filing date
  const dateGroups = {};
  iprData.forEach(ipr => {
    if (ipr.filing_date) {
      if (dateGroups[ipr.filing_date]) {
        dateGroups[ipr.filing_date]++;
      } else {
        dateGroups[ipr.filing_date] = 1;
      }
    }
  });
  
  // Convert to array sorted by date
  return Object.keys(dateGroups)
    .sort()
    .map(date => ({
      date,
      count: dateGroups[date]
    }));
}

function getStatusColor(status) {
  switch (status) {
    case 'Pending': return '#FBBF24';
    case 'Approved': return '#10B981';
    case 'Under Review': return '#3B82F6';
    case 'Rejected': return '#EF4444';
    default: return '#6B7280';
  }
}

function getStatusBadgeColor(status) {
  switch (status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    case 'Approved': return 'bg-green-100 text-green-800';
    case 'Under Review': return 'bg-blue-100 text-blue-800';
    case 'Rejected': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getStartupName(startups, startupId) {
  const startup = startups.find(s => s.startup_id === startupId);
  return startup ? startup.name : 'No Startup';
}

// Modal component for editing IPR records
function EditIprModal({ isOpen, onClose, ipr, startups, users, onSave }) {
  const [formData, setFormData] = useState({
    ipr_id: ipr?.ipr_id || '',
    ipr_type: ipr?.ipr_type || 'Patent',
    title: ipr?.title || '',
    ipr_number: ipr?.ipr_number || '',
    filing_date: ipr?.filing_date || '',
    status: ipr?.status || 'Pending',
    related_startup_id: ipr?.related_startup_id || 1,
    user_id: ipr?.user_id || 1
  });

  useEffect(() => {
    if (ipr) {
      setFormData({
        ipr_id: ipr.ipr_id,
        ipr_type: ipr.ipr_type,
        title: ipr.title,
        ipr_number: ipr.ipr_number,
        filing_date: ipr.filing_date,
        status: ipr.status,
        related_startup_id: ipr.related_startup_id,
        user_id: ipr.user_id
      });
    }
  }, [ipr]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'related_startup_id' || name === 'user_id' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Edit IPR Record</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* IPR Type */}
            <div>
              <label htmlFor="edit_ipr_type" className="block text-sm font-medium text-gray-700 mb-1">
                IPR Type <span className="text-red-500">*</span>
              </label>
              <select
                id="edit_ipr_type"
                name="ipr_type"
                value={formData.ipr_type}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              >
                <option value="Patent">Patent</option>
                <option value="Trademark">Trademark</option>
                <option value="Copyright">Copyright</option>
                <option value="Industrial Design">Industrial Design</option>
                <option value="Trade Secret">Trade Secret</option>
              </select>
            </div>
            
            {/* Title */}
            <div>
              <label htmlFor="edit_title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                id="edit_title"
                value={formData.title}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              />
            </div>
            
            {/* IPR Number */}
            <div>
              <label htmlFor="edit_ipr_number" className="block text-sm font-medium text-gray-700 mb-1">
                IPR Number
              </label>
              <input
                type="text"
                name="ipr_number"
                id="edit_ipr_number"
                value={formData.ipr_number}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              />
            </div>

            {/* Filing Date */}
            <div>
              <label htmlFor="edit_filing_date" className="block text-sm font-medium text-gray-700 mb-1">
                Filing Date
              </label>
              <input
                type="date"
                name="filing_date"
                id="edit_filing_date"
                value={formData.filing_date}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              />
            </div>
            
            {/* Status */}
            <div>
              <label htmlFor="edit_status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="edit_status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              >
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            
            {/* Related Startup */}
            <div>
              <label htmlFor="edit_related_startup_id" className="block text-sm font-medium text-gray-700 mb-1">
                Related Startup
              </label>
              <select
                id="edit_related_startup_id"
                name="related_startup_id"
                value={formData.related_startup_id}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              >
                {startups.map(startup => (
                  <option key={startup.startup_id} value={startup.startup_id}>
                    {startup.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* User ID */}
            <div>
              <label htmlFor="edit_user_id" className="block text-sm font-medium text-gray-700 mb-1">
                Filing User
              </label>
              <select
                id="edit_user_id"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              >
                {users.map(user => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Error handling component
function ErrorAlert({ message, onDismiss }) {
  return (
    <div className="fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md flex items-center justify-between">
      <div className="flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <span>{message}</span>
      </div>
      <button onClick={onDismiss} className="ml-4 text-red-700 hover:text-red-900">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}

// Success notification component
function SuccessNotification({ message, onDismiss }) {
  return (
    <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md flex items-center justify-between">
      <div className="flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span>{message}</span>
      </div>
      <button onClick={onDismiss} className="ml-4 text-green-700 hover:text-green-900">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}

// Extended Dashboard component with editing functionality
function Dashboard({ 
  iprData, 
  startups, 
  users, 
  onNewIpr,
  onUpdateIpr,
  onDeleteIpr,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus 
}) {
  const [editingIpr, setEditingIpr] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Prepare data for charts
  const typeData = prepareTypeData(iprData);
  const statusData = prepareStatusData(iprData);
  const startupData = prepareStartupData(iprData, startups);
  const timelineData = prepareTimelineData(iprData);
  
  // Get unique IPR types and statuses for filters
  const iprTypes = ['all', ...new Set(iprData.map(ipr => ipr.ipr_type))];
  const iprStatuses = ['all', ...new Set(iprData.map(ipr => ipr.status))];

  const handleEditClick = (ipr) => {
    setEditingIpr(ipr);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedIpr) => {
    try {
      await onUpdateIpr(updatedIpr);
      setSuccess("IPR successfully updated!");
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleDeleteClick = async (iprId) => {
    try {
      await onDeleteIpr(iprId);
      setSuccess("IPR successfully deleted!");
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <div>
      <Navbar/>
      <div className="container mx-auto px-4 py-8">
        {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
        {success && <SuccessNotification message={success} onDismiss={() => setSuccess(null)} />}
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">IPR Dashboard</h1>
          <button 
            onClick={onNewIpr}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus size={20} className="mr-2" />
            File New IPR
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap items-center gap-6">
          <div className="flex items-center">
            <Filter size={20} className="text-gray-500 mr-2" />
            <span className="font-medium">Filters:</span>
          </div>
          
          <div>
            <label className="mr-2">Type:</label>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="border rounded p-1"
            >
              {iprTypes.map(type => (
                <option key={type} value={type}>{type === 'all' ? 'All Types' : type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="mr-2">Status:</label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded p-1"
            >
              {iprStatuses.map(status => (
                <option key={status} value={status}>{status === 'all' ? 'All Statuses' : status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <SummaryCard 
            title="Total IPRs" 
            value={iprData.length} 
            icon={<FileText size={24} className="text-blue-500" />}
            color="bg-blue-100"
          />
          <SummaryCard 
            title="Pending IPRs" 
            value={iprData.filter(ipr => ipr.status === 'Pending').length} 
            icon={<Calendar size={24} className="text-yellow-500" />}
            color="bg-yellow-100" 
          />
          <SummaryCard 
            title="Approved IPRs" 
            value={iprData.filter(ipr => ipr.status === 'Approved').length}
            icon={<Award size={24} className="text-green-500" />} 
            color="bg-green-100"
          />
          <SummaryCard 
            title="Associated Startups" 
            value={new Set(iprData.map(ipr => ipr.related_startup_id)).size}
            icon={<TrendingUp size={24} className="text-purple-500" />}
            color="bg-purple-100" 
          />
        </div>

        {/* Charts & Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard title="IPR by Type">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="IPR Status Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getStatusColor(entry.name)} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="IPR by Startup">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={startupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="IPR Filing Timeline">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* IPRs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">IPR Records</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filing Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Startup</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {iprData.map((ipr) => (
                  <tr key={ipr.ipr_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ipr.ipr_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ipr.ipr_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ipr.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ipr.ipr_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ipr.filing_date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(ipr.status)}`}>
                        {ipr.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getStartupName(startups, ipr.related_startup_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleEditClick(ipr)}
                        >
                          Edit
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteClick(ipr.ipr_id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {iprData.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                      No IPR records found. Click "File New IPR" to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditIprModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        ipr={editingIpr}
        startups={startups}
        users={users}
        onSave={handleSaveEdit}
      />
    </div>
  );
}