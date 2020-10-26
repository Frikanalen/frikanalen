import React from "react";

import dynamic from "next/dynamic";
import ScheduleInfo from "./ScheduleInfo";
import WindowWidget from "./WindowWidget";

const ShakaPlayer = dynamic(() => import("./ShakaPlayer.js"), { ssr: false });

export default function LiveNow() {
    return (
      <WindowWidget nomargin>
        <ShakaPlayer src="https://frikanalen.no/stream/index.m3u8" />
        <ScheduleInfo />
      </WindowWidget>
    );
  };
