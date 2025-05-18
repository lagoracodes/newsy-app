import { updatePost } from "../../api/posts/update.js";
import { APP_TAG } from "../../api/constants.js";

export function toggleEditPostOverlay() {
  const overlay = document.getElementById("editPostOverlay");
  if (overlay) {
    overlay.classList.toggle("hidden");
    overlay.classList.toggle("flex");
    document.body.style.overflow = overlay.classList.contains("hidden")
      ? "auto"
      : "hidden";
  }
}

export function populateEditForm(post) {
  const titleInput = document.getElementById("editPostTitle");
  const contentInput = document.getElementById("editPostContent");
  const postIdInput = document.getElementById("editPostId");

  if (titleInput && contentInput && postIdInput) {
    titleInput.value = post.title;
    contentInput.value = post.body;
    postIdInput.value = post.id;
  }
}

export async function handleEditPost(event) {
  event.preventDefault();

  const form = event.target;
  const postId = form.querySelector("#editPostId").value;
  const titleInput = form.querySelector("#editPostTitle");
  const contentInput = form.querySelector("#editPostContent");

  const title = titleInput.value.trim();
  const body = contentInput.value.trim();

  if (title.length < 3) {
    alert("Title must be at least 3 characters long");
    return;
  }

  if (title.length > 100) {
    alert("Title cannot be longer than 100 characters");
    return;
  }

  if (body.length < 10) {
    alert("Content must be at least 10 characters long");
    return;
  }

  if (body.length > 280) {
    alert("Content cannot be longer than 280 characters");
    return;
  }

  const postData = {
    title: title,
    body: body,
    tags: [APP_TAG],
  };

  try {
    const response = await updatePost(postId, postData);

    const postElement = document.querySelector(`[data-post-id="${postId}"]`);
    if (postElement) {
      const titleElement = postElement.querySelector("h2");
      if (titleElement) {
        titleElement.textContent = title;
      }

      const contentElement = postElement.querySelector("p.text-gray-600");
      if (contentElement) {
        contentElement.textContent =
          body.substring(0, 150) + (body.length > 150 ? "..." : "");
      }
      postElement.dataset.postContent = body;
    }

    toggleEditPostOverlay();
    form.reset();
  } catch (error) {
    console.error("Error updating post:", error);

    let errorMessage = "Failed to update post. ";

    if (error.response) {
      try {
        const errorData = await error.response.json();
        if (errorData.errors && errorData.errors.length > 0) {
          errorMessage += errorData.errors[0].message;
        }
      } catch {
        errorMessage += "Please try again.";
      }
    } else if (error.message) {
      errorMessage += error.message;
    } else {
      errorMessage += "Please try again.";
    }

    alert(errorMessage);
  }
}

function updatePostInUI(updatedPost) {
  const postElement = document.querySelector(
    `[data-post-id="${updatedPost.id}"]`
  );
  if (postElement) {
    const titleElement = postElement.querySelector("h2");
    if (titleElement) {
      titleElement.textContent = updatedPost.title;
    }

    const contentElement = postElement.querySelector("p");
    if (contentElement) {
      contentElement.textContent =
        updatedPost.body.substring(0, 150) +
        (updatedPost.body.length > 150 ? "..." : "");
    }

    postElement.dataset.postContent = updatedPost.body;
  }
}
