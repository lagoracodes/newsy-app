import { toggleSidebar } from "./shared/sidebar.js";
import { searchBar } from "./shared/search.js";
import { toggleSort, sortBy } from "./shared/sort.js";
import { toggleArticleOverlay } from "./shared/article.js";
import { logout, checkAuthState } from "./shared/auth-utils.js";
import { readMoreBtn } from "./shared/read-more.js";
import { updateProfilePictures } from "./shared/user-utils.js";
import { setupClickOutsideHandlers } from "./shared/overlay-utils.js";
import { getPosts } from "./api/posts/get.js";
import { APP_TAG } from "./api/constants.js";
import { deletePost } from "./api/posts/delete.js";
import { updatePost } from "./api/posts/update.js";
import {
  toggleEditPostOverlay,
  populateEditForm,
  handleEditPost,
} from "./UI/posts/edit-post.js";

window.toggleSidebar = toggleSidebar;
window.searchBar = searchBar;
window.toggleSort = toggleSort;
window.sortBy = sortBy;
window.toggleArticleOverlay = toggleArticleOverlay;
window.logout = logout;
window.toggleEditPostOverlay = toggleEditPostOverlay;

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

function hasNewsyTag(post) {
  return post.tags && post.tags.includes(APP_TAG);
}

function updatePostInUI(updatedPost) {
  const postElement = document.querySelector(
    `[data-post-id="${updatedPost.id}"]`
  );
  if (postElement) {
    const titleElement = postElement.querySelector("h2");
    const contentElement = postElement.querySelector("p.text-gray-600");

    if (titleElement) {
      titleElement.textContent = updatedPost.title;
    }

    if (contentElement) {
      contentElement.textContent =
        updatedPost.body.substring(0, 150) +
        (updatedPost.body.length > 150 ? "..." : "");
    }

    postElement.dataset.postContent = updatedPost.body;
  }
}

function createPostElement(post) {
  const postElement = document.createElement("div");
  postElement.className =
    "p-4 bg-gray-100 rounded-lg border border-gray-200 transition-all duration-300 ease-in-out hover:shadow-md relative";

  postElement.dataset.postContent = post.body;
  postElement.dataset.postId = post.id;
  postElement.dataset.authorEmail = post.author?.email || "";

  const actionButtons = `<div class="flex items-center space-x-2 relative">
         <button class="text-blue-500 hover:text-blue-600 edit-post-btn">Edit</button>
         <span>•</span>
         <button class="text-red-500 hover:text-red-600 delete-post-btn">Delete</button>
         <div class="delete-confirm-popup hidden absolute right-0 top-8 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-50 w-64">
           <p class="text-gray-700 mb-3 text-center">Are you sure you want to delete this post?</p>
           <div class="flex justify-center space-x-2">
             <button class="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors cancel-delete-btn">Cancel</button>
             <button class="!text-red-600 px-3 py-1 hover:!text-white hover:bg-red-600 transition-colors confirm-delete-btn">Delete</button>
           </div>
         </div>
       </div>`;

  postElement.innerHTML = `
    <div class="flex justify-between items-start mb-2">
      <h2 class="font-semibold text-lg">${post.title}</h2>
      ${actionButtons}
    </div>
    <p class="text-gray-600 mb-4">${post.body.substring(0, 150)}${
    post.body.length > 150 ? "..." : ""
  }</p>
    <div class="flex justify-between items-center text-sm text-gray-500">
      <div class="flex items-center space-x-2">
        <span class="text-gray-400">@${post.author?.name || "unknown"}</span>
        <span>•</span>
        <span>${formatTimeAgo(post.created)}</span>
      </div>
      <span class="read-more hover:text-blue-500 transition-colors cursor-pointer">Read more →</span>
    </div>
  `;

  const editBtn = postElement.querySelector(".edit-post-btn");
  editBtn.onclick = (e) => {
    e.preventDefault();
    populateEditForm(post);
    toggleEditPostOverlay();
  };

  const deleteBtn = postElement.querySelector(".delete-post-btn");
  const deletePopup = postElement.querySelector(".delete-confirm-popup");
  const cancelDeleteBtn = postElement.querySelector(".cancel-delete-btn");
  const confirmDeleteBtn = postElement.querySelector(".confirm-delete-btn");

  const style = document.createElement("style");
  style.textContent = `
          .confirm-delete-btn:hover {
        background-color: #dc2626 !important;
        color: white !important;
      }
      .cancel-delete-btn:hover {
        background-color: #9ca3af !important;
        color: white !important;
      }
  `;
  document.head.appendChild(style);

  deleteBtn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    deletePopup.classList.remove("hidden");
  };

  cancelDeleteBtn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    deletePopup.classList.add("hidden");
  };

  confirmDeleteBtn.onclick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await deletePost(post.id);
      postElement.style.opacity = "0";
      postElement.style.transform = "translateY(10px)";
      setTimeout(() => postElement.remove(), 300);
    } catch (error) {
      console.error("Error deleting post:", error);
      const errorMsg = document.createElement("p");
      errorMsg.className = "text-red-500 text-sm mt-2";
      errorMsg.textContent =
        "Could not delete the post. Please try again later.";
      deletePopup.insertBefore(errorMsg, deletePopup.querySelector(".flex"));
      setTimeout(() => errorMsg.remove(), 3000);
    }
  };

  document.addEventListener("click", (e) => {
    if (!deletePopup.contains(e.target) && !deleteBtn.contains(e.target)) {
      deletePopup.classList.add("hidden");
    }
  });

  return postElement;
}

