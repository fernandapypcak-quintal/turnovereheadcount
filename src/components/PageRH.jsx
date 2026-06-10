import { useState } from 'react'
import KpiCard from './KpiCard.jsx'
import { useGASData, CONFIG_DEFAULT } from '../useGASData.js'
import {
  UNIDADES, MESES, HC_IDEAL, HC_REAL, TURNOVER,
  ADMISSOES, DESLIGAMENTOS, EM_EXP, MOTIVOS,
} from '../data.js'

const COR = { ok:'#97A624', atencao:'#D9B504', critico:'#8C1414' }
const BG  = { ok:'#F0F5E0', atencao:'#FDF9E0', critico:'#F5E0E0' }

export default function PageRH({ mesIdx, unidade }) {
  const [detalhe, setDetalhe] = useState(null)
  const { data: gas, loading, erro } = useGASData(mesIdx)

  // Config viva — usa GAS se disponível, senão usa defaults
  const cfg = gas?.configuracoes ?? CONFIG_DEFAULT
  const META         = cfg.semaforo_verde_ambar    ?? 5.0
  const LIMITE_CRIT  = cfg.semaforo_ambar_vermelho ?? 9.0
  const CUSTO_ADM    = cfg.custo_contratacao       ?? 2514
  const CUSTO_DEM    = cfg.custo_demissao          ?? 2724

  function st(t) { return t >= LIMITE_CRIT ? 'critico' : t > META ? 'atencao' : 'ok' }

  function hcReal(u)   { return gas?.resumo?.[u]?.hc_real        ?? HC_REAL[u]?.[mesIdx]      ?? 0 }
  function hcIdeal(u)  { return gas?.hc_ideal?.[u]               ?? HC_IDEAL[u]               ?? 0 }
  function turnover(u) { return gas?.resumo?.[u]?.turnover       ?? TURNOVER[u]?.[mesIdx]     ?? 0 }
  function adms(u)     { return gas?.resumo?.[u]?.admissoes      ?? ADMISSOES[u]?.[mesIdx]    ?? 0 }
  function desls(u)    { return gas?.resumo?.[u]?.desligamentos  ?? DESLIGAMENTOS[u]?.[mesIdx]?? 0 }
  function emExp(u)    { return gas?.resumo?.[u]?.em_experiencia ?? EM_EXP[u]                 ?? 0 }

  const uns = unidade === 'Todas' ? UNIDADES : UNIDADES.filter(u => u === unidade)
  let hcAt=0,hcId=0,adm=0,des=0,exp=0,turnSum=0
  uns.forEach(u => { hcAt+=hcReal(u); hcId+=hcIdeal(u); adm+=adms(u); des+=desls(u); exp+=emExp(u); turnSum+=turnover(u) })

  const turnMedio = Math.round((turnSum/uns.length)*10)/10
  const vagas     = Math.max(0,hcId-hcAt)
  const custoTurn = (des*CUSTO_DEM)+(adm*CUSTO_ADM)
  const pctExp    = hcAt>0?Math.round((exp/hcAt)*1000)/10:0
  const ocup      = hcId>0?Math.round((hcAt/hcId)*1000)/10:0

  const motivos = gas?.motivos ?? MOTIVOS.map(m=>({motivo:m.label,qtd:m.qtd,cor:m.cor}))
  const totalMot = motivos.reduce((s,m)=>s+m.qtd,0)

  const ranking = UNIDADES.map(u=>({
    u, hcR:hcReal(u), hcI:hcIdeal(u), turn:turnover(u),
    adm:adms(u), des:desls(u), desvio:hcReal(u)-hcIdeal(u),
  })).sort((a,b)=>b.turn-a.turn)
  const rankFilt = unidade==='Todas'?ranking:ranking.filter(r=>r.u===unidade)

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20,paddingBottom:40}}>

      {loading&&<div style={{background:'#fff',border:'1px solid #E8E8E2',borderRadius:8,padding:'10px 20px',fontSize:12,color:'#ABABAB'}}>⏳ Carregando dados do Google Sheets...</div>}
      {erro&&<div style={{background:'#FFF5E0',border:'1px solid #D9B504',borderRadius:8,padding:'10px 20px',fontSize:12,color:'#8C1414'}}>⚠️ {erro} — exibindo dados de referência.</div>}

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
        <KpiCard label="Turnover Médio" valor={turnMedio} sufixo="%" cor={st(turnMedio)==='critico'?'vermelho':st(turnMedio)==='atencao'?'ambar':'verde'}
          sub={turnMedio>META?`↑ ${Math.round((turnMedio-META)*10)/10}pp acima da meta`:`✓ Dentro da meta (${META}%)`}/>
        <KpiCard label="Headcount Atual" valor={hcAt} cor={hcAt>=hcId?'verde':'ambar'} sub={`Meta: ${hcId} · ${vagas>0?`${vagas} vagas abertas`:'Quadro completo'}`}/>
        <KpiCard label="Admissões / Desligamentos" valor={`${adm} / ${des}`} cor={adm>=des?'verde':'vermelho'} sub={`Saldo ${adm-des>=0?'+':''}${adm-des} no período`}/>
        <KpiCard label="Custo do Turnover" valor={`R$ ${custoTurn.toLocaleString('pt-BR')}`} cor="vermelho" sub={`${des} deslig. × R$ ${Math.round(CUSTO_DEM).toLocaleString('pt-BR')}`}/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
        <KpiCard label="Vagas Abertas" valor={vagas} cor={vagas===0?'verde':vagas<=5?'ambar':'vermelho'} sub={vagas===0?'Quadro completo':`${Math.round((vagas/hcId)*1000)/10}% do quadro ideal`}/>
        <KpiCard label="Em Experiência" valor={exp} cor={pctExp>20?'vermelho':pctExp>12?'ambar':'verde'} sub={`${pctExp}% do headcount (<90 dias)`}/>
        <div style={{gridColumn:'span 2',background:'#fff',border:'1px solid #E8E8E2',borderRadius:8,padding:'16px 20px',display:'flex',gap:32,alignItems:'center'}}>
          <div>
            <div style={{fontSize:10.5,fontWeight:600,color:'#ABABAB',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:6}}>Ocupação Geral</div>
            <div style={{fontSize:26,fontWeight:700,color:'#0D0D0D',fontFamily:"'DM Mono', monospace"}}>{ocup}%</div>
            <div style={{fontSize:12,color:'#ABABAB',marginTop:4}}>{hcAt} de {hcId} colaboradores</div>
          </div>
          <div style={{flex:1}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#ABABAB',marginBottom:6}}><span>HC Atual</span><span>Meta</span></div>
            <div style={{height:10,background:'#E8E8E2',borderRadius:99}}>
              <div style={{height:10,borderRadius:99,width:`${Math.min(100,ocup)}%`,background:ocup>=100?'#97A624':ocup>=90?'#D9B504':'#8C1414'}}/>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:11,fontFamily:"'DM Mono', monospace",marginTop:4}}>
              <span style={{fontWeight:600}}>{hcAt}</span><span style={{color:'#ABABAB'}}>{hcId}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:16}}>
        <div style={{background:'#fff',border:'1px solid #E8E8E2',borderRadius:8,overflow:'hidden'}}>
          <div style={{padding:'14px 20px',borderBottom:'1px solid #E8E8E2'}}>
            <div style={{fontWeight:600,fontSize:14,color:'#0D0D0D'}}>Tendência Mensal</div>
            <div style={{fontSize:11,color:'#ABABAB'}}>Turnover % · HC ideal vs atual</div>
          </div>
          <div style={{padding:20}}><GraficoTendencia mesAtual={mesIdx} gas={gas} meta={META}/></div>
        </div>
        <div style={{background:'#fff',border:'1px solid #E8E8E2',borderRadius:8,overflow:'hidden'}}>
          <div style={{padding:'14px 20px',borderBottom:'1px solid #E8E8E2'}}>
            <div style={{fontWeight:600,fontSize:14,color:'#0D0D0D'}}>Motivos de Desligamento</div>
            <div style={{fontSize:11,color:'#ABABAB'}}>Histórico acumulado</div>
          </div>
          <div style={{padding:20,display:'flex',flexDirection:'column',gap:14}}>
            {motivos.slice(0,6).map((m,i)=>{
              const pct=Math.round((m.qtd/totalMot)*1000)/10
              const cores=['#D9B504','#8C1414','#6B0000','#97A624','#888888','#ABABAB']
              return (
                <div key={m.motivo}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                    <span style={{fontSize:12,color:'#3D3D3D'}}>{m.motivo}</span>
                    <div style={{display:'flex',gap:8}}>
                      <span style={{fontSize:12,fontWeight:600,fontFamily:"'DM Mono', monospace"}}>{m.qtd}</span>
                      <span style={{fontSize:11,color:'#ABABAB',fontFamily:"'DM Mono', monospace"}}>{pct}%</span>
                    </div>
                  </div>
                  <div style={{height:6,background:'#E8E8E2',borderRadius:99}}>
                    <div style={{height:6,borderRadius:99,width:`${pct}%`,background:m.cor||cores[i]||'#888'}}/>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div style={{background:'#fff',border:'1px solid #E8E8E2',borderRadius:8,overflow:'hidden'}}>
        <div style={{padding:'14px 20px',borderBottom:'1px solid #E8E8E2',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontWeight:600,fontSize:14,color:'#0D0D0D'}}>Ranking de Unidades</div>
            <div style={{fontSize:11,color:'#ABABAB'}}>Ordenado por turnover · clique para detalhes</div>
          </div>
          <div style={{display:'flex',gap:16}}>
            {['ok','atencao','critico'].map(s=>(
              <span key={s} style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:'#ABABAB'}}>
                <span style={{width:8,height:8,borderRadius:'50%',background:COR[s],display:'inline-block'}}/>
                {s==='ok'?'OK':s==='atencao'?'Atenção':'Crítico'}
              </span>
            ))}
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1.6fr 80px 70px 70px 70px 70px 70px 70px',background:'#0D0D0D',padding:'8px 20px'}}>
          {['Unidade','Turnover','HC Atual','HC Ideal','Desvio','Admis.','Deslig.','Status'].map((h,i)=>(
            <div key={h} style={{fontSize:9.5,fontWeight:600,color:'#fff',letterSpacing:'0.07em',textTransform:'uppercase',textAlign:i===0?'left':'center'}}>{h}</div>
          ))}
        </div>
        {rankFilt.map((row,i)=>{
          const s=st(row.turn)
          return (
            <button key={row.u} onClick={()=>setDetalhe(row.u)}
              style={{width:'100%',display:'grid',gridTemplateColumns:'1.6fr 80px 70px 70px 70px 70px 70px 70px',padding:'12px 20px',background:'#fff',border:'none',cursor:'pointer',borderBottom:i<rankFilt.length-1?'1px solid #E8E8E2':'none',textAlign:'left'}}
              onMouseEnter={e=>e.currentTarget.style.background='#FAFAF8'}
              onMouseLeave={e=>e.currentTarget.style.background='#fff'}>
              <div style={{fontWeight:500,fontSize:13,color:'#0D0D0D'}}>{row.u}</div>
              <div style={{textAlign:'center',fontWeight:700,fontSize:13,color:COR[s],fontFamily:"'DM Mono', monospace"}}>{row.turn}%</div>
              <div style={{textAlign:'center',fontSize:13,fontFamily:"'DM Mono', monospace"}}>{row.hcR}</div>
              <div style={{textAlign:'center',fontSize:13,color:'#ABABAB',fontFamily:"'DM Mono', monospace"}}>{row.hcI}</div>
              <div style={{textAlign:'center',fontSize:13,fontWeight:600,color:row.desvio>=0?'#97A624':'#8C1414',fontFamily:"'DM Mono', monospace"}}>{row.desvio>=0?`+${row.desvio}`:row.desvio}</div>
              <div style={{textAlign:'center',fontSize:13,fontFamily:"'DM Mono', monospace"}}>{row.adm}</div>
              <div style={{textAlign:'center',fontSize:13,fontFamily:"'DM Mono', monospace"}}>{row.des}</div>
              <div style={{textAlign:'center'}}>
                <span style={{fontSize:10,fontWeight:600,padding:'2px 8px',borderRadius:99,background:BG[s],color:COR[s]}}>
                  {s==='ok'?'OK':s==='atencao'?'Atenção':'Crítico'}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {detalhe&&<PainelDetalhe unidade={detalhe} mesIdx={mesIdx} gas={gas} meta={META} onClose={()=>setDetalhe(null)}/>}
    </div>
  )
}

function GraficoTendencia({ mesAtual, gas, meta }) {
  const dados = MESES.map((mes,i)=>{
    let hcR=0,hcI=0,turn=0
    UNIDADES.forEach(u=>{ hcR+=HC_REAL[u][i]; hcI+=HC_IDEAL[u]; turn+=TURNOVER[u][i] })
    if(gas?.resumo&&i===mesAtual){
      hcR=0;turn=0
      UNIDADES.forEach(u=>{ hcR+=gas.resumo[u]?.hc_real??HC_REAL[u][i]; turn+=gas.resumo[u]?.turnover??TURNOVER[u][i] })
    }
    return {mes,hcR,hcI,turn:Math.round((turn/UNIDADES.length)*10)/10}
  })
  const maxHC=Math.max(...dados.map(d=>d.hcI))*1.1
  const maxTurn=Math.max(...dados.map(d=>d.turn),meta)*1.4
  const W=520,H=150,pl=40,pr=16,pt=16,pb=28,cW=W-pl-pr,cH=H-pt-pb,n=dados.length
  const x=i=>pl+(i/(n-1))*cW
  const yH=v=>pt+cH-(v/maxHC)*cH
  const yT=v=>pt+cH-(v/maxTurn)*cH
  const pHR=dados.map((d,i)=>`${i===0?'M':'L'}${x(i)},${yH(d.hcR)}`).join(' ')
  const pHI=dados.map((d,i)=>`${i===0?'M':'L'}${x(i)},${yH(d.hcI)}`).join(' ')
  const pT=dados.map((d,i)=>`${i===0?'M':'L'}${x(i)},${yT(d.turn)}`).join(' ')
  return (
    <div>
      <div style={{display:'flex',gap:20,marginBottom:10,flexWrap:'wrap'}}>
        {[['#0D0D0D','HC Atual',false],['#ABABAB','HC Ideal',true],['#97A624','Turnover %',false],['#D9B504',`Meta ${meta}%`,true]].map(([cor,lbl,dash])=>(
          <div key={lbl} style={{display:'flex',alignItems:'center',gap:6}}>
            <svg width="18" height="6"><line x1="0" y1="3" x2="18" y2="3" stroke={cor} strokeWidth="2" strokeDasharray={dash?'3,2':'none'}/></svg>
            <span style={{fontSize:11,color:'#ABABAB'}}>{lbl}</span>
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'auto'}}>
        {[0,.25,.5,.75,1].map(f=><line key={f} x1={pl} y1={pt+cH*f} x2={pl+cW} y2={pt+cH*f} stroke="#E8E8E2" strokeWidth="1"/>)}
        <line x1={pl} y1={yT(meta)} x2={pl+cW} y2={yT(meta)} stroke="#D9B504" strokeWidth="1.5" strokeDasharray="4,3"/>
        <path d={pHI} fill="none" stroke="#D0D0CA" strokeWidth="1.5" strokeDasharray="4,3"/>
        <path d={pHR} fill="none" stroke="#0D0D0D" strokeWidth="2"/>
        <path d={pT}  fill="none" stroke="#97A624" strokeWidth="2"/>
        {dados.map((d,i)=>(
          <g key={d.mes}>
            <circle cx={x(i)} cy={yH(d.hcR)} r={i===mesAtual?5:3} fill={i===mesAtual?'#0D0D0D':'#fff'} stroke="#0D0D0D" strokeWidth="1.5"/>
            <circle cx={x(i)} cy={yT(d.turn)} r={i===mesAtual?5:3} fill={i===mesAtual?'#97A624':'#fff'} stroke="#97A624" strokeWidth="1.5"/>
            <text x={x(i)} y={H-4} textAnchor="middle" fontSize="9" fill={i===mesAtual?'#0D0D0D':'#ABABAB'} fontWeight={i===mesAtual?'700':'400'}>{d.mes.split('/')[0]}</text>
          </g>
        ))}
        <text x={pl-4} y={pt+4} textAnchor="end" fontSize="8" fill="#ABABAB">{Math.round(maxHC)}</text>
        <text x={pl-4} y={pt+cH+4} textAnchor="end" fontSize="8" fill="#ABABAB">0</text>
      </svg>
    </div>
  )
}

function PainelDetalhe({ unidade, mesIdx, gas, meta, onClose }) {
  const resumo=gas?.resumo?.[unidade]
  const hcR=resumo?.hc_real??HC_REAL[unidade]?.[mesIdx]??0
  const hcI=resumo?.hc_ideal??HC_IDEAL[unidade]??0
  const desvio=hcR-hcI
  const ocup=hcI>0?Math.round((hcR/hcI)*1000)/10:0
  const turns=TURNOVER[unidade]??[]
  return (
    <>
      <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(13,13,13,0.35)',zIndex:40}}/>
      <div style={{position:'fixed',top:0,right:0,height:'100%',width:380,background:'#fff',zIndex:50,boxShadow:'-8px 0 40px rgba(0,0,0,0.12)',display:'flex',flexDirection:'column'}}>
        <div style={{padding:'16px 20px',borderBottom:'1px solid #E8E8E2',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontWeight:700,fontSize:15,color:'#0D0D0D'}}>{unidade}</div>
            <div style={{fontSize:11,color:'#ABABAB'}}>Detalhes {MESES[mesIdx]}</div>
          </div>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:6,border:'none',background:'#F5F5F0',cursor:'pointer',fontSize:18}}>×</button>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:20,display:'flex',flexDirection:'column',gap:20}}>
          <div>
            <div style={{fontSize:9.5,fontWeight:600,color:'#ABABAB',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:8}}>Headcount</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
              {[['Atual',hcR,'#0D0D0D'],['Ideal',hcI,'#ABABAB'],['Desvio',desvio>=0?`+${desvio}`:desvio,desvio>=0?'#97A624':'#8C1414']].map(([lbl,val,cor])=>(
                <div key={lbl} style={{background:'#FAFAF8',border:'1px solid #E8E8E2',borderRadius:8,padding:12}}>
                  <div style={{fontSize:9,color:'#ABABAB',textTransform:'uppercase',marginBottom:4}}>{lbl}</div>
                  <div style={{fontSize:22,fontWeight:700,color:cor,fontFamily:"'DM Mono', monospace"}}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:10}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#ABABAB',marginBottom:4}}>
                <span>Ocupação</span><span style={{fontFamily:"'DM Mono', monospace"}}>{ocup}%</span>
              </div>
              <div style={{height:8,background:'#E8E8E2',borderRadius:99}}>
                <div style={{height:8,borderRadius:99,width:`${Math.min(100,ocup)}%`,background:ocup>=100?'#97A624':ocup>=85?'#D9B504':'#8C1414'}}/>
              </div>
            </div>
          </div>
          <div>
            <div style={{fontSize:9.5,fontWeight:600,color:'#ABABAB',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:8}}>Histórico Turnover (referência)</div>
            {MESES.map((mes,i)=>{
              const v=turns[i]??0
              const cor=v>=9?'#8C1414':v>meta?'#D9B504':'#97A624'
              return (
                <div key={mes} style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
                  <span style={{fontSize:11,color:'#ABABAB',width:40}}>{mes}</span>
                  <div style={{flex:1,height:18,background:'#F5F5F0',borderRadius:4,overflow:'hidden'}}>
                    <div style={{height:18,width:`${Math.min(100,v*7)}%`,background:cor,opacity:0.85}}/>
                  </div>
                  <span style={{fontSize:11,fontWeight:600,color:cor,fontFamily:"'DM Mono', monospace",width:36,textAlign:'right'}}>{v}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
