import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  LineChart, Line, AreaChart, Area, 
  ResponsiveContainer 
} from 'recharts';

const DashboardSummary = ({ summary }) => {
  const [timeRange, setTimeRange] = useState('monthly');
  
  // Ensure summary exists and has the expected structure
  if (!summary) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Loading summary data...</p>
      </div>
    );
  }

  // Transform data for charts
  const statusData = [
    { name: 'Draft', value: summary.by_status?.draft || 0, color: '#3B82F6' },
    { name: 'Submitted', value: summary.by_status?.submitted || 0, color: '#10B981' },
    { name: 'Approved', value: summary.by_status?.approved || 0, color: '#F59E0B' },
  ].filter(item => item.value > 0);
  
  // Create domain data array from summary.by_domain object
  const domainData = Object.entries(summary.by_domain || {}).map(([key, value]) => ({
    name: key,
    value: value || 0
  })).filter(item => item.value > 0);
  
  // Create level data array from summary.by_level object
  const levelData = Object.entries(summary.by_level || {}).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: value || 0
  })).filter(item => item.value > 0);

  // Mock time series data for trends - in production, this would come from the API
  const mockTimeSeriesData = {
    monthly: [
      { name: 'Jan', value: 12 },
      { name: 'Feb', value: 19 },
      { name: 'Mar', value: 15 },
      { name: 'Apr', value: 21 },
      { name: 'May', value: 28 },
      { name: 'Jun', value: 24 },
    ],
    quarterly: [
      { name: 'Q1', value: 46 },
      { name: 'Q2', value: 73 },
      { name: 'Q3', value: 62 },
      { name: 'Q4', value: 51 },
    ],
    yearly: [
      { name: '2022', value: 185 },
      { name: '2023', value: 212 },
      { name: '2024', value: 232 },
    ]
  };
  
  // Mock data for innovation progress distribution
  const progressData = [
    { name: 'Concept Stage', value: 35 },
    { name: 'Development', value: 45 },
    { name: 'Testing', value: 30 },
    { name: 'Deployment', value: 20 },
    { name: 'Completed', value: 15 },
  ];

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-5 text-white">
          <div className="text-lg font-medium mb-1">Total Innovations</div>
          <div className="text-3xl font-bold">{summary.total || 0}</div>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg shadow p-5 text-white">
          <div className="text-lg font-medium mb-1">Draft</div>
          <div className="text-3xl font-bold">{summary.by_status?.draft || 0}</div>
        </div>
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg shadow p-5 text-white">
          <div className="text-lg font-medium mb-1">Submitted</div>
          <div className="text-3xl font-bold">{summary.by_status?.submitted || 0}</div>
        </div>
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg shadow p-5 text-white">
          <div className="text-lg font-medium mb-1">Approved</div>
          <div className="text-3xl font-bold">{summary.by_status?.approved || 0}</div>
        </div>
      </div>
      
      {/* First Row of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Distribution</h3>
          {statusData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} innovations`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">No status data available</p>
            </div>
          )}
        </div>
        
        {/* Domain Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Innovation by Domain</h3>
          {domainData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={domainData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(value) => [`${value} innovations`, 'Count']} />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">No domain data available</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Second Row of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Innovation Trends */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Innovation Trends</h3>
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button 
                className={`px-3 py-1 text-sm ${timeRange === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setTimeRange('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`px-3 py-1 text-sm border-l border-gray-300 ${timeRange === 'quarterly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setTimeRange('quarterly')}
              >
                Quarterly
              </button>
              <button 
                className={`px-3 py-1 text-sm border-l border-gray-300 ${timeRange === 'yearly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setTimeRange('yearly')}
              >
                Yearly
              </button>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTimeSeriesData[timeRange]}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} innovations`, 'Count']} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Level Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Innovation by Level</h3>
          {levelData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={levelData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} innovations`, 'Count']} />
                  <Legend />
                  <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">No level data available</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Third Row of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Innovation Progress Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={progressData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {progressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} innovations`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Monthly Comparisons */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Innovation Comparisons</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { name: 'Jan', current: 12, previous: 8 },
                  { name: 'Feb', current: 19, previous: 15 },
                  { name: 'Mar', current: 15, previous: 12 },
                  { name: 'Apr', current: 21, previous: 18 },
                  { name: 'May', current: 28, previous: 23 },
                  { name: 'Jun', current: 24, previous: 29 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  `${value} innovations`, 
                  name === 'current' ? 'Current Year' : 'Previous Year'
                ]} />
                <Legend 
                  formatter={(value) => value === 'current' ? 'Current Year' : 'Previous Year'}
                />
                <Line 
                  type="monotone" 
                  dataKey="current" 
                  stroke="#3B82F6" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="previous" 
                  stroke="#9CA3AF" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={{ r: 4 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;