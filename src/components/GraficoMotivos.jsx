import { useState, useEffect } from 'react'

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
  if (!mesStr) return ''
  const [ano, mes] = mesStr.split('-')
  const nomes = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  return `${nomes[parseInt(mes)-1]}/${ano.slice(2)}`
}

// mesSelecionado: "2026-06" — destaca o mês do filtro ativo
export default function GraficoMotivos({ historico, mesSelecionado }) {
  const [hoveredMes, setHoveredMes] = useState(null)
  const [paginaAtual, setPaginaAtual] = useState(0)

  // Quando o mês selecionado mudar, navega para a página que o contém
  useEffect(() => {
    if (!historico || !mesSelecionado) return
    const ordenado = [...historico].sort((a, b) => a.mes.localeCompare(b.mes))
    const idx = ordenado.findIndex(h => h.mes === mesSelecionado)
    if (idx >= 0) {
      const pagina = Math.floor(idx / 12)
      const totalPaginas = Math.ceil(ordenado.length / 12)
      // Converte para paginação invertida (0 = mais recente)
      setPaginaAtual(totalPaginas - 1 - pagina)
    }
  }, [mesSelecionado, historico])

  if (!historico || historico.length === 0) {
    return (
      <div style={{ padding:40, fontSize:12, color:'#ABABAB', textAlign:'center' }}>
        Aguardando dados históricos...
      </div>
    )
  }

  const historicoOrdenado = [...historico].sort((a, b) => a.mes.localeCompare(b.mes))

  // Motivos únicos ordenados por total
  const totaisPorMotivo = {}
  historicoOrdenado.forEach(h => {
    Object.entries(h.motivos).forEach(([m, qtd]) => {
      totaisPorMotivo[m] = (totaisPorMotivo[m] || 0) + qtd
    })
  })
  const todosMotivos = Object.keys(totaisPorMotivo).sort((a, b) => totaisPorMotivo[b] - totaisPorMotivo[a])

  const POR_PAGINA   = 12
  const totalPaginas = Math.ceil(historicoOrdenado.length / POR_PAGINA)
  const paginaReal   = totalPaginas - 1 - paginaAtual
  const inicio       = paginaReal * POR_PAGINA
  const pagina       = historicoOrdenado.slice(inicio, inicio + POR_PAGINA)

  const maxTotal = Math.max(...pagina.map(h =>
    Object.values(h.motivos).reduce((s, v) => s + v, 0)
  ), 1)

  const H       = 220
  const H_LABEL = 26
  const BAR_W   = 52
  const GAP     = 14
  const W       = pagina.length * (BAR_W + GAP) - GAP

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {/* Legenda */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:14 }}>
        {todosMotivos.map((m, i) => (
          <div key={m} style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ width:12, height:12, borderRadius:2, background:corMotivo(m,i), display:'inline-block', flexShrink:0 }} />
            <span style={{ fontSize:12, color:'#3D3D3D' }}>{m}</span>
            <span style={{ fontSize:11, color:'#ABABAB', fontFamily:"'DM Mono', monospace" }}>({totaisPorMotivo[m]})</span>
          </div>
        ))}
      </div>

      {/* Gráfico SVG */}
      <div style={{ width:'100%', overflowX:'auto' }}>
        <svg
          viewBox={`0 0 ${W + 40} ${H + H_LABEL + 10}`}
          style={{ width:'100%', minWidth: Math.min(W + 40, 500), height:'auto', display:'block' }}
        >
          {/* Eixo Y — linhas de grade */}
          {[0, 0.25, 0.5, 0.75, 1].map(f => (
            <g key={f}>
              <line x1={32} y1={H * f} x2={W + 36} y2={H * f} stroke="#E8E8E2" strokeWidth="1" />
              <text x={28} y={H * f + 3} textAnchor="end" fontSize="9"
                fill="#BDBDBD" fontFamily="DM Mono, monospace">
                {Math.round(maxTotal * (1 - f))}
              </text>
            </g>
          ))}

          {pagina.map((h, i) => {
            const x         = 34 + i * (BAR_W + GAP)
            const total     = Object.values(h.motivos).reduce((s, v) => s + v, 0)
            const isHover   = hoveredMes === h.mes
            const isSel     = mesSelecionado && h.mes === mesSelecionado
            let yAcum       = H

            return (
              <g key={h.mes}
                onMouseEnter={() => setHoveredMes(h.mes)}
                onMouseLeave={() => setHoveredMes(null)}
                style={{ cursor:'default' }}>

                {/* Destaque fundo mês selecionado */}
                {(isHover || isSel) && (
                  <rect
                    x={x - 4} y={0}
                    width={BAR_W + 8} height={H + H_LABEL + 4}
                    fill={isSel ? '#F5F5F0' : '#FAFAF8'}
                    rx="4"
                  />
                )}

                {/* Indicador mês selecionado */}
                {isSel && (
                  <rect x={x - 4} y={0} width={BAR_W + 8} height={3}
                    fill="#0D0D0D" rx="1" />
                )}

                {/* Barras empilhadas */}
                {todosMotivos.map((m, mi) => {
                  const qtd  = h.motivos[m] || 0
                  if (qtd === 0) return null
                  const barH = (qtd / maxTotal) * H
                  yAcum -= barH
                  return (
                    <rect key={m}
                      x={x} y={yAcum}
                      width={BAR_W} height={barH}
                      fill={corMotivo(m, mi)}
                      opacity={isHover || isSel ? 1 : 0.85}
                    />
                  )
                })}

                {/* Total acima da barra */}
                {total > 0 && (
                  <text
                    x={x + BAR_W / 2}
                    y={H - (total / maxTotal) * H - 7}
                    textAnchor="middle"
                    fontSize={isHover || isSel ? 11 : 10}
                    fontWeight={isHover || isSel ? '700' : '500'}
                    fill={isHover || isSel ? '#0D0D0D' : '#888'}
                    fontFamily="DM Mono, monospace"
                  >
                    {total}
                  </text>
                )}

                {/* Label mês */}
                <text
                  x={x + BAR_W / 2}
                  y={H + 18}
                  textAnchor="middle"
                  fontSize={10}
                  fill={isSel ? '#0D0D0D' : isHover ? '#3D3D3D' : '#ABABAB'}
                  fontWeight={isSel ? '700' : isHover ? '600' : '400'}
                  fontFamily="DM Sans, sans-serif"
                >
                  {formatarMesLabel(h.mes)}
                </text>

                {/* Tooltip hover */}
                {isHover && total > 0 && (() => {
                  const linhas = todosMotivos.filter(m => h.motivos[m] > 0)
                  const ttW    = 150
                  const ttH    = linhas.length * 13 + 22
                  const barTop = H - (total / maxTotal) * H
                  const ttY    = Math.max(2, barTop - ttH - 8)
                  // Garante que não sai pela direita nem pela esquerda
                  const ttXraw = x + BAR_W / 2 - ttW / 2
                  const ttX    = Math.max(32, Math.min(ttXraw, W + 36 - ttW - 4))
                  return (
                    <g style={{ pointerEvents:'none' }}>
                      <rect x={ttX} y={ttY} width={ttW} height={ttH}
                        fill="white" stroke="#E8E8E2" strokeWidth="1" rx="4" />
                      <text x={ttX + 8} y={ttY + 12}
                        fontSize={9} fontWeight="700" fill="#0D0D0D"
                        fontFamily="DM Sans, sans-serif">
                        {formatarMesLabel(h.mes)} · {total} deslig.
                      </text>
                      {linhas.map((m, ti) => (
                        <g key={m}>
                          <rect x={ttX + 8} y={ttY + 18 + ti * 13}
                            width={6} height={6} rx="1"
                            fill={corMotivo(m, todosMotivos.indexOf(m))} />
                          <text x={ttX + 17} y={ttY + 25 + ti * 13}
                            fontSize={8} fill="#3D3D3D"
                            fontFamily="DM Sans, sans-serif">
                            {m.length > 22 ? m.substring(0,22)+'…' : m}: {h.motivos[m]}
                          </text>
                        </g>
                      ))}
                    </g>
                  )
                })()}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <button
            onClick={() => setPaginaAtual(p => Math.min(totalPaginas - 1, p + 1))}
            disabled={paginaAtual >= totalPaginas - 1}
            style={{
              padding:'6px 16px', borderRadius:6,
              border:'1px solid #E8E8E2', background:'#fff',
              cursor: paginaAtual >= totalPaginas - 1 ? 'not-allowed' : 'pointer',
              color: paginaAtual >= totalPaginas - 1 ? '#BDBDBD' : '#0D0D0D',
              fontSize:12, fontFamily:"'DM Sans', sans-serif",
            }}>
            ← Mais antigo
          </button>

          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
            <span style={{ fontSize:12, color:'#0D0D0D', fontWeight:600 }}>
              {formatarMesLabel(pagina[0]?.mes)} – {formatarMesLabel(pagina[pagina.length-1]?.mes)}
            </span>
            <div style={{ display:'flex', gap:4 }}>
              {Array.from({ length: totalPaginas }).map((_, pi) => (
                <div key={pi}
                  onClick={() => setPaginaAtual(pi)}
                  style={{
                    width: pi === paginaAtual ? 18 : 6, height:6,
                    borderRadius:99, cursor:'pointer',
                    background: pi === paginaAtual ? '#0D0D0D' : '#E8E8E2',
                    transition:'width 0.2s',
                  }} />
              ))}
            </div>
          </div>

          <button
            onClick={() => setPaginaAtual(p => Math.max(0, p - 1))}
            disabled={paginaAtual === 0}
            style={{
              padding:'6px 16px', borderRadius:6,
              border:'1px solid #E8E8E2', background:'#fff',
              cursor: paginaAtual === 0 ? 'not-allowed' : 'pointer',
              color: paginaAtual === 0 ? '#BDBDBD' : '#0D0D0D',
              fontSize:12, fontFamily:"'DM Sans', sans-serif",
            }}>
            Mais recente →
          </button>
        </div>
      )}
    </div>
  )
}
