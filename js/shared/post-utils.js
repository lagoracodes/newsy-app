import { APP_TAG } from "../api/constants.js";

export function hasNewsyTag(post) {
  return post.tags && post.tags.includes(APP_TAG);
}
