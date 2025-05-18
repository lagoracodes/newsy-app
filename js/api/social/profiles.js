import { apiFetch } from "../fetch.js";
import { ENDPOINTS } from "../constants.js";

export async function getProfile(name) {
  return apiFetch(`${ENDPOINTS.social.profiles}/${name}`);
}

export async function getProfiles() {
  return apiFetch(ENDPOINTS.social.profiles);
}
