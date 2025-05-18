import { apiFetch } from "../fetch.js";
import { ENDPOINTS } from "../constants.js";

export async function deletePost(postId) {
  const options = {
    method: "DELETE",
  };

  return apiFetch(`${ENDPOINTS.social.posts}/${postId}`, options);
}
