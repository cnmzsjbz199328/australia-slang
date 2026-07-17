import { ImageResponse } from "next/og";

// Statically generated at build time (no external fonts/network) so it works
// with `output: 'export'`. Replaces the previous invalid SVG og:image.
export const dynamic = "force-static";
export const alt = "Australia Slang – dictionary and quiz";
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
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1e1b4b 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: "-0.03em" }}>
          Australia Slang
        </div>
        <div style={{ marginTop: 24, fontSize: 40, color: "#a5b4fc" }}>
          Learn Aussie slang — dictionary &amp; quiz
        </div>
        <div style={{ marginTop: 48, fontSize: 32, color: "#d4d4d8" }}>
          G&apos;day · Arvo · Fair dinkum · Ripper
        </div>
      </div>
    ),
    { ...size }
  );
}
