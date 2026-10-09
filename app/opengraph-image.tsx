import { ImageResponse } from "next/og";

export const alt = "Huy Nguyen — Software and Embedded Systems. UCSB Electrical Engineering ’28. Previously Amazon Alexa.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", background: "#f8f7f4", color: "#272b2c", display: "flex", flexDirection: "column", padding: "78px 90px", fontFamily: "sans-serif" }}><div style={{ display: "flex", fontSize: 20, letterSpacing: 4, color: "#456c8c" }}>SOFTWARE + EMBEDDED SYSTEMS</div><div style={{ display: "flex", fontSize: 105, letterSpacing: -5, marginTop: 48 }}>Huy Nguyen<span style={{ color: "#456c8c" }}>.</span></div><div style={{ display: "flex", maxWidth: 900, fontSize: 34, lineHeight: 1.4, marginTop: 24 }}>From real-time applications to sensing hardware.</div><div style={{ display: "flex", marginTop: "auto", fontSize: 23, color: "#62686b", paddingTop: 34, borderTop: "1px solid #d6d9d8" }}>UCSB Electrical Engineering ’28 · Previously Amazon Alexa</div></div>, size);
}
