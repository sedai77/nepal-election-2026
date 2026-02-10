import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Nepal Election 2026 - Interactive Election Zone Tracker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(59,130,246,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(147,51,234,0.12) 0%, transparent 50%)",
            display: "flex",
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
            display: "flex",
          }}
        />

        {/* Nepal Flag colors side accent */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 8,
            background: "linear-gradient(180deg, #dc2626 0%, #1d4ed8 100%)",
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 80,
              height: 80,
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
            }}
          >
            🗳️
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: "white",
                letterSpacing: "-0.02em",
                display: "flex",
              }}
            >
              Nepal Election 2026
            </div>
            <div
              style={{
                fontSize: 28,
                color: "#94a3b8",
                display: "flex",
              }}
            >
              नेपाल चुनाव २०८२ | Interactive Election Tracker
            </div>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: 32,
              marginTop: 16,
            }}
          >
            {[
              { label: "Districts", value: "77" },
              { label: "Constituencies", value: "165" },
              { label: "Candidates", value: "658+" },
              { label: "Election Day", value: "Mar 5" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 16,
                  padding: "16px 28px",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: "white",
                    display: "flex",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: "#64748b",
                    display: "flex",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom tagline */}
          <div
            style={{
              fontSize: 18,
              color: "#475569",
              marginTop: 8,
              display: "flex",
            }}
          >
            Interactive Map • Candidates • 2022 Results • Live Updates
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
