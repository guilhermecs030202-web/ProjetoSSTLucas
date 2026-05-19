
export const INITIAL_STATE = {
  stats: {},
  empresas: [
    { id: 1, nome: 'Logística Beta LTDA', cnpj: '12.345.678/0001-90', setor: 'Serviço industrial', status: 'Ativa', dataCriacao: 'Jan 2026' },
    { id: 2, nome: 'Construtora Alpha S.A', cnpj: '98.765.432/0001-10', setor: 'Sistema de limpeza', status: 'Ativa', dataCriacao: 'Fev 2026' },
    { id: 3, nome: 'Tech Solutions', cnpj: '45.123.890/0001-55', setor: 'Sistema de limpeza', status: 'Inativa', dataCriacao: 'Mar 2026' }
  ],
  funcionarios: [
    { id: 1, matricula: '10045', nome: 'João Silva', cpf: '111.222.333-44', cargo: 'Operador de Empilhadeira', empresaId: 1, empresaNome: 'Logística Beta LTDA' },
    { id: 2, matricula: '10046', nome: 'Ana Costa', cpf: '555.666.777-88', cargo: 'Engenheira Civil', empresaId: 2, empresaNome: 'Construtora Alpha S.A' }
  ],
  acidentesMes: [],
  rankPend: [],
  statusEmp: { regular: 0, atencao: 0, critico: 0 },
  alertas: [],
  documentos: [
    { id: 1, tipo: 'PGR', empresaId: 1, empresaNome: 'Logística Beta LTDA', dataEmissao: '10/01/2026', dataVencimento: '10/01/2027', status: 'Vencendo' },
    { id: 2, tipo: 'PCMSO', empresaId: 2, empresaNome: 'Construtora Alpha S.A', dataEmissao: '15/03/2026', dataVencimento: '15/03/2027', status: 'Válido' }
  ],
  treinamentos: [
    { id: 1, tipo: 'NR-35', funcionarioId: 1, funcionarioNome: 'João Silva', empresaNome: 'Logística Beta', dataRealizacao: '12/04/2026', dataVencimento: '12/04/2027', instrutor: '10045', status: 'Válido' }
  ],
  asos: [
    { id: 1, tipo: 'Admissional', funcionarioId: 1, funcionarioNome: 'João Silva', empresaNome: 'Logística Beta', dataRealizacao: '10/05/2026', dataVencimento: '10/05/2027', status: 'Vencendo', aptidao: 'Apto' }
  ],
  pendTipo: [],
  filters: {
    documentos: '',
    treinamentos: '',
    asos: '',
    acidentes: '',
    empresas: '',
    empresasSetor: '',
    funcionarios: '',
    treinamentosStatus: 'Todos os Status',
    asosAptidao: 'Todas as Aptidões',
    acidentesStatus: ''
  },
  acidentes: [
    { id: 1, data: '2026-04-10', hora: '14:30', funcionarioId: 3, funcionarioNome: 'Pedro Barros', empresaNome: 'Logística Beta LTDA', tipo: 'Tipico', catEmitida: true, status: 'CAT Emitida', descricao: 'Lesão leve na mão direita' }
  ],
  comprasEpi: [
    { id: 1, nf: '001.452', data: '2026-04-12', valorTotal: 1850.00, itens: [] }
  ],
  estoque: []
};

export let appState = JSON.parse(localStorage.getItem('sst_app_data')) || INITIAL_STATE;

if (!appState.acidentes) appState.acidentes = INITIAL_STATE.acidentes;

if (!appState.comprasEpi) appState.comprasEpi = INITIAL_STATE.comprasEpi;

if (!appState.estoque) appState.estoque = INITIAL_STATE.estoque || [];

if (!appState.documentos) appState.documentos = INITIAL_STATE.documentos;

if (!appState.treinamentos) appState.treinamentos = INITIAL_STATE.treinamentos;

if (!appState.asos) appState.asos = INITIAL_STATE.asos;

if (!appState.filters) appState.filters = INITIAL_STATE.filters;

if (appState.filters && appState.filters.empresasSetor === undefined) appState.filters.empresasSetor = '';

if (appState.filters && appState.filters.treinamentosStatus === undefined) appState.filters.treinamentosStatus = 'Todos os Status';

if (appState.filters && appState.filters.acidentesStatus === undefined) appState.filters.acidentesStatus = '';

if (!appState.stats) appState.stats = INITIAL_STATE.stats;

if (!appState.rankPend) appState.rankPend = INITIAL_STATE.rankPend;

if (!appState.acidentesMes) appState.acidentesMes = INITIAL_STATE.acidentesMes;

if (!appState.statusEmp) appState.statusEmp = INITIAL_STATE.statusEmp;

if (!appState.alertas) appState.alertas = INITIAL_STATE.alertas;

if (!appState.pendTipo) appState.pendTipo = INITIAL_STATE.pendTipo;

export let cartState = {
  items: [],
  nf: '',
  data: '',
  valorTotal: 0
};

export const saveState = () => {
  localStorage.setItem('sst_app_data', JSON.stringify(appState));
};

export const getFuncionarioCount = (empresaId) => {
  return appState.funcionarios.filter(f => f.empresaId == empresaId).length;
};

// saveState e getFuncionarioCount permanecem aqui por enquanto