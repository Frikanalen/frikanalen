import React, { useState, useRef, useEffect } from "react";

let ctx;

export default function AnalogClock(props) {
  const drawSecondHand = (size, seconds) => {
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate((225 * Math.PI) / 180);

    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.rotate(seconds * (Math.PI / 30));

    ctx.moveTo(0, 0);
    ctx.lineTo(size * 0.36, size * 0.36);
    ctx.stroke();
    ctx.restore();
  };
  const drawQuarters = (size) => {
    for (let step = 0; step < 4; step++) {
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.rotate((225 * Math.PI) / 180);

      ctx.beginPath();
      ctx.lineWidth = 40;
      ctx.rotate(step * (Math.PI / 2));

      ctx.moveTo(size * 0.3, size * 0.3);
      ctx.lineTo(size * 0.34, size * 0.34);
      ctx.stroke();
      ctx.restore();
    }
  };
  const drawHourNotches = (size) => {
    for (let step = 0; step < 12; step++) {
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.rotate((225 * Math.PI) / 180);

      ctx.beginPath();
      ctx.lineWidth = 16;
      ctx.rotate(step * (Math.PI / 6));

      ctx.moveTo(size * 0.3, size * 0.3);
      ctx.lineTo(size * 0.34, size * 0.34);
      ctx.stroke();
      ctx.restore();
    }
  };
  const drawMinutesHand = (size, minutes) => {
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate((225 * Math.PI) / 180);

    ctx.beginPath();
    ctx.lineWidth = 16;
    ctx.lineCap = "round";
    ctx.rotate(minutes * (Math.PI / 30));

    ctx.moveTo(0, 0);
    ctx.lineTo(size * 0.3, size * 0.3);
    ctx.stroke();
    ctx.restore();
  };
  const drawHoursHand = (size, hours) => {
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate((225 * Math.PI) / 180);

    ctx.beginPath();
    ctx.lineWidth = 30;
    ctx.lineCap = "round";
    ctx.rotate(hours * (Math.PI / 24));

    ctx.moveTo(0, 0);
    ctx.lineTo(size * 0.25, size * 0.25);
    ctx.stroke();
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
    if (!ctx) return;
    if (!time) return;
    ctx.save();
    ctx.clearRect(0, 0, size, size);
    ctx.restore();

    drawHourNotches(size);
    drawQuarters(size);

    drawSecondHand(size, time.getSeconds() + time.getMilliseconds() / 1000);
    drawMinutesHand(size, time.getMinutes() + time.getSeconds() / 60);
    drawHoursHand(size, time.getHours() + time.getMinutes() / 30);
  }, [time, ctx]);
  setTimeout(() => setTime(new Date()), 40);

  return (
    <canvas
      ref={refCanvas}
      height={size}
      width={size}
      style={{ width: `calc(0.25 * ${size}px)`, height: `calc(0.25 * ${size}px)` }}
    >
      &nbsp;
    </canvas>
  );
}
