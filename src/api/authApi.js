import axios from "axios";

const authApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/auth`,
});

export default authApi;