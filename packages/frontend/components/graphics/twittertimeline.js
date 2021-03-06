import React, { useState, useRef, useEffect } from "react";
import { Timeline } from "react-twitter-widgets";

let ctx;

export default function TwitterTimeline(props) {
  return (
    <Timeline
      dataSource={{
        sourceType: "profile",
        screenName: "Frikanalen",
      }}
      options={{
        tweetLimit: 1,
        chrome: "noheader, nofooter, noborders, noscrollbar",
        width: "600",
        height: "400",
      }}
    />
  );
}
