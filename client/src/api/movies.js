import axiosInstance from "../api/axiosInstance";

// Get all movies
export const getAllMovies = async () => {
  try {
    const response = await axiosInstance.get('/api/movies/get-all-movies');
    return response.data;
  } catch (err) {
    return { success: false, message: "Failed to fetch movies" };
  }
};

// Add new movie
export const addMovie = async (payload) => {
  try {
    const response = await axiosInstance.post('/api/movies/add-movie', payload);
    return response.data;
  } catch (err) {
    return { success: false, message: "Failed to add movie" };
  }
};

// Update existing movie
export const updateMovie = async ({ movieId, ...rest }) => {
  try {
    const response = await axiosInstance.put(`/api/movies/update-movie/${movieId}`, rest);
    return response.data;
  } catch (err) {
    return { success: false, message: "Failed to update movie" };
  }
};

// Delete movie by ID
export const deleteMovie = async ({ movieId }) => {
  try {
    const response = await axiosInstance.delete(`/api/movies/delete-movie/${movieId}`);
    return response.data;
  } catch (err) {
    return { success: false, message: "Failed to delete movie" };
  }
};

// get movie by id
export const getMovieById = async (movieId) => {
  try {
    const response = await axiosInstance.get(`/api/movies/get-movie/${movieId}`);
    return response.data;
  } catch (err) {
    return { success: false, message: "Failed to fetch movie" };
  }
}
