import { useState } from "react";
import Sidebar from "./components/Sidebar";
import HeaderBar from "./components/HeaderBar";
import DashboardRH from "./components/DashboardRH";

export default function App() {
  const [mesSelecionado, setMesSelecionado] = useState("Jun/25");
  const [unidade, setUnidade] = useState("Todas");
  const [paginaAtiva] = useState("rh");

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#FAFAF8", fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar paginaAtiva={paginaAtiva} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderBar
          titulo="Turnover & Headcount"
          mes={mesSelecionado}
          onMesChange={setMesSelecionado}
          unidade={unidade}
          onUnidadeChange={setUnidade}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <DashboardRH mes={mesSelecionado} unidade={unidade} />
        </main>
      </div>
    </div>
  );
}
