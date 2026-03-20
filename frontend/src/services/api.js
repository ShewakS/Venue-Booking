import axios from "axios";

const tokenKey = "scsb_auth_token";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(tokenKey);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const authTokenKey = tokenKey;

export default api;
