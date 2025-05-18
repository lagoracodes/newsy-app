export function searchBar() {
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
