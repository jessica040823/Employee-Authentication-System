import api from "../api/axiosInstance";

type Id = string;
type Data = any;

export const registerUser = async (userData: Data) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (loginData: Data) => {
  const response = await api.post("/auth/login", loginData);
  return response.data;
};

export const forgotpassword = async (email: string) => {
  const response = await api.post("/auth/forgot-password", {
    email,
  });
  return response.data;
};

export const resetpassword = async (resetData: Data) => {
  const response = await api.post("/auth/reset-password", resetData);
  return response.data;
};

export const getServices = async () => {
  const response = await api.get("/services");
  return response.data;
};

export const contactUs = async (contactData: Data) => {
  const response = await api.post("/contact", contactData);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const updateProfile = async (profileData: Data) => {
  const response = await api.patch("/profile", profileData);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const updateUser = async ({ id, data }: { id: Id; data: Data }) => {
  const response = await api.patch(`/admin/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: Id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const makeAdmin = async (id: string) => {
  const response = await api.patch(`/admin/users/${id}/make-admin`);
  return response.data;
};

export const removeAdmin = async (id: string) => {
  const response = await api.patch(`/admin/users/${id}/remove-admin`);
  return response.data;
};

export const getQueries = async () => {
  const response = await api.get("/contact");
  return response.data;
};

export const getQuery = async (id: Id) => {
  const response = await api.get(`/contact/${id}`);
  return response.data;
};

export const getQueryStats = async () => {
  const response = await api.get("/contact/stats");
  return response.data;
};

export const deleteQuery = async (id: Id) => {
  const response = await api.delete(`/contact/${id}`);
  return response.data;
};

export const markQueryRead = async (id: Id) => {
  const response = await api.patch(`/contact/${id}/read`, {
    isRead: true,
  });
  return response.data;
};

export const createService = async (data: Data) => {
  const response = await api.post("/services", data);
  return response.data;
};

export const updateService = async ({ id, data }: { id: Id; data: Data }) => {
  const response = await api.patch(`/services/${id}`, data);
  return response.data;
};

export const deleteService = async (id: Id) => {
  const response = await api.delete(`/services/${id}`);
  return response.data;
};

