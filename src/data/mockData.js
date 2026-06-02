// ─── MOCK DATA ───────────────────────────────────────────────────────────────
// Substitua as chamadas abaixo pelo seu Google Apps Script:
// fetch(`${GAS_URL}?tipo=headcount&mes=2025-06`)

export const UNIDADES = [
  "Aclimação",
  "Bela Vista",
  "Campo Belo",
  "Higienópolis",
  "Itaim Bibi",
  "Moema",
  "Pinheiros",
  "Santo André",
  "São Bernardo",
  "Tatuapé",
  "Administrativo",
];

export const MESES = [
  "Jan/25","Fev/25","Mar/25","Abr/25","Mai/25","Jun/25",
];

// Headcount por unidade por mês
export const headcountData = {
  "Aclimação":    { ideal: 28, historico: [24,25,26,27,26,27] },
  "Bela Vista":   { ideal: 32, historico: [30,31,30,32,31,30] },
  "Campo Belo":   { ideal: 25, historico: [22,23,23,24,22,21] },
  "Higienópolis": { ideal: 30, historico: [28,29,30,29,30,31] },
  "Itaim Bibi":   { ideal: 35, historico: [33,34,33,35,34,33] },
  "Moema":        { ideal: 29, historico: [26,27,28,27,26,24] },
  "Pinheiros":    { ideal: 31, historico: [29,30,31,30,29,28] },
  "Santo André":  { ideal: 27, historico: [25,26,25,27,26,25] },
  "São Bernardo": { ideal: 26, historico: [24,24,25,26,25,23] },
  "Tatuapé":      { ideal: 33, historico: [31,32,32,33,31,30] },
  "Administrativo":{ ideal: 18, historico: [17,17,18,18,18,18] },
};

// Turnover por unidade por mês (%)
export const turnoverData = {
  "Aclimação":    [4.2, 5.1, 3.8, 6.2, 7.1, 8.3],
  "Bela Vista":   [3.1, 2.9, 3.5, 4.0, 3.8, 3.2],
  "Campo Belo":   [8.5, 9.2, 7.8, 10.1, 11.3, 12.4],
  "Higienópolis": [2.8, 3.0, 2.5, 3.2, 2.9, 3.1],
  "Itaim Bibi":   [4.5, 4.2, 5.0, 4.8, 5.2, 4.9],
  "Moema":        [6.3, 7.0, 6.8, 8.2, 9.5, 11.2],
  "Pinheiros":    [3.8, 3.5, 4.2, 3.9, 4.1, 4.4],
  "Santo André":  [5.1, 4.8, 5.5, 5.0, 5.3, 5.8],
  "São Bernardo": [7.2, 8.0, 7.5, 9.0, 10.2, 9.8],
  "Tatuapé":      [4.0, 3.8, 4.5, 4.2, 4.0, 4.3],
  "Administrativo":[1.5, 1.0, 2.0, 1.8, 1.5, 1.2],
};

// Admissões e Desligamentos por unidade por mês
export const movimentacaoData = {
  "Aclimação":    { admissoes: [2,3,2,4,3,3], desligamentos: [1,2,1,3,4,4] },
  "Bela Vista":   { admissoes: [2,2,1,3,2,2], desligamentos: [1,1,2,2,2,1] },
  "Campo Belo":   { admissoes: [3,4,2,5,3,2], desligamentos: [2,3,2,4,5,5] },
  "Higienópolis": { admissoes: [1,2,1,2,1,2], desligamentos: [1,1,0,2,1,1] },
  "Itaim Bibi":   { admissoes: [3,3,4,3,4,3], desligamentos: [2,2,3,2,3,2] },
  "Moema":        { admissoes: [2,3,3,4,3,2], desligamentos: [2,3,2,4,5,5] },
  "Pinheiros":    { admissoes: [2,2,3,2,3,3], desligamentos: [2,1,2,2,3,2] },
  "Santo André":  { admissoes: [2,2,2,3,2,3], desligamentos: [2,2,2,2,2,3] },
  "São Bernardo": { admissoes: [2,2,2,3,2,1], desligamentos: [2,2,2,3,3,3] },
  "Tatuapé":      { admissoes: [3,3,3,3,2,3], desligamentos: [2,2,2,2,2,2] },
  "Administrativo":{ admissoes: [0,1,1,0,1,0], desligamentos: [0,1,0,0,0,0] },
};

// Motivo de desligamento (acumulado do ano, todos as unidades)
export const motivosDesligamento = [
  { motivo: "Pedido de demissão", qtd: 87, cor: "#D9B504" },
  { motivo: "Demissão sem justa causa", qtd: 52, cor: "#8C1414" },
  { motivo: "Demissão por justa causa", qtd: 11, cor: "#6B0000" },
  { motivo: "Fim de contrato / experiência", qtd: 23, cor: "#97A624" },
  { motivo: "Acordo", qtd: 14, cor: "#888" },
];

// % em experiência (<90 dias) por unidade – mês atual
export const emExperiencia = {
  "Aclimação":    { total: 27, experiencia: 7 },
  "Bela Vista":   { total: 30, experiencia: 4 },
  "Campo Belo":   { total: 21, experiencia: 8 },
  "Higienópolis": { total: 31, experiencia: 3 },
  "Itaim Bibi":   { total: 33, experiencia: 5 },
  "Moema":        { total: 24, experiencia: 9 },
  "Pinheiros":    { total: 28, experiencia: 4 },
  "Santo André":  { total: 25, experiencia: 5 },
  "São Bernardo": { total: 23, experiencia: 6 },
  "Tatuapé":      { total: 30, experiencia: 4 },
  "Administrativo":{ total: 18, experiencia: 1 },
};

// Custo médio de reposição por colaborador (R$)
export const CUSTO_REPOSICAO = 2800;

// Meta de turnover mensal (%)
export const META_TURNOVER = 5.0;
