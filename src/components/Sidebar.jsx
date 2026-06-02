const NAV = [
  {
    grupo: "Operações",
    itens: [
      { id: "cmv", label: "CMV", icone: "📦", ativo: false },
      { id: "rh", label: "Turnover & HC", icone: "👥", ativo: true },
    ],
  },
  {
    grupo: "Financeiro",
    itens: [
      { id: "dre", label: "DRE", icone: "📊", emBreve: true },
      { id: "fluxo", label: "Fluxo de Caixa", icone: "💰", emBreve: true },
    ],
  },
  {
    grupo: "Qualidade",
    itens: [
      { id: "nps", label: "NPS", icone: "⭐", emBreve: true },
      { id: "auditorias", label: "Auditorias", icone: "✅", emBreve: true },
    ],
  },
];

export default function Sidebar({ paginaAtiva }) {
  return (
    <aside
      className="flex flex-col w-56 shrink-0 border-r"
      style={{ background: "#FFFFFF", borderColor: "#E8E8E2" }}
    >
      {/* Logo / Header */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ background: "#0D0D0D" }}
      >
        <div
          className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold"
          style={{ background: "#97A624", color: "#0D0D0D" }}
        >
          QE
        </div>
        <div>
          <p className="text-white text-xs font-semibold leading-tight">Quintal do Espeto</p>
          <p className="text-xs leading-tight" style={{ color: "#97A624" }}>Gestão Inteligente</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {NAV.map((grupo) => (
          <div key={grupo.grupo} className="mb-5">
            <p
              className="px-2 mb-2 text-xs font-semibold tracking-widest uppercase"
              style={{ color: "#ABABAB", fontSize: "9px" }}
            >
              {grupo.grupo}
            </p>
            {grupo.itens.map((item) => {
              const isAtivo = item.id === paginaAtiva;
              return (
                <button
                  key={item.id}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded mb-0.5 text-left transition-all"
                  style={{
                    background: isAtivo ? "#0D0D0D" : "transparent",
                    color: isAtivo ? "#FFFFFF" : item.emBreve ? "#BDBDBD" : "#3D3D3D",
                    cursor: item.emBreve ? "default" : "pointer",
                    fontSize: "13px",
                  }}
                >
                  {isAtivo && (
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: "#97A624" }}
                    />
                  )}
                  {!isAtivo && <span className="w-1.5 h-1.5 shrink-0" />}
                  <span className="text-sm">{item.icone}</span>
                  <span className="flex-1 font-medium" style={{ fontSize: "12.5px" }}>
                    {item.label}
                  </span>
                  {item.emBreve && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ background: "#F0F0EC", color: "#ABABAB", fontSize: "9px", letterSpacing: "0.05em" }}
                    >
                      EM BREVE
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t" style={{ borderColor: "#E8E8E2" }}>
        <p className="text-xs" style={{ color: "#BDBDBD" }}>Dados atualizados</p>
        <p className="text-xs font-medium" style={{ color: "#0D0D0D" }}>Jun/2025</p>
      </div>
    </aside>
  );
}
