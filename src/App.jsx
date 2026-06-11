import { useState } from 'react'
import { MESES, UNIDADES } from './useGASData.js'
import Sidebar from './components/Sidebar.jsx'
import PageRH from './components/PageRH.jsx'
import PageCustos from './components/PageCustos.jsx'

export default function App() {
  const [pagina, setPagina]   = useState('rh')
  const [mesIdx, setMesIdx]   = useState(0)
  const [unidade, setUnidade] = useState('Todas')

  const todasUnidades = ['Todas', ...UNIDADES]

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#FAFAF8', fontFamily:"'DM Sans', sans-serif" }}>
      <Sidebar pagina={pagina} setPagina={setPagina} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* HEADER */}
        <div style={{ background:'#fff', borderBottom:'1px solid #E8E8E2', padding:'12px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div>
            <div style={{ fontWeight:700, fontSize:18, color:'#0D0D0D', letterSpacing:'-0.02em' }}>
              {pagina === 'rh' ? 'Turnover & Headcount' : 'Custos com Pessoas'}
            </div>
            <div style={{ fontSize:11, color:'#ABABAB', marginTop:2 }}>
              Quintal do Espeto · {unidade === 'Todas' ? 'Todas as unidades' : unidade}
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:9.5, fontWeight:600, color:'#ABABAB', letterSpacing:'0.08em' }}>UNIDADE</span>
              <select value={unidade} onChange={e => setUnidade(e.target.value)} style={selStyle(unidade !== 'Todas')}>
                {todasUnidades.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div style={{ width:1, height:20, background:'#E8E8E2' }} />
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:9.5, fontWeight:600, color:'#ABABAB', letterSpacing:'0.08em' }}>PERÍODO</span>
              <select value={mesIdx} onChange={e => setMesIdx(Number(e.target.value))} style={selStyle(true)}>
                {MESES.map((m, i) => <option key={m} value={i}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* PÁGINA */}
        <div style={{ flex:1, overflowY:'auto', padding:24 }}>
          {pagina === 'rh'
            ? <PageRH    mesIdx={mesIdx} unidade={unidade} />
            : <PageCustos mesIdx={mesIdx} unidade={unidade} />}
        </div>
      </div>
    </div>
  )
}

function selStyle(active) {
  return {
    background: active ? '#0D0D0D' : '#fff',
    color: active ? '#fff' : '#0D0D0D',
    border: `1px solid ${active ? '#0D0D0D' : '#E8E8E2'}`,
    borderRadius:6, padding:'5px 26px 5px 10px', fontSize:12,
    fontFamily:"'DM Sans', sans-serif", cursor:'pointer',
    outline:'none', appearance:'none', WebkitAppearance:'none',
    backgroundImage: active
      ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='white'/%3E%3C/svg%3E")`
      : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%230D0D0D'/%3E%3C/svg%3E")`,
    backgroundRepeat:'no-repeat', backgroundPosition:'right 8px center',
  }
}
