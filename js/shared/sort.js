export function toggleSort() {
  const menu = document.getElementById("sortMenu");
  menu.classList.toggle("hidden");
}

export function sortBy(criteria) {
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
