import axios from "axios";

const reportesApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}:5007`,
});

reportesApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default reportesApi;