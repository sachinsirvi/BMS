import axiosInstance from "./axiosInstance";

// Add a new show
export const addShows = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/shows/add-show", payload);
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message || 'Add show failed',
    };
  }
};

// Get shows by theatre
export const getShowsByTheatre = async (theatreId) => {
  try {
    const response = await axiosInstance.get(`/api/shows/get-shows-by-theatre/${theatreId}`);
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message || 'Get shows failed',
    };
  }
};

// Get all theatres showing a movie on a specific date
export const getAllTheatresByMovie = async (movieId, date) => {
  try {
    const response = await axiosInstance.get(
      `/api/shows/get-all-theatres-by-movie/${movieId}/${date}`
    );
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message || 'Get theatres failed',
    };
  }
};

// Get show by ID
export const getShowById = async (showId) => {
  try {
    const response = await axiosInstance.get(`/api/shows/get-show-by-id/${showId}`);
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message || 'Get show failed',
    };
  }
};

// Delete a show by ID
export const deleteShow = async (showId) => {
  try {
    const response = await axiosInstance.delete(`/api/shows/delete-show/${showId}`);
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message || 'Delete show failed',
    };
  }
};

// Update a show by ID
export const updateShow = async (showId, payload) => {
  try {
    const response = await axiosInstance.put(`/api/shows/update-show/${showId}`, payload);
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message || 'Update show failed',
    };
  }
};
