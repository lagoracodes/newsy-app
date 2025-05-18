import { login } from "./api/auth/login.js";
import { register } from "./api/auth/register.js";

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

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("showRegisterForm")
    .addEventListener("click", function (e) {
      e.preventDefault();
      toggleForm();
    });

  document
    .getElementById("showLoginForm")
    .addEventListener("click", function (e) {
      e.preventDefault();
      toggleForm();
    });

  document
    .getElementById("loginForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await login(email, password);
        if (response) {
          window.location.href = "pages/feed/index.html";
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    });

  document
    .getElementById("registerForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      const username = document
        .getElementById("registerUsername")
        .value.replace("@", "");
      const email = document.getElementById("registerEmail").value;
      const password = document.getElementById("registerPassword").value;

      try {
        const response = await register(email, password, username);
        if (response) {
          const loginResponse = await login(email, password);
          if (loginResponse) {
            window.location.href = "pages/feed/index.html";
          }
        }
      } catch (error) {
        console.error("Registration failed:", error);
      }
    });
});