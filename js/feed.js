import { toggleSidebar } from "./shared/sidebar.js";
import { searchBar } from "./shared/search.js";
import { toggleSort, sortBy } from "./shared/sort.js";
import { toggleArticleOverlay } from "./shared/article.js";

window.toggleSidebar = toggleSidebar;
window.searchBar = searchBar;
window.toggleSort = toggleSort;
window.sortBy = sortBy;
window.toggleArticleOverlay = toggleArticleOverlay;

function toggleNewPostOverlay() {
  const overlay = document.getElementById("newPostOverlay");
  const body = document.body;

  if (overlay.classList.contains("hidden")) {
    overlay.classList.remove("hidden");
    overlay.classList.add("flex");
    body.style.overflow = "hidden";
  } else {
    overlay.classList.remove("flex");
    overlay.classList.add("hidden");
    body.style.overflow = "auto";
  }
}

window.toggleNewPostOverlay = toggleNewPostOverlay;

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (event) {
    const sidebar = document.getElementById("sidebar");
    const hamburger = event.target.closest(".cursor-pointer");
    const sortMenu = document.getElementById("sortMenu");
    const sortButton = event.target.closest("button");

    if (sidebar && !sidebar.contains(event.target) && !hamburger) {
      sidebar.classList.add("-translate-x-full");
    }

    if (sortMenu && !sortMenu.contains(event.target) && !sortButton) {
      sortMenu.classList.add("hidden");
    }
  });

  const newPostOverlay = document.getElementById("newPostOverlay");
  if (newPostOverlay) {
    newPostOverlay.addEventListener("click", function (e) {
      if (e.target === this) {
        toggleNewPostOverlay();
      }
    });
  }

  const newPostForm = document.querySelector("#newPostOverlay form");
  if (newPostForm) {
    newPostForm.addEventListener("submit", function (e) {
      e.preventDefault();
      toggleNewPostOverlay();
    });
  }

  const articleOverlay = document.getElementById("articleOverlay");
  if (articleOverlay) {
    articleOverlay.addEventListener("click", function (e) {
      if (e.target === this) {
        toggleArticleOverlay();
      }
    });
  }

  const readMoreButtons = document.querySelectorAll(".read-more");
  if (readMoreButtons.length > 0) {
    readMoreButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const article = this.closest("div[class*='rounded-lg']");
        const title = article.querySelector("h2").textContent;
        const authorContainer = article.querySelector("div.flex.items-center");
        const author =
          authorContainer.querySelector("span:first-child").textContent;
        const username =
          authorContainer.querySelector("span.text-gray-400").textContent;
        const time =
          authorContainer.querySelector("span:last-child").textContent;
        toggleArticleOverlay(title, time, author, username);
      });
    });
  }
});
