export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  window.location.href = "../../index.html";
}

export function checkAuthState() {
  const accessToken = localStorage.getItem("accessToken");
  const userData = localStorage.getItem("user");

  if (!accessToken) {
    console.warn("No access token found - user might need to log in again");
    return null;
  }

  return JSON.parse(userData)?.data;
}
