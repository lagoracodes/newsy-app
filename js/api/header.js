import { API_KEY } from "./constants.js";

export function getHeaders(token) {
  if (token) {
    return {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
      Authorization: "Bearer " + token,
    };
  }

  return {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": API_KEY,
  };
}