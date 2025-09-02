// frontend/lib/authApi.ts
import axios from 'axios';

/** Central axios client for API calls */
export const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api',
  withCredentials: true, // send/receive cookies for auth
});

/** The shape of the /auth/me response */
export type User = {
  id: string;
  email: string;
};

/** Who am I? (requires cookie) */
export async function getMe(): Promise<User> {
  const { data } = await API.get<User>('/auth/me');
  return data;
}

/** Logout (clears cookie) */
export async function logout(): Promise<{ message: string }> {
  const { data } = await API.post('/auth/logout');
  return data;
}
