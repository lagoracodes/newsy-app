import { apiFetch } from "../fetch.js";
import { ENDPOINTS } from "../constants.js";

export async function getPosts() {
  return apiFetch(`${ENDPOINTS.social.posts}?_author=true`);
}

export async function getPostById(postId) {
  return apiFetch(`${ENDPOINTS.social.posts}/${postId}?_author=true`);
}
