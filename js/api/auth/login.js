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

    console.log("Login response:", data);

    const accessToken = data.data.accessToken;
    const userData = data.data;

    if (!accessToken) {
      throw new Error("No access token received");
    }

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));

    return data;
  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed. Please try again.");
    throw error;
  }
}
