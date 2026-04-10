import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001"}/api/calculations`
});

export const fetchCalculations = async () => {
  const response = await api.get("/");
  return response.data;
};

export const createCalculation = async (payload) => {
  const response = await api.post("/", payload);
  return response.data;
};

export const deleteCalculation = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};

export const clearCalculations = async () => {
  const response = await api.delete("/");
  return response.data;
};
