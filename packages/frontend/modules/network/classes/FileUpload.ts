import { makeAutoObservable } from "mobx";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { TUS_CHUNK_SIZE, TUS_RESUMABLE, UPLOAD_RETRY_COUNT } from "../constants";
import { Manager } from "modules/state/types";

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

const TUS_HEADERS = {
  "Tus-Resumable": TUS_RESUMABLE,
};

export class FileUpload {
  public status: FileUploadStatus = "idle";
  public uploaded = 0;
  public referenceId?: number;
  public error?: any;

  private offset = 0;
  private retries = 0;

  private readonly file: File;
  private destination: string;
  private metadata: object;
  private location?: string;
  private canceler = axios.CancelToken.source();

  public constructor(options: FileUploadOptions, private manager: Manager) {
    makeAutoObservable(this);

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
        ...TUS_HEADERS,
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

  private static encodeMetadata(metadata: Record<string, any>) {
    let encoded = [];

    for (const key in metadata) {
      encoded.push(`${key} ${window.btoa(metadata[key])}`);
    }

    return encoded.join(",");
  }

  async start() {
    const { destination, metadata } = this;
    const { size } = this.file;

    const headers = {
      ...TUS_HEADERS,
      "Upload-Length": String(size),
      "Upload-Metadata": FileUpload.encodeMetadata(metadata),
    };

    const request = this.server.post<any>(destination, null, {
      ...this.cancelOptions,
      headers,
    });

    try {
      const response = await request;
      this.location = response.headers.location!;

      await this.upload();
    } catch (e) {
      this.status = "failed";
      console.error(e);
    }
  }

  public async retry() {
    this.retries += 1;

    if (this.retries > UPLOAD_RETRY_COUNT) {
      this.status = "failed";
      return;
    }

    this.offset = 0;
    this.location = undefined;

    await this.start();
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

  private get cancelOptions() {
    return {
      cancelToken: this.canceler.token,
    };
  }

  private get server() {
    return this.manager.stores.networkStore.upload;
  }

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
