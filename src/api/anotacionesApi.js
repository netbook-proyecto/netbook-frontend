import axios from "axios";

const anotacionesApi = axios.create({
  baseURL: "http://100.27.206.126:5005/api"
});

anotacionesApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default anotacionesApi;