async function loadUserPosts() {
  const container = document.getElementById("newsContainer");
  if (!container) return;

  const userData = localStorage.getItem("user");
  if (!userData) return;

  const user = JSON.parse(userData);
  const userInfo = user.data || user;

  try {
    const response = await getPosts();
    const allPosts = response.data;

    const userPosts = allPosts.filter(
      (post) => hasNewsyTag(post) && post.author?.name === userInfo.name
    );

    // Sort posts by date (newest first)
    userPosts.sort((a, b) => {
      const dateA = new Date(a.updated || a.created);
      const dateB = new Date(b.updated || b.created);
      return dateB - dateA;
    });

    container.innerHTML = "";

    if (userPosts.length === 0) {
      container.innerHTML = `
        <div class="text-center text-gray-500 py-8">
          <p>You haven't created any posts yet.</p>
          <a href="../feed/index.html" class="text-blue-500 hover:text-blue-600 mt-2 inline-block">
            Go to feed to create your first post →
          </a>
        </div>
      `;
      return;
    }

    userPosts.forEach((post) => {
      const postElement = createPostElement(post);
      container.appendChild(postElement);
    });
  } catch (error) {
    console.error("Error loading posts:", error);
    container.innerHTML = `
      <div class="text-center text-red-500 py-8">
        <p>Failed to load posts. Please try again later.</p>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  if (user) {
    const nameElement = document.querySelector(".text-center h2");
    const usernameElement = document.querySelector(".text-center p");
    if (nameElement && usernameElement) {
      const userInfo = user.data || user;
      nameElement.textContent = userInfo.name;
      usernameElement.textContent = `@${userInfo.name}`;
    }
  }

  const editPostForm = document.querySelector("#editPostOverlay form");
  if (editPostForm) {
    editPostForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const form = event.target;
      const postId = form.querySelector("#editPostId").value;
      const titleInput = form.querySelector("#editPostTitle");
      const contentInput = form.querySelector("#editPostContent");

      const postData = {
        title: titleInput.value,
        body: contentInput.value,
        tags: [APP_TAG],
      };

      try {
        const response = await updatePost(postId, postData);
        console.log("Post updated successfully:", response);

        updatePostInUI(response.data);

        toggleEditPostOverlay();
        form.reset();
      } catch (error) {
        console.error("Error updating post:", error);
        alert("Failed to update post: " + error.message);
      }
    });
  }

  updateProfilePictures();
  await loadUserPosts();
  readMoreBtn();
  setupClickOutsideHandlers();
});
