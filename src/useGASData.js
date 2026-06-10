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
    const mes = MESES_API[mesIdx] || '2026-06'
    fetch(`${GAS_URL}?tipo=todos&mes=${mes}`)
      .then(r => r.json())
      .then(d => { if (d.erro) throw new Error(d.erro); setData(d) })
      .catch(e => { console.error('GAS:', e); setErro(e.message) })
      .finally(() => setLoading(false))
  }, [mesIdx])

  return { data, loading, erro }
}
