import { toggleSidebar } from "./shared/sidebar.js";
import { searchBar } from "./shared/search.js";
import { toggleSort, sortBy } from "./shared/sort.js";
import { toggleArticleOverlay } from "./shared/article.js";

window.toggleSidebar = toggleSidebar;
window.searchBar = searchBar;
window.toggleSort = toggleSort;
window.sortBy = sortBy;
window.toggleArticleOverlay = toggleArticleOverlay;

document.addEventListener("DOMContentLoaded", function () {
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
