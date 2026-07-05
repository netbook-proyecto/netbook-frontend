import axios from "axios";

const anotacionesApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}:5005/api`,
});

anotacionesApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default anotacionesApi;