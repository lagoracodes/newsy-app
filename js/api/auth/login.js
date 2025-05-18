import { apiFetch } from "../fetch.js";
import { ENDPOINTS } from "../constants.js";

export async function login(email, password) {
  if (!email || !password) {
    alert("Please enter both email and password");
    return;
  }

  try {
    const data = await apiFetch(ENDPOINTS.auth.login, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data));

    alert("Login successful!");
    return data;
  } catch (error) {
    alert("Login failed. Please try again.");
  }
}
