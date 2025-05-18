export function getCurrentUser() {
  const userData = localStorage.getItem("user");
  if (!userData) return null;
  return JSON.parse(userData).data;
}

export function updateProfilePictures() {
  const user = getCurrentUser();
  if (!user) return;

  let profilePicUrl = "../../assets/images/blank-profile-picture.png";
  if (user.avatar && user.avatar.url) {
    profilePicUrl = user.avatar.url;
  }

  const headerProfilePic = document.querySelector('header img[alt="Profile"]');
  if (headerProfilePic) {
    headerProfilePic.src = profilePicUrl;
    headerProfilePic.alt = user.name + "'s profile picture";
  }

  const bigProfilePic = document.querySelector(".w-32.h-32.rounded-full img");
  if (bigProfilePic) {
    bigProfilePic.src = profilePicUrl;
    bigProfilePic.alt = user.name + "'s profile picture";
  }

  const path = window.location.pathname;
  if (path.includes("/profile/")) {
    const articleAuthorPic = document.querySelector(
      '#articleOverlay img[alt="Author"]'
    );
    if (articleAuthorPic) {
      articleAuthorPic.src = profilePicUrl;
      articleAuthorPic.alt = user.name + "'s profile picture";
    }
  }
}