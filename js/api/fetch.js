import { API_BASE_URL } from "./constants.js";
import { getHeaders } from "./header.js";

export async function apiFetch(endpoint, options = {}) {
  const url = API_BASE_URL + endpoint;
  const token = localStorage.getItem("token");

  options.headers = getHeaders(token);

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    return data;
  } catch (error) {
    alert("Error: " + error.message);
    throw error;
  }
}