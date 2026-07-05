import axios from "axios";

const vidaApi = axios.create({
  baseURL: "http://localhost:5009",
});

vidaApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default vidaApi;