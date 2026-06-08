// ─── DADOS REAIS — Quintal do Espeto ─────────────────────────────────────────
// Fonte: Custo_Operações.xlsx + Custo_Turnover.png (jun/2026)
// Para conectar ao Google Apps Script, substituir fetch() em src/hooks/useGASData.js

export const UNIDADES_OP = [
  "Carinãs","Chácara","Figueiras","Lapa","Madalena",
  "Mariana","Pavão","Perdizes","Santana","Tatuapé",
];
export const UNIDADES = [...UNIDADES_OP, "Holding"];
export const MESES = ["Jan/26","Fev/26","Mar/26","Abr/26","Mai/26","Jun/26"];

// ── Headcount real (sem afastados) e ideal ────────────────────────────────────
export const headcountData = {
  "Carinãs":   { ideal: 57, historico: [50,51,49,48,46,45], afastados: [2,2,2,1,2,2] },
  "Chácara":   { ideal: 19, historico: [18,18,17,17,17,17], afastados: [1,1,1,1,1,1] },
  "Figueiras": { ideal: 56, historico: [48,47,46,46,45,45], afastados: [2,2,2,2,2,2] },
  "Lapa":      { ideal: 22, historico: [20,20,19,18,18,18], afastados: [1,1,1,1,1,1] },
  "Madalena":  { ideal: 24, historico: [20,19,18,17,16,16], afastados: [2,2,2,2,2,2] },
  "Mariana":   { ideal: 22, historico: [21,21,20,20,20,20], afastados: [0,0,0,0,0,0] },
  "Pavão":     { ideal: 20, historico: [20,20,20,20,20,20], afastados: [0,0,0,0,0,0] },
  "Perdizes":  { ideal: 21, historico: [19,18,18,18,18,18], afastados: [0,0,0,0,0,0] },
  "Santana":   { ideal: 52, historico: [40,39,38,37,36,35], afastados: [3,3,3,3,3,3] },
  "Tatuapé":   { ideal: 61, historico: [50,49,48,47,46,45], afastados: [6,6,6,6,6,6] },
  "Holding":   { ideal: 50, historico: [42,42,41,41,41,41], afastados: [0,0,0,0,0,0] },
};

// ── Turnover mensal % por unidade ─────────────────────────────────────────────
export const turnoverData = {
  "Carinãs":   [5.2, 6.1, 5.8, 7.2, 8.3, 7.1],
  "Chácara":   [3.1, 2.9, 3.5, 4.0, 3.8, 3.2],
  "Figueiras": [6.5, 7.2, 6.8, 8.1, 9.3, 8.4],
  "Lapa":      [4.2, 4.5, 3.8, 5.0, 4.7, 4.3],
  "Madalena":  [7.3, 8.0, 7.5, 9.2, 10.5, 9.8],
  "Mariana":   [2.8, 3.0, 2.5, 3.2, 2.9, 3.1],
  "Pavão":     [3.5, 3.2, 4.0, 3.8, 3.5, 3.8],
  "Perdizes":  [4.8, 4.5, 5.2, 4.9, 5.0, 4.7],
  "Santana":   [8.5, 9.2, 8.8, 10.1, 11.3, 10.2],
  "Tatuapé":   [5.8, 6.2, 5.9, 7.0, 8.1, 7.5],
  "Holding":   [1.5, 1.0, 2.0, 1.8, 1.5, 1.2],
};

// ── Movimentação mensal ───────────────────────────────────────────────────────
export const movimentacaoData = {
  "Carinãs":   { admissoes: [3,4,3,4,3,3], desligamentos: [2,3,3,4,5,4] },
  "Chácara":   { admissoes: [1,1,1,2,1,1], desligamentos: [1,1,1,1,1,1] },
  "Figueiras": { admissoes: [3,4,3,4,3,3], desligamentos: [3,4,3,4,5,4] },
  "Lapa":      { admissoes: [2,2,1,2,2,2], desligamentos: [1,2,2,2,2,2] },
  "Madalena":  { admissoes: [2,2,2,2,2,1], desligamentos: [2,3,3,3,3,3] },
  "Mariana":   { admissoes: [1,1,1,1,1,1], desligamentos: [1,1,1,1,1,1] },
  "Pavão":     { admissoes: [1,1,2,1,1,2], desligamentos: [1,1,1,1,1,1] },
  "Perdizes":  { admissoes: [2,1,2,2,2,2], desligamentos: [2,2,2,2,2,2] },
  "Santana":   { admissoes: [4,4,3,4,4,3], desligamentos: [3,4,4,5,5,5] },
  "Tatuapé":   { admissoes: [4,4,3,4,4,4], desligamentos: [3,4,4,5,5,5] },
  "Holding":   { admissoes: [1,0,1,1,0,1], desligamentos: [0,1,0,0,1,0] },
};

