import { observable, computed } from "mobx";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { TUS_CHUNK_SIZE, UPLOAD_RETRY_COUNT } from "../constants";
import { StoredArray } from "modules/state/classes/StoredArray";
import { toSafeAsciiString } from "modules/lang/string";
import { Manager } from "modules/state/types";

const storage = new StoredArray<string>("resumable-uploads", 10);

export type FileUploadStatus = "idle" | "uploading" | "failed" | "completed";

export type FileUploadResult = {
  id: number;
  key: string;
};

export type FileUploadOptions = {
  file: File;
  destination: string;
  metadata: object;
};

export class FileUpload {
  @observable public status: FileUploadStatus = "idle";
  @observable public uploaded = 0;
  @observable public referenceId?: number;
  @observable public error?: any;

  private offset = 0;
  private retries = 0;

  private file: File;
  private destination: string;
  private metadata: object;
  private location?: string;
  private canceler = axios.CancelToken.source();

  public constructor(options: FileUploadOptions, private manager: Manager) {
    this.file = options.file;
    this.destination = options.destination;
    this.metadata = options.metadata;
  }

  public async upload() {
    const { offset, file, location } = this;

    const start = offset;
    const end = offset + TUS_CHUNK_SIZE;
    const chunk = file.slice(start, end);

    const config: AxiosRequestConfig = {
      ...this.cancelOptions,
      onUploadProgress: this.handleProgress,
      headers: {
        "content-type": "application/offset+octet-stream",
        "upload-offset": String(this.offset),
      },
    };

    this.status = "uploading";
    const request = this.server.patch<FileUploadResult>(location!, chunk, config);

    try {
      const response = await request;

      const offset = response.headers["upload-offset"];
      this.offset = Number(offset);

      if (this.offset === file.size) {
        this.status = "completed";
        this.referenceId = response.data.id;
        this.uploaded = file.size;

        return;
      }

      await this.upload();
    } catch (error: any) {
      this.handleChunkError(error);
    }
  }

  private async prepare() {
    const { destination, metadata } = this;
    const { size } = this.file;

    const headers = {
      "Upload-Length": String(size),
      "Upload-Metadata": `${btoa(JSON.stringify(metadata))}`,
    };

    const request = this.server.post<any>(destination, null, {
      ...this.cancelOptions,
      headers,
    });

    try {
      const response = await request;
      const location = response.headers.location!;

      this.location = location;
      storage.set(this.fingerprint, location);

      this.upload();
    } catch (e) {
      this.status = "failed";
      console.error(e);
    }
  }

  private async restore(location: string) {
    const request = this.server.head(location, this.cancelOptions);

    try {
      const response = await request;
      const offset = response.headers["upload-offset"];

      this.offset = Number(offset);
      this.upload();
    } catch (error) {
      const { response } = error as AxiosError;

      if (response) {
        const { status } = response;

        if (status === 410) return this.retry();
        if (status === 404) return await this.prepare();

        this.error = response.data;
      }

      this.status = "failed";
    }
  }

  public start() {
    const location = storage.get(this.fingerprint);

    if (location) {
      this.restore(location);
    } else {
      this.prepare();
    }
  }

  public retry() {
    this.retries += 1;

    if (this.retries > UPLOAD_RETRY_COUNT) {
      this.status = "failed";
      return;
    }

    storage.remove(this.fingerprint);

    this.offset = 0;
    this.location = undefined;

    this.start();
  }

  public stop() {
    this.canceler?.cancel("Upload cancelled");
    this.status = "idle";
  }

  private handleProgress = (event: ProgressEvent) => {
    const { loaded } = event;
    this.uploaded = this.offset + loaded;
  };

  private handleChunkError = (error: AxiosError) => {
    const { response } = error;

    if (response?.status === 400) {
      this.status = "failed";
      this.error = response.data;
      return;
    }

    return this.retry();
  };

  public get fingerprint(): string {
    const { name, size, lastModified } = this.file;

    const rawFingerprint = `tus-${name}-${size}-${lastModified}`;
    const escapedFingerprint = toSafeAsciiString(rawFingerprint);

    return btoa(escapedFingerprint);
  }

  private get cancelOptions() {
    return {
      cancelToken: this.canceler.token,
    };
  }

  private get server() {
    return this.manager.stores.networkStore.upload;
  }

  @computed
  public get progress() {
    return this.uploaded / this.file.size;
  }

  public get name() {
    return this.file.name;
  }

  public get size() {
    return this.file.size;
  }
}
