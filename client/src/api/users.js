import axiosInstance from './axiosInstance.js';

// user register
export const RegisterUser = async (values) => {
    try {
        const response = await axiosInstance.post('/api/users/register', values);
        return response.data;
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Something went wrong. Please try again.",
          };
    }
}

// user login
export const LoginUser = async (values) => {
    try {
        const response = await axiosInstance.post('/api/users/login', values);
        return response.data;
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Something went wrong. Please try again.",
          };
    }
}

// forgot password
export const ForgotPassword = async (values) => {
    try {
        const response = await axiosInstance.patch('/api/users/forgot-password', values);
        return response.data;
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Something went wrong. Please try again.",
          };
    }
}

// reset password
export const ResetPassword = async (values) => {
    try {
        const response = await axiosInstance.patch('/api/users/reset-password', values);
        return response.data;
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Something went wrong. Please try again.",
          };
    }
}

// get current user
export const GetCurrentUser = async () => {
    try {
        const response = await axiosInstance.get('/api/users/get-current-user');
        return response.data;
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Something went wrong. Please try again.",
          };
    }
}

export const GetAllPartners = async () => {
    try {
        const response = await axiosInstance.get('/api/users/get-all-partners');
        return response.data;
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Something went wrong. Please try again.",
          };
    }
};

export const ApprovePartner = async (userId) => {
    try {
        const response = await axiosInstance.post('/api/users/approve-partner', { userId });
        return response.data;
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Something went wrong. Please try again.",
          };
    }
};

export const RejectPartner = async (userId) => {
    try {
      const response = await axiosInstance.post('/api/users/reject-partner', { userId });
      return response.data;
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Something went wrong. Please try again.",
          };
    }
  };
  