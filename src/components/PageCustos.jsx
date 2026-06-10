import KpiCard from './KpiCard.jsx'
import { useGASData, CONFIG_DEFAULT, CUSTO_IDEAL_KEY } from '../useGASData.js'
import { UNIDADES, MESES, HC_IDEAL, HC_REAL, ADMISSOES, DESLIGAMENTOS, CUSTO_REAL } from '../data.js'

const fmt = v => (v==null||isNaN(Number(v)))?'—':Math.round(Number(v)).toLocaleString('pt-BR')

export default function PageCustos({ mesIdx, unidade }) {
  const { data: gas, loading, erro } = useGASData(mesIdx)

  const cfg = gas?.configuracoes ?? CONFIG_DEFAULT
  const CUSTO_ADM    = cfg.custo_contratacao   ?? 2514
  const CUSTO_DEM    = cfg.custo_demissao      ?? 2724
  const FOLHA_MEN    = cfg.folha_mensal        ?? 1800000
  const TURN_ANO     = cfg.custo_turnover_ano  ?? 1185202
  const ADM_REF      = cfg.admissoes_ano_ref   ?? 193
  const DES_REF      = cfg.desligamentos_ano_ref ?? 257

  const COMPOSICAO = [
    {label:'Salário Base', pct: cfg.comp_salario_base ?? 52, cor:'#0D0D0D'},
    {label:'Encargos',     pct: cfg.comp_encargos     ?? 21, cor:'#8C1414'},
    {label:'Benefícios',   pct: cfg.comp_beneficios   ?? 12, cor:'#D9B504'},
    {label:'Provisões',    pct: cfg.comp_provisoes    ?? 15, cor:'#97A624'},
  ]

  function custoIdeal(u) {
    const key = CUSTO_IDEAL_KEY[u]
    return (key && cfg[key]) ? cfg[key] : 0
  }
  function custoReal(u)  { return gas?.custos?.[u]                ?? CUSTO_REAL[u]?.[mesIdx]      ?? 0 }
  function hcReal(u)     { return gas?.resumo?.[u]?.hc_real       ?? HC_REAL[u]?.[mesIdx]         ?? 0 }
  function adms(u)       { return gas?.resumo?.[u]?.admissoes     ?? ADMISSOES[u]?.[mesIdx]       ?? 0 }
  function desls(u)      { return gas?.resumo?.[u]?.desligamentos ?? DESLIGAMENTOS[u]?.[mesIdx]   ?? 0 }

  const uns = unidade==='Todas'?UNIDADES:UNIDADES.filter(u=>u===unidade)
  let cr=0,ci=0,adm=0,des=0,hcAt=0
  uns.forEach(u=>{ cr+=custoReal(u); ci+=custoIdeal(u); adm+=adms(u); des+=desls(u); hcAt+=hcReal(u) })

  const custoTurn = (des*CUSTO_DEM)+(adm*CUSTO_ADM)
  const cpp       = hcAt>0?Math.round(cr/hcAt):0
  const gapCusto  = ci-cr
  const pesoTurn  = Math.round((custoTurn/FOLHA_MEN)*1000)/10

  const rankingCusto = UNIDADES.map(u=>({
    u, cr:custoReal(u), ci:custoIdeal(u),
    hcR:hcReal(u), hcI:HC_IDEAL[u]??0,
    cpp:hcReal(u)>0?Math.round(custoReal(u)/hcReal(u)):0,
    gap:custoIdeal(u)-custoReal(u),
    cturn:Math.round((desls(u)*CUSTO_DEM)+(adms(u)*CUSTO_ADM)),
    ocup:HC_IDEAL[u]>0?Math.round((hcReal(u)/HC_IDEAL[u])*1000)/10:0,
  })).sort((a,b)=>b.cr-a.cr)
  const rankFilt = unidade==='Todas'?rankingCusto:rankingCusto.filter(r=>r.u===unidade)

  const historico = MESES.map((mes,i)=>({
    mes,
    cr: UNIDADES.reduce((s,u)=>s+(i===mesIdx&&gas?.custos?.[u]?gas.custos[u]:CUSTO_REAL[u]?.[i]??0),0),
    ct: UNIDADES.reduce((s,u)=>s+((DESLIGAMENTOS[u]?.[i]??0)*CUSTO_DEM+(ADMISSOES[u]?.[i]??0)*CUSTO_ADM),0),
  }))

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20,paddingBottom:40}}>

      {loading&&<div style={{background:'#fff',border:'1px solid #E8E8E2',borderRadius:8,padding:'10px 20px',fontSize:12,color:'#ABABAB'}}>⏳ Carregando dados do Google Sheets...</div>}
      {erro&&<div style={{background:'#FFF5E0',border:'1px solid #D9B504',borderRadius:8,padding:'10px 20px',fontSize:12,color:'#8C1414'}}>⚠️ {erro} — exibindo dados de referência.</div>}

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
        <KpiCard label="Custo Total Mensal"        valor={`R$ ${fmt(cr)}`}        cor="preto"   sub={unidade==='Todas'?'Todas as unidades':unidade}/>
        <KpiCard label="Custo se HC Completo"      valor={`R$ ${fmt(ci)}`}        cor="ambar"   sub={`Gap de R$ ${fmt(gapCusto)} com vagas abertas`}/>
        <KpiCard label="Custo Médio / Colaborador" valor={`R$ ${fmt(cpp)}`}       cor="preto"   sub={`Base: ${hcAt} colaboradores ativos`}/>
        <KpiCard label="Custo do Turnover"         valor={`R$ ${fmt(custoTurn)}`} cor={pesoTurn>5?'vermelho':'ambar'} sub={`${pesoTurn}% da folha mensal`}/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
        <KpiCard label="Desligamentos no Mês" valor={des} cor="vermelho" sub={`× R$ ${fmt(CUSTO_DEM)} = R$ ${fmt(des*CUSTO_DEM)}`}/>
        <KpiCard label="Admissões no Mês"     valor={adm} cor="ambar"   sub={`× R$ ${fmt(CUSTO_ADM)} = R$ ${fmt(adm*CUSTO_ADM)}`}/>
        <div style={{gridColumn:'span 2',background:'#fff',border:'1px solid #E8E8E2',borderRadius:8,padding:'16px 20px'}}>
          <div style={{fontSize:10.5,fontWeight:600,color:'#ABABAB',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:10}}>Composição do Custo</div>
          <div style={{display:'flex',height:20,borderRadius:4,overflow:'hidden',gap:2,marginBottom:10}}>
            {COMPOSICAO.map(c=><div key={c.label} style={{width:`${c.pct}%`,background:c.cor}}/>)}
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:14}}>
            {COMPOSICAO.map(c=>(
              <div key={c.label} style={{display:'flex',alignItems:'center',gap:6}}>
                <span style={{width:8,height:8,borderRadius:'50%',background:c.cor,display:'inline-block'}}/>
                <span style={{fontSize:12,color:'#3D3D3D'}}>{c.label}</span>
                <span style={{fontSize:12,fontWeight:600,color:c.cor,fontFamily:"'DM Mono', monospace"}}>{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:16}}>
        <div style={{background:'#fff',border:'1px solid #E8E8E2',borderRadius:8,overflow:'hidden'}}>
          <div style={{padding:'14px 20px',borderBottom:'1px solid #E8E8E2'}}>
            <div style={{fontWeight:600,fontSize:14,color:'#0D0D0D'}}>Evolução do Custo Mensal</div>
            <div style={{fontSize:11,color:'#ABABAB'}}>Custo real × custo com turnover</div>
          </div>
          <div style={{padding:20}}><GraficoCusto historico={historico} mesAtual={mesIdx}/></div>
        </div>
        <div style={{background:'#fff',border:'1px solid #E8E8E2',borderRadius:8,overflow:'hidden'}}>
          <div style={{padding:'14px 20px',borderBottom:'1px solid #E8E8E2'}}>
            <div style={{fontWeight:600,fontSize:14,color:'#0D0D0D'}}>Custo do Turnover</div>
            <div style={{fontSize:11,color:'#ABABAB'}}>Metodologia interna RH</div>
          </div>
          <div style={{padding:20,display:'flex',flexDirection:'column',gap:12}}>
            {[
              {label:'Por Contratação', val:CUSTO_ADM, cor:'#D9B504',desc:'ATS + recrutamento + exame + uniforme'},
              {label:'Por Desligamento',val:CUSTO_DEM, cor:'#8C1414',desc:'Rescisão + multa FGTS + aviso prévio'},
            ].map(item=>(
              <div key={item.label} style={{background:'#FAFAF8',border:'1px solid #E8E8E2',borderRadius:8,padding:14}}>
                <div style={{fontSize:9,color:'#ABABAB',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:4}}>{item.label}</div>
                <div style={{fontSize:22,fontWeight:700,color:item.cor,fontFamily:"'DM Mono', monospace"}}>R$ {fmt(item.val)}</div>
                <div style={{fontSize:11,color:'#ABABAB',marginTop:4}}>{item.desc}</div>
              </div>
            ))}
            <div style={{background:'#0D0D0D',borderRadius:8,padding:14}}>
              <div style={{fontSize:9,color:'#97A624',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:4}}>Custo Real do Turnover (ref. anual)</div>
              <div style={{fontSize:22,fontWeight:700,color:'#fff',fontFamily:"'DM Mono', monospace"}}>R$ {fmt(TURN_ANO)}</div>
              <div style={{fontSize:11,color:'#888',marginTop:4}}>{ADM_REF} admissões · {DES_REF} desligamentos (referência)</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{background:'#fff',border:'1px solid #E8E8E2',borderRadius:8,overflow:'hidden'}}>
        <div style={{padding:'14px 20px',borderBottom:'1px solid #E8E8E2'}}>
          <div style={{fontWeight:600,fontSize:14,color:'#0D0D0D'}}>Custos por Unidade</div>
          <div style={{fontSize:11,color:'#ABABAB'}}>Ordenado por custo total decrescente</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1.5fr 110px 110px 90px 90px 110px 100px',background:'#0D0D0D',padding:'8px 20px'}}>
          {['Unidade','Custo Real','Custo Ideal','Gap','R$/Pessoa','Custo Turnover','HC Real/Ideal'].map((h,i)=>(
            <div key={h} style={{fontSize:9.5,fontWeight:600,color:'#fff',letterSpacing:'0.07em',textTransform:'uppercase',textAlign:i===0?'left':'center'}}>{h}</div>
          ))}
        </div>
        {rankFilt.map((row,i)=>(
          <div key={row.u} style={{display:'grid',gridTemplateColumns:'1.5fr 110px 110px 90px 90px 110px 100px',padding:'12px 20px',borderBottom:i<rankFilt.length-1?'1px solid #E8E8E2':'none'}}>
            <div style={{fontWeight:500,fontSize:13,color:'#0D0D0D'}}>{row.u}</div>
            <div style={{textAlign:'center',fontWeight:700,fontSize:13,fontFamily:"'DM Mono', monospace"}}>R$ {fmt(row.cr)}</div>
            <div style={{textAlign:'center',fontSize:13,color:'#ABABAB',fontFamily:"'DM Mono', monospace"}}>R$ {fmt(row.ci)}</div>
            <div style={{textAlign:'center',fontSize:13,fontWeight:600,color:row.gap>0?'#D9B504':'#97A624',fontFamily:"'DM Mono', monospace"}}>{row.gap>0?`+${fmt(row.gap)}`:'OK'}</div>
            <div style={{textAlign:'center',fontSize:13,fontFamily:"'DM Mono', monospace"}}>R$ {fmt(row.cpp)}</div>
            <div style={{textAlign:'center',fontSize:13,color:row.cturn>10000?'#8C1414':row.cturn>5000?'#D9B504':'#97A624',fontFamily:"'DM Mono', monospace"}}>R$ {fmt(row.cturn)}</div>
            <div style={{textAlign:'center',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
              <span style={{fontSize:13,fontWeight:600,fontFamily:"'DM Mono', monospace"}}>{row.hcR}</span>
              <span style={{fontSize:11,color:'#ABABAB'}}>/</span>
              <span style={{fontSize:13,color:'#ABABAB',fontFamily:"'DM Mono', monospace"}}>{row.hcI}</span>
              <div style={{width:36,height:6,background:'#E8E8E2',borderRadius:99,overflow:'hidden'}}>
                <div style={{height:6,width:`${Math.min(100,row.ocup)}%`,background:row.ocup>=100?'#97A624':row.ocup>=85?'#D9B504':'#8C1414'}}/>
              </div>
            </div>
          </div>
        ))}
        <div style={{display:'grid',gridTemplateColumns:'1.5fr 110px 110px 90px 90px 110px 100px',padding:'12px 20px',background:'#F5F5F0',borderTop:'2px solid #0D0D0D'}}>
          <div style={{fontWeight:700,fontSize:13}}>TOTAL</div>
          <div style={{textAlign:'center',fontWeight:700,fontSize:13,fontFamily:"'DM Mono', monospace"}}>R$ {fmt(cr)}</div>
          <div style={{textAlign:'center',fontWeight:700,fontSize:13,color:'#ABABAB',fontFamily:"'DM Mono', monospace"}}>R$ {fmt(ci)}</div>
          <div style={{textAlign:'center',fontWeight:700,fontSize:13,color:'#D9B504',fontFamily:"'DM Mono', monospace"}}>+{fmt(gapCusto)}</div>
          <div style={{textAlign:'center',fontWeight:700,fontSize:13,fontFamily:"'DM Mono', monospace"}}>R$ {fmt(cpp)}</div>
          <div style={{textAlign:'center',fontWeight:700,fontSize:13,color:'#8C1414',fontFamily:"'DM Mono', monospace"}}>R$ {fmt(custoTurn)}</div>
          <div style={{textAlign:'center',fontWeight:700,fontSize:13,fontFamily:"'DM Mono', monospace"}}>{hcAt}</div>
        </div>
      </div>
    </div>
  )
}

function GraficoCusto({ historico, mesAtual }) {
  const maxCR=Math.max(...historico.map(h=>h.cr))*1.15||1
  const maxCT=Math.max(...historico.map(h=>h.ct))*1.5||1
  const W=520,H=150,pl=50,pr=16,pt=16,pb=28,cW=W-pl-pr,cH=H-pt-pb,n=historico.length
  const x=i=>pl+(i/(n-1))*cW
  const yCR=v=>pt+cH-(v/maxCR)*cH
  const yCT=v=>pt+cH-(v/maxCT)*cH
  const pCR=historico.map((h,i)=>`${i===0?'M':'L'}${x(i)},${yCR(h.cr)}`).join(' ')
  const pCT=historico.map((h,i)=>`${i===0?'M':'L'}${x(i)},${yCT(h.ct)}`).join(' ')
  return (
    <div>
      <div style={{display:'flex',gap:20,marginBottom:10}}>
        {[['#0D0D0D','Custo Total'],['#8C1414','Custo Turnover']].map(([cor,lbl])=>(
          <div key={lbl} style={{display:'flex',alignItems:'center',gap:6}}>
            <svg width="18" height="6"><line x1="0" y1="3" x2="18" y2="3" stroke={cor} strokeWidth="2"/></svg>
            <span style={{fontSize:11,color:'#ABABAB'}}>{lbl}</span>
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'auto'}}>
        {[0,.25,.5,.75,1].map(f=><line key={f} x1={pl} y1={pt+cH*f} x2={pl+cW} y2={pt+cH*f} stroke="#E8E8E2" strokeWidth="1"/>)}
        <path d={pCT} fill="none" stroke="#8C1414" strokeWidth="2"/>
        <path d={pCR} fill="none" stroke="#0D0D0D" strokeWidth="2.5"/>
        {historico.map((h,i)=>(
          <g key={h.mes}>
            <circle cx={x(i)} cy={yCR(h.cr)} r={i===mesAtual?5:3} fill={i===mesAtual?'#0D0D0D':'#fff'} stroke="#0D0D0D" strokeWidth="1.5"/>
            <circle cx={x(i)} cy={yCT(h.ct)} r={i===mesAtual?5:3} fill={i===mesAtual?'#8C1414':'#fff'} stroke="#8C1414" strokeWidth="1.5"/>
            <text x={x(i)} y={H-4} textAnchor="middle" fontSize="9" fill={i===mesAtual?'#0D0D0D':'#ABABAB'} fontWeight={i===mesAtual?'700':'400'}>{h.mes.split('/')[0]}</text>
          </g>
        ))}
        <text x={pl-4} y={pt+4} textAnchor="end" fontSize="8" fill="#ABABAB">{Math.round(maxCR/1000)}k</text>
        <text x={pl-4} y={pt+cH+4} textAnchor="end" fontSize="8" fill="#ABABAB">0</text>
      </svg>
    </div>
  )
}
