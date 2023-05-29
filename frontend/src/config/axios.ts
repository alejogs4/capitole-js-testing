import axios from "axios";

export const axiosService = axios.create({
  baseURL: process.env.baseURL || "http://localhost:8000",
});
