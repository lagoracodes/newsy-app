function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar.classList.contains("-translate-x-full")) {
    sidebar.classList.remove("-translate-x-full");
  } else {
    sidebar.classList.add("-translate-x-full");
  }
}

function toggleSort() {
  const menu = document.getElementById("sortMenu");
  menu.classList.toggle("hidden");
}

function sortBy(criteria) {
  const container = document.getElementById("newsContainer");
  const posts = Array.from(container.children);

  posts.forEach((post) => {
    post.style.opacity = "0";
    post.style.transform = "translateY(10px)";
  });

  setTimeout(() => {
    posts.sort((a, b) => {
      if (criteria === "newest") {
        const timeA = a.querySelector("span").textContent;
        const timeB = b.querySelector("span").textContent;
        return timeA.localeCompare(timeB);
      } else if (criteria === "oldest") {
        const timeA = a.querySelector("span").textContent;
        const timeB = b.querySelector("span").textContent;
        return timeB.localeCompare(timeA);
      } else if (criteria === "title") {
        const titleA = a.querySelector("h2").textContent;
        const titleB = b.querySelector("h2").textContent;
        return titleA.localeCompare(titleB);
      }
    });

    posts.forEach((post) => {
      container.appendChild(post);
      post.offsetHeight;
      post.style.opacity = "1";
      post.style.transform = "translateY(0)";
    });

    document.getElementById("sortMenu").classList.add("hidden");
  }, 300);
}

function searchBar() {
  const searchInput = document.getElementById("searchInput");
  const searchTerm = searchInput.value.toLowerCase();
  const newsItems = document.querySelectorAll("#newsContainer > div");

  newsItems.forEach((item) => {
    const title = item.querySelector("h2").textContent.toLowerCase();
    const content = item.querySelector("p").textContent.toLowerCase();
    const isMatch = title.includes(searchTerm) || content.includes(searchTerm);

    item.style.opacity = "0";
    item.style.transform = "translateY(10px)";

    setTimeout(() => {
      item.style.display = isMatch ? "block" : "none";
      if (isMatch) {
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      }
    }, 300);
  });
}

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

function toggleForm() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm.classList.contains("hidden")) {
    loginForm.classList.remove("hidden");
    loginForm.classList.add("flex", "flex-col");
    registerForm.classList.remove("flex", "flex-col");
    registerForm.classList.add("hidden");
  } else {
    loginForm.classList.remove("flex", "flex-col");
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
    registerForm.classList.add("flex", "flex-col");
  }
}

function toggleArticleOverlay(
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
      followButton.classList.remove("hidden");
    } else {
      followButton.classList.add("hidden");
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

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (event) {
    const sidebar = document.getElementById("sidebar");
    const hamburger = event.target.closest(".cursor-pointer");
    const sortMenu = document.getElementById("sortMenu");
    const sortButton = event.target.closest("button");

    if (!sidebar.contains(event.target) && !hamburger) {
      sidebar.classList.add("-translate-x-full");
    }

    if (!sortMenu.contains(event.target) && !sortButton) {
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

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      window.location.href = "pages/feed/index.html";
    });
  }

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      window.location.href = "pages/feed/index.html";
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
  readMoreButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const article = this.closest("div[class*='rounded-lg']");
      const title = article.querySelector("h2").textContent;
      const authorContainer = article.querySelector("div.flex.items-center");
      const author =
        authorContainer.querySelector("span:first-child").textContent;
      const username =
        authorContainer.querySelector("span.text-gray-400").textContent;
      const time = authorContainer.querySelector("span:last-child").textContent;
      toggleArticleOverlay(title, time, author, username);
    });
  });
});