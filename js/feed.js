import { toggleSidebar } from "./shared/sidebar.js";
import { searchBar } from "./shared/search.js";
import { toggleSort, sortBy } from "./shared/sort.js";
import { toggleArticleOverlay } from "./shared/article.js";
import { logout, checkAuthState } from "./shared/auth-utils.js";
import { readMoreBtn } from "./shared/read-more.js";
import {
  updateProfilePictures,
  initializeProfilesCache,
} from "./shared/user-utils.js";
import {
  setupClickOutsideHandlers,
  setupOverlayClickHandler,
  toggleOverlay,
  toggleNewPostOverlay,
} from "./shared/overlay-utils.js";
import { initializeCreatePost } from "./UI/posts/create-post.js";
import { loadPosts } from "./UI/posts/post-list.js";
import { toggleEditPostOverlay, handleEditPost } from "./UI/posts/edit-post.js";

window.toggleSidebar = toggleSidebar;
window.searchBar = searchBar;
window.toggleSort = toggleSort;
window.sortBy = sortBy;
window.toggleArticleOverlay = toggleArticleOverlay;
window.logout = logout;
window.toggleNewPostOverlay = toggleNewPostOverlay;
window.toggleEditPostOverlay = toggleEditPostOverlay;

document.addEventListener("DOMContentLoaded", async function () {
  checkAuthState();

  await initializeProfilesCache();

  updateProfilePictures();

  setupClickOutsideHandlers();
  setupOverlayClickHandler("newPostOverlay", toggleNewPostOverlay);
  setupOverlayClickHandler("editPostOverlay", toggleEditPostOverlay);

  initializeCreatePost();

  const editPostForm = document.querySelector("#editPostOverlay form");
  if (editPostForm) {
    editPostForm.addEventListener("submit", handleEditPost);
  }

  await loadPosts();

  readMoreBtn();
});
