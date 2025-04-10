import axios from "axios";

const API_BASE_URL = "http://localhost:8080"; // change if your backend runs on a different port or IP

export const fetchCities = async () => {
  const response = await axios.get(`${API_BASE_URL}/cities`);
  return response.data;
};

export const fetchPlaces = async (city) => {
  const response = await axios.get(`${API_BASE_URL}/places/${city}`);
  return response.data;
};
