// Create an axios instance with interceptor
// lib/axiosInstance.ts
import axios from 'axios';
import store from '../redux/store'; // your redux store

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_KEY },
});

// ✅ Attach token from Redux state on every request
axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;