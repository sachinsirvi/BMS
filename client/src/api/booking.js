import axiosInstance from "../api/axiosInstance";

// Make Payment
export const makePayment = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/bookings/make-payment", payload);
    return response.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

// Book a show (after successful payment)
export const bookShow = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/bookings/book-show", payload);
    return response.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

// Get all bookings for the current user
export const getAllBookings = async () => {
  try {
    const response = await axiosInstance.get(`/api/bookings/get-all-bookings-by-user`);
    return response.data;
  } catch (err) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
}
