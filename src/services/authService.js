import api from "../api/axiosInstance";

// Register
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// Login
export const loginUser = async (loginData) => {
  const response = await api.post("/auth/login", loginData);
  return response.data;
};

// Get all services
export const getServices = async () => {
  const response = await api.get("/services");
  return response.data;
};

// Forgot Password
export const forgotpassword = async (email) => {
  const response = await api.post("/auth/forgetpassword", {
    email,
  });

  return response.data;
};
 
// Reset Password
export const resetpassword = async (resetData) => {
  const response = await api.post(
    "/auth/reset-password",
    resetData
  );

  return response.data;
};