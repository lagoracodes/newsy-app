export function searchBar() {
  const searchInput = document.getElementById("searchInput");
  const searchTerm = searchInput.value.toLowerCase();
  const newsContainer = document.getElementById("newsContainer");

  if (!newsContainer) {
    console.error("News container not found");
    return;
  }

  const newsItems = Array.from(newsContainer.children).filter(
    (item) => !item.classList.contains("text-center")
  );

  if (!newsItems || newsItems.length === 0) {
    return;
  }

  let hasVisibleItems = false;

  newsItems.forEach((item) => {
    try {
      const title = item.querySelector("h2")?.textContent?.toLowerCase() || "";
      const content = item.querySelector("p")?.textContent?.toLowerCase() || "";
      const isMatch =
        title.includes(searchTerm) || content.includes(searchTerm);

      item.style.opacity = "0";
      item.style.transform = "translateY(10px)";

      setTimeout(() => {
        item.style.display = isMatch ? "block" : "none";
        if (isMatch) {
          item.style.opacity = "1";
          item.style.transform = "translateY(0)";
          hasVisibleItems = true;
        }
      }, 300);
    } catch (error) {
      console.error("Error processing search for item:", error);
    }
  });

  setTimeout(() => {
    const existingMessage = newsContainer.querySelector(".search-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    if (!hasVisibleItems && searchTerm) {
      const noResultsMessage = document.createElement("div");
      noResultsMessage.className =
        "text-center text-gray-500 py-8 search-message";
      noResultsMessage.innerHTML = `
        <p>No posts found matching "${searchTerm}"</p>
        <p class="text-sm mt-2">Try a different search term</p>
      `;
      newsContainer.appendChild(noResultsMessage);
    }
  }, 350);
}
