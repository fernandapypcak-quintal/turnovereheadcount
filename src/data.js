export const MESES = ['Jan/26','Fev/26','Mar/26','Abr/26','Mai/26','Jun/26']

export const UNIDADES = [
  'Carinãs','Chácara','Figueiras','Lapa','Madalena',
  'Mariana','Pavão','Perdizes','Santana','Tatuapé','Holding'
]

export const HC_IDEAL = {
  'Carinãs':57,'Chácara':19,'Figueiras':56,'Lapa':22,'Madalena':24,
  'Mariana':22,'Pavão':20,'Perdizes':21,'Santana':52,'Tatuapé':61,'Holding':50
}

// HC real por mês [Jan..Jun]
export const HC_REAL = {
  'Carinãs':  [50,51,49,48,46,45],
  'Chácara':  [18,18,17,17,17,17],
  'Figueiras':[48,47,46,46,45,45],
  'Lapa':     [20,20,19,18,18,18],
  'Madalena': [20,19,18,17,16,16],
  'Mariana':  [21,21,20,20,20,20],
  'Pavão':    [20,20,20,20,20,20],
  'Perdizes': [19,18,18,18,18,18],
  'Santana':  [40,39,38,37,36,35],
  'Tatuapé':  [50,49,48,47,46,45],
  'Holding':  [42,42,41,41,41,41],
}

// Turnover % por mês
export const TURNOVER = {
  'Carinãs':  [5.2,6.1,5.8,7.2,8.3,7.1],
  'Chácara':  [3.1,2.9,3.5,4.0,3.8,3.2],
  'Figueiras':[6.5,7.2,6.8,8.1,9.3,8.4],
  'Lapa':     [4.2,4.5,3.8,5.0,4.7,4.3],
  'Madalena': [7.3,8.0,7.5,9.2,10.5,9.8],
  'Mariana':  [2.8,3.0,2.5,3.2,2.9,3.1],
  'Pavão':    [3.5,3.2,4.0,3.8,3.5,3.8],
  'Perdizes': [4.8,4.5,5.2,4.9,5.0,4.7],
  'Santana':  [8.5,9.2,8.8,10.1,11.3,10.2],
  'Tatuapé':  [5.8,6.2,5.9,7.0,8.1,7.5],
  'Holding':  [1.5,1.0,2.0,1.8,1.5,1.2],
}

// Admissões por mês
export const ADMISSOES = {
  'Carinãs':  [3,4,3,4,3,3],
  'Chácara':  [1,1,1,2,1,1],
  'Figueiras':[3,4,3,4,3,3],
  'Lapa':     [2,2,1,2,2,2],
  'Madalena': [2,2,2,2,2,1],
  'Mariana':  [1,1,1,1,1,1],
  'Pavão':    [1,1,2,1,1,2],
  'Perdizes': [2,1,2,2,2,2],
  'Santana':  [4,4,3,4,4,3],
  'Tatuapé':  [4,4,3,4,4,4],
  'Holding':  [1,0,1,1,0,1],
}

// Desligamentos por mês
export const DESLIGAMENTOS = {
  'Carinãs':  [2,3,3,4,5,4],
  'Chácara':  [1,1,1,1,1,1],
  'Figueiras':[3,4,3,4,5,4],
  'Lapa':     [1,2,2,2,2,2],
  'Madalena': [2,3,3,3,3,3],
  'Mariana':  [1,1,1,1,1,1],
  'Pavão':    [1,1,1,1,1,1],
  'Perdizes': [2,2,2,2,2,2],
  'Santana':  [3,4,4,5,5,5],
  'Tatuapé':  [3,4,4,5,5,5],
  'Holding':  [0,1,0,0,1,0],
}

// Em experiência <90 dias (mês atual)
export const EM_EXP = {
  'Carinãs':8,'Chácara':3,'Figueiras':9,'Lapa':4,'Madalena':5,
  'Mariana':3,'Pavão':3,'Perdizes':4,'Santana':8,'Tatuapé':9,'Holding':2
}

// Custo mensal R$ por mês
export const CUSTO_REAL = {
  'Carinãs':  [195420,193800,191200,189600,188900,187882],
  'Chácara':  [76800,75900,75200,74800,74500,74152],
  'Figueiras':[189600,187200,185800,184200,183500,182827],
  'Lapa':     [81200,80500,79800,79200,78600,78022],
  'Madalena': [72400,71800,70900,70100,69500,68853],
  'Mariana':  [88200,87800,87500,87200,87000,86783],
  'Pavão':    [69900,69800,69800,69717,69717,69717],
  'Perdizes': [76200,75500,74800,74200,73600,73098],
  'Santana':  [162000,157800,153200,151000,149000,147107],
  'Tatuapé':  [198200,195400,192800,190200,187000,183905],
  'Holding':  [168000,167000,166500,166000,165500,165000],
}

// Custo ideal (HC completo)
export const CUSTO_IDEAL = {
  'Carinãs':237984,'Chácara':82875,'Figueiras':227518,'Lapa':95360,
  'Madalena':103279,'Mariana':95461,'Pavão':69717,'Perdizes':85281,
  'Santana':218559,'Tatuapé':249294,'Holding':201220
}

export const MOTIVOS = [
  { label:'Pedido de demissão',           qtd:87, cor:'#D9B504' },
  { label:'Demissão sem justa causa',     qtd:52, cor:'#8C1414' },
  { label:'Demissão por justa causa',     qtd:11, cor:'#6B0000' },
  { label:'Fim de contrato/experiência',  qtd:23, cor:'#97A624' },
  { label:'Acordo',                       qtd:14, cor:'#888888' },
]

export const CUSTO_ADMISSAO   = 2514
export const CUSTO_DEMISSAO   = 2724
export const META_TURNOVER    = 5.0
export const FOLHA_MENSAL     = 1800000
