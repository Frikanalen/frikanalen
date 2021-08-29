import React, { useEffect, useRef, useState } from "react";
import JSMpeg from "@cycjimmy/jsmpeg-player";

export const MonitoringStream = () => {
  const [videoElement, setVideoElement] = useState<JSMpeg.VideoElement | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current == null) return;

    setVideoElement(
      new JSMpeg.VideoElement(containerRef.current, "wss://monitoring.frikanalen.no/", {
        videoBufferSize: 512 * 1024 * 20,
        audioBufferSize: 128 * 1024 * 20,
      })
    );
  }, [containerRef]);

  return (
    <div
      ref={containerRef}
      style={{ width: "1024px", height: "576px", margin: "0 auto" }}
      onClick={() => {
        if (!videoElement?.player) return;
        videoElement.player.getVolume() ? videoElement.player.setVolume(0) : videoElement.player.setVolume(1);
      }}
    />
  );
};
