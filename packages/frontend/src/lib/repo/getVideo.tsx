import { Video } from "@/generated/frikanalenDjangoAPI.schemas";
import { videosRetrieve } from "@/generated/videos/videos";
import { isAxiosError } from "axios";
import { notFound } from "next/navigation";

export const getVideo = async (videoId: string): Promise<Video> => {
  try {
    return await videosRetrieve(videoId);
  } catch (e: unknown) {
    if (isAxiosError(e)) {
      if (e.status === 404) return notFound();
    }
    throw new Error("could not bla bla");
  }
};
