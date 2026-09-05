import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

/** The portfolio's browser and app icon. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#090B0D",
          borderRadius: 112,
          display: "flex",
          fontFamily: "Arial, sans-serif",
          fontSize: 284,
          fontWeight: 500,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "-26px",
          paddingBottom: 22,
          width: "100%",
        }}
      >
        <span style={{ color: "#EEEDE7" }}>d</span>
        <span style={{ color: "#2855D9" }}>.</span>
      </div>
    ),
    size,
  );
}
