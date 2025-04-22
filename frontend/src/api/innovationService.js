const API_BASE_URL = 'https://riise.koyeb.app/api/v1';

export const fetchInnovations = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.domain) queryParams.append('domain', filters.domain);
  if (filters.level) queryParams.append('level', filters.level);
  if (filters.status) queryParams.append('status', filters.status);
  
  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/innovations`;
  
  const response = await fetch(url, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch innovations');
  }
  
  return await response.json();
};

export const fetchInnovation = async (id) => {
  const response = await fetch(`${API_BASE_URL}/innovations`, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch innovation');
  }
  
  return await response.json();
};

export const createInnovation = async (data) => {
  const response = await fetch(`${API_BASE_URL}/innovations/add-innovation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to create innovation');
  }
  
  return await response.json();
};

export const updateInnovation = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/innovations/update-innovation/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to update innovation');
  }
  
  return await response.json();
};

export const deleteInnovation = async (id) => {
  const response = await fetch(`${API_BASE_URL}/innovations/delete-innovation/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete innovation');
  }
  
  return await response.json();
};

export const fetchDashboardSummary = async () => {
  try {
    // First try to fetch from a dedicated summary endpoint if available
    const response = await fetch(`${API_BASE_URL}/innovations/summary`, {
      credentials: 'include',
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    // If dedicated endpoint fails, fall back to calculating summary from all innovations
    console.log("Summary endpoint not available. Calculating summary from all innovations...");
    const allInnovations = await fetchInnovations();
    
    // Process data to create summary
    return processSummaryData(allInnovations);
  } catch (error) {
    // console.error("Error fetching dashboard summary:", error);
    // throw error;
  }
};

// Helper function to process innovation data into summary format
function processSummaryData(innovations) {
  // Initialize summary object
  const summary = {
    total: innovations.length,
    by_status: {
      draft: 0,
      submitted: 0,
      approved: 0,
    },
    by_domain: {},
    by_level: {
      institute: 0,
      state: 0,
      national: 0,
    }
  };
  
  // Process each innovation
  innovations.forEach(innovation => {
    // Count by status
    if (innovation.status) {
      const status = innovation.status.toLowerCase();
      if (summary.by_status[status] !== undefined) {
        summary.by_status[status]++;
      }
    }
    
    // Count by domain
    if (innovation.domain) {
      if (!summary.by_domain[innovation.domain]) {
        summary.by_domain[innovation.domain] = 0;
      }
      summary.by_domain[innovation.domain]++;
    }
    
    // Count by level
    if (innovation.level) {
      const level = innovation.level.toLowerCase();
      if (summary.by_level[level] !== undefined) {
        summary.by_level[level]++;
      }
    }
  });
  
  return summary;
}