// ── Custo mensal real com pessoal por unidade (R$) — fonte: HC CARGO ──────────
export const custoMensalData = {
  "Carinãs":   [195420, 193800, 191200, 189600, 188900, 187882],
  "Chácara":   [76800,  75900,  75200,  74800,  74500,  74152 ],
  "Figueiras": [189600, 187200, 185800, 184200, 183500, 182827],
  "Lapa":      [81200,  80500,  79800,  79200,  78600,  78022 ],
  "Madalena":  [72400,  71800,  70900,  70100,  69500,  68853 ],
  "Mariana":   [88200,  87800,  87500,  87200,  87000,  86783 ],
  "Pavão":     [69900,  69800,  69800,  69717,  69717,  69717 ],
  "Perdizes":  [76200,  75500,  74800,  74200,  73600,  73098 ],
  "Santana":   [162000, 157800, 153200, 151000, 149000, 147107],
  "Tatuapé":   [198200, 195400, 192800, 190200, 187000, 183905],
  "Holding":   [168000, 167000, 166500, 166000, 165500, 165000],
};

// ── HC ideal → custo estimado se quadro completo ──────────────────────────────
export const custoIdealData = {
  "Carinãs":   237984,
  "Chácara":   82875,
  "Figueiras": 227518,
  "Lapa":      95360,
  "Madalena":  103279,
  "Mariana":   95461,
  "Pavão":     69717,
  "Perdizes":  85281,
  "Santana":   218559,
  "Tatuapé":   249294,
  "Holding":   201220,
};

// ── Custo médio por colaborador por unidade (R$) ──────────────────────────────
export const custoMedioPorPessoa = {
  "Carinãs":   4175,
  "Chácara":   4362,
  "Figueiras": 4063,
  "Lapa":      4335,
  "Madalena":  4303,
  "Mariana":   4339,
  "Pavão":     3486,
  "Perdizes":  4061,
  "Santana":   4203,
  "Tatuapé":   4087,
  "Holding":   4024,
};

// ── Em experiência (<90 dias) por unidade ─────────────────────────────────────
export const emExperiencia = {
  "Carinãs":   { total: 45, experiencia: 8 },
  "Chácara":   { total: 17, experiencia: 3 },
  "Figueiras": { total: 45, experiencia: 9 },
  "Lapa":      { total: 18, experiencia: 4 },
  "Madalena":  { total: 16, experiencia: 5 },
  "Mariana":   { total: 20, experiencia: 3 },
  "Pavão":     { total: 20, experiencia: 3 },
  "Perdizes":  { total: 18, experiencia: 4 },
  "Santana":   { total: 35, experiencia: 8 },
  "Tatuapé":   { total: 45, experiencia: 9 },
  "Holding":   { total: 41, experiencia: 2 },
};

// ── Motivos de desligamento ───────────────────────────────────────────────────
export const motivosDesligamento = [
  { motivo: "Pedido de demissão",            qtd: 87, cor: "#D9B504" },
  { motivo: "Demissão sem justa causa",      qtd: 52, cor: "#8C1414" },
  { motivo: "Demissão por justa causa",      qtd: 11, cor: "#6B0000" },
  { motivo: "Fim de contrato / experiência", qtd: 23, cor: "#97A624" },
  { motivo: "Acordo",                        qtd: 14, cor: "#888"    },
];

// ── Composição do custo (% sobre custo total) ─────────────────────────────────
export const composicaoCusto = {
  salarioBase:   0.52,
  encargos:      0.21,  // INSS + FGTS empresa
  beneficios:    0.12,  // VT + VA + plano médico + seguro
  provisoes:     0.15,  // férias + 13º provisionados
};

// ── Parâmetros de turnover — fonte: Custo_Turnover.png ────────────────────────
export const CUSTO_CONTRATACAO  = 2514.32;
export const CUSTO_DESLIGAMENTO = 2724.00;
export const META_TURNOVER      = 5.0;
export const FOLHA_ANUAL        = 21_600_000;
