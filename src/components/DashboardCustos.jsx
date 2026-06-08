import { useState } from "react";
import KpiCard from "./KpiCard";
import { getKPIs, getRankingUnidades, getHistoricoConsolidado, getMesIndex } from "../utils/calculos";
import { composicaoCusto, CUSTO_CONTRATACAO, CUSTO_DESLIGAMENTO, FOLHA_ANUAL } from "../data/mockData";

const fmt = (v) => v?.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function DashboardCustos({ mes, unidade }) {
  const [unidadeDetalhe, setUnidadeDetalhe] = useState(null);
  const mesIndex = getMesIndex(mes);
  const kpi = getKPIs(mesIndex, unidade);
  const ranking = getRankingUnidades(mesIndex);
  const historico = getHistoricoConsolidado();

  const rankingFiltrado = unidade === "Todas"
    ? ranking
    : ranking.filter(r => r.unidade === unidade);

  const rankingCusto = [...rankingFiltrado].sort((a, b) => b.custoMensal - a.custoMensal);

  return (
    <div className="flex flex-col gap-6 pb-8">

      {/* ── KPIs ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="Custo Total Mensal"
          valor={fmt(kpi.custoReal)}
          prefixo="R$ "
          mono
          cor="preto"
          subtitulo={`${unidade === "Todas" ? "Todas as unidades" : unidade}`}
        />
        <KpiCard
          label="Custo se HC Completo"
          valor={fmt(kpi.custoIdeal)}
          prefixo="R$ "
          mono
          cor="ambar"
          subtitulo={`Gap de R$ ${fmt(kpi.gapCusto)} com ${kpi.vagasAbertas} vagas abertas`}
        />
        <KpiCard
          label="Custo Médio / Colaborador"
          valor={fmt(kpi.custoPorPessoa)}
          prefixo="R$ "
          mono
          cor="preto"
          subtitulo={`Base: ${kpi.hcAtual} colaboradores ativos`}
        />
        <KpiCard
          label="Custo do Turnover"
          valor={fmt(kpi.custoTurnover)}
          prefixo="R$ "
          mono
          cor={kpi.pesoTurnoverFolha > 5 ? "vermelho" : "ambar"}
          subtitulo={`${kpi.pesoTurnoverFolha}% da folha mensal`}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="Desligamentos no Mês"
          valor={kpi.desligamentos}
          mono
          cor="vermelho"
          subtitulo={`× R$ ${fmt(CUSTO_DESLIGAMENTO)} = R$ ${fmt(kpi.desligamentos * CUSTO_DESLIGAMENTO)}`}
        />
        <KpiCard
          label="Admissões no Mês"
          valor={kpi.admissoes}
          mono
          cor="ambar"
          subtitulo={`× R$ ${fmt(CUSTO_CONTRATACAO)} = R$ ${fmt(kpi.admissoes * CUSTO_CONTRATACAO)}`}
        />
        <div className="col-span-2 rounded-lg p-5" style={{ background:"#FFFFFF", border:"1px solid #E8E8E2" }}>
          <p className="uppercase tracking-widest font-semibold mb-3" style={{ fontSize:"9.5px", color:"#ABABAB" }}>
            Composição do Custo
          </p>
          <div className="flex gap-1 h-6 rounded overflow-hidden mb-2">
            {[
              { label:"Salário Base", pct: composicaoCusto.salarioBase, cor:"#0D0D0D" },
              { label:"Encargos",     pct: composicaoCusto.encargos,    cor:"#8C1414" },
              { label:"Benefícios",   pct: composicaoCusto.beneficios,  cor:"#D9B504" },
              { label:"Provisões",    pct: composicaoCusto.provisoes,   cor:"#97A624" },
            ].map(item => (
              <div key={item.label} style={{ width:`${item.pct*100}%`, background:item.cor, borderRadius:"2px" }} />
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { label:"Salário Base", pct: composicaoCusto.salarioBase, cor:"#0D0D0D" },
              { label:"Encargos",     pct: composicaoCusto.encargos,    cor:"#8C1414" },
              { label:"Benefícios",   pct: composicaoCusto.beneficios,  cor:"#D9B504" },
              { label:"Provisões",    pct: composicaoCusto.provisoes,   cor:"#97A624" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background:item.cor }} />
                <span className="text-xs" style={{ color:"#3D3D3D" }}>{item.label}</span>
                <span className="text-xs font-semibold" style={{ color:item.cor, fontFamily:"'DM Mono', monospace" }}>
                  {(item.pct*100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tendência de Custo + Custo Turnover ─────────── */}
      <div className="grid gap-4" style={{ gridTemplateColumns:"1fr 340px" }}>

        {/* Gráfico tendência custo */}
        <div className="rounded-lg overflow-hidden" style={{ background:"#FFFFFF", border:"1px solid #E8E8E2" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor:"#E8E8E2" }}>
            <p className="font-semibold text-sm" style={{ color:"#0D0D0D" }}>Evolução do Custo Mensal</p>
            <p className="text-xs" style={{ color:"#ABABAB" }}>Custo real × custo com turnover</p>
          </div>
          <div className="p-5">
            <TendenciaCustoChart historico={historico} mesAtual={mes} />
          </div>
        </div>

        {/* Painel custo turnover */}
        <div className="rounded-lg overflow-hidden" style={{ background:"#FFFFFF", border:"1px solid #E8E8E2" }}>
          <div className="px-5 py-4 border-b" style={{ borderColor:"#E8E8E2" }}>
            <p className="font-semibold text-sm" style={{ color:"#0D0D0D" }}>Custo do Turnover</p>
            <p className="text-xs" style={{ color:"#ABABAB" }}>Metodologia interna RH 2025</p>
          </div>
          <div className="p-5 flex flex-col gap-4">
            {[
              { label:"Por Contratação",  val: CUSTO_CONTRATACAO,  cor:"#D9B504", desc:"ATS + recrutamento + exame + uniforme + onboarding" },
              { label:"Por Desligamento", val: CUSTO_DESLIGAMENTO, cor:"#8C1414", desc:"Rescisão + multa FGTS + aviso prévio" },
            ].map(item => (
              <div key={item.label} className="rounded-lg p-4" style={{ background:"#FAFAF8", border:"1px solid #E8E8E2" }}>
                <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color:"#ABABAB", fontSize:"9px" }}>{item.label}</p>
                <p className="font-bold text-2xl" style={{ color:item.cor, fontFamily:"'DM Mono', monospace" }}>
                  R$ {item.val.toLocaleString("pt-BR", { minimumFractionDigits:2 })}
                </p>
                <p className="text-xs mt-1" style={{ color:"#ABABAB" }}>{item.desc}</p>
              </div>
            ))}

            <div className="rounded-lg p-4" style={{ background:"#0D0D0D" }}>
              <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color:"#97A624", fontSize:"9px" }}>Custo Real do Turnover (2025)</p>
              <p className="font-bold text-2xl text-white" style={{ fontFamily:"'DM Mono', monospace" }}>R$ 1.185.202</p>
              <p className="text-xs mt-1" style={{ color:"#888" }}>5,48% da folha anual · 193 admissões · 257 desligamentos</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabela ranking por custo ─────────────────────── */}
      <div className="rounded-lg overflow-hidden" style={{ background:"#FFFFFF", border:"1px solid #E8E8E2" }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor:"#E8E8E2" }}>
          <div>
            <p className="font-semibold text-sm" style={{ color:"#0D0D0D" }}>Custos por Unidade</p>
            <p className="text-xs" style={{ color:"#ABABAB" }}>Ordenado por custo total decrescente · clique para detalhes</p>
          </div>
        </div>

        <div className="grid text-xs uppercase tracking-widest font-semibold px-5 py-2.5"
          style={{
            background:"#0D0D0D", color:"#FFFFFF",
            gridTemplateColumns:"1.6fr 110px 110px 90px 90px 100px 100px",
            fontSize:"9.5px", letterSpacing:"0.07em",
          }}>
          <span>Unidade</span>
          <span className="text-right">Custo Real</span>
          <span className="text-right">Custo Ideal</span>
          <span className="text-right">Gap</span>
          <span className="text-right">R$/Pessoa</span>
          <span className="text-right">Custo Turnover</span>
          <span className="text-right">HC Real / Ideal</span>
        </div>

        {rankingCusto.map((row, i) => {
          const gap = row.custoIdeal - row.custoMensal;
          const custoTurn = Math.round(
            (row.desligamentos * CUSTO_DESLIGAMENTO) + (row.admissoes * CUSTO_CONTRATACAO)
          );
          return (
            <button key={row.unidade} onClick={() => setUnidadeDetalhe(row.unidade)}
              className="w-full grid px-5 py-3.5 text-left hover:bg-gray-50 transition-colors"
              style={{
                gridTemplateColumns:"1.6fr 110px 110px 90px 90px 100px 100px",
                borderBottom: i < rankingCusto.length - 1 ? "1px solid #E8E8E2" : "none",
              }}>
              <span className="font-medium text-sm" style={{ color:"#0D0D0D" }}>{row.unidade}</span>
              <span className="text-right text-sm font-semibold" style={{ fontFamily:"'DM Mono', monospace", color:"#0D0D0D" }}>
                R$ {fmt(row.custoMensal)}
              </span>
              <span className="text-right text-sm" style={{ fontFamily:"'DM Mono', monospace", color:"#ABABAB" }}>
                R$ {fmt(row.custoIdeal)}
              </span>
              <span className="text-right text-sm font-semibold" style={{
                fontFamily:"'DM Mono', monospace",
                color: gap > 0 ? "#D9B504" : "#97A624",
              }}>
                {gap > 0 ? `+R$ ${fmt(gap)}` : "OK"}
              </span>
              <span className="text-right text-sm" style={{ fontFamily:"'DM Mono', monospace", color:"#3D3D3D" }}>
                R$ {fmt(row.custoPorPessoa)}
              </span>
              <span className="text-right text-sm" style={{
                fontFamily:"'DM Mono', monospace",
                color: custoTurn > 10000 ? "#8C1414" : custoTurn > 5000 ? "#D9B504" : "#97A624",
              }}>
                R$ {fmt(custoTurn)}
              </span>
              <div className="flex justify-end items-center gap-2">
                <span className="text-sm font-semibold" style={{ fontFamily:"'DM Mono', monospace", color:"#0D0D0D" }}>
                  {row.hcAtual}
                </span>
                <span className="text-xs" style={{ color:"#ABABAB" }}>/</span>
                <span className="text-sm" style={{ fontFamily:"'DM Mono', monospace", color:"#ABABAB" }}>
                  {row.hcIdeal}
                </span>
                <div className="w-12 h-1.5 rounded-full ml-1" style={{ background:"#E8E8E2" }}>
                  <div className="h-1.5 rounded-full" style={{
                    width:`${Math.min(100,(row.hcAtual/row.hcIdeal)*100)}%`,
                    background: row.hcAtual >= row.hcIdeal ? "#97A624" : row.hcAtual/row.hcIdeal > 0.85 ? "#D9B504" : "#8C1414",
                  }} />
                </div>
              </div>
            </button>
          );
        })}

        {/* Linha Total */}
        <div className="grid px-5 py-3.5" style={{
          gridTemplateColumns:"1.6fr 110px 110px 90px 90px 100px 100px",
          background:"#F5F5F0", borderTop:"2px solid #0D0D0D",
        }}>
          <span className="font-bold text-sm" style={{ color:"#0D0D0D" }}>TOTAL</span>
          <span className="text-right text-sm font-bold" style={{ fontFamily:"'DM Mono', monospace", color:"#0D0D0D" }}>
            R$ {fmt(kpi.custoReal)}
          </span>
          <span className="text-right text-sm font-bold" style={{ fontFamily:"'DM Mono', monospace", color:"#ABABAB" }}>
            R$ {fmt(kpi.custoIdeal)}
          </span>
          <span className="text-right text-sm font-bold" style={{ fontFamily:"'DM Mono', monospace", color:"#D9B504" }}>
            +R$ {fmt(kpi.gapCusto)}
          </span>
          <span className="text-right text-sm font-bold" style={{ fontFamily:"'DM Mono', monospace", color:"#0D0D0D" }}>
            R$ {fmt(kpi.custoPorPessoa)}
          </span>
          <span className="text-right text-sm font-bold" style={{ fontFamily:"'DM Mono', monospace", color:"#8C1414" }}>
            R$ {fmt(kpi.custoTurnover)}
          </span>
          <span className="text-right text-sm font-bold" style={{ fontFamily:"'DM Mono', monospace", color:"#0D0D0D" }}>
            {kpi.hcAtual} / {kpi.hcIdeal}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── GRÁFICO TENDÊNCIA CUSTO ──────────────────────────── */
