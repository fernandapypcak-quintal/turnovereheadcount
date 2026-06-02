import { useState } from "react";
import KpiCard from "./KpiCard";
import PainelDetalhe from "./PainelDetalhe";
import { getKPIs, getRankingUnidades, getHistoricoConsolidado, getMesIndex } from "../utils/calculos";
import { motivosDesligamento, CUSTO_REPOSICAO, META_TURNOVER } from "../data/mockData";

const STATUS_COR = { ok: "#97A624", atencao: "#D9B504", critico: "#8C1414" };
const STATUS_BG = { ok: "#F0F5E0", atencao: "#FDF9E0", critico: "#F5E0E0" };
const STATUS_LABEL = { ok: "OK", atencao: "Atenção", critico: "Crítico" };

export default function DashboardRH({ mes, unidade }) {
  const [unidadeDetalhe, setUnidadeDetalhe] = useState(null);
  const mesIndex = getMesIndex(mes);
  const kpi = getKPIs(mesIndex, unidade);
  const ranking = getRankingUnidades(mesIndex);
  const historico = getHistoricoConsolidado();
  const totalMotivos = motivosDesligamento.reduce((s, m) => s + m.qtd, 0);

  // Filtrar ranking se unidade específica
  const rankingFiltrado = unidade === "Todas"
    ? ranking
    : ranking.filter((r) => r.unidade === unidade);

  return (
    <div className="flex flex-col gap-6 pb-8">

      {/* ── KPI CARDS ────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="Turnover Médio"
          valor={kpi.turnoverMedio}
          sufixo="%"
          mono
          cor={kpi.turnoverMedio > 9 ? "vermelho" : kpi.turnoverMedio > META_TURNOVER ? "ambar" : "verde"}
          subtitulo={kpi.turnoverMedio > META_TURNOVER ? `↑ ${(kpi.turnoverMedio - META_TURNOVER).toFixed(1)}pp acima da meta` : `✓ Dentro da meta (${META_TURNOVER}%)`}
        />
        <KpiCard
          label="Headcount Atual"
          valor={kpi.hcAtual}
          mono
          cor={kpi.hcAtual >= kpi.hcIdeal ? "verde" : "ambar"}
          subtitulo={`Meta: ${kpi.hcIdeal} · ${kpi.vagasAbertas > 0 ? `${kpi.vagasAbertas} vagas abertas` : "Quadro completo"}`}
        />
        <KpiCard
          label="Admissões / Desligamentos"
          valor={`${kpi.admissoes} / ${kpi.desligamentos}`}
          mono
          cor={kpi.saldo >= 0 ? "verde" : "vermelho"}
          subtitulo={`Saldo ${kpi.saldo >= 0 ? "+" : ""}${kpi.saldo} no período`}
        />
        <KpiCard
          label="Custo de Reposição"
          valor={kpi.custoReposicao.toLocaleString("pt-BR")}
          prefixo="R$ "
          mono
          cor="vermelho"
          subtitulo={`${kpi.desligamentos} deslig. × R$ ${CUSTO_REPOSICAO.toLocaleString("pt-BR")}`}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="Vagas Abertas"
          valor={kpi.vagasAbertas}
          mono
          cor={kpi.vagasAbertas === 0 ? "verde" : kpi.vagasAbertas <= 5 ? "ambar" : "vermelho"}
          subtitulo={kpi.vagasAbertas === 0 ? "Quadro completo" : `${((kpi.vagasAbertas / kpi.hcIdeal) * 100).toFixed(1)}% do quadro ideal`}
        />
        <KpiCard
          label="Em Experiência"
          valor={kpi.emExperiencia}
          mono
          cor={kpi.pctExperiencia > 20 ? "vermelho" : kpi.pctExperiencia > 12 ? "ambar" : "verde"}
          subtitulo={`${kpi.pctExperiencia}% do headcount (<90 dias)`}
        />
        <div
          className="col-span-2 rounded-lg p-5 flex items-center gap-5"
          style={{ background: "#FFFFFF", border: "1px solid #E8E8E2" }}
        >
          <div className="flex-1">
            <p className="uppercase tracking-widest font-semibold mb-1" style={{ fontSize: "9.5px", color: "#ABABAB" }}>
              Ocupação Geral
            </p>
            <p className="font-bold text-2xl" style={{ color: "#0D0D0D", fontFamily: "'DM Mono', monospace" }}>
              {((kpi.hcAtual / kpi.hcIdeal) * 100).toFixed(1)}%
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#ABABAB" }}>
              {kpi.hcAtual} de {kpi.hcIdeal} colaboradores
            </p>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1.5" style={{ color: "#ABABAB" }}>
              <span>HC Atual</span>
              <span>Meta</span>
            </div>
            <div className="rounded-full h-3" style={{ background: "#E8E8E2" }}>
              <div
                className="h-3 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (kpi.hcAtual / kpi.hcIdeal) * 100)}%`,
                  background: kpi.hcAtual >= kpi.hcIdeal ? "#97A624" : kpi.hcAtual / kpi.hcIdeal > 0.9 ? "#D9B504" : "#8C1414",
                }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-xs font-semibold" style={{ color: "#0D0D0D", fontFamily: "'DM Mono', monospace" }}>{kpi.hcAtual}</span>
              <span className="text-xs font-semibold" style={{ color: "#ABABAB", fontFamily: "'DM Mono', monospace" }}>{kpi.hcIdeal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── LINHA 2: Tendência + Motivos ─────────────────── */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 340px" }}>

        {/* Gráfico de Tendência */}
        <div className="rounded-lg overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid #E8E8E2" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: "#E8E8E2" }}>
            <p className="font-semibold text-sm" style={{ color: "#0D0D0D" }}>Tendência Mensal</p>
            <p className="text-xs" style={{ color: "#ABABAB" }}>Turnover médio · Headcount ideal vs atual</p>
          </div>
          <div className="p-5">
            <TendenciaChart historico={historico} mesAtual={mes} />
          </div>
        </div>

        {/* Motivos de Desligamento */}
        <div className="rounded-lg overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid #E8E8E2" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: "#E8E8E2" }}>
            <p className="font-semibold text-sm" style={{ color: "#0D0D0D" }}>Motivos de Desligamento</p>
            <p className="text-xs" style={{ color: "#ABABAB" }}>Acumulado {new Date().getFullYear()}</p>
          </div>
          <div className="p-5 flex flex-col gap-3">
            {motivosDesligamento.map((m) => {
              const pct = ((m.qtd / totalMotivos) * 100).toFixed(1);
              return (
                <div key={m.motivo}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs" style={{ color: "#3D3D3D" }}>{m.motivo}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold" style={{ color: "#0D0D0D", fontFamily: "'DM Mono', monospace" }}>{m.qtd}</span>
                      <span className="text-xs" style={{ color: "#ABABAB", fontFamily: "'DM Mono', monospace" }}>{pct}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "#E8E8E2" }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: m.cor }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── RANKING DE UNIDADES ───────────────────────────── */}
      <div className="rounded-lg overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid #E8E8E2" }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "#E8E8E2" }}>
          <div>
            <p className="font-semibold text-sm" style={{ color: "#0D0D0D" }}>Ranking de Unidades</p>
            <p className="text-xs" style={{ color: "#ABABAB" }}>Ordenado por turnover decrescente · clique para detalhes</p>
          </div>
          <div className="flex items-center gap-3 text-xs" style={{ color: "#ABABAB" }}>
            {["ok","atencao","critico"].map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COR[s] }} />
                {STATUS_LABEL[s]}
              </span>
            ))}
          </div>
        </div>

        {/* Table header */}
        <div
          className="grid text-xs uppercase tracking-widest font-semibold px-5 py-2.5"
          style={{
            background: "#0D0D0D", color: "#FFFFFF",
            gridTemplateColumns: "1.8fr 80px 80px 80px 80px 80px 80px 80px 70px",
            fontSize: "9.5px", letterSpacing: "0.07em",
          }}
        >
          <span>Unidade</span>
          <span className="text-right">Turnover</span>
          <span className="text-right">HC Atual</span>
          <span className="text-right">HC Ideal</span>
          <span className="text-right">Desvio</span>
          <span className="text-right">Admiss.</span>
          <span className="text-right">Deslig.</span>
          <span className="text-right">Exp. %</span>
          <span className="text-right">Status</span>
        </div>

        {/* Rows */}
        {rankingFiltrado.map((row, i) => (
          <button
            key={row.unidade}
            onClick={() => setUnidadeDetalhe(row.unidade)}
            className="w-full grid px-5 py-3.5 text-left hover:bg-gray-50 transition-colors"
            style={{
              gridTemplateColumns: "1.8fr 80px 80px 80px 80px 80px 80px 80px 70px",
              borderBottom: i < rankingFiltrado.length - 1 ? "1px solid #E8E8E2" : "none",
            }}
          >
            <span className="font-medium text-sm" style={{ color: "#0D0D0D" }}>{row.unidade}</span>
            <span className="text-right font-semibold" style={{ color: STATUS_COR[row.status], fontFamily: "'DM Mono', monospace", fontSize: "13px" }}>
              {row.turnover}%
            </span>
            <span className="text-right text-sm" style={{ fontFamily: "'DM Mono', monospace", color: "#0D0D0D" }}>{row.hcAtual}</span>
            <span className="text-right text-sm" style={{ fontFamily: "'DM Mono', monospace", color: "#ABABAB" }}>{row.hcIdeal}</span>
            <span
              className="text-right text-sm font-semibold"
              style={{ fontFamily: "'DM Mono', monospace", color: row.desvio >= 0 ? "#97A624" : "#8C1414" }}
            >
              {row.desvio >= 0 ? `+${row.desvio}` : row.desvio}
            </span>
            <span className="text-right text-sm" style={{ fontFamily: "'DM Mono', monospace", color: "#3D3D3D" }}>{row.admissoes}</span>
            <span className="text-right text-sm" style={{ fontFamily: "'DM Mono', monospace", color: "#3D3D3D" }}>{row.desligamentos}</span>
            <span
              className="text-right text-sm"
              style={{
                fontFamily: "'DM Mono', monospace",
                color: row.pctExp > 20 ? "#8C1414" : row.pctExp > 12 ? "#D9B504" : "#97A624",
              }}
            >
              {row.pctExp}%
            </span>
            <div className="flex justify-end">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{
                  background: STATUS_BG[row.status],
                  color: STATUS_COR[row.status],
                  fontSize: "10px",
                }}
              >
                {STATUS_LABEL[row.status]}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Painel lateral */}
      <PainelDetalhe
        unidade={unidadeDetalhe}
        mesIndex={mesIndex}
        onClose={() => setUnidadeDetalhe(null)}
      />
    </div>
  );
}

