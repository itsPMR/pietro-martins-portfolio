import { ImageResponse } from "next/og";

export const alt = "Pietro Martins — Desenvolvedor em formação";
export const size = { height: 630, width: 1200 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#090a0b",
        color: "#f2efe8",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: "62px 72px",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          borderTop: "1px solid rgba(242,239,232,.28)",
          display: "flex",
          fontSize: 18,
          justifyContent: "space-between",
          letterSpacing: "0.12em",
          paddingTop: 18,
          textTransform: "uppercase",
        }}
      >
        <span>PMR / Portfólio 2026</span>
        <span style={{ color: "#a7aaae" }}>Guarulhos — SP</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 142,
            fontWeight: 700,
            letterSpacing: "-0.065em",
            lineHeight: 0.78,
            textTransform: "uppercase",
          }}
        >
          Pietro
        </div>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            fontSize: 142,
            fontWeight: 700,
            letterSpacing: "-0.065em",
            lineHeight: 0.82,
            marginLeft: 120,
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              background: "#e5483d",
              display: "flex",
              height: 18,
              marginRight: 22,
              width: 18,
            }}
          />
          Martins
        </div>
      </div>
      <div
        style={{
          alignItems: "flex-end",
          borderBottom: "1px solid rgba(242,239,232,.28)",
          display: "flex",
          fontSize: 29,
          justifyContent: "space-between",
          paddingBottom: 20,
        }}
      >
        <span style={{ maxWidth: 680 }}>
          Backend, Python e aplicações web construídas com evidência.
        </span>
        <span style={{ color: "#e5483d", fontSize: 72, lineHeight: 0.7 }}>
          ↗
        </span>
      </div>
    </div>,
    size,
  );
}
