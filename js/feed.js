import { toggleSidebar } from "./shared/sidebar.js";
import { searchBar } from "./shared/search.js";
import { toggleSort, sortBy } from "./shared/sort.js";
import { toggleArticleOverlay } from "./shared/article.js";
import { logout } from "./shared/auth-utils.js";
import { readMoreBtn } from "./shared/read-more.js";
import { updateProfilePictures } from "./shared/user-utils.js";
import {
  setupClickOutsideHandlers,
  setupOverlayClickHandler,
  toggleOverlay,
} from "./shared/overlay-utils.js";

window.toggleSidebar = toggleSidebar;
window.searchBar = searchBar;
window.toggleSort = toggleSort;
window.sortBy = sortBy;
window.toggleArticleOverlay = toggleArticleOverlay;
window.logout = logout;

function toggleNewPostOverlay() {
  toggleOverlay("newPostOverlay", {
    showClass: "flex",
    lockScroll: true,
  });
}

window.toggleNewPostOverlay = toggleNewPostOverlay;

document.addEventListener("DOMContentLoaded", function () {
  updateProfilePictures();

  setupClickOutsideHandlers();
  setupOverlayClickHandler("newPostOverlay", toggleNewPostOverlay);

  const newPostForm = document.querySelector("#newPostOverlay form");
  if (newPostForm) {
    newPostForm.addEventListener("submit", function (e) {
      e.preventDefault();
      toggleNewPostOverlay();
    });
  }

  readMoreBtn();
});
