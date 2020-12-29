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

  return (
    <div
      className="mainPresentationSurfaceOuter"
      style={{ width: `${width}px`, height: `${height}px`, backgroundSize: "cover", background: dataURL }}
    >
      <div className="mainPresentationSurfaceInner" style={{ width: `${width}px`, height: `${height}px` }}>
        {children}
      </div>
      <style jsx>{`
        .mainPresentationSurfaceOuter {
          transform: rotate(180deg);
          background-size: cover !important;
        }
        .mainPresentationSurfaceInner {
          transform: rotate(180deg);
        }
      `}</style>
    </div>
  );
}
