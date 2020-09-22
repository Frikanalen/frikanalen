import { APIGET, APIPOST } from "./Fetch.js";

export default class Organization {
  loadJSON(orgData) {
    this.ID = orgData.id;
    this.name = orgData.name;
  }

  async load(id) {
    this.fromJSON(await APIGET("organization/" + id));
  }
}
