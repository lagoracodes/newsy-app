export function toggleArticleOverlay(
  title = "",
  time = "",
  author = "",
  username = ""
) {
  const overlay = document.getElementById("articleOverlay");
  const titleElement = document.getElementById("articleTitle");
  const timeElement = document.getElementById("articleTime");
  const authorElement = document.getElementById("articleAuthor");
  const usernameElement = document.getElementById("articleUsername");
  const followButton = document.getElementById("followButton");
  const body = document.body;

  if (overlay.classList.contains("hidden")) {
    titleElement.textContent = title;
    timeElement.textContent = time;
    authorElement.textContent = author;
    usernameElement.textContent = username;

    if (author !== "Jane Doe") {
      followButton?.classList.remove("hidden");
    } else {
      followButton?.classList.add("hidden");
    }

    overlay.classList.remove("hidden");
    overlay.classList.add("flex");
    body.style.overflow = "hidden";
  } else {
    overlay.classList.remove("flex");
    overlay.classList.add("hidden");
    body.style.overflow = "auto";
  }
}
