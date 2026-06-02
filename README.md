# Quintal do Espeto · RH Dashboard

Dashboard de Turnover & Headcount — React + Vite + Tailwind CSS.

## Stack
- React 18 + Vite 6
- Tailwind CSS 3
- Deploy na Vercel via GitHub
- Dados: mock local → Google Apps Script (ver seção abaixo)

## Rodando localmente

```bash
npm install
npm run dev
```

## Deploy na Vercel

1. Suba este repositório no GitHub
2. Importe no Vercel (New Project → Import Git Repository)
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Deploy!

---

## Conectando ao Google Apps Script

### 1. Crie o Web App no Apps Script

```javascript
// Code.gs
function doGet(e) {
  const tipo = e.parameter.tipo;
  const mes  = e.parameter.mes; // ex: "2025-06"

  let dados;
  if (tipo === "headcount")    dados = getHeadcount(mes);
  if (tipo === "turnover")     dados = getTurnover(mes);
  if (tipo === "movimentacao") dados = getMovimentacao(mes);
  // etc.

  return ContentService
    .createTextOutput(JSON.stringify(dados))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Publique como Web App → acesso **Anyone**.

### 2. Substitua o mock em `src/data/mockData.js`

Crie um hook `src/hooks/useGASData.js`:

```javascript
const GAS_URL = "https://script.google.com/macros/s/SEU_ID/exec";

export async function fetchGAS(tipo, mes) {
  const res = await fetch(`${GAS_URL}?tipo=${tipo}&mes=${mes}`);
  return res.json();
}
```

### 3. Use no componente

```javascript
const [kpiData, setKpiData] = useState(null);

useEffect(() => {
  fetchGAS("headcount", "2025-06").then(setKpiData);
}, [mes]);
```

---

## Estrutura de Arquivos

```
src/
├── components/
│   ├── Sidebar.jsx        # Sidebar branca com nav
│   ├── HeaderBar.jsx      # Header fixo com filtros
│   ├── DashboardRH.jsx    # Página principal (KPIs, tabela, gráfico)
│   ├── KpiCard.jsx        # Card de KPI reutilizável
│   └── PainelDetalhe.jsx  # Painel lateral deslizante
├── data/
│   └── mockData.js        # 🔁 Substituir pelo GAS
├── utils/
│   └── calculos.js        # Funções de cálculo (turnover, HC, etc.)
├── App.jsx
├── main.jsx
└── index.css
```

## Paleta de Cores

| Cor | Hex | Uso |
|-----|-----|-----|
| Verde | `#97A624` | OK, dentro da meta |
| Vermelho | `#8C1414` | Crítico, alerta |
| Âmbar | `#D9B504` | Atenção |
| Preto | `#0D0D0D` | Headers, ativos |
| Off-white | `#FAFAF8` | Background |
