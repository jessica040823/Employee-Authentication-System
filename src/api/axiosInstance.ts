import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.150.169:3000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  console.log("TOKEN BEING SENT:", token);
  console.log("REQUEST:", config.url);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// const refreshAccessToken = async () => {
//   const refreshToken = localStorage.getItem("refreshToken");
//   const response = await axios.post(
//     "http://192.168.150.169:3000/api/auth/refresh",
//     { refreshToken }
//   );
//   return response.data;
// };

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       try {
//         const data = await refreshAccessToken();

//         localStorage.setItem("authToken", data.accessToken);
//         localStorage.setItem("refreshToken", data.refreshToken);

//         error.config.headers.Authorization = `Bearer ${data.accessToken}`;
//         return api(error.config);
//       } catch (refreshError) {
//         localStorage.removeItem("authToken");
//         localStorage.removeItem("refreshToken");
//         window.location.href = "/auth/login";
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );


export default api;