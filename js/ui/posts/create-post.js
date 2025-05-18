import { createPost } from "../../api/posts/create.js";
import { toggleNewPostOverlay } from "../../shared/overlay-utils.js";
import { APP_TAG } from "../../api/constants.js";
import { handleNewPost } from "./post-list.js";
import { getUserProfilePicture } from "../../shared/user-utils.js";

export function initializeCreatePost() {
  const form = document.querySelector("#newPostOverlay form");
  if (!form) return;

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const titleInput = form.querySelector("#postTitle");
    const contentInput = form.querySelector("#postContent");

    const userData = localStorage.getItem("user");
    if (!userData) {
      console.error("User must be logged in to create a post");
      return;
    }

    const user = JSON.parse(userData);
    const userInfo = user.data || user;

    const postData = {
      title: titleInput.value,
      body: contentInput.value,
      tags: [APP_TAG],
      author: {
        name: userInfo.name,
        email: userInfo.email,
        profilePicture: getUserProfilePicture(userInfo.email),
      },
    };

    try {
      const response = await createPost(postData);
      console.log("Post created successfully:", response);

      handleNewPost(response.data);

      form.reset();
      toggleNewPostOverlay();
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post: " + error.message);
    }
  });
}
