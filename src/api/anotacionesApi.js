import axios from "axios";

const anotacionesApi = axios.create({
  baseURL: "http://localhost:5005",
});

anotacionesApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default anotacionesApi;