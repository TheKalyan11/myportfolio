import { ImageResponse } from "next/og";

// The picture shown when the link is shared (WhatsApp, LinkedIn, X, Slack, Google...).
export const alt = "Kalyan, Full Stack & AI Engineer in Hyderabad, India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#16379c",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 6, opacity: 0.85 }}>THEKALYAN.ONLINE</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 148, fontWeight: 800, lineHeight: 1, letterSpacing: -6 }}>Kalyan</div>
          <div style={{ display: "flex", fontSize: 54, fontWeight: 600, marginTop: 20 }}>Full Stack &amp; AI Engineer</div>
          <div style={{ display: "flex", fontSize: 34, marginTop: 16, opacity: 0.85 }}>Web &amp; mobile apps · Generative AI · AWS · Hyderabad, India</div>
        </div>
        <div style={{ display: "flex", height: 10, width: 220, background: "#d1181f" }} />
      </div>
    ),
    { ...size },
  );
}
