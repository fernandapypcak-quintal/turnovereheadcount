import { UNIDADES, MESES } from "../data/mockData";

export default function HeaderBar({ titulo, mes, onMesChange, unidade, onUnidadeChange }) {
  const todasUnidades = ["Todas", ...UNIDADES];

  const selectStyle = (ativo) => ({
    background: ativo ? "#0D0D0D" : "#FFFFFF",
    color: ativo ? "#FFFFFF" : "#0D0D0D",
    border: "1px solid",
    borderColor: ativo ? "#0D0D0D" : "#E8E8E2",
    borderRadius: "6px",
    padding: "5px 10px",
    fontSize: "12px",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    outline: "none",
    appearance: "none",
    WebkitAppearance: "none",
    paddingRight: "26px",
    backgroundImage: ativo
      ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='white'/%3E%3C/svg%3E")`
      : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%230D0D0D'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 8px center",
  });

  return (
    <header
      className="flex items-center justify-between px-6 py-4 border-b shrink-0"
      style={{ background: "#FFFFFF", borderColor: "#E8E8E2" }}
    >
      <div>
        <p className="font-bold text-lg" style={{ color: "#0D0D0D", letterSpacing: "-0.02em" }}>
          {titulo}
        </p>
        <p className="text-xs" style={{ color: "#ABABAB" }}>
          Quintal do Espeto · Todas as unidades
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Filtro Unidade */}
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "#ABABAB", fontSize: "9.5px" }}
          >
            Unidade
          </span>
          <div style={{ position: "relative" }}>
            <select
              value={unidade}
              onChange={(e) => onUnidadeChange(e.target.value)}
              style={selectStyle(unidade !== "Todas")}
            >
              {todasUnidades.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Divisor */}
        <div style={{ width: 1, height: 20, background: "#E8E8E2" }} />

        {/* Filtro Mês */}
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "#ABABAB", fontSize: "9.5px" }}
          >
            Período
          </span>
          <div style={{ position: "relative" }}>
            <select
              value={mes}
              onChange={(e) => onMesChange(e.target.value)}
              style={selectStyle(true)}
            >
              {MESES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
