import { useState } from "react";
import Sidebar from "./components/Sidebar";
import HeaderBar from "./components/HeaderBar";
import DashboardRH from "./components/DashboardRH";
import DashboardCustos from "./components/DashboardCustos";

export default function App() {
  const [pagina, setPagina] = useState("rh");
  const [mes, setMes] = useState("Jun/26");
  const [unidade, setUnidade] = useState("Todas");

  return (
    <div className="flex h-screen overflow-hidden" style={{ background:"#FAFAF8", fontFamily:"'DM Sans', sans-serif" }}>
      <Sidebar paginaAtiva={pagina} onNavegar={setPagina} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderBar
          titulo={pagina === "rh" ? "Turnover & Headcount" : "Custos com Pessoas"}
          mes={mes} onMesChange={setMes}
          unidade={unidade} onUnidadeChange={setUnidade}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {pagina === "rh"
            ? <DashboardRH    mes={mes} unidade={unidade} />
            : <DashboardCustos mes={mes} unidade={unidade} />}
        </main>
      </div>
    </div>
  );
}
