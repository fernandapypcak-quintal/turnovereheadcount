import { useState, useEffect } from 'react'

const GAS_URL = "https://script.google.com/macros/s/AKfycby-QXglHGObJS1_YVTonnY0rXkrzkMBQZhwOqBMm2dZ46i53vdJuX7zM1SiEijtQ2H9/exec"

const MESES_API = ['2026-01','2026-02','2026-03','2026-04','2026-05','2026-06']

export function useGASData(mesIdx) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro]       = useState(null)

  useEffect(() => {
    setLoading(true)
    setErro(null)

    // Garante que o índice é número e está dentro do range
    const idx = Math.min(Math.max(Number(mesIdx) || 0, 0), MESES_API.length - 1)
    const mes = MESES_API[idx]

    console.log('GAS fetch → mes:', mes, 'idx:', idx)

    fetch(`${GAS_URL}?tipo=todos&mes=${mes}`)
      .then(r => r.json())
      .then(d => {
        if (d.erro) throw new Error(d.erro)
        console.log('GAS recebido → mes retornado:', d.mes, 'hc Carinãs:', d.resumo?.['Carinãs']?.hc_real)
        setData(d)
      })
      .catch(e => { console.error('GAS erro:', e); setErro(e.message) })
      .finally(() => setLoading(false))

  }, [mesIdx])

  return { data, loading, erro }
}

export const CONFIG_DEFAULT = {
  meta_turnover:           5.0,
  custo_contratacao:       2514,
  custo_demissao:          2724,
  folha_mensal:            1800000,
  custo_turnover_ano:      1185202,
  admissoes_ano_ref:       193,
  desligamentos_ano_ref:   257,
  comp_salario_base:       52,
  comp_encargos:           21,
  comp_beneficios:         12,
  comp_provisoes:          15,
  semaforo_verde_ambar:    5.0,
  semaforo_ambar_vermelho: 9.0,
  custo_ideal_carinas:     237984,
  custo_ideal_chacara:     82875,
  custo_ideal_figueiras:   227518,
  custo_ideal_lapa:        95360,
  custo_ideal_madalena:    103279,
  custo_ideal_mariana:     95461,
  custo_ideal_pavao:       69717,
  custo_ideal_perdizes:    85281,
  custo_ideal_santana:     218559,
  custo_ideal_tatuape:     249294,
  custo_ideal_holding:     201220,
  custo_ideal_santoandre:  100000,
}

export const CUSTO_IDEAL_KEY = {
  'Carinãs':    'custo_ideal_carinas',
  'Chácara':    'custo_ideal_chacara',
  'Figueiras':  'custo_ideal_figueiras',
  'Lapa':       'custo_ideal_lapa',
  'Madalena':   'custo_ideal_madalena',
  'Mariana':    'custo_ideal_mariana',
  'Pavão':      'custo_ideal_pavao',
  'Perdizes':   'custo_ideal_perdizes',
  'Santana':    'custo_ideal_santana',
  'Tatuapé':    'custo_ideal_tatuape',
  'Holding':    'custo_ideal_holding',
  'Santo André':'custo_ideal_santoandre',
}
