import Organization from "./Organization";
import { APIGET, APIPOST } from "./Fetch";

export async function getCategories() {
  const categories = await APIGET("categories/");
  return categories.results;
}

export function getUploadToken(videoID) {
  return APIGET(`videos/${videoID}/upload_token`);
}

export default class Video {
  constructor() {
    this.ID = null;
    this.org = new Organization();
  }

  async loadJSON(videoData) {
    this.ID = videoData.id;
    this.name = videoData.name;
    this.header = videoData.header;
    this.categories = videoData.categories;
    this.published = videoData.publish_on_web;
    this.org.loadJSON(videoData.organization);
    this.files = videoData.files;
  }

  async load(videoID) {
    let ID = videoID;
    if (typeof videoID === "undefined") {
      ID = this.ID;
    }
    await this.loadJSON(await APIGET(`videos/${ID}`));
  }

  async save() {
    if (this.ID == null) {
      const foo = await APIPOST("videos/", {
        name: this.name,
        header: this.header,
        categories: this.categories,
        organization: this.org.ID,
      });
      this.ID = foo.id;
    }
  }

  setOrganization(newOrganizationID) {
    this.org = new Organization();
    this.org.ID = newOrganizationID;
  }

  setHeader(newHeader) {
    this.header = newHeader;
  }

  setName(newName) {
    this.name = newName;
  }

  setCategories(categoryList) {
    this.categories = categoryList;
  }
}
