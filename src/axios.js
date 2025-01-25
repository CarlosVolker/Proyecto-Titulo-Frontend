import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://proyecto-titulo-backend.onrender.com/api/", // URL base según tu backend
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

export default axiosInstance;