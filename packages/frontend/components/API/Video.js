import { Component } from "react";
import Organization from "./Organization";
import { APIGET, APIPOST } from "./Fetch.js";

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
    if (typeof videoID === "undefined") {
      videoID = this.ID;
    }
    await this.loadJSON(await APIGET("videos/" + videoID));
  }

  async save() {
    if (this.ID == null) {
      const foo = await APIPOST("videos/", {
        name: this.name,
        header: this.header,
        categories: this.categories,
        organization: this.org.ID,
      });
      try {
        this.ID = foo.id;
      } catch (e) {
        console.log(e);
      }
      console.log("video ID now ", foo.id);
    }
  }

  setOrganization(newOrganizationID) {
    this.org = new Organization();
    this.org.ID = newOrganizationID;
  }

  setHeader(newHeader) {
    this.header = newHeader;
  }

  setName(new_name) {
    this.name = new_name;
  }

  setCategories(category_list) {
    this.categories = category_list;
  }
}
