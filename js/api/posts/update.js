import { apiFetch } from "../fetch.js";
import { ENDPOINTS } from "../constants.js";

export async function updatePost(postId, postData) {
  const options = {
    method: "PUT",
    body: JSON.stringify(postData),
  };

  return apiFetch(`${ENDPOINTS.social.posts}/${postId}`, options);
}
