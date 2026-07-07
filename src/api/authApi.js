import axios from "axios";

const authApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}:5001/api/auth`,
});

export default authApi;