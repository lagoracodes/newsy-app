import { toggleOverlay } from "./overlay-utils.js";

export function toggleArticleOverlay(title = "", time = "", username = "") {
  const titleElement = document.getElementById("articleTitle");
  const timeElement = document.getElementById("articleTime");
  const usernameElement = document.getElementById("articleUsername");
  const followButton = document.getElementById("followButton");

  toggleOverlay("articleOverlay", {
    showClass: "flex",
    lockScroll: true,
    onShow: () => {
      titleElement.textContent = title;
      timeElement.textContent = time;
      usernameElement.textContent = username;

      const currentUser = JSON.parse(localStorage.getItem("user"))?.data;
      const currentUsername = currentUser ? `@${currentUser.name}` : "";

      if (username && username !== currentUsername) {
        followButton?.classList.remove("hidden");
      } else {
        followButton?.classList.add("hidden");
      }
    },
  });
}