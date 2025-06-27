import axiosInstance from "./axiosInstance";

// Add Theatre
export const addTheatre = async (payload) => {
  try {
    const response = await axiosInstance.post('/api/theatres/add-theatre', payload);
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Something went wrong. Please try again.",
    };
  }
};

// Update Theatre
export const updateTheatre = async (payload) => {
  try {
    const theatreId = payload.theatreId;
    const response = await axiosInstance.put(`/api/theatres/update-theatre/${theatreId}`, payload);
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Something went wrong. Please try again.",
    };
  }
};

// Delete Theatre
export const deleteTheatre = async (payload) => {
  try {
    const theatreId = payload.theatreId;
    const response = await axiosInstance.delete(`/api/theatres/delete-theatre/${theatreId}`);
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Something went wrong. Please try again.",
    };
  }
};

// Get all theatres (Admin)
export const getAllTheatres = async () => {
  try {
    const response = await axiosInstance.get('/api/theatres/get-all-theatres');
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Something went wrong. Please try again.",
    };
  }
};

// Get all theatres by owner (Partner)
export const allPartnerTheatres = async (ownerId) => {
  try {
    const response = await axiosInstance.get(`/api/theatres/get-all-theatres-by-owner/${ownerId}`);
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Something went wrong. Please try again.",
    };
  }
};

// Update Theatre Status (Admin)
export const updateTheatreStatus = async (theatreId, isActive) => {
  try {
    const response = await axiosInstance.put(`/api/theatres/update-theatre-status/${theatreId}`, { isActive });
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Something went wrong. Please try again.",
    };
  }
};

