import { motivosDesligamento, headcountData, turnoverData, MESES } from "../data/mockData";

export default function PainelDetalhe({ unidade, mesIndex, onClose }) {
  if (!unidade) return null;

  const hc = headcountData[unidade];
  const turn = turnoverData[unidade];
  const atual = hc.historico[mesIndex];
  const ideal = hc.ideal;
  const desvio = atual - ideal;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(13,13,13,0.35)" }}
        onClick={onClose}
      />

      {/* Painel */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col overflow-hidden"
        style={{
          width: "400px",
          background: "#FFFFFF",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
        }}
      >
        {/* Header do painel */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid #E8E8E2" }}>
          <div>
            <p className="font-bold text-base" style={{ color: "#0D0D0D" }}>{unidade}</p>
            <p className="text-xs" style={{ color: "#ABABAB" }}>Detalhes de {MESES[mesIndex]}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded flex items-center justify-center text-lg"
            style={{ background: "#F5F5F0", color: "#0D0D0D" }}
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* HC Ideal vs Atual */}
          <section>
            <p className="uppercase tracking-widest text-xs font-semibold mb-3" style={{ color: "#ABABAB", fontSize: "9.5px" }}>
              Headcount
            </p>
            <div className="flex gap-3">
              {[
                { label: "Atual", val: atual },
                { label: "Ideal", val: ideal },
                { label: "Desvio", val: desvio > 0 ? `+${desvio}` : desvio, cor: desvio >= 0 ? "#97A624" : "#8C1414" },
              ].map((item) => (
                <div key={item.label} className="flex-1 rounded-lg p-4" style={{ background: "#FAFAF8", border: "1px solid #E8E8E2" }}>
                  <p className="text-xs uppercase tracking-wide" style={{ color: "#ABABAB", fontSize: "9px" }}>{item.label}</p>
                  <p className="font-bold text-2xl mt-1" style={{ color: item.cor || "#0D0D0D", fontFamily: "'DM Mono', monospace" }}>{item.val}</p>
                </div>
              ))}
            </div>

            {/* Barra HC */}
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1" style={{ color: "#ABABAB" }}>
                <span>Ocupação</span>
                <span style={{ fontFamily: "'DM Mono', monospace" }}>{((atual / ideal) * 100).toFixed(0)}%</span>
              </div>
              <div className="rounded-full h-2" style={{ background: "#E8E8E2" }}>
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${Math.min(100, (atual / ideal) * 100)}%`,
                    background: atual >= ideal ? "#97A624" : atual / ideal > 0.85 ? "#D9B504" : "#8C1414",
                  }}
                />
              </div>
            </div>
          </section>

          {/* Histórico turnover */}
          <section>
            <p className="uppercase tracking-widest text-xs font-semibold mb-3" style={{ color: "#ABABAB", fontSize: "9.5px" }}>
              Histórico de Turnover
            </p>
            <div className="flex flex-col gap-1">
              {MESES.map((m, i) => {
                const val = turn[i];
                const cor = val > 9 ? "#8C1414" : val > 5 ? "#D9B504" : "#97A624";
                return (
                  <div key={m} className="flex items-center gap-3">
                    <span className="text-xs w-12" style={{ color: "#ABABAB" }}>{m}</span>
                    <div className="flex-1 h-5 rounded" style={{ background: "#F5F5F0", position: "relative" }}>
                      <div
                        className="h-5 rounded"
                        style={{ width: `${Math.min(100, val * 6)}%`, background: cor, opacity: 0.85 }}
                      />
                    </div>
                    <span
                      className="text-xs w-10 text-right font-semibold"
                      style={{ color: cor, fontFamily: "'DM Mono', monospace" }}
                    >
                      {val}%
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* HC histórico */}
          <section>
            <p className="uppercase tracking-widest text-xs font-semibold mb-3" style={{ color: "#ABABAB", fontSize: "9.5px" }}>
              Histórico Headcount
            </p>
            <div className="flex gap-1.5 items-end h-20">
              {hc.historico.map((v, i) => {
                const max = hc.ideal;
                const h = (v / (max * 1.2)) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t relative" style={{ height: "64px", background: "#F5F5F0" }}>
                      <div
                        className="w-full rounded-t absolute bottom-0"
                        style={{ height: `${h}%`, background: i === mesIndex ? "#0D0D0D" : "#D0D0CA" }}
                      />
                      {i === mesIndex && (
                        <div className="absolute -top-5 w-full text-center">
                          <span className="text-xs font-bold" style={{ color: "#0D0D0D" }}>{v}</span>
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: "8px", color: "#ABABAB" }}>{MESES[i].split("/")[0]}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-3 h-0.5" style={{ background: "#8C1414", borderTop: "2px dashed #8C1414" }} />
              <span className="text-xs" style={{ color: "#ABABAB" }}>Meta ideal: {hc.ideal}</span>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
