import { toggleSidebar } from "./shared/sidebar.js";
import { searchBar } from "./shared/search.js";
import { toggleSort, sortBy } from "./shared/sort.js";
import { toggleArticleOverlay } from "./shared/article.js";
import { logout } from "./shared/auth-utils.js";
import { readMoreBtn } from "./shared/read-more.js";
import { getCurrentUser, updateProfilePictures } from "./shared/user-utils.js";
import { setupClickOutsideHandlers } from "./shared/overlay-utils.js";

window.toggleSidebar = toggleSidebar;
window.searchBar = searchBar;
window.toggleSort = toggleSort;
window.sortBy = sortBy;
window.toggleArticleOverlay = toggleArticleOverlay;
window.logout = logout;

document.addEventListener("DOMContentLoaded", function () {
  const user = getCurrentUser();

  if (!user) {
    window.location.href = "../../index.html";
    return;
  }
  document.querySelector(".text-center h2").textContent = user.name;
  document.querySelector(".text-center p").textContent = `@${user.name}`;

  updateProfilePictures();

  const newsContainer = document.getElementById("newsContainer");
  const usernameSpans = newsContainer.querySelectorAll(
    ".flex.items-center.space-x-2 span.text-gray-400"
  );
  usernameSpans.forEach((span) => {
    span.textContent = `@${user.name}`;
  });

  readMoreBtn();

  setupClickOutsideHandlers();
});
