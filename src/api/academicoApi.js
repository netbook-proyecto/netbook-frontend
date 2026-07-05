import axios from "axios";

const academicoApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}:5004`,
});

academicoApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default academicoApi;