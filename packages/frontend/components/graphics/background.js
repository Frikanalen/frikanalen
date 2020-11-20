import trianglify from "./trianglify.bundle";

export default function TrianglifiedDiv(props) {
  const { children, width, height } = props;

  const pattern = trianglify({
    width: width,
    height: height,
    xColors: "YlGn",
    cellSize: 60,
  });

  return (
    <div
      style={{ width: `${width}px`, height: `${height}px`, background: "url(" + pattern.toCanvas().toDataURL() + ")" }}
    >
      {children}
    </div>
  );
}