function TendenciaCustoChart({ historico, mesAtual }) {
  const maxCusto = Math.max(...historico.map(h => h.custoReal)) * 1.12;
  const maxTurn  = Math.max(...historico.map(h => h.custoTurnover)) * 1.3;
  const W=560, H=160, PAD={ t:20, r:20, b:30, l:55 };
  const cW = W-PAD.l-PAD.r, cH = H-PAD.t-PAD.b, n = historico.length;

  const xPos  = i => PAD.l + (i/(n-1))*cW;
  const yCusto= v => PAD.t + cH - (v/maxCusto)*cH;
  const yTurn = v => PAD.t + cH - (v/maxTurn)*cH;

  const pathCusto = historico.map((h,i) => `${i===0?"M":"L"} ${xPos(i)} ${yCusto(h.custoReal)}`).join(" ");
  const pathTurn  = historico.map((h,i) => `${i===0?"M":"L"} ${xPos(i)} ${yTurn(h.custoTurnover)}`).join(" ");

  return (
    <div>
      <div className="flex items-center gap-5 mb-3">
        {[
          { cor:"#0D0D0D", label:"Custo Total Mensal", dash:false },
          { cor:"#8C1414", label:"Custo Turnover",     dash:false },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <svg width="18" height="6"><line x1="0" y1="3" x2="18" y2="3" stroke={l.cor} strokeWidth="2" strokeDasharray={l.dash?"3,2":"none"} /></svg>
            <span className="text-xs" style={{ color:"#ABABAB" }}>{l.label}</span>
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", overflow:"visible" }}>
        {[0,0.25,0.5,0.75,1].map(f => (
          <line key={f} x1={PAD.l} y1={PAD.t+cH*f} x2={PAD.l+cW} y2={PAD.t+cH*f} stroke="#E8E8E2" strokeWidth="1" />
        ))}
        <path d={pathTurn}  fill="none" stroke="#8C1414" strokeWidth="2" />
        <path d={pathCusto} fill="none" stroke="#0D0D0D" strokeWidth="2.5" />
        {historico.map((h,i) => {
          const isMes = h.mes === mesAtual;
          return (
            <g key={h.mes}>
              <circle cx={xPos(i)} cy={yCusto(h.custoReal)} r={isMes?5:3}
                fill={isMes?"#0D0D0D":"#FFFFFF"} stroke="#0D0D0D" strokeWidth="1.5" />
              <circle cx={xPos(i)} cy={yTurn(h.custoTurnover)} r={isMes?5:3}
                fill={isMes?"#8C1414":"#FFFFFF"} stroke="#8C1414" strokeWidth="1.5" />
              <text x={xPos(i)} y={H-4} textAnchor="middle" fontSize="9"
                fill={isMes?"#0D0D0D":"#ABABAB"}
                fontWeight={isMes?"700":"400"}
                fontFamily="DM Sans, sans-serif">
                {h.mes.split("/")[0]}
              </text>
            </g>
          );
        })}
        {/* Eixo Y */}
        <text x={PAD.l-6} y={PAD.t+4} textAnchor="end" fontSize="8" fill="#ABABAB" fontFamily="DM Mono, monospace">
          {(maxCusto/1000).toFixed(0)}k
        </text>
        <text x={PAD.l-6} y={PAD.t+cH+4} textAnchor="end" fontSize="8" fill="#ABABAB" fontFamily="DM Mono, monospace">0</text>
      </svg>
    </div>
  );
}
