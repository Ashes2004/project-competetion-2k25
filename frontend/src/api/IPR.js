import axios from "axios";

const BASE_URL = "https://riise.koyeb.app/api/v1/ipr"; // change if needed

// Get all IPR records (Admin sees all, users see their own)
export const getAllIPRs = async () => 
  await axios.get(`${BASE_URL}/`, { withCredentials: true });

// Add a new IPR record
export const createIPR = async (data) =>
  await axios.post(`${BASE_URL}/add-ipr`, data, { withCredentials: true });

// Update an existing IPR record (Admin or owner only)
export const updateIPR = async (iprId, data) =>
  await axios.put(`${BASE_URL}/update-ipr/${iprId}`, data, { withCredentials: true });

// Delete an IPR record (Admin only)
export const deleteIPR = async (iprId) =>
  await axios.delete(`${BASE_URL}/delete-ipr/${iprId}`, { withCredentials: true });
