import axios from "axios";

const mensajeriaApi = axios.create({
  baseURL: "http://localhost:5008",
});

mensajeriaApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default mensajeriaApi;