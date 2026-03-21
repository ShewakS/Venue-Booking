import axios from "axios";
import BASE_URL from "../config";

const tokenKey = "scsb_auth_token";

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
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
