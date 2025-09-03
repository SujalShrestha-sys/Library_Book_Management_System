import axios from "axios";
import api from "./api";

export const signupApi = (userData) => api.post("/auth/register", userData);
export const loginApi = (credentials) => api.post("/auth/login", credentials);
export const logoutApi = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}; 