/* ── MINI CHART ─────────────────────────────────── */
function TendenciaChart({ historico, mesAtual }) {
  const maxHC = Math.max(...historico.map((h) => h.hcIdeal)) * 1.1;
  const maxTurn = Math.max(...historico.map((h) => h.turnover)) * 1.3;

  const W = 560, H = 160, PAD = { t: 20, r: 20, b: 30, l: 40 };
  const cW = W - PAD.l - PAD.r;
  const cH = H - PAD.t - PAD.b;
  const n = historico.length;

  const xPos = (i) => PAD.l + (i / (n - 1)) * cW;
  const yHC = (v) => PAD.t + cH - (v / maxHC) * cH;
  const yTurn = (v) => PAD.t + cH - (v / maxTurn) * cH;

  const pathHCAtual = historico.map((h, i) => `${i === 0 ? "M" : "L"} ${xPos(i)} ${yHC(h.hcAtual)}`).join(" ");
  const pathHCIdeal = historico.map((h, i) => `${i === 0 ? "M" : "L"} ${xPos(i)} ${yHC(h.hcIdeal)}`).join(" ");
  const pathTurn = historico.map((h, i) => `${i === 0 ? "M" : "L"} ${xPos(i)} ${yTurn(h.turnover)}`).join(" ");

  // Meta line (5%)
  const metaY = yTurn(5);

  return (
    <div>
      {/* Legenda */}
      <div className="flex items-center gap-5 mb-3 flex-wrap">
        {[
          { cor: "#0D0D0D", label: "HC Atual", dash: false },
          { cor: "#ABABAB", label: "HC Ideal", dash: true },
          { cor: "#97A624", label: "Turnover %", dash: false },
          { cor: "#D9B504", label: "Meta 5%", dash: true },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <svg width="18" height="6">
              <line
                x1="0" y1="3" x2="18" y2="3"
                stroke={l.cor} strokeWidth="2"
                strokeDasharray={l.dash ? "3,2" : "none"}
              />
            </svg>
            <span className="text-xs" style={{ color: "#ABABAB" }}>{l.label}</span>
          </div>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", overflow: "visible" }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f}
            x1={PAD.l} y1={PAD.t + cH * f}
            x2={PAD.l + cW} y2={PAD.t + cH * f}
            stroke="#E8E8E2" strokeWidth="1"
          />
        ))}

        {/* Meta line */}
        <line
          x1={PAD.l} y1={metaY} x2={PAD.l + cW} y2={metaY}
          stroke="#D9B504" strokeWidth="1.5" strokeDasharray="4,3"
        />

        {/* HC Ideal (dashed) */}
        <path d={pathHCIdeal} fill="none" stroke="#D0D0CA" strokeWidth="1.5" strokeDasharray="4,3" />

        {/* HC Atual */}
        <path d={pathHCAtual} fill="none" stroke="#0D0D0D" strokeWidth="2" />

        {/* Turnover */}
        <path d={pathTurn} fill="none" stroke="#97A624" strokeWidth="2" />

        {/* Points e labels eixo X */}
        {historico.map((h, i) => {
          const isMesAtual = h.mes === mesAtual;
          return (
            <g key={h.mes}>
              <circle cx={xPos(i)} cy={yHC(h.hcAtual)} r={isMesAtual ? 5 : 3}
                fill={isMesAtual ? "#0D0D0D" : "#FFFFFF"} stroke="#0D0D0D" strokeWidth="1.5" />
              <circle cx={xPos(i)} cy={yTurn(h.turnover)} r={isMesAtual ? 5 : 3}
                fill={isMesAtual ? "#97A624" : "#FFFFFF"} stroke="#97A624" strokeWidth="1.5" />
              <text
                x={xPos(i)} y={H - 4}
                textAnchor="middle"
                fontSize="9"
                fill={isMesAtual ? "#0D0D0D" : "#ABABAB"}
                fontWeight={isMesAtual ? "700" : "400"}
                fontFamily="DM Sans, sans-serif"
              >
                {h.mes.split("/")[0]}
              </text>
            </g>
          );
        })}

        {/* Eixo Y labels */}
        <text x={PAD.l - 6} y={PAD.t + 4} textAnchor="end" fontSize="8" fill="#ABABAB" fontFamily="DM Mono, monospace">
          {Math.round(maxHC)}
        </text>
        <text x={PAD.l - 6} y={PAD.t + cH + 4} textAnchor="end" fontSize="8" fill="#ABABAB" fontFamily="DM Mono, monospace">0</text>
      </svg>
    </div>
  );
}
