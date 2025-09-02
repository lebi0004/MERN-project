// frontend/lib/auth.ts
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api',
  withCredentials: true,
});

export const login = (email: string, password: string) =>
  API.post('/auth/login', { email, password });

export const logout = () => API.post('/auth/logout');

export const getMe = () => API.get('/auth/me');

// IMPORTANT: return the response `data` so the page can show the message
export const register = async (email: string, password: string) => {
  const { data } = await API.post('/auth/register', { email, password });
  return data; // { id, email, message }
};
