export default function KpiCard({ label, valor, subtitulo, cor, prefixo = "", sufixo = "", mono = false }) {
  const corMap = {
    verde: "#97A624",
    vermelho: "#8C1414",
    ambar: "#D9B504",
    cinza: "#888888",
    preto: "#0D0D0D",
  };
  const corFinal = corMap[cor] || cor || "#0D0D0D";

  return (
    <div
      className="rounded-lg p-5 flex flex-col gap-1"
      style={{ background: "#FFFFFF", border: "1px solid #E8E8E2" }}
    >
      <p
        className="uppercase tracking-widest"
        style={{ fontSize: "10.5px", color: "#ABABAB", fontWeight: 600, letterSpacing: "0.08em" }}
      >
        {label}
      </p>
      <p
        className="font-bold"
        style={{
          fontSize: "26px",
          color: "#0D0D0D",
          fontFamily: mono ? "'DM Mono', monospace" : "'DM Sans', sans-serif",
          letterSpacing: mono ? "-0.02em" : "-0.03em",
          lineHeight: 1.1,
        }}
      >
        {prefixo}{valor ?? "—"}{sufixo}
      </p>
      {subtitulo && (
        <p className="text-xs font-medium" style={{ color: corFinal, fontSize: "12px" }}>
          {subtitulo}
        </p>
      )}
    </div>
  );
}
