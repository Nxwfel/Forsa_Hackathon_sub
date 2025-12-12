// src/api/client.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://forsahackathonbackendek.onrender.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default apiClient;
