import { API_BASE_URL } from "./constants.js";
import { getHeaders } from "./header.js";

export async function apiFetch(endpoint, options = {}) {
  const url = API_BASE_URL + endpoint;
  const accessToken = localStorage.getItem("accessToken");

  options.headers = getHeaders(accessToken);

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    }

    return null;
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
}
