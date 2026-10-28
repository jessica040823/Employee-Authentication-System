import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.150.169:3000/api",
});

api.interceptors.request.use((config) =>{
  const token = localStorage.getItem("authToken");

  if(token)
  {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
});

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const response = await axios.post(
    "http://192.168.150.169:3000/api/auth/refresh",
    { refreshToken }
  );
  return response.data;
};
export default api;