import React, { useState, useRef, useEffect } from "react";

let ctx;

export default function AnalogClock(props) {
  const drawCentralSpot = () => {
    ctx.save();
    const dimen = 12;
    const innerDimen = dimen - 3.5;
    ctx.beginPath();
    ctx.arc(0, 0, dimen, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, innerDimen, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#F00";
    ctx.fill();
    ctx.restore();
  };

  const drawMarkers = () => {
    ctx.save();
    for (let step = 0; step < 12; step++) {
      const width = 8;
      const height = 40;
      const distance = 200;
      ctx.rotate(Math.PI / 6);
      roundRect(ctx, -width / 2, distance, width, height, 2);
    }
    ctx.restore();
  };

  const roundRect = (ctx, x, y, width, height, radius, roundBothEnds = true) => {
    ctx.beginPath();
    ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI + Math.PI / 2);
    ctx.lineTo(x + width - radius, y);
    ctx.arc(x + width - radius, y + radius, radius, Math.PI + Math.PI / 2, 0);
    ctx.lineTo(x + width, y + height - radius);
    if (!roundBothEnds) {
      radius = 0;
    }
    ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2);
    ctx.lineTo(x + radius, y + height);
    ctx.arc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI);
    ctx.lineTo(x, y + radius);
    ctx.fill();
  };

  const drawSecondHand = (seconds) => {
    ctx.save();
    const width = 4;
    const height = 150;
    ctx.fillStyle = "#F00";
    ctx.rotate((seconds * Math.PI) / 30 + Math.PI);
    roundRect(ctx, -width / 2.0, 0, width, height, width / 2);
    ctx.restore();
  };

  const drawMinutesHand = (minutes) => {
    ctx.save();
    const width = 10;
    const height = 195;
    if (!(minutes % 60)) {
    }
    ctx.rotate((minutes * Math.PI) / 30 + Math.PI);
    roundRect(ctx, -width / 2.0, 0, width, height, width / 2, false);
    ctx.restore();
  };

  const drawHoursHand = (hours) => {
    ctx.save();
    const width = 10;
    const height = 125;
    if (!(hours % 60)) {
    }
    ctx.rotate(hours * ((2 * Math.PI) / 12) - Math.PI);
    roundRect(ctx, -width / 2.0, 0, width, height, width / 2, false);
    ctx.restore();
  };

  const size = parseInt(props.size);
  const [time, setTime] = useState();

  const [ctx, setContext] = useState(null);
  const refCanvas = useRef(null);
  const getContext = useEffect(() => {
    setContext(refCanvas.current.getContext("2d"));
  }, []);
  const update = useEffect(() => {
    const radius = refCanvas.current.height / 2;
    if (!ctx) return;
    if (!time) return;
    ctx.restore();
    ctx.clearRect(0, 0, refCanvas.current.width, refCanvas.current.height);
    ctx.save();
    ctx.translate(radius, radius);

    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    drawMarkers();
    drawMinutesHand(time.getMinutes());
    drawHoursHand(time.getHours() + time.getMinutes() / 60.0);
    drawCentralSpot();
    drawSecondHand(time.getSeconds());
  }, [time, ctx]);
  setTimeout(() => setTime(new Date()), 80);

  return (
    <canvas
      ref={refCanvas}
      height={size}
      width={size}
      style={{ width: `calc(0.8 * ${size}px)`, height: `calc(0.8 * ${size}px)` }}
    >
      &nbsp;
    </canvas>
  );
}
