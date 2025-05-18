import { toggleArticleOverlay } from "./article.js";

export function setupClickOutsideHandlers() {
  document.addEventListener("click", function (event) {
    const sidebar = document.getElementById("sidebar");
    const hamburger = event.target.closest("[data-hamburger]");
    const sortMenu = document.getElementById("sortMenu");
    const sortButton = event.target.closest("button");

    if (sidebar && !sidebar.contains(event.target) && !hamburger) {
      sidebar.classList.add("-translate-x-full");
    }

    if (sortMenu && !sortMenu.contains(event.target) && !sortButton) {
      sortMenu.classList.add("hidden");
    }
  });

  const articleOverlay = document.getElementById("articleOverlay");
  if (articleOverlay) {
    articleOverlay.addEventListener("click", function (e) {
      if (e.target === this) {
        toggleArticleOverlay();
      }
    });
  }
}

export function setupOverlayClickHandler(overlayId, toggleFunction) {
  const overlay = document.getElementById(overlayId);
  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === this) {
        toggleFunction();
      }
    });
  }
}

export function toggleOverlay(overlayId, options = {}) {
  const {
    showClass = "flex",
    hideClass = "hidden",
    lockScroll = true,
    onShow,
    onHide,
  } = options;

  const overlay = document.getElementById(overlayId);
  const body = document.body;

  if (overlay.classList.contains(hideClass)) {
    overlay.classList.remove(hideClass);
    if (showClass) overlay.classList.add(showClass);
    if (lockScroll) body.style.overflow = "hidden";

    if (onShow) {
      onShow(overlay);
    }
  } else {
    if (showClass) overlay.classList.remove(showClass);
    overlay.classList.add(hideClass);
    if (lockScroll) body.style.overflow = "auto";

    if (onHide) {
      onHide(overlay);
    }
  }
}
