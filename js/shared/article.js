import { toggleOverlay } from "./overlay-utils.js";
import { updateProfilePictureElement } from "./user-utils.js";

let isShowingPost = false;

/**
 * Shows or hides the article popup window.
 * If given article info, shows the popup with that content.
 * If called empty, closes the popup.
 *
 * @param {string} [title=""] - The article title
 * @param {string} [time=""] - When it was posted (like "2 hours ago")
 * @param {string} [username=""] - Who wrote it (like "@johndoe")
 * @param {string} [content=""] - The article text
 * @param {string} [postId=""] - The post's ID number
 * @param {string} [authorName=""] - The writer's name without @ (like "johndoe")
 *
 * @example
 * // Show an article
 * toggleArticleOverlay(
 *   "My First Post",
 *   "2 hours ago",
 *   "@johndoe",
 *   "Hello world!",
 *   "123",
 *   "johndoe"
 * );
 *
 * // Close the popup
 * toggleArticleOverlay();
 */
export function toggleArticleOverlay(
  title = "",
  time = "",
  username = "",
  content = "",
  postId = "",
  authorName = ""
) {
  const titleElement = document.getElementById("articleTitle");
  const timeElement = document.getElementById("articleTime");
  const usernameElement = document.getElementById("articleUsername");
  const contentElement = document.getElementById("articleContent");
  const followButton = document.getElementById("followButton");
  const authorImage = document.querySelector(
    "#articleOverlay img[alt='Author']"
  );

  const isOpening = title && !isShowingPost;

  toggleOverlay("articleOverlay", {
    showClass: "flex",
    lockScroll: true,
    onShow: () => {
      if (isOpening) {
        titleElement.textContent = title;
        timeElement.textContent = time;
        usernameElement.textContent = username;
        isShowingPost = true;

        if (authorImage) {
          updateProfilePictureElement(
            authorImage,
            authorName,
            username.replace("@", "")
          );
        }

        contentElement.innerHTML = content
          .split("\n")
          .filter((para) => para.trim())
          .map((para) => `<p class="text-gray-600 mb-4">${para}</p>`)
          .join("");

        if (followButton) {
          const currentUser = JSON.parse(localStorage.getItem("user"));
          const currentUserName = currentUser?.data?.name || currentUser?.name;
          const postAuthorName = username.replace("@", "");

          if (!currentUserName || currentUserName === postAuthorName) {
            followButton.classList.add("hidden");
          } else {
            followButton.classList.remove("hidden");
          }
        }
      }
    },
    onHide: () => {
      isShowingPost = false;
      const baseUrl = window.location.href.split("?")[0];
      window.history.pushState({}, "", baseUrl);
    },
  });
}
