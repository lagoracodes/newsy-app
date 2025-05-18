import { toggleOverlay } from "./overlay-utils.js";
import { updateProfilePictureElement } from "./user-utils.js";

let isShowingPost = false;

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
