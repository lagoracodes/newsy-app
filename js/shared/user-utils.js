import { getProfiles, getProfile } from "../api/social/profiles.js";

const profilePictureCache = new Map();
const DEFAULT_PROFILE_PICTURE = "../../assets/images/blank-profile-picture.png";

export async function initializeProfilesCache() {
  try {
    const response = await getProfiles();
    const profiles = response.data || [];

    profiles.forEach((profile) => {
      if (profile.name) {
        profilePictureCache.set(
          profile.name,
          profile.avatar?.url || DEFAULT_PROFILE_PICTURE
        );
      }
    });
  } catch (error) {
    console.error("Error initializing profiles cache:", error);
  }
}

export function updateProfilePictures() {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  if (!user) return;

  let profilePicUrl = DEFAULT_PROFILE_PICTURE;
  if (user.avatar && user.avatar.url) {
    profilePicUrl = user.avatar.url;
    const userInfo = user.data || user;
    if (userInfo.name) {
      profilePictureCache.set(userInfo.name, profilePicUrl);
    }
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

export async function getUserProfilePicture(name) {
  if (!name) {
    return DEFAULT_PROFILE_PICTURE;
  }

  if (profilePictureCache.has(name)) {
    return profilePictureCache.get(name);
  }

  const userData = localStorage.getItem("user");
  const currentUser = userData ? JSON.parse(userData) : null;
  const currentUserName = currentUser?.data?.name || currentUser?.name;

  if (currentUserName === name) {
    const profilePicUrl = currentUser.avatar?.url || DEFAULT_PROFILE_PICTURE;
    profilePictureCache.set(name, profilePicUrl);
    return profilePicUrl;
  }

  try {
    const response = await getProfile(name);
    const profile = response.data;
    const profilePicUrl = profile?.avatar?.url || DEFAULT_PROFILE_PICTURE;

    profilePictureCache.set(name, profilePicUrl);
    return profilePicUrl;
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    return DEFAULT_PROFILE_PICTURE;
  }
}

export function updateProfilePictureElement(imgElement, name, username) {
  if (!imgElement) return;

  const defaultSrc = imgElement.src;
  getUserProfilePicture(name)
    .then((picUrl) => {
      imgElement.src = picUrl;
      imgElement.alt = `${username}'s profile picture`;
    })
    .catch(() => {
      imgElement.src = defaultSrc;
    });
}
