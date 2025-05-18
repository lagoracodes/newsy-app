import { getPosts } from "../../api/posts/get.js";
import { APP_TAG } from "../../api/constants.js";
import { deletePost } from "../../api/posts/delete.js";
import { toggleEditPostOverlay, populateEditForm } from "./edit-post.js";
import { formatTimeAgo } from "../../shared/time-utils.js";
import { hasNewsyTag } from "../../shared/post-utils.js";
import {
  getUserProfilePicture,
  updateProfilePictureElement,
} from "../../shared/user-utils.js";
import { toggleArticleOverlay } from "../../shared/article.js";

function getAuthorName(post) {
  return post.author?.name || "unknown";
}

function isCurrentUser(post) {
  const userData = localStorage.getItem("user");
  if (!userData) return false;

  const user = JSON.parse(userData);
  const userInfo = user.data || user;
  const postAuthorName = post.author?.name || post.name;

  return userInfo.name === postAuthorName;
}

function createPostElement(post) {
  const postElement = document.createElement("div");
  postElement.className =
    "p-4 bg-gray-100 rounded-lg border border-gray-200 transition-all duration-300 ease-in-out hover:shadow-md relative";

  postElement.dataset.postContent = post.body;
  postElement.dataset.postId = post.id;
  postElement.dataset.authorName = post.author?.name || "";

  const authorName = getAuthorName(post);
  const isOwner = isCurrentUser(post);

  const style = document.createElement("style");
  style.textContent = `
    .edit-post-btn:hover { color: #1d4ed8 !important; }
    .delete-post-btn:hover { color: #dc2626 !important; }
    .cancel-delete-btn:hover { color: #111827 !important; }
    .confirm-delete-btn:hover { color: #dc2626 !important; }
  `;
  document.head.appendChild(style);

  const actionButtons = isOwner
    ? `<div class="flex items-center space-x-2 relative">
         <button class="px-4 py-1.5 bg-white border rounded edit-post-btn text-blue-500">Edit</button>
         <button class="px-4 py-1.5 bg-white border rounded delete-post-btn text-red-500">Delete</button>
         <div class="delete-confirm-popup hidden absolute right-0 top-8 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-50 w-64">
           <p class="text-gray-700 mb-3 text-center">Are you sure you want to delete this post?</p>
           <div class="flex justify-center space-x-2">
             <button class="px-4 py-1.5 bg-gray-100 text-gray-600 rounded cancel-delete-btn">Cancel</button>
             <button class="px-4 py-1.5 bg-white border text-red-500 rounded confirm-delete-btn">Delete</button>
           </div>
         </div>
       </div>`
    : "";

  postElement.innerHTML = `
    <div class="flex justify-between items-start mb-2">
      <div class="flex items-center space-x-3">
        <img src="../../assets/images/blank-profile-picture.png" alt="${authorName}'s profile" class="w-10 h-10 rounded-full object-cover"/>
        <div>
          <h2 class="font-semibold text-lg">${post.title}</h2>
          <div class="flex items-center space-x-2 text-sm text-gray-500">
            <span class="text-gray-400">@${authorName}</span>
            <span>•</span>
            <span>${formatTimeAgo(post.created)}</span>
          </div>
        </div>
      </div>
      ${actionButtons}
    </div>
    <p class="text-gray-600 mb-4">${post.body.substring(0, 150)}${
    post.body.length > 150 ? "..." : ""
  }</p>
    <div class="flex justify-end">
      <span class="read-more hover:text-blue-500 transition-colors cursor-pointer">Read more →</span>
    </div>
  `;

  const profilePicElement = postElement.querySelector("img");
  updateProfilePictureElement(profilePicElement, post.author?.name, authorName);

  postElement.addEventListener("click", function (e) {
    if (e.target.classList.contains("read-more")) {
      toggleArticleOverlay(
        post.title,
        formatTimeAgo(post.created),
        `@${authorName}`,
        post.body,
        post.id,
        post.author?.name || ""
      );
    }
  });

  if (isOwner) {
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
  }

  return postElement;
}

export function addPostToFeed(post, container, prepend = true) {
  if (!hasNewsyTag(post)) return;

  const postElement = createPostElement(post);

  if (prepend) {
    container.insertBefore(postElement, container.firstChild);
  } else {
    container.appendChild(postElement);
  }
}

export async function loadPosts() {
  const container = document.getElementById("newsContainer");
  if (!container) return;

  try {
    const response = await getPosts();
    const posts = response.data;

    const newsyPosts = posts.filter(hasNewsyTag);

    newsyPosts.sort((a, b) => {
      const dateA = new Date(a.updated || a.created);
      const dateB = new Date(b.updated || b.created);
      return dateB - dateA;
    });

    container.innerHTML = "";

    if (newsyPosts.length === 0) {
      container.innerHTML = `
        <div class="text-center text-gray-500 py-8">
          <p>No posts found.</p>
          <button onclick="toggleNewPostOverlay()" class="text-blue-500 hover:text-blue-600 mt-2">
            Create your first post →
          </button>
        </div>
      `;
      return;
    }

    newsyPosts.forEach((post) => {
      addPostToFeed(post, container, false);
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

export function handleNewPost(post) {
  const container = document.getElementById("newsContainer");
  if (!container) return;

  if (hasNewsyTag(post)) {
    if (
      container.children.length === 1 &&
      container.children[0].classList.contains("text-center")
    ) {
      container.innerHTML = "";
    }

    if (!post.author) {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        const userInfo = user.data || user;
        post.author = {
          name: userInfo.name,
          email: userInfo.email,
        };
      }
    }

    addPostToFeed(post, container, true);

    import("../../shared/read-more.js").then((module) => {
      module.readMoreBtn();
    });
  }
}
