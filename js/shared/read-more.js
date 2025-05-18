import { toggleArticleOverlay } from "./article.js";

export function readMoreBtn() {
  const readMoreButtons = document.querySelectorAll(".read-more");
  if (readMoreButtons.length > 0) {
    readMoreButtons.forEach((button) => {
      button.addEventListener("click", function () {
        try {
          const article = this.closest("div[class*='rounded-lg']");
          if (!article) {
            console.error("Could not find article container");
            return;
          }

          const title = article.querySelector("h2").textContent;

          const bottomContainer = article.querySelector(
            ".flex.justify-between.items-center"
          );
          if (!bottomContainer) {
            console.error("Could not find bottom container");
            return;
          }

          const authorTimeContainer = bottomContainer.querySelector(
            ".flex.items-center.space-x-2"
          );
          if (!authorTimeContainer) {
            console.error("Could not find author/time container");
            return;
          }

          const spans = authorTimeContainer.querySelectorAll("span");
          if (spans.length < 3) {
            console.error("Could not find all required spans");
            return;
          }

          const username = spans[0].textContent;
          const time = spans[2].textContent;

          const content = article.dataset.postContent || "";
          const postId = article.dataset.postId;
          const authorEmail = article.dataset.authorEmail || "";

          if (postId) {
            const baseUrl = window.location.href.split("?")[0];
            const newUrl = `${baseUrl}?id=${postId}`;
            window.history.pushState({ postId }, "", newUrl);
          }

          toggleArticleOverlay(
            title,
            time,
            username,
            content,
            postId,
            authorEmail
          );
        } catch (error) {
          console.error("Error handling read more click:", error);
        }
      });
    });
  }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");
    if (postId) {
      const postElement = document.querySelector(`[data-post-id="${postId}"]`);
      if (postElement) {
        // Get title
        const title = postElement.querySelector("h2").textContent;

        const bottomContainer = postElement.querySelector(
          ".flex.justify-between.items-center"
        );
        if (!bottomContainer) {
          console.error("Could not find bottom container");
          return;
        }

        const authorTimeContainer = bottomContainer.querySelector(
          ".flex.items-center.space-x-2"
        );
        if (!authorTimeContainer) {
          console.error("Could not find author/time container");
          return;
        }

        const spans = authorTimeContainer.querySelectorAll("span");
        if (spans.length < 3) {
          console.error("Could not find all required spans");
          return;
        }

        const username = spans[0].textContent;
        const time = spans[2].textContent;

        const content = postElement.dataset.postContent || "";
        const authorEmail = postElement.dataset.authorEmail || "";

        toggleArticleOverlay(
          title,
          time,
          username,
          content,
          postId,
          authorEmail
        );
      }
    }
  } catch (error) {
    console.error("Error handling URL navigation:", error);
  }
}
