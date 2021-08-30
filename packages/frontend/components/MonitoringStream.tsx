import React, { useEffect, useRef, useState } from "react";
import JSMpeg from "@cycjimmy/jsmpeg-player";

export const MonitoringStream = () => {
  const [videoElement, setVideoElement] = useState<JSMpeg.VideoElement | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current == null) return;

    if (!videoElement)
      setVideoElement(
        new JSMpeg.VideoElement(containerRef.current, "wss://monitoring.frikanalen.no/", {
          videoBufferSize: 512 * 1024 * 20,
          audioBufferSize: 128 * 1024 * 20,
        })
      );

    return () => {
      videoElement?.destroy && videoElement.destroy();
    };
  }, [videoElement]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", paddingBottom: "56.25%" }}
      onClick={() => {
        if (!videoElement?.player) return;
        videoElement.player.getVolume() ? videoElement.player.setVolume(0) : videoElement.player.setVolume(1);
      }}
    />
  );
};

export default MonitoringStream;
