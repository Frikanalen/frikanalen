import { Resource, ResourceFactory } from "modules/state/classes/Resource";
import { VideoData } from "../types";

export class Video extends Resource<VideoData> {}

export const createVideo: ResourceFactory<Video> = (data, manager) => new Video(data, manager);
