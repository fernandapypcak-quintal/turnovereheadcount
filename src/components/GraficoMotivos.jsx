import { useState, useEffect, useRef } from 'react'

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
  return ['#0D0D0D','#3D3D3D','#888','#BDBDBD'][idx % 4]
}

function fmtMes(mesStr) {
  if (!mesStr) return ''
  const [ano, mes] = mesStr.split('-')
  const n = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  return `${n[parseInt(mes)-1]}/${ano.slice(2)}`
}

// historico: array de { mes: "2022-01", motivos: { "Pedido de demissão": 5, ... } }
// gas: objeto completo do GAS (tem resumo por unidade com desligamentos)
// unidade: string "Carinãs" ou "Todas"
// mesSelecionado: "2026-06"
export default function GraficoMotivos({ historico, gas, unidade, mesSelecionado }) {
  const [tooltip, setTooltip]    = useState(null)
  const [paginaAtual, setPagina] = useState(0)
  const containerRef             = useRef(null)

  // Filtrar histórico por unidade se necessário
  // Se unidade === 'Todas', usa o histórico completo do GAS (todos desligamentos)
  // Se unidade específica, filtra da aba Colaboradores via resumo (só temos total por mês)
  // Como o GAS não retorna histórico por unidade ainda, mostramos aviso
  const historicoFiltrado = historico || []
  const filtrandoUnidade  = unidade && unidade !== 'Todas'

  const ordenado = [...historicoFiltrado].sort((a,b) => a.mes.localeCompare(b.mes))

  // Navega para o mês do filtro de período
  useEffect(() => {
    if (!mesSelecionado || ordenado.length === 0) return
    const idx = ordenado.findIndex(h => h.mes === mesSelecionado)
    if (idx >= 0) {
      const totalPags = Math.ceil(ordenado.length / 12)
      setPagina(totalPags - 1 - Math.floor(idx / 12))
    }
  }, [mesSelecionado])

  // Reset para última página quando mudar unidade
  useEffect(() => {
    const totalPags = Math.ceil(ordenado.length / 12)
    if (totalPags > 0) setPagina(0)
  }, [unidade])

  if (ordenado.length === 0) return (
    <div style={{ padding:40, textAlign:'center', fontSize:12, color:'#ABABAB' }}>
      Aguardando dados históricos...
    </div>
  )

  // Motivos únicos ordenados por total
  const totais = {}
  ordenado.forEach(h => Object.entries(h.motivos).forEach(([m,q]) => { totais[m] = (totais[m]||0)+q }))
  const motivosOrdenados = Object.keys(totais).sort((a,b) => totais[b]-totais[a])

  const POR_PAG   = 12
  const totalPags = Math.ceil(ordenado.length / POR_PAG)
  const pReal     = totalPags - 1 - paginaAtual
  const pagina    = ordenado.slice(pReal * POR_PAG, (pReal+1) * POR_PAG)
  const maxTotal  = Math.max(...pagina.map(h => Object.values(h.motivos).reduce((s,v)=>s+v,0)), 1)

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }} ref={containerRef}>

      {/* Aviso filtro unidade */}
      {filtrandoUnidade && (
        <div style={{ background:'#FDF9E0', border:'1px solid #D9B504', borderRadius:6, padding:'8px 14px', fontSize:11, color:'#8C6800' }}>
          ⚠️ Histórico de motivos exibe <strong>todas as unidades</strong> — filtro por unidade individual ainda não disponível nesta visualização.
        </div>
      )}

      {/* Legenda */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:12 }}>
        {motivosOrdenados.map((m, i) => (
          <div key={m} style={{ display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ width:10, height:10, borderRadius:2, background:corMotivo(m,i), flexShrink:0, display:'inline-block' }} />
            <span style={{ fontSize:11, color:'#3D3D3D' }}>{m}</span>
            <span style={{ fontSize:10, color:'#ABABAB', fontFamily:"'DM Mono',monospace" }}>({totais[m]})</span>
          </div>
        ))}
      </div>

      {/* Gráfico HTML */}
      <div style={{ position:'relative' }}>

        {/* Área do gráfico */}
        <div style={{ display:'flex', gap:8, height:220, paddingLeft:36, position:'relative', alignItems:'flex-end' }}>

          {/* Linhas de grade */}
          <div style={{ position:'absolute', left:36, right:0, top:0, bottom:0, pointerEvents:'none' }}>
            {[0,0.25,0.5,0.75,1].map(f => (
              <div key={f} style={{ position:'absolute', left:0, right:0, top:`${f*100}%`, borderTop:'1px solid #E8E8E2', display:'flex', alignItems:'center' }}>
                <span style={{ position:'absolute', left:-34, fontSize:9, color:'#BDBDBD', fontFamily:"'DM Mono',monospace", whiteSpace:'nowrap' }}>
                  {Math.round(maxTotal * (1-f))}
                </span>
              </div>
            ))}
          </div>

          {pagina.map((h) => {
            const total = Object.values(h.motivos).reduce((s,v)=>s+v,0)
            const isSel = h.mes === mesSelecionado
            const hPct  = (total / maxTotal) * 100

            return (
              <div key={h.mes}
                style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', height:'100%', justifyContent:'flex-end', position:'relative' }}
                onMouseEnter={e => {
                  const rect   = e.currentTarget.getBoundingClientRect()
                  const parent = containerRef.current?.getBoundingClientRect()
                  setTooltip({ mes:h.mes, motivos:h.motivos, total,
                    x: rect.left - (parent?.left||0) + rect.width/2,
                    y: rect.top  - (parent?.top||0)
                  })
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                {/* Total acima */}
                <div style={{ fontSize:10, color: isSel?'#0D0D0D':'#888', fontWeight: isSel?700:500, fontFamily:"'DM Mono',monospace", marginBottom:3, lineHeight:1 }}>
                  {total || ''}
                </div>

                {/* Barra empilhada — do maior para o menor de baixo para cima */}
                <div style={{
                  width:'100%',
                  height:`${hPct}%`,
                  display:'flex',
                  flexDirection:'column',        // maior em cima, menor embaixo
                  borderRadius:'3px 3px 0 0',
                  overflow:'hidden',
                  outline: isSel ? '2px solid #0D0D0D' : 'none',
                  outlineOffset: 1,
                  minHeight: total > 0 ? 4 : 0,
                }}>
                  {/* Ordena do maior para menor para empilhar corretamente */}
                  {[...motivosOrdenados]
                    .filter(m => h.motivos[m] > 0)
                    .sort((a,b) => (h.motivos[b]||0) - (h.motivos[a]||0))
                    .map((m) => (
                      <div key={m} style={{
                        width:'100%',
                        flex: h.motivos[m],
                        background: corMotivo(m, motivosOrdenados.indexOf(m)),
                        minHeight: 2,
                      }} />
                    ))
                  }
                </div>
              </div>
            )
          })}
        </div>

        {/* Labels meses */}
        <div style={{ display:'flex', gap:8, paddingLeft:36, marginTop:6 }}>
          {pagina.map(h => (
            <div key={h.mes} style={{
              flex:1, textAlign:'center', fontSize:10,
              color: h.mes === mesSelecionado ? '#0D0D0D' : '#ABABAB',
              fontWeight: h.mes === mesSelecionado ? 700 : 400,
              fontFamily:"'DM Sans',sans-serif",
            }}>
              {fmtMes(h.mes)}
            </div>
          ))}
        </div>

        {/* Tooltip HTML */}
        {tooltip && (
          <div style={{
            position:'absolute',
            left: Math.min(
              Math.max(0, tooltip.x - 85),
              (containerRef.current?.offsetWidth || 500) - 176
            ),
            top: Math.max(0, tooltip.y - 8),
            background:'#fff',
            border:'1px solid #E8E8E2',
            borderRadius:6,
            padding:'8px 12px',
            boxShadow:'0 4px 16px rgba(0,0,0,0.10)',
            zIndex:20,
            pointerEvents:'none',
            minWidth:170,
          }}>
            <div style={{ fontSize:11, fontWeight:700, color:'#0D0D0D', marginBottom:7, fontFamily:"'DM Sans',sans-serif", borderBottom:'1px solid #F0F0EC', paddingBottom:5 }}>
              {fmtMes(tooltip.mes)} · {tooltip.total} desligamentos
            </div>
            {motivosOrdenados.filter(m => tooltip.motivos[m] > 0).map((m, i) => (
              <div key={m} style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                <span style={{ width:8, height:8, borderRadius:2, background:corMotivo(m, motivosOrdenados.indexOf(m)), flexShrink:0 }} />
                <span style={{ fontSize:11, color:'#3D3D3D', fontFamily:"'DM Sans',sans-serif", flex:1 }}>{m}</span>
                <span style={{ fontSize:11, fontWeight:600, color:'#0D0D0D', fontFamily:"'DM Mono',monospace", marginLeft:8 }}>{tooltip.motivos[m]}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paginação */}
      {totalPags > 1 && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:4 }}>
          <button onClick={() => setPagina(p => Math.min(totalPags-1, p+1))}
            disabled={paginaAtual >= totalPags-1}
            style={{ padding:'5px 14px', borderRadius:6, border:'1px solid #E8E8E2', background:'#fff', cursor: paginaAtual>=totalPags-1?'not-allowed':'pointer', color: paginaAtual>=totalPags-1?'#BDBDBD':'#0D0D0D', fontSize:12, fontFamily:"'DM Sans',sans-serif" }}>
            ← Mais antigo
          </button>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
            <span style={{ fontSize:12, fontWeight:600, color:'#0D0D0D' }}>
              {fmtMes(pagina[0]?.mes)} – {fmtMes(pagina[pagina.length-1]?.mes)}
            </span>
            <div style={{ display:'flex', gap:4 }}>
              {Array.from({length:totalPags}).map((_,pi) => (
                <div key={pi} onClick={() => setPagina(pi)}
                  style={{ width: pi===paginaAtual?18:6, height:6, borderRadius:99, cursor:'pointer', background: pi===paginaAtual?'#0D0D0D':'#E8E8E2', transition:'width 0.2s' }} />
              ))}
            </div>
          </div>
          <button onClick={() => setPagina(p => Math.max(0, p-1))}
            disabled={paginaAtual === 0}
            style={{ padding:'5px 14px', borderRadius:6, border:'1px solid #E8E8E2', background:'#fff', cursor: paginaAtual===0?'not-allowed':'pointer', color: paginaAtual===0?'#BDBDBD':'#0D0D0D', fontSize:12, fontFamily:"'DM Sans',sans-serif" }}>
            Mais recente →
          </button>
        </div>
      )}
    </div>
  )
}
