import trianglify from "./trianglify.bundle";
import React, { useEffect, useState } from "react";

export default function TrianglifiedDiv(props) {
  const { children, width, height } = props;
  const [dataURL, setDataURL] = useState();
  var pattern;

  useEffect(() => {
    pattern = trianglify({
      width: width,
      height: height,
      xColors: "YlGn",
      yColors: "random",
      seed: "frikanalen",
      colorFunction: trianglify.colorFunctions.sparkle(0.1),
      cellSize: 40,
    });
    setDataURL("url(" + pattern.toCanvas().toDataURL() + ")");
  }, []);

  return <div style={{ width: `${width}px`, height: `${height}px`, background: dataURL }}>{children}</div>;
}
