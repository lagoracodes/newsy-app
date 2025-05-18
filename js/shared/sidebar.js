import { toggleOverlay } from "./overlay-utils.js";

export function toggleSidebar() {
  toggleOverlay("sidebar", {
    showClass: null,
    hideClass: "-translate-x-full",
    lockScroll: false,
  });
}