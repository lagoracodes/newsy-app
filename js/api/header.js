import { API_KEY } from "./constants.js";

export function getHeaders(accessToken) {
  if (accessToken) {
    return {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
      Authorization: `Bearer ${accessToken}`,
    };
  }

  return {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": API_KEY,
  };
}
