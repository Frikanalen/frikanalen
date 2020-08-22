import { APIGET } from "./Fetch.js";

export default async function ProfileFetcher() {
  return APIGET("user");
}
