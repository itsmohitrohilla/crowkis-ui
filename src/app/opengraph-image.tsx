import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Crowkis — the semantic LLM cache & agent memory layer, in Rust";

// Branded default Open Graph card (Crowkis paper/ink/crow) for social + AI previews.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FAF7F1",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 40, background: "#D62221", borderRadius: 8 }} />
          <div style={{ fontSize: 30, fontWeight: 800, color: "#16130E", letterSpacing: 2 }}>
            CROWKIS
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 24, color: "#D62221", fontWeight: 700, letterSpacing: 4 }}>
            LLM CACHE · AGENT MEMORY · IN RUST
          </div>
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              color: "#16130E",
              lineHeight: 1.05,
              marginTop: 20,
              maxWidth: 1000,
            }}
          >
            The cache that knows when to say no.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 26, color: "#4A443A" }}>
            Semantic cache + memory + guardrails, self-hosted, zero egress.
          </div>
          <div style={{ fontSize: 26, color: "#16130E", fontWeight: 700 }}>crowkis.com</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
