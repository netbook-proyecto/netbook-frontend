import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:5001/api/auth",
});

export default authApi;