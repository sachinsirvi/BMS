import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://bookmyshow-fy4x.onrender.com/api",
  headers: {
    "Content-Type": "application/json"
  },
});

axiosInstance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;
