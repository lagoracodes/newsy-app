import { toggleArticleOverlay } from "./article.js";

export function readMoreBtn() {
  const readMoreButtons = document.querySelectorAll(".read-more");
  if (readMoreButtons.length > 0) {
    readMoreButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const article = this.closest("div[class*='rounded-lg']");
        const title = article.querySelector("h2").textContent;
        const authorContainer = article.querySelector("div.flex.items-center");
        const username =
          authorContainer.querySelector("span.text-gray-400").textContent;
        const time =
          authorContainer.querySelector("span:last-child").textContent;
        toggleArticleOverlay(title, time, username);
      });
    });
  }
}