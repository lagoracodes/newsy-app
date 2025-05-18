import { apiFetch } from "../fetch.js";
import { ENDPOINTS } from "../constants.js";

export async function createPost(postData) {
  const userData = localStorage.getItem("user");

  if (!userData) {
    throw new Error("You must be logged in to create a post");
  }

  const user = JSON.parse(userData);
  const userInfo = user.data || user;

  const fullPostData = {
    ...postData,
    author: {
      name: userInfo.name,
      email: userInfo.email,
    },
  };

  const options = {
    method: "POST",
    body: JSON.stringify(fullPostData),
  };

  const response = await apiFetch(ENDPOINTS.social.posts, options);
  return response;
}
