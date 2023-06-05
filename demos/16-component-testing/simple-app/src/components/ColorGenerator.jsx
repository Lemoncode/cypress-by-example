import { useState } from "react";

// https://medium.com/swlh/javascript-color-functions-c91efabdc155
// https://www.slingacademy.com/article/javascript-convert-a-byte-array-to-a-hex-string-and-vice-versa/?utm_content=cmp-true

const hexToBytes = (hex) => {
  var bytes = [];

  for (var c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }

  return bytes;
};

export default function ColorGenerator({
  initialColor = "ff0000",
  onChange = () => {},
}) {
  const [color, setColor] = useState(initialColor);

  const handleConvertToGray = () => {
    const [r, g, b] = hexToBytes(color);
    const gray = ((r + g + b) / 3) >> 0;
    const grayColor = `${gray.toString(16)}${gray.toString(16)}${gray.toString(
      16
    )}`;
    setColor(grayColor);
  };

  const handleBackToColor = () => {
    setColor(initialColor);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "300px",
        backgroundColor: `#${color}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <button
        style={{ width: "12rem", marginBottom: "1rem" }}
        data-cy="gray"
        onClick={handleConvertToGray}
      >
        Convert to Gray
      </button>
      <button
        style={{ width: "12rem" }}
        data-cy="color"
        onClick={handleBackToColor}
      >
        Back to color
      </button>
    </div>
  );
}
