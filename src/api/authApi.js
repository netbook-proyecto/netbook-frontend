import axios from "axios";

const authApi = axios.create({
  baseURL: "http://100.27.206.126:5001/api",
});

export default authApi;