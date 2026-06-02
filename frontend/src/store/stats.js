import { appState, cartState, INITIAL_STATE, saveState, getFuncionarioCount } from './state.js';
import { formatDate } from '../utils/formatters.js';
import { calculateStatus } from '../utils/status.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const runLocalStats = () => {
  // ===== 1. Recalcular status baseado nas datas atuais =====
  if (appState.documentos) {
    appState.documentos.forEach(d => d.status = calculateStatus(d.dataVencimento));
  }
  if (appState.treinamentos) {
    appState.treinamentos.forEach(t => t.status = calculateStatus(t.dataVencimento));
  }
  if (appState.asos) {
    appState.asos.forEach(a => a.status = calculateStatus(a.dataVencimento));
  }

  // ===== 2. KPIs — Contagens reais =====
  const empresasAtivas = (appState.empresas || []).filter(e => e.status !== 'Inativa').length;
  appState.stats.empresas = empresasAtivas;
  appState.stats.funcionarios = (appState.funcionarios || []).length;

  // ===== 3. Pendências reais (Vencido + Vencendo) =====
  const docsPend = (appState.documentos || []).filter(d => d.status !== 'Válido').length;
  const treinPend = (appState.treinamentos || []).filter(t => t.status !== 'Válido').length;
  const asosPend = (appState.asos || []).filter(a => a.status !== 'Válido').length;
  appState.stats.pendencias = docsPend + treinPend + asosPend;

  // ===== 4. Pendências por Tipo (gráfico de barras empilhadas) =====
  appState.pendTipo = [
    { tipo: 'Documentos', val: docsPend, pct: Math.round((docsPend / (appState.stats.pendencias || 1)) * 100), cor: 'bg-indigo-500' },
    { tipo: 'ASOs', val: asosPend, pct: Math.round((asosPend / (appState.stats.pendencias || 1)) * 100), cor: 'bg-emerald-500' },
    { tipo: 'Treinamentos', val: treinPend, pct: Math.round((treinPend / (appState.stats.pendencias || 1)) * 100), cor: 'bg-amber-500' }
  ];

  // ===== 5. Acidentes no mês atual =====
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();
  const acidentesMesAtual = (appState.acidentes || []).filter(ac => {
    const d = new Date(ac.data);
    return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
  }).length;
  appState.stats.acidentesMes = acidentesMesAtual;

  // ===== 6. Gráfico: Acidentes por Mês (últimos 6 meses) =====
  const mesesNome = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const acidentesPorMes = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(anoAtual, mesAtual - i, 1);
    const m = d.getMonth();
    const a = d.getFullYear();
    const count = (appState.acidentes || []).filter(ac => {
      const ad = new Date(ac.data);
      return ad.getMonth() === m && ad.getFullYear() === a;
    }).length;
    acidentesPorMes.push({ mes: mesesNome[m], val: count });
  }
  appState.acidentesMes = acidentesPorMes;

  // ===== 7. Ranking: Empresas com mais pendências (Top 5) =====
  const pendPorEmpresa = {};
  // Contar docs pendentes por empresa
  (appState.documentos || []).filter(d => d.status !== 'Válido').forEach(d => {
    const key = d.empresaNome || 'Sem empresa';
    if (!pendPorEmpresa[key]) pendPorEmpresa[key] = { nome: key, val: 0, setor: '' };
    pendPorEmpresa[key].val++;
  });
  // Contar ASOs pendentes por empresa (via funcionário)
  (appState.asos || []).filter(a => a.status !== 'Válido').forEach(a => {
    const key = a.empresaNome || 'Sem empresa';
    if (!pendPorEmpresa[key]) pendPorEmpresa[key] = { nome: key, val: 0, setor: '' };
    pendPorEmpresa[key].val++;
  });
  // Contar treinamentos pendentes por empresa (via funcionário)
  (appState.treinamentos || []).filter(t => t.status !== 'Válido').forEach(t => {
    const key = t.empresaNome || 'Sem empresa';
    if (!pendPorEmpresa[key]) pendPorEmpresa[key] = { nome: key, val: 0, setor: '' };
    pendPorEmpresa[key].val++;
  });
  // Associar o setor de cada empresa
  Object.values(pendPorEmpresa).forEach(item => {
    const emp = (appState.empresas || []).find(e => e.nome.startsWith(item.nome) || item.nome.startsWith(e.nome));
    if (emp) item.setor = emp.setor;
  });
  appState.rankPend = Object.values(pendPorEmpresa)
    .sort((a, b) => b.val - a.val)
    .slice(0, 5);
  // Garantir ao menos 1 item para o gráfico não quebrar
  if (appState.rankPend.length === 0) {
    appState.rankPend = [{ nome: 'Nenhuma pendência', val: 0, setor: '-' }];
  }

  // ===== 8. Status das Empresas (Regular / Atenção / Crítico) =====
  let regular = 0, atencao = 0, critico = 0;
  (appState.empresas || []).forEach(emp => {
    // Contar pendências desta empresa
    const docsEmp = (appState.documentos || []).filter(d =>
      d.empresaId == emp.id && d.status !== 'Válido'
    ).length;
    const asosEmp = (appState.asos || []).filter(a => {
      const func = (appState.funcionarios || []).find(f => f.id == a.funcionarioId);
      return func && func.empresaId == emp.id && a.status !== 'Válido';
    }).length;
    const treinEmp = (appState.treinamentos || []).filter(t => {
      const func = (appState.funcionarios || []).find(f => f.id == t.funcionarioId);
      return func && func.empresaId == emp.id && t.status !== 'Válido';
    }).length;
    const totalPendEmp = docsEmp + asosEmp + treinEmp;

    // Verificar se tem acidentes recentes (últimos 3 meses)
    const acidentesRecentes = (appState.acidentes || []).filter(ac => {
      if (!ac.empresaNome) return false;
      const matchEmp = ac.empresaNome.startsWith(emp.nome) || emp.nome.startsWith(ac.empresaNome);
      const dAc = new Date(ac.data);
      const tresMesesAtras = new Date();
      tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);
      return matchEmp && dAc >= tresMesesAtras;
    }).length;

    // Classificação:
    // Crítico: tem itens vencidos OU 2+ acidentes recentes
    const temVencido = (appState.documentos || []).some(d => d.empresaId == emp.id && d.status === 'Vencido') ||
      (appState.asos || []).some(a => {
        const func = (appState.funcionarios || []).find(f => f.id == a.funcionarioId);
        return func && func.empresaId == emp.id && a.status === 'Vencido';
      });
    if (temVencido || acidentesRecentes >= 2) {
      critico++;
    } else if (totalPendEmp > 0 || acidentesRecentes >= 1) {
      atencao++;
    } else {
      regular++;
    }
  });
  // Garantir que ao menos 1 apareça para o gráfico donut não quebrar
  if (regular === 0 && atencao === 0 && critico === 0) regular = 1;
  appState.statusEmp = { regular, atencao, critico };

  // ===== 9. Alertas Prioritários (itens vencidos e vencendo) =====
  const alertas = [];
  // Documentos vencidos/vencendo
  (appState.documentos || []).filter(d => d.status !== 'Válido').forEach(d => {
    const emp = (appState.empresas || []).find(e => e.id == d.empresaId);
    alertas.push({
      ent: d.empresaNome || 'Empresa',
      desc: `${d.tipo} ${d.status === 'Vencido' ? 'vencido' : 'vencendo em breve'}`,
      tipo: 'Documento',
      cor: 'red',
      data: formatDate(d.dataVencimento),
      setor: emp ? emp.setor : '-'
    });
  });
  // ASOs vencidos/vencendo
  (appState.asos || []).filter(a => a.status !== 'Válido').forEach(a => {
    const func = (appState.funcionarios || []).find(f => f.id == a.funcionarioId);
    alertas.push({
      ent: a.funcionarioNome || 'Funcionário',
      desc: `ASO ${a.tipo} ${a.status === 'Vencido' ? 'vencido' : 'vencendo em breve'}`,
      tipo: 'ASO',
      cor: 'emerald',
      data: formatDate(a.dataVencimento),
      setor: func ? ((appState.empresas || []).find(e => e.id == func.empresaId) || {}).setor || '-' : '-'
    });
  });
  // Treinamentos vencidos/vencendo
  (appState.treinamentos || []).filter(t => t.status !== 'Válido').forEach(t => {
    const func = (appState.funcionarios || []).find(f => f.id == t.funcionarioId);
    alertas.push({
      ent: t.funcionarioNome || 'Funcionário',
      desc: `${t.tipo} ${t.status === 'Vencido' ? 'vencido' : 'vencendo em breve'}`,
      tipo: 'Treinamento',
      cor: 'amber',
      data: formatDate(t.dataVencimento),
      setor: func ? ((appState.empresas || []).find(e => e.id == func.empresaId) || {}).setor || '-' : '-'
    });
  });
  // Ordenar: Vencidos primeiro (por data mais antiga)
  alertas.sort((a, b) => {
    const parseAlertDate = (str) => {
      if (!str || str === '-') return new Date(9999, 0);
      const [d, m, y] = str.split('/');
      return new Date(y, m - 1, d);
    };
    return parseAlertDate(a.data) - parseAlertDate(b.data);
  });
  appState.alertas = alertas;
};

export const updateStats = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1500);

  try {
    const response = await fetch(`${BASE_URL}/stats`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    appState.stats = data.stats;
    appState.pendTipo = data.pendTipo;
    appState.acidentesMes = data.acidentesMes;
    appState.rankPend = data.rankPend;
    appState.statusEmp = data.statusEmp;
    appState.alertas = data.alertas;
  } catch (error) {
    console.warn("Falha ao buscar estatísticas do banco de dados. Executando cálculo local:", error);
    runLocalStats();
  } finally {
    saveState();
  }
};