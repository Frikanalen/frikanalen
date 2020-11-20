import trianglify from "trianglify";
export default function Trianglify(width, height) {
  const pattern = trianglify({
    width,
    height,
    xColors: "YlGn",
    cellSize: 60,
  });

  return "url(" + pattern.toCanvas().toDataURL() + ")";
}
