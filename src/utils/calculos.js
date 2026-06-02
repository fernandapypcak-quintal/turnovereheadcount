import {
  headcountData, turnoverData, movimentacaoData,
  emExperiencia, CUSTO_REPOSICAO, META_TURNOVER, UNIDADES
} from "../data/mockData";

export function getMesIndex(mes) {
  const meses = ["Jan/25","Fev/25","Mar/25","Abr/25","Mai/25","Jun/25"];
  return meses.indexOf(mes);
}

export function getKPIs(mesIndex, unidadeFiltro) {
  const unidades = unidadeFiltro === "Todas" ? UNIDADES : [unidadeFiltro];

  let hcAtual = 0, hcIdeal = 0, admissoes = 0, desligamentos = 0, emExp = 0;
  let turnoverSum = 0;

  unidades.forEach((u) => {
    const hc = headcountData[u];
    const turn = turnoverData[u];
    const mov = movimentacaoData[u];
    const exp = emExperiencia[u];
    if (!hc || !turn || !mov || !exp) return;

    hcAtual += hc.historico[mesIndex];
    hcIdeal += hc.ideal;
    admissoes += mov.admissoes[mesIndex];
    desligamentos += mov.desligamentos[mesIndex];
    emExp += exp.experiencia;
    turnoverSum += turn[mesIndex];
  });

  const turnoverMedio = turnoverSum / unidades.length;
  const vagasAbertas = Math.max(0, hcIdeal - hcAtual);
  const custoReposicao = desligamentos * CUSTO_REPOSICAO;
  const pctExperiencia = hcAtual > 0 ? (emExp / hcAtual) * 100 : 0;

  return {
    hcAtual,
    hcIdeal,
    vagasAbertas,
    admissoes,
    desligamentos,
    saldo: admissoes - desligamentos,
    turnoverMedio: parseFloat(turnoverMedio.toFixed(1)),
    emExperiencia: emExp,
    pctExperiencia: parseFloat(pctExperiencia.toFixed(1)),
    custoReposicao,
    dentroMeta: turnoverMedio <= META_TURNOVER,
  };
}

export function getRankingUnidades(mesIndex) {
  return UNIDADES.map((u) => {
    const hc = headcountData[u];
    const turn = turnoverData[u];
    const mov = movimentacaoData[u];
    const exp = emExperiencia[u];
    const atual = hc.historico[mesIndex];
    const ideal = hc.ideal;
    const desvio = atual - ideal;
    const desvioP = ((desvio / ideal) * 100).toFixed(1);
    const turnover = turn[mesIndex];
    const vagas = Math.max(0, ideal - atual);
    const pctExp = ((exp.experiencia / atual) * 100).toFixed(1);
    return {
      unidade: u,
      hcAtual: atual,
      hcIdeal: ideal,
      desvio,
      desvioP: parseFloat(desvioP),
      turnover,
      vagas,
      admissoes: mov.admissoes[mesIndex],
      desligamentos: mov.desligamentos[mesIndex],
      pctExp: parseFloat(pctExp),
      status:
        turnover > 9 ? "critico"
        : turnover > META_TURNOVER ? "atencao"
        : "ok",
    };
  }).sort((a, b) => b.turnover - a.turnover);
}

export function getHistoricoConsolidado() {
  const meses = ["Jan/25","Fev/25","Mar/25","Abr/25","Mai/25","Jun/25"];
  return meses.map((mes, i) => {
    let hcAtual = 0, hcIdeal = 0, admissoes = 0, desligamentos = 0;
    let turnoverSum = 0;
    UNIDADES.forEach((u) => {
      hcAtual += headcountData[u].historico[i];
      hcIdeal += headcountData[u].ideal;
      admissoes += movimentacaoData[u].admissoes[i];
      desligamentos += movimentacaoData[u].desligamentos[i];
      turnoverSum += turnoverData[u][i];
    });
    return {
      mes,
      hcAtual,
      hcIdeal,
      turnover: parseFloat((turnoverSum / UNIDADES.length).toFixed(1)),
      admissoes,
      desligamentos,
    };
  });
}
