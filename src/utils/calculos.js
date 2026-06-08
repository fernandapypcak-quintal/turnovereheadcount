import {
  headcountData, turnoverData, movimentacaoData, emExperiencia,
  custoMensalData, custoIdealData, custoMedioPorPessoa,
  CUSTO_CONTRATACAO, CUSTO_DESLIGAMENTO, META_TURNOVER, UNIDADES, FOLHA_ANUAL
} from "../data/mockData";

export const MESES_LIST = ["Jan/26","Fev/26","Mar/26","Abr/26","Mai/26","Jun/26"];

export function getMesIndex(mes) {
  return MESES_LIST.indexOf(mes);
}

export function getUnidadesFiltro(unidade) {
  return unidade === "Todas" ? UNIDADES : [unidade];
}

export function getKPIs(mesIndex, unidade) {
  const unidades = getUnidadesFiltro(unidade);
  let hcAtual=0, hcIdeal=0, admissoes=0, desligamentos=0, emExp=0, custoReal=0, custoIdeal=0;
  let turnoverSum=0;

  unidades.forEach(u => {
    const hc   = headcountData[u];
    const turn = turnoverData[u];
    const mov  = movimentacaoData[u];
    const exp  = emExperiencia[u];
    const custo = custoMensalData[u];
    const cideal = custoIdealData[u];
    if (!hc) return;
    hcAtual      += hc.historico[mesIndex];
    hcIdeal      += hc.ideal;
    admissoes    += mov.admissoes[mesIndex];
    desligamentos+= mov.desligamentos[mesIndex];
    emExp        += exp.experiencia;
    turnoverSum  += turn[mesIndex];
    custoReal    += custo[mesIndex];
    custoIdeal   += cideal;
  });

  const turnoverMedio    = turnoverSum / unidades.length;
  const vagasAbertas     = Math.max(0, hcIdeal - hcAtual);
  const custoTurnover    = (desligamentos * CUSTO_DESLIGAMENTO) + (admissoes * CUSTO_CONTRATACAO);
  const pctExperiencia   = hcAtual > 0 ? (emExp / hcAtual) * 100 : 0;
  const custoPorPessoa   = hcAtual > 0 ? custoReal / hcAtual : 0;
  const gapCusto         = custoIdeal - custoReal;
  const pesoTurnoverFolha= (custoTurnover / (FOLHA_ANUAL / 12)) * 100;

  return {
    hcAtual, hcIdeal, vagasAbertas, admissoes, desligamentos,
    saldo: admissoes - desligamentos,
    turnoverMedio: parseFloat(turnoverMedio.toFixed(1)),
    emExperiencia: emExp,
    pctExperiencia: parseFloat(pctExperiencia.toFixed(1)),
    custoReal, custoIdeal, gapCusto,
    custoTurnover: Math.round(custoTurnover),
    custoPorPessoa: Math.round(custoPorPessoa),
    pesoTurnoverFolha: parseFloat(pesoTurnoverFolha.toFixed(2)),
    dentroMeta: turnoverMedio <= META_TURNOVER,
  };
}

export function getRankingUnidades(mesIndex) {
  return UNIDADES.map(u => {
    const hc    = headcountData[u];
    const turn  = turnoverData[u];
    const mov   = movimentacaoData[u];
    const exp   = emExperiencia[u];
    const custo = custoMensalData[u];
    const atual = hc.historico[mesIndex];
    const ideal = hc.ideal;
    const desvio= atual - ideal;
    const turnover = turn[mesIndex];
    const custoMes = custo[mesIndex];
    const cpp = atual > 0 ? Math.round(custoMes / atual) : 0;
    return {
      unidade: u,
      hcAtual: atual, hcIdeal: ideal,
      desvio, desvioP: parseFloat(((desvio/ideal)*100).toFixed(1)),
      turnover, vagas: Math.max(0, ideal - atual),
      admissoes: mov.admissoes[mesIndex],
      desligamentos: mov.desligamentos[mesIndex],
      pctExp: parseFloat(((exp.experiencia / atual)*100).toFixed(1)),
      custoMensal: custoMes,
      custoIdeal: custoIdealData[u],
      custoPorPessoa: cpp,
      status: turnover > 9 ? "critico" : turnover > META_TURNOVER ? "atencao" : "ok",
    };
  }).sort((a,b) => b.turnover - a.turnover);
}

export function getHistoricoConsolidado() {
  return MESES_LIST.map((mes, i) => {
    let hcAtual=0, hcIdeal=0, admissoes=0, desligamentos=0, custoReal=0;
    let turnoverSum=0;
    UNIDADES.forEach(u => {
      hcAtual      += headcountData[u].historico[i];
      hcIdeal      += headcountData[u].ideal;
      admissoes    += movimentacaoData[u].admissoes[i];
      desligamentos+= movimentacaoData[u].desligamentos[i];
      turnoverSum  += turnoverData[u][i];
      custoReal    += custoMensalData[u][i];
    });
    return {
      mes, hcAtual, hcIdeal, custoReal,
      turnover: parseFloat((turnoverSum / UNIDADES.length).toFixed(1)),
      admissoes, desligamentos,
      custoTurnover: Math.round((desligamentos*CUSTO_DESLIGAMENTO)+(admissoes*CUSTO_CONTRATACAO)),
    };
  });
}
