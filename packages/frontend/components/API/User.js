import { APIGET } from "./Fetch";

export default async function ProfileFetcher(token) {
  return APIGET("user", token);
}
