import { APIGET } from "./Fetch";

export default async function ProfileFetcher() {
  return APIGET("user");
}
