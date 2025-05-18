import { toggleOverlay } from "./overlay-utils.js";

export function toggleSort() {
  toggleOverlay("sortMenu", {
    showClass: null,
    lockScroll: false,
  });
}

const sortFunctions = {
  newest: (a, b) => {
    const timeA = a.querySelector("span").textContent;
    const timeB = b.querySelector("span").textContent;
    return timeA.localeCompare(timeB);
  },
  oldest: (a, b) => {
    const timeA = a.querySelector("span").textContent;
    const timeB = b.querySelector("span").textContent;
    return timeB.localeCompare(timeA);
  },
  title: (a, b) => {
    const titleA = a.querySelector("h2").textContent;
    const titleB = b.querySelector("h2").textContent;
    return titleA.localeCompare(titleB);
  },
};

export function sortBy(criteria) {
  const container = document.getElementById("newsContainer");
  const posts = Array.from(container.children);

  posts.forEach((post) => {
    post.style.opacity = "0";
    post.style.transform = "translateY(10px)";
  });

  setTimeout(() => {
    if (criteria in sortFunctions) {
      posts.sort(sortFunctions[criteria]);
    }

    posts.forEach((post) => {
      container.appendChild(post);
      post.offsetHeight;
      post.style.opacity = "1";
      post.style.transform = "translateY(0)";
    });

    document.getElementById("sortMenu").classList.add("hidden");
  }, 300);
}