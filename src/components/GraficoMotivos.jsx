import { useState } from 'react'

// Cores por motivo — consistentes em todo o dashboard
const CORES_MOTIVO = {
  'Demissão sem justa causa':      '#8C1414',
  'Pedido de demissão':            '#D9B504',
  'Fim de contrato / experiência': '#97A624',
  'Demissão por justa causa':      '#6B0000',
  'Transferência':                 '#ABABAB',
  'Acordo':                        '#888888',
  'Falecimento':                   '#D0D0CA',
}

function corMotivo(motivo, idx) {
  if (CORES_MOTIVO[motivo]) return CORES_MOTIVO[motivo]
  const fallback = ['#0D0D0D','#3D3D3D','#888','#BDBDBD']
  return fallback[idx % fallback.length]
}

function formatarMesLabel(mesStr) {
  const [ano, mes] = mesStr.split('-')
  const nomes = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  return `${nomes[parseInt(mes)-1]}/${ano.slice(2)}`
}

export default function GraficoMotivos({ historico }) {
  const [hoveredMes, setHoveredMes] = useState(null)
  const [paginaAtual, setPaginaAtual] = useState(0)

  if (!historico || historico.length === 0) {
    return (
      <div style={{ padding:20, fontSize:12, color:'#ABABAB', textAlign:'center' }}>
        Aguardando dados históricos...
      </div>
    )
  }

  // Coletar todos os motivos únicos
  const todosMotivos = []
  historico.forEach(h => {
    Object.keys(h.motivos).forEach(m => {
      if (!todosMotivos.includes(m)) todosMotivos.push(m)
    })
  })

  // Ordenar por total decrescente
  const totaisPorMotivo = {}
  todosMotivos.forEach(m => {
    totaisPorMotivo[m] = historico.reduce((s, h) => s + (h.motivos[m] || 0), 0)
  })
  todosMotivos.sort((a, b) => totaisPorMotivo[b] - totaisPorMotivo[a])

  // Paginação — 12 meses por página
  const POR_PAGINA = 12
  const totalPaginas = Math.ceil(historico.length / POR_PAGINA)
  const inicio = paginaAtual * POR_PAGINA
  const historicoPagina = historico.slice(inicio, inicio + POR_PAGINA)

  // Máximo para escala
  const maxTotal = Math.max(...historicoPagina.map(h =>
    Object.values(h.motivos).reduce((s, v) => s + v, 0)
  ))

  const BAR_W    = Math.max(20, Math.min(48, Math.floor(520 / historicoPagina.length) - 8))
  const GAP      = 8
  const H_GRAFICO = 160
  const H_LABEL   = 28
  const W_TOTAL   = historicoPagina.length * (BAR_W + GAP)

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

      {/* Legenda */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
        {todosMotivos.map((m, i) => (
          <div key={m} style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ width:10, height:10, borderRadius:2, background:corMotivo(m,i), display:'inline-block', flexShrink:0 }} />
            <span style={{ fontSize:11, color:'#3D3D3D' }}>{m}</span>
            <span style={{ fontSize:11, color:'#ABABAB', fontFamily:"'DM Mono', monospace" }}>({totaisPorMotivo[m]})</span>
          </div>
        ))}
      </div>

      {/* Gráfico */}
      <div style={{ overflowX:'auto' }}>
        <svg
          viewBox={`0 0 ${W_TOTAL + 8} ${H_GRAFICO + H_LABEL}`}
          style={{ width:'100%', minWidth: W_TOTAL + 8, height:'auto' }}
        >
          {/* Linhas de grade */}
          {[0, 0.25, 0.5, 0.75, 1].map(f => (
            <line key={f}
              x1={0} y1={H_GRAFICO * f}
              x2={W_TOTAL + 8} y2={H_GRAFICO * f}
              stroke="#E8E8E2" strokeWidth="1"
            />
          ))}

          {historicoPagina.map((h, i) => {
            const x       = i * (BAR_W + GAP)
            const total   = Object.values(h.motivos).reduce((s, v) => s + v, 0)
            const isHover = hoveredMes === h.mes
            let yAcum = H_GRAFICO

            return (
              <g key={h.mes}
                onMouseEnter={() => setHoveredMes(h.mes)}
                onMouseLeave={() => setHoveredMes(null)}
                style={{ cursor:'default' }}>

                {/* Barras empilhadas por motivo */}
                {todosMotivos.map((m, mi) => {
                  const qtd = h.motivos[m] || 0
                  if (qtd === 0) return null
                  const barH = maxTotal > 0 ? (qtd / maxTotal) * H_GRAFICO : 0
                  yAcum -= barH
                  return (
                    <rect key={m}
                      x={x} y={yAcum}
                      width={BAR_W} height={barH}
                      fill={corMotivo(m, mi)}
                      opacity={isHover ? 1 : 0.85}
                      rx={mi === 0 ? 0 : 0}
                    />
                  )
                })}

                {/* Borda arredondada no topo da barra */}
                {total > 0 && (
                  <rect
                    x={x}
                    y={H_GRAFICO - (total / maxTotal) * H_GRAFICO}
                    width={BAR_W} height={3}
                    fill="transparent"
                    rx={2}
                  />
                )}

                {/* Total acima da barra */}
                {total > 0 && (
                  <text
                    x={x + BAR_W / 2}
                    y={H_GRAFICO - (total / maxTotal) * H_GRAFICO - 4}
                    textAnchor="middle"
                    fontSize={isHover ? 10 : 9}
                    fontWeight={isHover ? '700' : '400'}
                    fill={isHover ? '#0D0D0D' : '#ABABAB'}
                    fontFamily="DM Mono, monospace"
                  >
                    {total}
                  </text>
                )}

                {/* Label do mês */}
                <text
                  x={x + BAR_W / 2}
                  y={H_GRAFICO + 16}
                  textAnchor="middle"
                  fontSize={9}
                  fill={isHover ? '#0D0D0D' : '#ABABAB'}
                  fontWeight={isHover ? '700' : '400'}
                  fontFamily="DM Sans, sans-serif"
                >
                  {formatarMesLabel(h.mes)}
                </text>

                {/* Tooltip ao hover */}
                {isHover && (
                  <g>
                    <rect
                      x={Math.min(x - 4, W_TOTAL - 130)}
                      y={H_GRAFICO - (total / maxTotal) * H_GRAFICO - 80}
                      width={126}
                      height={todosMotivos.filter(m => h.motivos[m] > 0).length * 16 + 20}
                      fill="white"
                      stroke="#E8E8E2"
                      strokeWidth="1"
                      rx="4"
                    />
                    <text
                      x={Math.min(x + 2, W_TOTAL - 122)}
                      y={H_GRAFICO - (total / maxTotal) * H_GRAFICO - 64}
                      fontSize={9}
                      fontWeight="700"
                      fill="#0D0D0D"
                      fontFamily="DM Sans, sans-serif"
                    >
                      {formatarMesLabel(h.mes)} · {total} deslig.
                    </text>
                    {todosMotivos.filter(m => h.motivos[m] > 0).map((m, ti) => (
                      <text key={m}
                        x={Math.min(x + 2, W_TOTAL - 122)}
                        y={H_GRAFICO - (total / maxTotal) * H_GRAFICO - 48 + ti * 14}
                        fontSize={9}
                        fill="#3D3D3D"
                        fontFamily="DM Sans, sans-serif"
                      >
                        ● {m.substring(0, 22)}: {h.motivos[m]}
                      </text>
                    ))}
                  </g>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <button
            onClick={() => setPaginaAtual(p => Math.max(0, p - 1))}
            disabled={paginaAtual === 0}
            style={{ padding:'4px 12px', borderRadius:6, border:'1px solid #E8E8E2', background:'#fff', cursor: paginaAtual === 0 ? 'not-allowed' : 'pointer', color: paginaAtual === 0 ? '#BDBDBD' : '#0D0D0D', fontSize:12 }}>
            ← Anterior
          </button>
          <span style={{ fontSize:11, color:'#ABABAB' }}>
            {formatarMesLabel(historicoPagina[0]?.mes)} – {formatarMesLabel(historicoPagina[historicoPagina.length-1]?.mes)}
            <span style={{ marginLeft:8, color:'#D0D0CA' }}>·</span>
            <span style={{ marginLeft:8 }}>{paginaAtual + 1}/{totalPaginas}</span>
          </span>
          <button
            onClick={() => setPaginaAtual(p => Math.min(totalPaginas - 1, p + 1))}
            disabled={paginaAtual === totalPaginas - 1}
            style={{ padding:'4px 12px', borderRadius:6, border:'1px solid #E8E8E2', background:'#fff', cursor: paginaAtual === totalPaginas - 1 ? 'not-allowed' : 'pointer', color: paginaAtual === totalPaginas - 1 ? '#BDBDBD' : '#0D0D0D', fontSize:12 }}>
            Próximo →
          </button>
        </div>
      )}
    </div>
  )
}
