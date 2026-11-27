import { ImageResponse } from "next/og";
import { PROFILE } from "@/config/profile";

export const alt = `${PROFILE.name} — ${PROFILE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          backgroundColor: "#07080D",
          backgroundImage:
            "radial-gradient(circle at 82% 22%, rgba(91,140,255,0.28), transparent 45%), radial-gradient(circle at 18% 82%, rgba(155,107,255,0.22), transparent 45%)",
          color: "#F5F7FF",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              fontSize: 22,
              letterSpacing: "0.2em",
              color: "#45E4FF",
            }}
          >
            <span>{PROFILE.name}</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              color: "#969BB0",
              border: "1px solid rgba(245,247,255,0.16)",
              borderRadius: 999,
              padding: "8px 20px",
            }}
          >
            {`${PROFILE.yearsOfExperience} YEARS EXPERIENCE`}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: 20,
              letterSpacing: "0.18em",
              color: "#5B8CFF",
            }}
          >
            {PROFILE.role}
          </div>
          <div
            style={{
              fontSize: 58,
              fontWeight: 700,
              lineHeight: 1.08,
              maxWidth: "960px",
            }}
          >
            {PROFILE.brandHeadline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(245,247,255,0.12)",
            paddingTop: "24px",
            fontSize: 18,
            color: "#969BB0",
          }}
        >
          <span>Full Stack · AI Agents · Distributed Systems · Cloud-Native</span>
          <span style={{ color: "#45E4FF" }}>117 Technologies · 15 Blueprints</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
