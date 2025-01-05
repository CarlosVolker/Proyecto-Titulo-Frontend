import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000/api/", // URL base según tu backend
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;