import { toggleOverlay } from "./overlay-utils.js";

export function toggleSort() {
  toggleOverlay("sortMenu", {
    showClass: null,
    lockScroll: false,
  });
}

function getTimestamp(timeString) {
  const now = new Date();

  if (timeString === "just now") return now.getTime();

  const match = timeString.match(/(\d+)\s+(minute|hour|day)s?\s+ago/);
  if (!match) return 0;

  const [, amount, unit] = match;
  const value = parseInt(amount);

  switch (unit) {
    case "minute":
      return now.getTime() - value * 60 * 1000;
    case "hour":
      return now.getTime() - value * 60 * 60 * 1000;
    case "day":
      return now.getTime() - value * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
}

const sortFunctions = {
  newest: (a, b) => {
    try {
      const timeA = getTimestamp(
        a.querySelector("span:last-child").textContent.trim()
      );
      const timeB = getTimestamp(
        b.querySelector("span:last-child").textContent.trim()
      );
      return timeB - timeA;
    } catch (error) {
      console.error("Error sorting by time:", error);
      return 0;
    }
  },
  oldest: (a, b) => {
    try {
      const timeA = getTimestamp(
        a.querySelector("span:last-child").textContent.trim()
      );
      const timeB = getTimestamp(
        b.querySelector("span:last-child").textContent.trim()
      );
      return timeA - timeB;
    } catch (error) {
      console.error("Error sorting by time:", error);
      return 0;
    }
  },
  title: (a, b) => {
    const titleA = a.querySelector("h2").textContent.toLowerCase();
    const titleB = b.querySelector("h2").textContent.toLowerCase();
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

    container.innerHTML = "";
    posts.forEach((post) => {
      container.appendChild(post);
      post.offsetHeight;
      post.style.opacity = "1";
      post.style.transform = "translateY(0)";
    });

    document.getElementById("sortMenu").classList.add("hidden");
  }, 300);
}
