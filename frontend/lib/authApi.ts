import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g. http://localhost:5050/api
  withCredentials: true,                    // send/receive the auth cookie
});

export const getMe = () => API.get("/auth/me");
export const logout = () => API.post("/auth/logout");
