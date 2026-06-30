import axios from "axios";

const estudiantesApi = axios.create({
  baseURL: "http://localhost:5002/api",
});

estudiantesApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default estudiantesApi;