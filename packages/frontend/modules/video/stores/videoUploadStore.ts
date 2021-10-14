import { FileUpload } from "modules/network/classes/FileUpload";
import { ApiCollection } from "modules/network/types";
import { VideoCategoryData, VideoData, VideoUploadTokenData } from "../types";
import { createStoreFactory, Store } from "modules/state/classes/Store";
import { createNewVideoForm, NewVideoForm } from "../forms/createNewVideoForm";
import { observable } from "mobx";

export type SerializedVideoUploadStore = {
  categories: VideoCategoryData[];
  organizationId: number;
};

export class VideoUploadStore extends Store<SerializedVideoUploadStore> {
  @observable public file?: File;
  @observable public upload?: FileUpload;

  public form!: NewVideoForm;

  public organizationId = 0;
  public videoId = 0;

  public categories: VideoCategoryData[] = [];

  public async fetchCategories() {
    // Don't refetch categories
    if (this.categories.length > 0) return;

    const { networkStore } = this.manager.stores;
    const { api } = networkStore;

    const { data } = await api.get<ApiCollection<VideoCategoryData>>("/categories");
    this.categories = data.results;
  }

  public async start() {
    const { form, file, organizationId } = this;

    if (!file) {
      throw new Error("start() was called without a file");
    }

    const { networkStore } = this.manager.stores;
    const { api } = networkStore;

    const { data: video } = await api.post<VideoData>("/videos/", {
      ...form.serialized,
      organization: organizationId,
    });

    const { data: token } = await api.get<VideoUploadTokenData>(`/videos/${video.id}/upload_token`);

    this.videoId = video.id;
    this.upload = new FileUpload(
      {
        file,
        destination: "/",
        metadata: {
          origFileName: file.name,
          videoID: video.id,
          uploadToken: token.uploadToken,
        },
      },
      this.manager
    );

    this.upload.start();
  }

  public cancel() {
    if (this.upload) {
      this.upload.stop();
    }

    this.form = createNewVideoForm(this.categories, this.manager);
    this.upload = undefined;
    this.file = undefined;
    this.videoId = 0;
  }

  public async prepare(organizationId: number) {
    await this.fetchCategories();

    if (this.organizationId !== organizationId) {
      this.form = createNewVideoForm(this.categories, this.manager);
      this.upload = undefined;
      this.organizationId = organizationId;
    }
  }

  public serialize() {
    const { categories, organizationId } = this;
    return { categories, organizationId };
  }

  public hydrate(data: SerializedVideoUploadStore) {
    this.categories = data.categories;
    this.organizationId = data.organizationId;

    // This is a workaround due to the fact that there's a mismatch between manager instances on server side
    this.form = createNewVideoForm(this.categories, this.manager);
  }
}

export const videoUploadStore = createStoreFactory(VideoUploadStore);
