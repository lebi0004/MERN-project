import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g. http://localhost:5050/api
  withCredentials: true, // send/receive the httpOnly cookie
  headers: { "Content-Type": "application/json" },
});

export async function register(email: string, password: string) {
  const { data } = await API.post("/auth/register", { email, password });
  return data as { id: string; email: string };
}

export async function login(email: string, password: string) {
  const { data } = await API.post("/auth/login", { email, password });
  return data as { id: string; email: string };
}

export async function me() {
  const { data } = await API.get("/auth/me");
  return data as { id: string; email: string };
}

export async function logout() {
  const { data } = await API.post("/auth/logout");
  return data as { message: string };
}
