import { apiFetch } from "../fetch.js";
import { ENDPOINTS } from "../constants.js";

export async function register(email, password, username) {
  const data = await apiFetch(ENDPOINTS.auth.register, {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      name: username,
    }),
  });

  return data;
}