import { ImageResponse } from "next/og";

export const alt = "Pietro Martins — Desenvolvedor em formação";
export const size = { height: 630, width: 1200 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#0b0c0a",
        color: "#ede9de",
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
          border: "1px solid rgba(237,233,222,.22)",
          borderRadius: 24,
          display: "flex",
          fontSize: 18,
          justifyContent: "space-between",
          letterSpacing: "0.12em",
          padding: "18px 22px",
          textTransform: "uppercase",
        }}
      >
        <span>PMR / Portfólio 2026</span>
        <span style={{ color: "#a9aa9f" }}>Guarulhos — SP</span>
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
              background: "#d7f35e",
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
          borderBottom: "1px solid rgba(237,233,222,.28)",
          display: "flex",
          fontSize: 29,
          justifyContent: "space-between",
          paddingBottom: 20,
        }}
      >
        <span style={{ maxWidth: 680 }}>
          Backend, Python e aplicações web construídas com evidência.
        </span>
        <span style={{ color: "#d7f35e", fontSize: 72, lineHeight: 0.7 }}>
          ↗
        </span>
      </div>
    </div>,
    size,
  );
}
