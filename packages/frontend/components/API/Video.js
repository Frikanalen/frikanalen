import Organization from "./Organization";
import { Component } from "react";
import { APIGET, APIPOST } from "./Fetch.js";

export async function get_categories() {
  const categories = await APIGET("categories/");
  return categories["results"];
}

export function get_upload_token(video_id) {
  return APIGET("videos/" + video_id + "/upload_token");
}

export default class Video {
  constructor() {
    this.ID = null;
    this.org = new Organization();
    this.assets = {};
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
    this.loadJSON(await APIGET("videos/" + videoID));
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
