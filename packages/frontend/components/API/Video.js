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
  }

  async load(videoID) {
    const videoData = await APIGET("videos/" + videoID);
    this.ID = videoData.id;
    this.name = videoData.name;
    this.header = videoData.header;
    this.categories = videoData.categories;
  }

  async save() {
    if (this.ID == null) {
      const foo = await APIPOST("videos/", {
        name: this.name,
        header: this.header,
        categories: this.categories,
        organization: this.organization,
      });
      try {
        this.ID = foo.id;
      } catch (e) {
        console.log(e);
      }
    }
  }

  setOrganization(newOrganization) {
    this.organization = newOrganization;
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
