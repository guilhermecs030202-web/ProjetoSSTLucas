import './style.css';

// ==========================================
// 1. ESTADO GLOBAL E PERSISTÊNCIA (localStorage)
// ==========================================

const INITIAL_STATE = {
  stats: { empresas: 12, funcionarios: 248, pendencias: 19, acidentesMes: 5 },
  empresas: [
    { id: 1, nome: 'Logística Beta LTDA', cnpj: '12.345.678/0001-90', setor: 'Serviço industrial', status: 'Ativa', dataCriacao: 'Jan 2026' },
    { id: 2, nome: 'Construtora Alpha S.A', cnpj: '98.765.432/0001-10', setor: 'Sistema de limpeza', status: 'Ativa', dataCriacao: 'Fev 2026' },
    { id: 3, nome: 'Tech Solutions', cnpj: '45.123.890/0001-55', setor: 'Sistema de limpeza', status: 'Inativa', dataCriacao: 'Mar 2026' }
  ],
  funcionarios: [
    { id: 1, matricula: '10045', nome: 'João Silva', cpf: '111.222.333-44', cargo: 'Operador de Empilhadeira', empresaId: 1, empresaNome: 'Logística Beta LTDA' },
    { id: 2, matricula: '10046', nome: 'Ana Costa', cpf: '555.666.777-88', cargo: 'Engenheira Civil', empresaId: 2, empresaNome: 'Construtora Alpha S.A' }
  ],
  acidentesMes: [
    { mes: 'Dez', val: 3 }, { mes: 'Jan', val: 4 }, { mes: 'Fev', val: 6 },
    { mes: 'Mar', val: 4 }, { mes: 'Abr', val: 5 }, { mes: 'Mai', val: 5 }
  ],
  rankPend: [
    { nome: 'Logística Beta', val: 8, setor: 'Serviço industrial' }, { nome: 'Construtora Alpha', val: 5, setor: 'Sistema de limpeza' },
    { nome: 'Indústria Delta', val: 4, setor: 'Serviço industrial' }, { nome: 'Transportes Gama', val: 3, setor: 'Serviço industrial' },
    { nome: 'Comércio Epsilon', val: 3, setor: 'Sistema de limpeza' }
  ],
  statusEmp: { regular: 7, atencao: 3, critico: 2 },
  alertas: [
    { ent: 'Logística Beta', desc: 'PGR vencido', tipo: 'Documento', cor: 'red', data: '15/05/2026', setor: 'Serviço industrial' },
    { ent: 'João Silva', desc: 'ASO Admissional vencido', tipo: 'ASO', cor: 'emerald', data: '10/05/2026', setor: 'Serviço industrial' },
    { ent: 'Construtora Alpha', desc: 'NR-35 vencido', tipo: 'Treinamento', cor: 'amber', data: '12/05/2026', setor: 'Sistema de limpeza' },
    { ent: 'Indústria Delta', desc: 'PCMSO vencido', tipo: 'Documento', cor: 'red', data: '11/05/2026', setor: 'Serviço industrial' }
  ],
  documentos: [
    { id: 1, tipo: 'PGR', empresaId: 1, empresaNome: 'Logística Beta LTDA', dataEmissao: '10/01/2026', dataVencimento: '10/01/2027', status: 'Vencendo' },
    { id: 2, tipo: 'PCMSO', empresaId: 2, empresaNome: 'Construtora Alpha S.A', dataEmissao: '15/03/2026', dataVencimento: '15/03/2027', status: 'Válido' }
  ],
  treinamentos: [
    { id: 1, tipo: 'NR-35', funcionarioId: 1, funcionarioNome: 'João Silva', empresaNome: 'Logística Beta', dataRealizacao: '12/04/2026', dataVencimento: '12/04/2027', instrutor: 'Eng. Ricardo', status: 'Válido' }
  ],
  asos: [
    { id: 1, tipo: 'Admissional', funcionarioId: 1, funcionarioNome: 'João Silva', empresaNome: 'Logística Beta', dataRealizacao: '10/05/2026', dataVencimento: '10/05/2027', status: 'Vencendo' }
  ],
  pendTipo: [
    { tipo: 'Documentos', val: 9, pct: 47, cor: 'bg-indigo-500' },
    { tipo: 'ASOs', val: 6, pct: 32, cor: 'bg-emerald-500' },
    { tipo: 'Treinamentos', val: 4, pct: 21, cor: 'bg-amber-500' }
  ],
  acidentes: [
    { id: 1, data: '2026-04-10', hora: '14:30', funcionarioId: 3, funcionarioNome: 'Pedro Barros', empresaNome: 'Logística Beta LTDA', tipo: 'Tipico', status: 'CAT Emitida', descricao: 'Lesão leve na mão direita' }
  ],
  comprasEpi: [
    { id: 1, nf: '001.452', data: '2026-04-12', valorTotal: 1850.00, itens: [] }
  ]
};

// Carregar do localStorage ou usar o inicial
let appState = JSON.parse(localStorage.getItem('sst_app_data')) || INITIAL_STATE;

// Garantir que novas coleções existam no estado (migração simples)
if (!appState.acidentes) appState.acidentes = INITIAL_STATE.acidentes;
if (!appState.comprasEpi) appState.comprasEpi = INITIAL_STATE.comprasEpi;
if (!appState.documentos) appState.documentos = INITIAL_STATE.documentos;
if (!appState.treinamentos) appState.treinamentos = INITIAL_STATE.treinamentos;
if (!appState.asos) appState.asos = INITIAL_STATE.asos;

const saveState = () => {
  localStorage.setItem('sst_app_data', JSON.stringify(appState));
};

// Atalho para recalcular estatísticas básicas
const updateStats = () => {
  appState.stats.totalEmpresas = appState.empresas.length;
  appState.stats.totalFuncionarios = appState.funcionarios.length;

  // Calcular pendências reais
  const docsPend = appState.documentos.filter(d => d.status !== 'Válido').length;
  const treinPend = appState.treinamentos.filter(t => t.status !== 'Válido').length;
  const asosPend = appState.asos.filter(a => a.status !== 'Válido').length;

  appState.stats.pendencias = docsPend + treinPend + asosPend;

  // Atualizar ranking de pendências por tipo
  appState.pendTipo = [
    { tipo: 'Documentos', val: docsPend, pct: Math.round((docsPend / (appState.stats.pendencias || 1)) * 100), cor: 'bg-indigo-500' },
    { tipo: 'ASOs', val: asosPend, pct: Math.round((asosPend / (appState.stats.pendencias || 1)) * 100), cor: 'bg-emerald-500' },
    { tipo: 'Treinamentos', val: treinPend, pct: Math.round((treinPend / (appState.stats.pendencias || 1)) * 100), cor: 'bg-amber-500' }
  ];

  saveState();
};

const getFuncionarioCount = (empresaId) => {
  return appState.funcionarios.filter(f => f.empresaId == empresaId).length;
};

// ==========================================
// 2. FUNÇÕES DE RENDERIZAÇÃO (VIEWS) PREMIUM
// ==========================================

const renderDashboard = () => {
  const maxP = Math.max(...appState.rankPend.map(r => r.val));
  const maxA = Math.max(...appState.acidentesMes.map(a => a.val));
  const tot = appState.statusEmp.regular + appState.statusEmp.atencao + appState.statusEmp.critico;
  const pR = Math.round(appState.statusEmp.regular / tot * 100), pA = Math.round(appState.statusEmp.atencao / tot * 100), pC = 100 - pR - pA;
  const ra = 54, ci = 2 * Math.PI * ra, seg1 = ci * pR / 100, seg2 = ci * pA / 100, seg3 = ci * pC / 100;
  return `
    <div class="p-10 max-w-7xl mx-auto">
      <div class="mb-10"><h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Visão Geral</h1><p class="text-slate-500 mt-1">Acompanhe os principais indicadores de Segurança do Trabalho.</p></div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all group cursor-pointer"><div class="flex items-center justify-between mb-3"><div class="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg></div><span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Todas ativas</span></div><p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Empresas Ativas</p><p class="text-3xl font-black text-slate-900 mt-1">${appState.stats.empresas}</p></div>
        <div class="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all group cursor-pointer"><div class="flex items-center justify-between mb-3"><div class="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></div><span class="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Ativos</span></div><p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Funcionários</p><p class="text-3xl font-black text-slate-900 mt-1">${appState.stats.funcionarios}</p></div>
        <div class="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all group cursor-pointer relative overflow-hidden"><div class="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-bl-[80px]"></div><div class="flex items-center justify-between mb-3 relative z-10"><div class="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div></div><p class="text-xs font-bold text-slate-400 uppercase tracking-wider relative z-10">Pendências Totais</p><p class="text-3xl font-black text-slate-900 mt-1 relative z-10">${appState.stats.pendencias}</p><p class="text-[10px] text-slate-400 relative z-10">Docs, ASOs e Treinamentos</p></div>
        <div class="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all group cursor-pointer relative overflow-hidden"><div class="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-bl-[80px]"></div><div class="flex items-center justify-between mb-3 relative z-10"><div class="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div></div><p class="text-xs font-bold text-slate-400 uppercase tracking-wider relative z-10">Acidentes no Mês</p><p class="text-3xl font-black text-slate-900 mt-1 relative z-10">${appState.stats.acidentesMes}</p><p class="text-[10px] text-slate-400 relative z-10">Média: ${(appState.stats.acidentesMes / appState.stats.empresas).toFixed(1)} por empresa</p></div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"><h3 class="text-sm font-bold text-slate-900 mb-1">Acidentes por Mês</h3><p class="text-xs text-slate-400 mb-5">Últimos 6 meses</p><div class="flex items-end justify-between gap-2 h-36">${appState.acidentesMes.map(a => '<div class="flex-1 flex flex-col items-center gap-1"><span class="text-xs font-bold text-slate-700">' + a.val + '</span><div class="w-full bg-indigo-500 rounded-t-lg hover:bg-indigo-600 transition-colors" style="height:' + Math.max(a.val / maxA * 100, 10) + '%"></div><span class="text-[10px] text-slate-400 mt-1">' + a.mes + '</span></div>').join('')}</div></div>
        <div class="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"><h3 class="text-sm font-bold text-slate-900 mb-1">Empresas com Mais Pendências</h3><p class="text-xs text-slate-400 mb-5">Top 5</p><div class="space-y-3">${appState.rankPend.map(r => '<div class="flex items-center gap-3"><div class="w-32 shrink-0"><p class="text-xs font-semibold text-slate-700 truncate">' + r.nome + '</p><p class="text-[9px] text-slate-400 uppercase font-bold">' + r.setor + '</p></div><div class="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden"><div class="bg-indigo-500 h-full rounded-full" style="width:' + r.val / maxP * 100 + '%"></div></div><span class="text-xs font-bold text-slate-800 w-5 text-right">' + r.val + '</span></div>').join('')}</div></div>
        <div class="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"><h3 class="text-sm font-bold text-slate-900 mb-1">Status das Empresas</h3><p class="text-xs text-slate-400 mb-4">Situação regulatória</p><div class="flex items-center justify-center gap-6"><div class="relative w-32 h-32"><svg viewBox="0 0 120 120" class="w-full h-full -rotate-90"><circle cx="60" cy="60" r="${ra}" fill="none" stroke="#10b981" stroke-width="12" stroke-dasharray="${seg1} ${ci - seg1}" stroke-dashoffset="0"/><circle cx="60" cy="60" r="${ra}" fill="none" stroke="#f59e0b" stroke-width="12" stroke-dasharray="${seg2} ${ci - seg2}" stroke-dashoffset="-${seg1}"/><circle cx="60" cy="60" r="${ra}" fill="none" stroke="#ef4444" stroke-width="12" stroke-dasharray="${seg3} ${ci - seg3}" stroke-dashoffset="-${seg1 + seg2}"/></svg><div class="absolute inset-0 flex items-center justify-center"><span class="text-lg font-black text-slate-800">${tot}</span></div></div><div class="space-y-2.5"><div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-emerald-500"></div><div><p class="text-xs font-bold text-slate-700">Regular</p><p class="text-[10px] text-slate-400">${appState.statusEmp.regular} (${pR}%)</p></div></div><div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-amber-500"></div><div><p class="text-xs font-bold text-slate-700">Atenção</p><p class="text-[10px] text-slate-400">${appState.statusEmp.atencao} (${pA}%)</p></div></div><div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-red-500"></div><div><p class="text-xs font-bold text-slate-700">Crítico</p><p class="text-[10px] text-slate-400">${appState.statusEmp.critico} (${pC}%)</p></div></div></div></div></div>
      </div>
      <div class="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div class="xl:col-span-3 bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"><div class="p-5 border-b border-slate-100 flex items-center gap-2"><h3 class="text-sm font-bold text-slate-900">Alertas Prioritários</h3><span class="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">${appState.alertas.length}</span></div><div class="divide-y divide-slate-50">${appState.alertas.map(a => '<div class="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/50 transition-colors"><div class="w-2 h-2 rounded-full shrink-0 ' + (a.tipo === "Documento" ? "bg-red-500" : a.tipo === "ASO" ? "bg-emerald-500" : a.tipo === "Treinamento" ? "bg-amber-500" : "bg-indigo-500") + '"></div><div class="w-36 shrink-0"><p class="text-sm font-bold text-indigo-600 truncate">' + a.ent + '</p><p class="text-[9px] text-slate-400 uppercase font-bold">' + a.setor + '</p></div><span class="text-sm text-slate-600 flex-1 truncate">' + a.desc + '</span><span class="text-[10px] font-bold text-white px-2 py-0.5 rounded ' + (a.tipo === "Documento" ? "bg-red-500" : a.tipo === "ASO" ? "bg-emerald-500" : a.tipo === "Treinamento" ? "bg-amber-500" : "bg-indigo-500") + '">' + a.tipo + '</span><span class="text-xs text-slate-400 whitespace-nowrap">' + a.data + '</span></div>').join('')}</div></div>
        <div class="xl:col-span-2 bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"><div class="p-5 border-b border-slate-100"><h3 class="text-sm font-bold text-slate-900">Pendências por Tipo</h3></div><div class="p-5 space-y-4">${appState.pendTipo.map(p => '<div class="flex items-center gap-3"><span class="text-sm font-semibold text-slate-700 w-28">' + p.tipo + '</span><div class="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden"><div class="' + p.cor + ' h-full rounded-full" style="width:' + p.pct + '%"></div></div><span class="text-sm font-bold text-slate-800 w-6 text-right">' + p.val + '</span><span class="text-xs text-slate-400 w-10 text-right">(' + p.pct + '%)</span></div>').join('')}<div class="flex items-center gap-3 pt-3 border-t border-slate-100"><span class="text-sm font-bold text-slate-900 w-28">Total</span><span class="flex-1 text-xs text-slate-400">Total de pendências</span><span class="text-sm font-black text-slate-900 w-6 text-right">${appState.stats.pendencias}</span><span class="text-xs text-slate-400 w-10 text-right">(100%)</span></div></div></div>
      </div>
    </div>
  `;
};

const renderEmpresas = () => {
  return `
    <div class="p-10 max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-10">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">Empresas</h1>
          <p class="text-slate-500 text-base">Gerencie o cadastro de empresas clientes.</p>
        </div>
        <button onclick="openModal(renderFormEmpresa())" class="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          Nova Empresa
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        
        <!-- Barra de Busca (Exemplo Visual) -->
        <div class="p-5 border-b border-slate-100 flex gap-4 bg-slate-50/50">
          <div class="relative flex-[2]">
            <svg class="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder="Buscar empresa por nome ou CNPJ..." class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm">
          </div>
          <div class="flex-1">
            <select class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm bg-white text-slate-600 font-medium">
              <option value="">Todos os Setores</option>
              <option value="limpeza">Sistema de limpeza</option>
              <option value="industrial">Serviço industrial</option>
            </select>
          </div>
          <button class="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            Filtrar
          </button>
        </div>

        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200/80">
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Razão Social</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">CNPJ / Setor</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Funcionários</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100/80">
            ${appState.empresas.map(emp => `
              <tr class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100">
                      ${emp.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p class="font-bold text-slate-900">${emp.nome}</p>
                      <p class="text-xs text-slate-500 mt-0.5">Criada em ${emp.dataCriacao}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <p class="text-slate-600 text-sm font-medium">${emp.cnpj}</p>
                  <p class="text-[10px] font-bold text-indigo-500 uppercase mt-0.5">${emp.setor}</p>
                </td>
                <td class="px-6 py-4 text-slate-600 text-sm">${getFuncionarioCount(emp.id)} ativos</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 ${emp.status === 'Ativa' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' : 'bg-slate-100 text-slate-600 border-slate-200'} rounded-md text-xs font-semibold border">
                    <div class="w-1.5 h-1.5 rounded-full ${emp.status === 'Ativa' ? 'bg-emerald-500' : 'bg-slate-400'}"></div>
                    ${emp.status}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="openModal(renderDetailsEmpresa(${emp.id}), 'max-w-4xl')" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Visualizar">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                    <button class="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Editar">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button onclick="handleDeleteEmpresa(${emp.id})" class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

const renderFuncionarios = () => {
  return `
    <div class="p-10 max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-10">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">Funcionários</h1>
          <p class="text-slate-500 text-base">Gerencie o cadastro de colaboradores.</p>
        </div>
        <button onclick="openModal(renderFormFuncionario())" class="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          Novo Funcionário
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        
        <!-- Barra de Busca -->
        <div class="p-5 border-b border-slate-100 flex gap-4 bg-slate-50/50">
          <div class="relative flex-1">
            <svg class="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder="Buscar funcionário por nome, CPF ou matrícula..." class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm">
          </div>
          <button class="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            Filtrar
          </button>
        </div>

        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200/80">
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Matrícula</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nome</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">CPF</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cargo</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100/80">
            ${appState.funcionarios.map(func => `
              <tr class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-6 py-4 text-slate-600 text-sm font-medium">#${func.matricula}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100">
                      ${func.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p class="font-bold text-slate-900">${func.nome}</p>
                      <p class="text-xs text-slate-500 mt-0.5">${func.empresaNome}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-slate-600 text-sm">${func.cpf}</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold border border-slate-200">
                    ${func.cargo}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="openModal(renderDetailsFuncionario(${func.id}), 'max-w-4xl')" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Visualizar">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                    <button class="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Editar">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button onclick="handleDeleteFuncionario(${func.id})" class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

const renderDocumentos = () => {
  return `
    <div class="p-10 max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-10">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">Documentos</h1>
          <p class="text-slate-500 text-base">Gerencie os programas e laudos das empresas.</p>
        </div>
        <button onclick="openModal(renderFormDocumento())" class="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          Novo Documento
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        
        <div class="p-5 border-b border-slate-100 flex gap-4 bg-slate-50/50">
          <div class="relative flex-1">
            <svg class="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder="Buscar documento por tipo ou empresa..." class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm">
          </div>
          <button class="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            Filtrar
          </button>
        </div>

        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200/80">
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo / Documento</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Empresa (Razão Social)</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Datas (Elab. / Rev.)</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Anexos</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100/80">
            ${(appState.documentos || []).map(doc => `
              <tr class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl ${doc.tipo === 'PGR' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-orange-50 text-orange-600 border-orange-100'} flex items-center justify-center border">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <div>
                      <p class="font-bold text-slate-900">${doc.tipo}</p>
                      <p class="text-xs text-slate-500 mt-0.5">${doc.tipo === 'PGR' ? 'Gerenciamento de Riscos' : 'Controle Médico e Saúde'}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-slate-700 text-sm font-medium">${doc.empresaNome}</td>
                <td class="px-6 py-4">
                  <p class="text-sm text-slate-700"><span class="text-slate-400">E:</span> ${doc.dataEmissao}</p>
                  <p class="text-sm ${doc.status === 'Vencendo' || doc.status === 'Vencido' ? 'text-red-600' : 'text-emerald-600'} font-medium mt-0.5"><span class="text-slate-400">R:</span> ${doc.dataVencimento}</p>
                </td>
                <td class="px-6 py-4 text-center">
                  <button class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors" title="Ver PDF anexado">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                  </button>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="openModal(renderDetailsDocumento(), 'max-w-2xl')" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Visualizar">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                    <button class="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Editar">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button onclick="handleDeleteDocumento(${doc.id})" class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

const actionIcons = `
  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
    <button class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Visualizar">
      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
    </button>
    <button class="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Editar">
      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
    </button>
    <button class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
    </button>
  </div>
`;

const renderTreinamentos = () => {
  return `
    <div class="p-10 max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-10">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">Treinamentos</h1>
          <p class="text-slate-500 text-base">Controle de capacitações (NRs) dos funcionários.</p>
        </div>
        <button onclick="openModal(renderFormTreinamento())" class="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          Registrar Treinamento
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        
        <!-- Barra de Busca -->
        <div class="p-5 border-b border-slate-100 flex gap-4 bg-slate-50/50">
          <div class="relative flex-1">
            <svg class="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder="Buscar por tipo de treinamento ou instrutor..." class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm">
          </div>
          <select class="pl-4 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm bg-white text-slate-600 font-medium">
            <option>Todos os Status</option>
            <option>Válido</option>
            <option>Vencendo</option>
            <option>Vencido</option>
          </select>
        </div>

        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200/80">
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo (NR)</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Funcionário</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Datas (Realiz. / Venc.)</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Instrutor</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100/80">
            ${(appState.treinamentos || []).map(trei => `
              <tr class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm border border-purple-100">
                      ${trei.tipo.replace('NR-', '')}
                    </div>
                    <div>
                      <p class="font-bold text-slate-900">${trei.tipo}</p>
                      <p class="text-xs text-slate-500 mt-0.5">${trei.tipo === 'NR-35' ? 'Trabalho em Altura' : 'Segurança do Trabalho'}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <p class="font-bold text-slate-900 text-sm">${trei.funcionarioNome}</p>
                  <p class="text-xs text-slate-500">${trei.empresaNome}</p>
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm text-slate-700"><span class="text-slate-400">R:</span> ${trei.dataRealizacao}</p>
                  <p class="text-sm text-slate-500 mt-0.5"><span class="text-slate-400">V:</span> ${trei.dataVencimento}</p>
                </td>
                <td class="px-6 py-4 text-slate-600 text-sm font-medium">${trei.instrutor}</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-1 ${trei.status === 'Válido' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'} rounded-md text-xs font-semibold border">
                    ${trei.status}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="openModal(renderDetailsTreinamento(), 'max-w-2xl')" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Visualizar">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                    <button class="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Editar">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button onclick="handleDeleteTreinamento(${trei.id})" class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

const renderAsos = () => {
  return `
    <div class="p-10 max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-10">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">ASOs</h1>
          <p class="text-slate-500 text-base">Controle de Atestados de Saúde Ocupacional.</p>
        </div>
        <button onclick="openModal(renderFormAso())" class="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          Registrar ASO
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        
        <!-- Barra de Busca -->
        <div class="p-5 border-b border-slate-100 flex gap-4 bg-slate-50/50">
          <div class="relative flex-1">
            <svg class="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder="Buscar por funcionário ou tipo de ASO..." class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm">
          </div>
          <select class="pl-4 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm bg-white text-slate-600 font-medium">
            <option>Todas as Aptidões</option>
            <option>Apto</option>
            <option>Inapto</option>
          </select>
        </div>

        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200/80">
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo de ASO</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Funcionário</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Datas (Realiz. / Valid.)</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Aptidão</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100/80">
            ${(appState.asos || []).map(aso => `
              <tr class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-6 py-4">
                  <p class="font-bold text-slate-900">${aso.tipo}</p>
                  <p class="text-xs text-slate-500 mt-0.5">Renovação anual</p>
                </td>
                <td class="px-6 py-4">
                  <p class="font-bold text-slate-900 text-sm">${aso.funcionarioNome}</p>
                  <p class="text-xs text-slate-500">${aso.empresaNome}</p>
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm text-slate-700"><span class="text-slate-400">R:</span> ${aso.dataRealizacao}</p>
                  <p class="text-sm ${aso.status === 'Vencendo' ? 'text-amber-600' : 'text-emerald-600'} font-medium mt-0.5"><span class="text-slate-400">V:</span> ${aso.dataVencimento}</p>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-1 ${aso.status === 'Válido' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'} rounded-md text-xs font-semibold border">
                    ${aso.status === 'Válido' ? 'APTO' : aso.status.toUpperCase()}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="openModal(renderDetailsAso(), 'max-w-2xl')" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Visualizar">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                    <button class="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Editar">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button onclick="handleDeleteASO(${aso.id})" class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

const renderEpis = () => {
  return `
    <div class="p-10 max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-10">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">Gestão de EPIs</h1>
          <p class="text-slate-500 text-base">Histórico de compras e notas fiscais por empresa.</p>
        </div>
        <button onclick="openModal(renderFormEpi(), 'max-w-4xl')" class="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          Registrar Compra (NF)
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="p-5 border-b border-slate-100 flex gap-4 bg-slate-50/50">
          <select class="pl-4 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm bg-white text-slate-600 font-medium">
            <option>Mês Atual (Abril 2026)</option>
            <option>Março 2026</option>
          </select>
          <div class="relative flex-1">
            <svg class="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder="Buscar por Nº da Nota Fiscal..." class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm">
          </div>
        </div>
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200/80">
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nº Nota Fiscal</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data da Compra</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Valor Total</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100/80">
            ${(appState.comprasEpi || []).map(compra => `
              <tr class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <div>
                      <p class="font-bold text-slate-900">NF-e ${compra.nf}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-slate-700 text-sm">${compra.data.split('-').reverse().join('/')}</td>
                <td class="px-6 py-4 text-slate-900 font-bold text-sm">R$ ${compra.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="openModal(renderDetailsEpi(), 'max-w-4xl')" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Visualizar">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                    <button class="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Editar">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button onclick="handleDeleteCompraEpi(${compra.id})" class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

const renderAcidentes = () => {
  return `
    <div class="p-10 max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-10">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">Registro de Acidentes</h1>
          <p class="text-slate-500 text-base">Histórico de ocorrências e emissão de Comunicação de Acidente de Trabalho (CAT).</p>
        </div>
        <button onclick="openModal(renderFormAcidente(), 'max-w-4xl')" class="bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-red-600/20 hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          Registrar Novo Acidente
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        
        <!-- Barra de Busca -->
        <div class="p-5 border-b border-slate-100 flex gap-4 bg-slate-50/50">
          <div class="relative flex-1">
            <svg class="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder="Buscar por funcionário ou empresa..." class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm">
          </div>
          <select class="pl-4 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm bg-white text-slate-600 font-medium">
            <option>Todos os Status</option>
            <option>CAT Emitida</option>
            <option>Pendente</option>
          </select>
        </div>

        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200/80">
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data / Hora</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Funcionário Envolvido</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Empresa</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status CAT</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100/80">
            ${(appState.acidentes || []).map(acid => `
              <tr class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-6 py-4">
                  <p class="font-bold text-slate-900">${acid.data.split('-').reverse().join('/')}</p>
                  <p class="text-xs text-slate-500 mt-0.5">${acid.hora}h</p>
                </td>
                <td class="px-6 py-4">
                  <p class="font-semibold text-slate-800 text-sm">${acid.funcionarioNome}</p>
                  <p class="text-xs text-slate-500 mt-0.5">${acid.descricao}</p>
                </td>
                <td class="px-6 py-4 text-slate-700 text-sm">${acid.empresaNome}</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-bold border border-amber-200">${acid.tipo}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-1 ${acid.status === 'CAT Emitida' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-700 border-slate-200'} rounded-md text-xs font-semibold border">
                    ${acid.status}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Gerar PDF da CAT">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </button>
                    <button onclick="openModal(renderDetailsAcidente(), 'max-w-4xl')" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Visualizar Detalhes">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                    <button onclick="handleDeleteAcidente(${acid.id})" class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

// ==========================================
// 3. CONTROLE DE MODAIS (FORMULÁRIOS)
// ==========================================

const openModal = (htmlContent, widthClass = 'max-w-lg') => {
  const container = document.getElementById('modal-container');
  const content = document.getElementById('modal-content');

  content.innerHTML = htmlContent;

  // Limpar classes de largura anteriores e aplicar a nova
  content.classList.remove('max-w-sm', 'max-w-md', 'max-w-lg', 'max-w-xl', 'max-w-2xl', 'max-w-3xl', 'max-w-4xl', 'max-w-5xl');
  content.classList.add(widthClass);

  container.classList.remove('opacity-0', 'pointer-events-none');
  content.classList.remove('scale-95');
};

const closeModal = () => {
  const container = document.getElementById('modal-container');
  const content = document.getElementById('modal-content');

  container.classList.add('opacity-0', 'pointer-events-none');
  content.classList.add('scale-95');

  setTimeout(() => {
    content.innerHTML = '';
  }, 300);
};

document.addEventListener('click', (e) => {
  if (e.target.id === 'modal-container') {
    closeModal();
  }
});

window.openModal = openModal;
window.closeModal = closeModal;

// Formulário: Nova Empresa
const renderFormEmpresa = () => {
  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100">
      <h3 class="text-xl font-bold text-slate-900">Nova Empresa</h3>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    <form id="form-empresa" class="p-6 space-y-5" onsubmit="window.handleSaveEmpresa(event)">
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">Razão Social</label>
        <input type="text" id="razao-social" name="razao-social" required placeholder="Ex: Construtora Alpha S.A" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900">
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">CNPJ</label>
        <input type="text" id="cnpj" name="cnpj" required placeholder="00.000.000/0000-00" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900">
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">Setor de Atuação</label>
        <select id="setor" name="setor" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900">
          <option value="">Selecione o setor...</option>
          <option value="limpeza">Sistema de limpeza</option>
          <option value="industrial">Serviço industrial</option>
        </select>
      </div>
      
      <div class="pt-4 flex items-center justify-end gap-3">
        <button type="button" onclick="closeModal()" class="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
          Cancelar
        </button>
        <button type="submit" class="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all">
          Salvar Empresa
        </button>
      </div>
    </form>
  `;
};
window.renderFormEmpresa = renderFormEmpresa;

// Formulário: Novo Funcionário
const renderFormFuncionario = () => {
  const empresasLimpeza = appState.empresas.filter(e => e.setor === 'Sistema de limpeza');
  const empresasIndustrial = appState.empresas.filter(e => e.setor === 'Serviço industrial');

  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100">
      <h3 class="text-xl font-bold text-slate-900">Novo Funcionário</h3>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    <form id="form-funcionario" class="p-6 space-y-4 max-h-[70vh] overflow-y-auto" onsubmit="window.handleSaveFuncionario(event)">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Matrícula</label>
          <input type="text" id="func-matricula" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">CPF</label>
          <input type="text" id="func-cpf" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
        </div>
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">Nome Completo</label>
        <input type="text" id="func-nome" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Data de Nascimento</label>
          <input type="date" id="func-nascimento" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Data de Admissão</label>
          <input type="date" id="func-admissao" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
        </div>
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">Cargo</label>
        <input type="text" id="func-cargo" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">Empresa</label>
        <select id="func-empresa" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
          <option value="">Selecione a empresa...</option>
          ${empresasIndustrial.length > 0 ? `<optgroup label="Serviço industrial">${empresasIndustrial.map(e => `<option value="${e.id}">${e.nome}</option>`).join('')}</optgroup>` : ''}
          ${empresasLimpeza.length > 0 ? `<optgroup label="Sistema de limpeza">${empresasLimpeza.map(e => `<option value="${e.id}">${e.nome}</option>`).join('')}</optgroup>` : ''}
        </select>
      </div>
      <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
        <button type="button" onclick="closeModal()" class="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancelar</button>
        <button type="submit" class="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all">Salvar Funcionário</button>
      </div>
    </form>
  `;
};
window.renderFormFuncionario = renderFormFuncionario;

// Formulário: Novo Documento
const renderFormDocumento = () => {
  const empresasLimpeza = appState.empresas.filter(e => e.setor === 'Sistema de limpeza');
  const empresasIndustrial = appState.empresas.filter(e => e.setor === 'Serviço industrial');

  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100">
      <h3 class="text-xl font-bold text-slate-900">Novo Documento</h3>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    <form id="form-documento" class="p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-hide" onsubmit="window.handleSaveDocumento(event)">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-sm font-semibold text-slate-700">Tipo de Documento</label>
            <button type="button" onclick="document.getElementById('novo-tipo-doc').classList.toggle('hidden')" class="text-[10px] uppercase tracking-wider font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md border border-indigo-100">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              Novo
            </button>
          </div>
          <select id="doc-tipo" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
            <option value="">Selecione...</option>
            <option value="PGR">PGR</option>
            <option value="PCMSO">PCMSO</option>
            <option value="LTCAT">LTCAT</option>
          </select>
          <!-- Área Oculta para Cadastrar Novo Tipo -->
          <div id="novo-tipo-doc" class="hidden mt-3 bg-indigo-50/50 border border-indigo-100/60 p-3 rounded-xl space-y-2 relative">
            <p class="text-[10px] font-bold text-indigo-800 uppercase tracking-wider mb-1">Cadastrar Novo Tipo</p>
            <input type="text" id="doc-novo-tipo-sigla" placeholder="Sigla (ex: AET)" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
            <input type="text" id="doc-novo-tipo-desc" placeholder="Descrição (ex: Análise Ergonômica)" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
          </div>
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Empresa</label>
          <select id="doc-empresa" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
            <option value="">Selecione...</option>
            ${empresasIndustrial.length > 0 ? `<optgroup label="Serviço industrial">${empresasIndustrial.map(e => `<option value="${e.id}">${e.nome}</option>`).join('')}</optgroup>` : ''}
            ${empresasLimpeza.length > 0 ? `<optgroup label="Sistema de limpeza">${empresasLimpeza.map(e => `<option value="${e.id}">${e.nome}</option>`).join('')}</optgroup>` : ''}
          </select>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Data de Elaboração</label>
          <input type="date" id="doc-elaboracao" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Data de Revisão</label>
          <input type="date" id="doc-revisao" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
        </div>
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">Observações</label>
        <textarea id="doc-obs" rows="3" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"></textarea>
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">Anexos (PDF)</label>
        <input type="file" id="doc-anexo" accept=".pdf" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer">
      </div>
      <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
        <button type="button" onclick="closeModal()" class="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancelar</button>
        <button type="submit" class="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all">Salvar Documento</button>
      </div>
    </form>
  `;
};
window.renderFormDocumento = renderFormDocumento;

// Formulário: Novo Treinamento
const renderFormTreinamento = () => {
  const empresas = appState.empresas;
  const funcionarios = appState.funcionarios;

  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100">
      <h3 class="text-xl font-bold text-slate-900">Registrar Treinamento</h3>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    <form id="form-treinamento" class="p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-hide" onsubmit="window.handleSaveTreinamento(event)">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-sm font-semibold text-slate-700">Tipo de Treinamento</label>
            <button type="button" onclick="document.getElementById('novo-tipo-treinamento').classList.toggle('hidden')" class="text-[10px] uppercase tracking-wider font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md border border-indigo-100">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              Novo
            </button>
          </div>
          <select id="trei-tipo" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
            <option value="">Selecione...</option>
            <option value="NR-35">NR-35 (Trabalho em Altura)</option>
            <option value="NR-10">NR-10 (Elétrica)</option>
            <option value="NR-33">NR-33 (Espaço Confinado)</option>
          </select>
          <!-- Área Oculta para Cadastrar Novo Tipo -->
          <div id="novo-tipo-treinamento" class="hidden mt-3 bg-indigo-50/50 border border-indigo-100/60 p-3 rounded-xl space-y-2 relative">
            <p class="text-[10px] font-bold text-indigo-800 uppercase tracking-wider mb-1">Cadastrar Novo Tipo</p>
            <input type="text" id="trei-novo-tipo-sigla" placeholder="Sigla/NR (ex: NR-12)" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
            <input type="text" id="trei-novo-tipo-desc" placeholder="Descrição (ex: Segurança em Máquinas)" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
          </div>
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Funcionário</label>
          <select id="trei-funcionario" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
            <option value="">Selecione...</option>
            ${empresas.map(emp => `
              <optgroup label="${emp.nome}">
                ${funcionarios.filter(f => f.empresaId == emp.id).map(f => `
                  <option value="${f.id}">${f.nome} - Mat: ${f.matricula}</option>
                `).join('')}
              </optgroup>
            `).join('')}
          </select>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Data de Realização</label>
          <input type="date" id="trei-realizacao" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Data de Vencimento</label>
          <input type="date" id="trei-vencimento" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
        </div>
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">Instrutor (Matrícula) <span class="text-slate-400 font-normal">- Opcional</span></label>
        <input type="text" id="trei-instrutor" placeholder="Ex: 90012" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">Observações</label>
        <textarea id="trei-obs" rows="2" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"></textarea>
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">Certificado (Anexo)</label>
        <input type="file" id="trei-anexo" accept=".pdf,.jpg,.png" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer">
      </div>
      <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
        <button type="button" onclick="closeModal()" class="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancelar</button>
        <button type="submit" class="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all">Salvar Treinamento</button>
      </div>
    </form>
  `;
};
window.renderFormTreinamento = renderFormTreinamento;

// Formulário: Novo ASO
const renderFormAso = () => {
  const empresas = appState.empresas;
  const funcionarios = appState.funcionarios;

  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100">
      <h3 class="text-xl font-bold text-slate-900">Registrar ASO</h3>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    <form id="form-aso" class="p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-hide" onsubmit="window.handleSaveAso(event)">
      
      <!-- Dados do Funcionario -->
      <div class="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 mb-4">
        <label class="block text-sm font-semibold text-indigo-900 mb-2">Selecionar Funcionário</label>
        <select id="aso-funcionario" required class="w-full px-4 py-2 bg-white border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm mb-3">
          <option value="">Selecione...</option>
          ${empresas.map(emp => `
            <optgroup label="${emp.nome}">
              ${funcionarios.filter(f => f.empresaId == emp.id).map(f => `
                <option value="${f.id}">${f.nome} - ${emp.nome}</option>
              `).join('')}
            </optgroup>
          `).join('')}
        </select>
        <div class="grid grid-cols-3 gap-3 text-xs text-indigo-800">
          <div><span class="font-bold">CPF:</span> Selecione...</div>
          <div><span class="font-bold">Cargo:</span> Selecione...</div>
          <div><span class="font-bold">Empresa:</span> Selecione...</div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Tipo de ASO</label>
          <select id="aso-tipo" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
            <option value="Admissional">Admissional</option>
            <option value="Periodico">Periódico</option>
            <option value="Demissional">Demissional</option>
            <option value="Retorno">Retorno ao Trabalho</option>
            <option value="Mudanca">Mudança de Risco</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Aptidão</label>
          <select id="aso-aptidao" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm text-slate-900 font-semibold">
            <option value="Apto">APTO</option>
            <option value="Inapto">INAPTO</option>
          </select>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Data de Realização</label>
          <input type="date" id="aso-realizacao" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Data de Validade</label>
          <input type="date" id="aso-vencimento" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
        </div>
      </div>

      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">Observações</label>
        <textarea id="aso-obs" rows="2" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"></textarea>
      </div>
      
      <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
        <button type="button" onclick="closeModal()" class="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancelar</button>
        <button type="submit" class="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all">Salvar ASO</button>
      </div>
    </form>
  `;
};
window.renderFormAso = renderFormAso;

// Formulário: Gestão de Compras (EPI/Uniforme) com Distribuição
const renderFormEpi = () => {
  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100">
      <h3 class="text-xl font-bold text-slate-900">Registrar Compra (EPIs / Uniformes)</h3>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    
    <div class="flex flex-col lg:flex-row h-[70vh]">
      <!-- Lateral Esquerda: Formulário da NF e Adição de Itens -->
      <div class="w-full lg:w-1/2 p-6 border-r border-slate-100 overflow-y-auto scrollbar-hide space-y-6">
        <div>
          <h4 class="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Dados da Nota Fiscal</h4>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Número da NF</label>
              <input type="text" placeholder="000.000" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Data da Compra</label>
              <input type="date" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100">
          <h4 class="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Adicionar Item</h4>
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Tipo de Item</label>
              <select class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
                <option>EPI - Equipamento de Proteção</option>
                <option>Uniforme</option>
              </select>
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div class="col-span-2">
                <label class="block text-xs font-semibold text-slate-700 mb-1">Descrição</label>
                <input type="text" placeholder="Ex: Bota de Segurança" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">CA <span class="font-normal text-slate-400">(Opc)</span></label>
                <input type="text" placeholder="12345" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Quantidade Total</label>
                <input type="number" value="1" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Valor Unitário (R$)</label>
                <input type="text" placeholder="0,00" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
              </div>
            </div>
            <button type="button" class="w-full mt-2 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors flex justify-center items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>

      <!-- Lateral Direita: Carrinho e Distribuição por Empresa -->
      <div class="w-full lg:w-1/2 flex flex-col bg-slate-50/40">
        <div class="p-6 flex-1 overflow-y-auto scrollbar-hide">
          <h4 class="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Itens da Compra (Carrinho)</h4>
          
          <!-- Item Mockado no Carrinho -->
          <div class="bg-white border border-slate-200 rounded-xl p-4 mb-4 shadow-sm">
            <div class="flex justify-between items-start mb-3">
              <div>
                <p class="font-bold text-sm text-slate-900">Luva de Vaqueta <span class="text-xs font-normal text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded ml-1">CA 4321</span></p>
                <p class="text-xs text-slate-500 mt-1">Qtd total: 50 pares | R$ 15,00 un</p>
              </div>
              <button class="text-slate-400 hover:text-red-500 p-1 rounded transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
            </div>
            
            <div class="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50">
              <p class="text-xs font-bold text-indigo-900 mb-2 uppercase tracking-wide">Distribuir entre as Empresas:</p>
              
              <div class="flex items-center gap-2 mb-3">
                <select class="flex-1 px-2 py-1.5 bg-white border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500">
                  <option value="">Selecione...</option>
                  <optgroup label="Serviço industrial">
                    <option>Logística Beta LTDA</option>
                  </optgroup>
                  <optgroup label="Sistema de limpeza">
                    <option>Construtora Alpha S.A</option>
                  </optgroup>
                </select>
                <input type="number" placeholder="Qtd" class="w-16 px-2 py-1.5 bg-white border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <button class="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-1.5 rounded text-xs font-bold transition-colors">OK</button>
              </div>

              <!-- Distribuiçao adicionada -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between text-xs py-1.5 border-t border-indigo-100/50 text-slate-700">
                  <span>Logística Beta LTDA</span>
                  <div class="flex items-center gap-2">
                    <span class="font-bold">30 un</span>
                    <button class="text-slate-400 hover:text-red-500"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                  </div>
                </div>
                <div class="flex items-center justify-between text-xs py-1.5 text-slate-700">
                  <span>Construtora Alpha S.A</span>
                  <div class="flex items-center gap-2">
                    <span class="font-bold">20 un</span>
                    <button class="text-slate-400 hover:text-red-500"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                  </div>
                </div>
              </div>

              <div class="mt-2 text-xs text-right font-bold text-emerald-600">Total distribuído: 50/50 ✓</div>
            </div>
          </div>
          <!-- Fim do Item -->
        </div>

        <!-- Footer do Carrinho -->
        <div class="p-6 bg-white border-t border-slate-100 flex flex-col justify-between">
          <div class="flex justify-between items-center mb-4">
            <span class="text-sm font-bold text-slate-500 uppercase tracking-wider">Valor Total NF:</span>
            <span class="text-2xl font-black text-indigo-600">R$ 750,00</span>
          </div>
          <div class="flex gap-3">
            <button onclick="closeModal()" class="flex-1 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancelar Compra</button>
            <button class="flex-1 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all">Salvar Nota Fiscal</button>
          </div>
        </div>
      </div>
    </div>
  `;
};
window.renderFormEpi = renderFormEpi;

// ==========================================
// MODAIS DE DETALHAMENTO (VISUALIZAÇÃO)
// ==========================================

const renderDetailsEmpresa = (id) => {
  const emp = appState.empresas.find(e => e.id == id);
  if (!emp) return '<div class="p-10 text-center font-bold text-slate-500">Empresa não encontrada.</div>';

  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
      <div>
        <h3 class="text-xl font-bold text-slate-900">${emp.nome}</h3>
        <div class="flex items-center gap-2 mt-1">
          <p class="text-sm text-slate-500">CNPJ: ${emp.cnpj}</p>
          <span class="text-[10px] font-bold px-1.5 py-0.5 ${emp.setor === 'Sistema de limpeza' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'} rounded uppercase">${emp.setor}</span>
        </div>
      </div>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    
    <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto scrollbar-hide bg-slate-50/50">
      
      <!-- Seção: Cargos e Quantitativos -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          Funções e Efetivo
        </h4>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span class="text-sm font-semibold text-slate-700">Engenheiro Civil</span>
            <span class="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-md">2</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span class="text-sm font-semibold text-slate-700">Mestre de Obras</span>
            <span class="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-md">1</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span class="text-sm font-semibold text-slate-700">Pedreiro</span>
            <span class="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-md">15</span>
          </div>
        </div>
      </div>

      <!-- Seção: Documentos -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Documentos Ativos
        </h4>
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm border border-emerald-100">PGR</div>
              <div>
                <p class="text-sm font-bold text-slate-900">Programa de Gerenciamento de Riscos</p>
                <p class="text-xs text-slate-500 mt-0.5">Válido até 15/03/2027</p>
              </div>
            </div>
            <button class="text-indigo-600 hover:text-indigo-800 text-sm font-bold px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100">Ver PDF</button>
          </div>
          <div class="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm border border-emerald-100">PCMSO</div>
              <div>
                <p class="text-sm font-bold text-slate-900">Controle Médico Ocupacional</p>
                <p class="text-xs text-slate-500 mt-0.5">Válido até 10/05/2026</p>
              </div>
            </div>
            <button class="text-indigo-600 hover:text-indigo-800 text-sm font-bold px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100">Ver PDF</button>
          </div>
        </div>
      </div>

      <!-- Seção: Quadro de Funcionários & CIPA -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          Quadro de Funcionários (Designação CIPA)
        </h4>
        <div class="overflow-x-auto border border-slate-100 rounded-xl">
          <table class="w-full text-left">
            <thead class="bg-slate-50">
              <tr class="border-b border-slate-100">
                <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Nome</th>
                <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Cargo</th>
                <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase text-center">Representante CIPA</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr class="hover:bg-slate-50/50">
                <td class="px-4 py-3 text-sm font-semibold text-slate-800">Ana Costa</td>
                <td class="px-4 py-3 text-sm text-slate-600">Engenheira Civil</td>
                <td class="px-4 py-3 text-center">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer" checked>
                    <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </td>
              </tr>
              <tr class="hover:bg-slate-50/50">
                <td class="px-4 py-3 text-sm font-semibold text-slate-800">Carlos Mendes</td>
                <td class="px-4 py-3 text-sm text-slate-600">Mestre de Obras</td>
                <td class="px-4 py-3 text-center">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer">
                    <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </td>
              </tr>
              <tr class="hover:bg-slate-50/50">
                <td class="px-4 py-3 text-sm font-semibold text-slate-800">Marcos Lima</td>
                <td class="px-4 py-3 text-sm text-slate-600">Pedreiro</td>
                <td class="px-4 py-3 text-center">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer">
                    <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
};
window.renderDetailsEmpresa = renderDetailsEmpresa;

const renderDetailsFuncionario = () => {
  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg border border-indigo-100">JS</div>
        <div>
          <h3 class="text-xl font-bold text-slate-900">João Silva</h3>
          <p class="text-sm text-slate-500 font-medium mt-0.5">Matrícula: #10045</p>
        </div>
      </div>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    
    <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto scrollbar-hide bg-slate-50/50">
      
      <!-- Dados Principais -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Dados Pessoais & Ocupacionais</h4>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">CPF:</span>
              <span class="font-semibold text-slate-900">111.222.333-44</span>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">Nascimento:</span>
              <span class="font-semibold text-slate-900">12/05/1990</span>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">Admissão:</span>
              <span class="font-semibold text-slate-900">01/02/2025</span>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">Cargo:</span>
              <span class="font-semibold text-slate-900">Operador de Empilhadeira</span>
            </div>
            <div class="flex justify-between pt-1">
              <span class="text-slate-500">Vínculo:</span>
              <span class="font-bold text-indigo-600">Logística Beta LTDA</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">ASO Atual</h4>
          <div class="flex-1 flex flex-col justify-center">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <p class="font-bold text-slate-900 text-lg">APTO</p>
                <p class="text-sm text-slate-500">Exame Periódico</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div>
                <span class="block text-xs text-slate-400 mb-0.5">Realização</span>
                <span class="font-semibold text-slate-700">15/02/2026</span>
              </div>
              <div>
                <span class="block text-xs text-slate-400 mb-0.5">Validade</span>
                <span class="font-semibold text-slate-700">15/02/2027</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Treinamentos -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          Treinamentos e Capacitações
        </h4>
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm border border-purple-100">35</div>
              <div>
                <p class="text-sm font-bold text-slate-900">NR-35 - Trabalho em Altura</p>
                <p class="text-xs text-slate-500 mt-0.5">Válido até 05/01/2027</p>
              </div>
            </div>
            <span class="inline-flex items-center px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-bold border border-emerald-200">Válido</span>
          </div>
          <div class="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm border border-amber-100">11</div>
              <div>
                <p class="text-sm font-bold text-slate-900">NR-11 - Op. de Empilhadeira</p>
                <p class="text-xs text-slate-500 mt-0.5">Válido até 20/05/2026</p>
              </div>
            </div>
            <span class="inline-flex items-center px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-bold border border-amber-200">Vencendo</span>
          </div>
        </div>
      </div>

      <!-- Acidentes (Placeholder) -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          Histórico de Acidentes (CAT)
        </h4>
        <div class="flex items-center justify-center p-6 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
          <div class="text-center">
            <svg class="w-8 h-8 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p class="text-sm font-semibold text-slate-600">Nenhum acidente registrado</p>
            <p class="text-xs text-slate-400 mt-1">Este funcionário não possui histórico de ocorrências.</p>
          </div>
        </div>
      </div>

    </div>
  `;
};
window.renderDetailsFuncionario = renderDetailsFuncionario;

const renderDetailsDocumento = () => {
  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-100">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        </div>
        <div>
          <h3 class="text-xl font-bold text-slate-900">PGR</h3>
          <p class="text-sm text-slate-500 font-medium mt-0.5">Programa de Gerenciamento de Riscos</p>
        </div>
      </div>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    
    <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto scrollbar-hide bg-slate-50/50">
      
      <!-- Detalhes do Documento -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Informações Gerais</h4>
        
        <div class="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
          <div>
            <span class="block text-slate-500 mb-1">Empresa Vinculada</span>
            <span class="font-bold text-indigo-600">Logística Beta LTDA</span>
          </div>
          <div>
            <span class="block text-slate-500 mb-1">Status</span>
            <span class="inline-flex items-center px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-bold border border-emerald-200">Válido</span>
          </div>
          <div>
            <span class="block text-slate-500 mb-1">Data de Elaboração</span>
            <span class="font-semibold text-slate-900">10/01/2026</span>
          </div>
          <div>
            <span class="block text-slate-500 mb-1">Data de Revisão</span>
            <span class="font-semibold text-slate-900">10/01/2027</span>
          </div>
        </div>
      </div>

      <!-- Observações -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Observações Adicionais</h4>
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p class="text-sm text-slate-700 leading-relaxed">Documento gerado após a última inspeção anual nas instalações do galpão principal. Atualizadas as medições de ruído e as recomendações ergonômicas para a equipe de separação de mercadorias.</p>
        </div>
      </div>

      <!-- Anexos -->
      <div class="bg-indigo-600 p-5 rounded-2xl shadow-[0_2px_10px_rgba(79,70,229,0.2)] text-white flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
          </div>
          <div>
            <p class="font-bold text-lg">PGR_Logistica_Beta_2026.pdf</p>
            <p class="text-indigo-200 text-sm">PDF • 2.4 MB</p>
          </div>
        </div>
        <button class="bg-white text-indigo-600 hover:bg-indigo-50 px-5 py-2.5 rounded-xl font-bold transition-colors shadow-sm">
          Baixar Arquivo
        </button>
      </div>

    </div>
  `;
};
window.renderDetailsDocumento = renderDetailsDocumento;

const renderDetailsTreinamento = () => {
  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg border border-purple-100">
          35
        </div>
        <div>
          <h3 class="text-xl font-bold text-slate-900">NR-35</h3>
          <p class="text-sm text-slate-500 font-medium mt-0.5">Trabalho em Altura</p>
        </div>
      </div>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    
    <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto scrollbar-hide bg-slate-50/50">
      
      <!-- Detalhes do Treinamento -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Informações do Aluno</h4>
          <div class="space-y-3 text-sm">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100">JS</div>
              <div>
                <p class="font-bold text-slate-900 text-base">João Silva</p>
                <p class="text-xs text-slate-500">Matrícula: #10045</p>
              </div>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">Cargo:</span>
              <span class="font-semibold text-slate-900">Operador de Empilhadeira</span>
            </div>
            <div class="flex justify-between pt-1">
              <span class="text-slate-500">Empresa:</span>
              <span class="font-bold text-indigo-600">Logística Beta LTDA</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Status e Datas</h4>
          <div class="flex items-center justify-between bg-emerald-50 p-3 rounded-lg border border-emerald-100 mb-4">
            <span class="font-bold text-emerald-800">Situação Atual:</span>
            <span class="inline-flex items-center px-3 py-1 bg-emerald-600 text-white rounded text-xs font-bold shadow-sm">Válido</span>
          </div>
          <div class="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div>
              <span class="block text-xs text-slate-400 mb-1">Realização</span>
              <span class="font-bold text-slate-700">05/01/2026</span>
            </div>
            <div>
              <span class="block text-xs text-slate-400 mb-1">Vencimento</span>
              <span class="font-bold text-emerald-600">05/01/2027</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Informações do Instrutor -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between">
        <div>
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Instrutor Responsável</h4>
          <p class="font-bold text-slate-800 text-lg">Eng. Carlos Mendes</p>
          <p class="text-sm text-slate-500">Registro/Matrícula: #90012</p>
        </div>
        <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
        </div>
      </div>

      <!-- Observações -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Observações Adicionais</h4>
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p class="text-sm text-slate-700 leading-relaxed">Treinamento prático realizado nas dependências da Logística Beta, utilizando os equipamentos originais que o funcionário utilizará na rotina diária. Desempenho satisfatório em todas as simulações.</p>
        </div>
      </div>

      <!-- Anexos -->
      <div class="bg-purple-600 p-5 rounded-2xl shadow-[0_2px_10px_rgba(147,51,234,0.2)] text-white flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <div>
            <p class="font-bold text-lg">Certificado_NR35_JoaoSilva.pdf</p>
            <p class="text-purple-200 text-sm">PDF • 1.1 MB</p>
          </div>
        </div>
        <button class="bg-white text-purple-600 hover:bg-purple-50 px-5 py-2.5 rounded-xl font-bold transition-colors shadow-sm">
          Baixar Certificado
        </button>
      </div>

    </div>
  `;
};
window.renderDetailsTreinamento = renderDetailsTreinamento;

const renderDetailsAso = () => {
  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        </div>
        <div>
          <h3 class="text-xl font-bold text-slate-900">ASO - Periódico</h3>
          <p class="text-sm text-slate-500 font-medium mt-0.5">Ana Costa • Construtora Alpha S.A</p>
        </div>
      </div>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    
    <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto scrollbar-hide bg-slate-50/50">
      
      <!-- Dados da ASO Atual + Funcionário -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Dados do Funcionário</h4>
          <div class="space-y-3 text-sm">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm border border-emerald-100">AC</div>
              <div>
                <p class="font-bold text-slate-900 text-base">Ana Costa</p>
                <p class="text-xs text-slate-500">CPF: 555.666.777-88</p>
              </div>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">Cargo:</span>
              <span class="font-semibold text-slate-900">Engenheira Civil</span>
            </div>
            <div class="flex justify-between pt-1">
              <span class="text-slate-500">Empresa:</span>
              <span class="font-bold text-indigo-600">Construtora Alpha S.A</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Resultado Atual</h4>
          <div class="flex items-center justify-between bg-emerald-50 p-3 rounded-lg border border-emerald-100 mb-3">
            <span class="font-bold text-emerald-800">Aptidão:</span>
            <span class="inline-flex items-center px-4 py-1.5 bg-emerald-600 text-white rounded-md text-sm font-bold shadow-sm">APTO</span>
          </div>
          <div class="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div>
              <span class="block text-xs text-slate-400 mb-1">Realização</span>
              <span class="font-bold text-slate-700">15/02/2026</span>
            </div>
            <div>
              <span class="block text-xs text-slate-400 mb-1">Validade</span>
              <span class="font-bold text-emerald-600">15/02/2027</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Exames Complementares -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
          Exames Complementares
        </h4>
        <div class="overflow-x-auto border border-slate-100 rounded-xl">
          <table class="w-full text-left">
            <thead class="bg-slate-50">
              <tr class="border-b border-slate-100">
                <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Exame</th>
                <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Realização</th>
                <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Validade</th>
                <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr class="hover:bg-slate-50/50">
                <td class="px-4 py-3 text-sm font-semibold text-slate-800">Audiometria</td>
                <td class="px-4 py-3 text-sm text-slate-600">15/02/2026</td>
                <td class="px-4 py-3 text-sm text-slate-600">15/02/2027</td>
                <td class="px-4 py-3 text-center">
                  <span class="inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs font-bold border border-emerald-200">Válido</span>
                </td>
              </tr>
              <tr class="hover:bg-slate-50/50">
                <td class="px-4 py-3 text-sm font-semibold text-slate-800">Acuidade Visual</td>
                <td class="px-4 py-3 text-sm text-slate-600">15/02/2026</td>
                <td class="px-4 py-3 text-sm text-slate-600">15/02/2027</td>
                <td class="px-4 py-3 text-center">
                  <span class="inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs font-bold border border-emerald-200">Válido</span>
                </td>
              </tr>
              <tr class="hover:bg-slate-50/50">
                <td class="px-4 py-3 text-sm font-semibold text-slate-800">Hemograma Completo</td>
                <td class="px-4 py-3 text-sm text-slate-600">15/02/2026</td>
                <td class="px-4 py-3 text-sm text-slate-600">15/08/2026</td>
                <td class="px-4 py-3 text-center">
                  <span class="inline-flex items-center px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-bold border border-amber-200">Vencendo</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Observações -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Observações do Médico</h4>
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p class="text-sm text-slate-700 leading-relaxed">Funcionária apta para todas as atividades do cargo. Recomenda-se uso de protetor auricular em áreas com ruído acima de 85dB. Próximo exame periódico em 12 meses.</p>
        </div>
      </div>

      <!-- Histórico de ASOs Anteriores -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Histórico de ASOs Anteriores
        </h4>
        <div class="relative border-l-2 border-slate-200 ml-4 space-y-6">
          <!-- ASO Anterior 1 -->
          <div class="relative pl-6">
            <div class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-300 border-2 border-white"></div>
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div class="flex items-center justify-between mb-2">
                <div>
                  <p class="font-bold text-slate-800 text-sm">Periódico</p>
                  <p class="text-xs text-slate-500">Realizado em 10/02/2025</p>
                </div>
                <span class="inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs font-bold border border-emerald-200">APTO</span>
              </div>
              <p class="text-xs text-slate-500">Exames: Audiometria, Acuidade Visual • Validade: 10/02/2026</p>
            </div>
          </div>
          <!-- ASO Anterior 2 -->
          <div class="relative pl-6">
            <div class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-300 border-2 border-white"></div>
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div class="flex items-center justify-between mb-2">
                <div>
                  <p class="font-bold text-slate-800 text-sm">Admissional</p>
                  <p class="text-xs text-slate-500">Realizado em 05/01/2024</p>
                </div>
                <span class="inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs font-bold border border-emerald-200">APTO</span>
              </div>
              <p class="text-xs text-slate-500">Exames: Hemograma, ECG, Audiometria • Validade: 05/01/2025</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  `;
};
window.renderDetailsAso = renderDetailsAso;

const renderDetailsEpi = () => {
  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        </div>
        <div>
          <h3 class="text-xl font-bold text-slate-900">NF-e 001.452</h3>
          <p class="text-sm text-slate-500 font-medium mt-0.5">Compra registrada em 12/04/2026</p>
        </div>
      </div>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    
    <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto scrollbar-hide bg-slate-50/50">

      <!-- Itens da Nota Fiscal -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
          Itens Comprados
        </h4>
        <div class="overflow-x-auto border border-slate-100 rounded-xl">
          <table class="w-full text-left">
            <thead class="bg-slate-50">
              <tr class="border-b border-slate-100">
                <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Tipo</th>
                <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Descrição</th>
                <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase">CA</th>
                <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase text-center">Qtd</th>
                <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase text-right">Preço Unit.</th>
                <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr class="hover:bg-slate-50/50">
                <td class="px-4 py-3"><span class="inline-flex items-center px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-bold border border-indigo-200">EPI</span></td>
                <td class="px-4 py-3 text-sm font-semibold text-slate-800">Luva de Vaqueta</td>
                <td class="px-4 py-3 text-sm text-slate-500">4321</td>
                <td class="px-4 py-3 text-sm text-center font-bold text-slate-800">50</td>
                <td class="px-4 py-3 text-sm text-right text-slate-600">R$ 15,00</td>
                <td class="px-4 py-3 text-sm text-right font-bold text-slate-900">R$ 750,00</td>
              </tr>
              <tr class="hover:bg-slate-50/50">
                <td class="px-4 py-3"><span class="inline-flex items-center px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-bold border border-indigo-200">EPI</span></td>
                <td class="px-4 py-3 text-sm font-semibold text-slate-800">Capacete c/ Jugular</td>
                <td class="px-4 py-3 text-sm text-slate-500">7890</td>
                <td class="px-4 py-3 text-sm text-center font-bold text-slate-800">20</td>
                <td class="px-4 py-3 text-sm text-right text-slate-600">R$ 35,00</td>
                <td class="px-4 py-3 text-sm text-right font-bold text-slate-900">R$ 700,00</td>
              </tr>
              <tr class="hover:bg-slate-50/50">
                <td class="px-4 py-3"><span class="inline-flex items-center px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-xs font-bold border border-orange-200">Uniforme</span></td>
                <td class="px-4 py-3 text-sm font-semibold text-slate-800">Camisa Manga Longa</td>
                <td class="px-4 py-3 text-sm text-slate-400">—</td>
                <td class="px-4 py-3 text-sm text-center font-bold text-slate-800">20</td>
                <td class="px-4 py-3 text-sm text-right text-slate-600">R$ 20,00</td>
                <td class="px-4 py-3 text-sm text-right font-bold text-slate-900">R$ 400,00</td>
              </tr>
            </tbody>
            <tfoot class="bg-indigo-50/50 border-t-2 border-indigo-100">
              <tr>
                <td colspan="3" class="px-4 py-3 text-sm font-bold text-indigo-900 uppercase">Total da NF</td>
                <td class="px-4 py-3 text-sm text-center font-bold text-indigo-900">90 itens</td>
                <td class="px-4 py-3"></td>
                <td class="px-4 py-3 text-right text-lg font-black text-indigo-600">R$ 1.850,00</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Distribuição por Empresa -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
          Distribuição por Empresa
        </h4>
        <div class="space-y-4">

          <!-- Empresa 1 -->
          <div class="border border-slate-100 rounded-xl overflow-hidden">
            <div class="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-100">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100">LB</div>
                <span class="text-sm font-bold text-slate-800">Logística Beta LTDA</span>
              </div>
              <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">3 itens recebidos</span>
            </div>
            <div class="divide-y divide-slate-50">
              <div class="flex items-center justify-between px-4 py-2.5">
                <span class="text-sm text-slate-700">Luva de Vaqueta <span class="text-xs text-slate-400">CA 4321</span></span>
                <span class="text-sm font-bold text-slate-800">30 un</span>
              </div>
              <div class="flex items-center justify-between px-4 py-2.5">
                <span class="text-sm text-slate-700">Capacete c/ Jugular <span class="text-xs text-slate-400">CA 7890</span></span>
                <span class="text-sm font-bold text-slate-800">10 un</span>
              </div>
              <div class="flex items-center justify-between px-4 py-2.5">
                <span class="text-sm text-slate-700">Camisa Manga Longa</span>
                <span class="text-sm font-bold text-slate-800">12 un</span>
              </div>
            </div>
          </div>

          <!-- Empresa 2 -->
          <div class="border border-slate-100 rounded-xl overflow-hidden">
            <div class="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-100">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100">CA</div>
                <span class="text-sm font-bold text-slate-800">Construtora Alpha S.A</span>
              </div>
              <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">3 itens recebidos</span>
            </div>
            <div class="divide-y divide-slate-50">
              <div class="flex items-center justify-between px-4 py-2.5">
                <span class="text-sm text-slate-700">Luva de Vaqueta <span class="text-xs text-slate-400">CA 4321</span></span>
                <span class="text-sm font-bold text-slate-800">20 un</span>
              </div>
              <div class="flex items-center justify-between px-4 py-2.5">
                <span class="text-sm text-slate-700">Capacete c/ Jugular <span class="text-xs text-slate-400">CA 7890</span></span>
                <span class="text-sm font-bold text-slate-800">10 un</span>
              </div>
              <div class="flex items-center justify-between px-4 py-2.5">
                <span class="text-sm text-slate-700">Camisa Manga Longa</span>
                <span class="text-sm font-bold text-slate-800">8 un</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  `;
};
window.renderDetailsEpi = renderDetailsEpi;

const renderFormAcidente = () => {
  const empresas = appState.empresas;
  const funcionarios = appState.funcionarios;

  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-slate-900">Registrar Acidente (CAT)</h3>
      </div>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    <form id="form-acidente" class="p-6 space-y-5 max-h-[75vh] overflow-y-auto scrollbar-hide" onsubmit="window.handleSaveAcidente(event)">

      <!-- Seção 1: Dados do Acidentado -->
      <div class="bg-red-50/50 p-4 rounded-xl border border-red-100/60">
        <p class="text-[10px] font-bold text-red-800 uppercase tracking-wider mb-3">1. Dados do Acidentado</p>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Funcionário</label>
            <select id="acid-funcionario" required class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm">
              <option value="">Selecione...</option>
              ${empresas.map(emp => `
                <optgroup label="${emp.nome}">
                  ${funcionarios.filter(f => f.empresaId == emp.id).map(f => `
                    <option value="${f.id}">${f.nome} - Mat: ${f.matricula}</option>
                  `).join('')}
                </optgroup>
              `).join('')}
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Tipo de Acidente</label>
            <select id="acid-tipo" required class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
              <option value="Tipico">Típico</option>
              <option value="Trajeto">De Trajeto</option>
              <option value="Doenca">Doença Ocupacional</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Seção 2: Dados do Acidente -->
      <div class="bg-slate-50/50 p-4 rounded-xl border border-slate-100/60">
        <p class="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-3">2. Dados do Acidente</p>
        <div class="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Data do Acidente</label>
            <input type="date" required class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Hora do Acidente</label>
            <input type="time" required class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Tipo de Acidente</label>
            <select required class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
              <option value="Tipico">Típico</option>
              <option value="Trajeto">De Trajeto</option>
              <option value="Doenca">Doença Ocupacional</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Local do Acidente</label>
            <input type="text" placeholder="Ex: Galpão principal, setor de carga" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Último Dia Trabalhado</label>
            <input type="date" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
          </div>
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Descrição Detalhada da Situação</label>
          <textarea rows="3" required placeholder="Descreva como ocorreu o acidente, em que circunstâncias e quais atividades estavam sendo realizadas no momento..." class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"></textarea>
        </div>
      </div>

      <!-- Seção 3: Dados Médicos -->
      <div class="bg-blue-50/50 p-4 rounded-xl border border-blue-100/60">
        <p class="text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-3">3. Diagnóstico e Atendimento</p>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Parte do Corpo Atingida</label>
            <select required class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm">
              <option value="">Selecione...</option>
              <option>Mão</option>
              <option>Braço</option>
              <option>Perna</option>
              <option>Pé</option>
              <option>Cabeça</option>
              <option>Tronco</option>
              <option>Coluna</option>
              <option>Olhos</option>
              <option>Múltiplas Regiões</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Agente Causador</label>
            <input type="text" placeholder="Ex: Queda de material, máquina, piso escorregadio" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm">
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">CID <span class="font-normal text-slate-400">(Opc)</span></label>
            <input type="text" placeholder="Ex: S61.0" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Houve Afastamento?</label>
            <select class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm">
              <option value="Nao">Não</option>
              <option value="Sim">Sim</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Houve Óbito?</label>
            <select class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm">
              <option value="Nao">Não</option>
              <option value="Sim">Sim</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Médico Responsável <span class="font-normal text-slate-400">(Opc)</span></label>
            <input type="text" placeholder="Nome do médico" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">CRM <span class="font-normal text-slate-400">(Opc)</span></label>
            <input type="text" placeholder="Ex: 12345/SP" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm">
          </div>
        </div>
      </div>

      <!-- Seção 4: Testemunhas -->
      <div class="bg-amber-50/50 p-4 rounded-xl border border-amber-100/60">
        <p class="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-3">4. Testemunhas <span class="font-normal text-amber-600">(Opcional)</span></p>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Nome da Testemunha</label>
            <input type="text" placeholder="Nome completo" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Telefone</label>
            <input type="text" placeholder="(00) 00000-0000" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm">
          </div>
        </div>
      </div>

      <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
        <button type="button" onclick="closeModal()" class="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancelar</button>
        <button type="submit" class="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-sm shadow-red-600/20 transition-all">Salvar e Emitir CAT</button>
      </div>
    </form>
  `;
};
window.renderFormAcidente = renderFormAcidente;

// Modal: Detalhes do Acidente (CAT)
const renderDetailsAcidente = () => {
  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <div>
          <h3 class="text-xl font-bold text-slate-900">CAT - Acidente Típico</h3>
          <p class="text-sm text-slate-500 font-medium mt-0.5">Registrado em 10/04/2026 às 14:30h</p>
        </div>
      </div>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    
    <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto scrollbar-hide bg-slate-50/50">
      
      <!-- Acidentado e Status -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Dados do Acidentado</h4>
          <div class="space-y-3 text-sm">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm border border-red-100">PB</div>
              <div>
                <p class="font-bold text-slate-900 text-base">Pedro Barros</p>
                <p class="text-xs text-slate-500">Matrícula: #10047</p>
              </div>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">CPF:</span>
              <span class="font-semibold text-slate-900">333.444.555-66</span>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">Cargo:</span>
              <span class="font-semibold text-slate-900">Operador de Carga</span>
            </div>
            <div class="flex justify-between pt-1">
              <span class="text-slate-500">Empresa:</span>
              <span class="font-bold text-indigo-600">Logística Beta LTDA</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Resumo do Acidente</h4>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">Tipo:</span>
              <span class="inline-flex items-center px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-bold border border-amber-200">Típico</span>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">Local:</span>
              <span class="font-semibold text-slate-900">Galpão principal, setor de carga</span>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">Afastamento:</span>
              <span class="font-semibold text-red-600">Sim</span>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">Óbito:</span>
              <span class="font-semibold text-slate-900">Não</span>
            </div>
            <div class="flex justify-between pt-1">
              <span class="text-slate-500">Status:</span>
              <span class="inline-flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-bold border border-emerald-200">CAT Emitida</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Descrição da Ocorrência -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Descrição da Ocorrência
        </h4>
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p class="text-sm text-slate-700 leading-relaxed">O funcionário estava realizando a descarga de material pesado (caixas de 25kg) do caminhão quando uma das caixas escorregou e atingiu a mão direita. O colaborador estava utilizando luvas de proteção, porém o impacto causou lesão leve nos dedos indicador e médio. Foi encaminhado imediatamente ao pronto-socorro mais próximo.</p>
        </div>
      </div>

      <!-- Dados Médicos -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
          Diagnóstico e Atendimento
        </h4>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
            <p class="text-xs text-slate-400 mb-1">Parte Atingida</p>
            <p class="text-sm font-bold text-slate-800">Mão Direita</p>
          </div>
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
            <p class="text-xs text-slate-400 mb-1">Agente Causador</p>
            <p class="text-sm font-bold text-slate-800">Queda de Material</p>
          </div>
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
            <p class="text-xs text-slate-400 mb-1">CID</p>
            <p class="text-sm font-bold text-slate-800">S61.0</p>
          </div>
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
            <p class="text-xs text-slate-400 mb-1">Últ. Dia Trabalhado</p>
            <p class="text-sm font-bold text-slate-800">10/04/2026</p>
          </div>
        </div>
        <div class="mt-4 flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <p class="text-sm font-bold text-slate-800">Dr. Roberto Souza</p>
            <p class="text-xs text-slate-500">CRM: 54321/SP</p>
          </div>
          <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </div>
        </div>
      </div>

      <!-- Testemunhas -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Testemunhas</h4>
        <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <p class="text-sm font-semibold text-slate-800">Carlos Eduardo Lima</p>
            <p class="text-xs text-slate-500">(11) 98765-4321</p>
          </div>
          <span class="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded border border-slate-200">Testemunha 1</span>
        </div>
      </div>

      <!-- Botão de Download -->
      <div class="bg-red-600 p-5 rounded-2xl shadow-[0_2px_10px_rgba(220,38,38,0.2)] text-white flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <div>
            <p class="font-bold text-lg">CAT_PedroBarros_10042026.pdf</p>
            <p class="text-red-200 text-sm">Documento gerado • Padrão eSocial</p>
          </div>
        </div>
        <button class="bg-white text-red-600 hover:bg-red-50 px-5 py-2.5 rounded-xl font-bold transition-colors shadow-sm">
          Baixar CAT
        </button>
      </div>

    </div>
  `;
};
window.renderDetailsAcidente = renderDetailsAcidente;

// ==========================================
// 3. LÓGICA DE MANIPULAÇÃO DE DADOS (CRUD)
// ==========================================

window.handleSaveEmpresa = (event) => {
  event.preventDefault();
  const form = event.target;

  const novaEmpresa = {
    id: Date.now(),
    nome: form.querySelector('#razao-social').value,
    cnpj: form.querySelector('#cnpj').value,
    setor: form.querySelector('#setor').value === 'limpeza' ? 'Sistema de limpeza' : 'Serviço industrial',
    status: 'Ativa',
    dataCriacao: new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
  };

  appState.empresas.push(novaEmpresa);
  updateStats();
  closeModal();
  window.navigateTo('empresas');
};

window.handleDeleteEmpresa = (id) => {
  if (confirm('Tem certeza que deseja excluir esta empresa?')) {
    appState.empresas = appState.empresas.filter(emp => emp.id != id);
    updateStats();
    window.navigateTo('empresas');
  }
};

window.handleSaveFuncionario = (event) => {
  event.preventDefault();
  const form = event.target;

  const empresaId = form.querySelector('#func-empresa').value;
  const empresa = appState.empresas.find(e => e.id == empresaId);

  const novoFunc = {
    id: Date.now(),
    matricula: form.querySelector('#func-matricula').value,
    cpf: form.querySelector('#func-cpf').value,
    nome: form.querySelector('#func-nome').value,
    cargo: form.querySelector('#func-cargo').value,
    empresaId: empresaId,
    empresaNome: empresa ? empresa.nome : 'N/A'
  };

  appState.funcionarios.push(novoFunc);
  updateStats();
  closeModal();
  window.navigateTo('funcionarios');
};

window.handleDeleteFuncionario = (id) => {
  if (confirm('Tem certeza que deseja excluir este funcionário?')) {
    appState.funcionarios = appState.funcionarios.filter(f => f.id != id);
    updateStats();
    window.navigateTo('funcionarios');
  }
};

window.handleDeleteASO = (id) => {
  if (confirm('Tem certeza que deseja excluir este ASO?')) {
    appState.asos = appState.asos.filter(a => a.id != id);
    updateStats();
    window.navigateTo('asos');
  }
};

window.handleDeleteTreinamento = (id) => {
  if (confirm('Tem certeza que deseja excluir este treinamento?')) {
    appState.treinamentos = appState.treinamentos.filter(t => t.id != id);
    updateStats();
    window.navigateTo('treinamentos');
  }
};

window.handleDeleteDocumento = (id) => {
  if (confirm('Tem certeza que deseja excluir este documento?')) {
    appState.documentos = appState.documentos.filter(d => d.id != id);
    updateStats();
    window.navigateTo('documentos');
  }
};

window.handleSaveDocumento = (e) => {
  e.preventDefault();
  const sigla = document.getElementById('doc-novo-tipo-sigla').value;
  const desc = document.getElementById('doc-novo-tipo-desc').value;
  const tipo = sigla || document.getElementById('doc-tipo').value;
  const empresaId = document.getElementById('doc-empresa').value;
  const empresa = appState.empresas.find(emp => emp.id == empresaId);

  const novoDoc = {
    id: Date.now(),
    tipo: tipo,
    nome: desc || tipo,
    empresaId: parseInt(empresaId),
    empresaNome: empresa ? empresa.nome : 'Empresa não encontrada',
    status: 'Válido',
    dataEmissao: document.getElementById('doc-elaboracao').value,
    dataVencimento: document.getElementById('doc-revisao').value,
    observacoes: document.getElementById('doc-obs').value
  };

  appState.documentos.push(novoDoc);
  updateStats();
  closeModal();
  window.navigateTo('documentos');
};

window.handleSaveTreinamento = (e) => {
  e.preventDefault();
  const sigla = document.getElementById('trei-novo-tipo-sigla').value;
  const tipo = sigla || document.getElementById('trei-tipo').value;
  const funcId = document.getElementById('trei-funcionario').value;
  const func = appState.funcionarios.find(f => f.id == funcId);

  const novoTrei = {
    id: Date.now(),
    tipo: tipo,
    funcionarioId: parseInt(funcId),
    funcionarioNome: func ? func.nome : 'N/A',
    empresaNome: func ? func.empresaNome : 'N/A',
    status: 'Válido',
    dataRealizacao: document.getElementById('trei-realizacao').value,
    dataVencimento: document.getElementById('trei-vencimento').value,
    instrutor: document.getElementById('trei-instrutor').value || 'Não informado',
    observacoes: document.getElementById('trei-obs').value
  };

  appState.treinamentos.push(novoTrei);
  updateStats();
  closeModal();
  window.navigateTo('treinamentos');
};

window.handleSaveAso = (e) => {
  e.preventDefault();
  const funcId = document.getElementById('aso-funcionario').value;
  const func = appState.funcionarios.find(f => f.id == funcId);

  const novoAso = {
    id: Date.now(),
    tipo: document.getElementById('aso-tipo').value,
    funcionarioId: parseInt(funcId),
    funcionarioNome: func ? func.nome : 'N/A',
    empresaNome: func ? func.empresaNome : 'N/A',
    status: 'Válido',
    aptidao: document.getElementById('aso-aptidao').value,
    dataRealizacao: document.getElementById('aso-realizacao').value,
    dataVencimento: document.getElementById('aso-vencimento').value,
    observacoes: document.getElementById('aso-obs').value
  };

  appState.asos.push(novoAso);
  updateStats();
  closeModal();
  window.navigateTo('asos');
};

window.handleSaveAcidente = (e) => {
  e.preventDefault();
  const funcId = document.getElementById('acid-funcionario').value;
  const func = appState.funcionarios.find(f => f.id == funcId);

  const novoAcid = {
    id: Date.now(),
    data: document.getElementById('acid-data').value,
    hora: document.getElementById('acid-hora').value,
    funcionarioId: parseInt(funcId),
    funcionarioNome: func ? func.nome : 'N/A',
    empresaNome: func ? func.empresaNome : 'N/A',
    tipo: document.getElementById('acid-tipo').value,
    status: 'Pendente',
    descricao: document.getElementById('acid-desc').value,
    local: document.getElementById('acid-local').value
  };

  appState.acidentes.push(novoAcid);
  updateStats();
  closeModal();
  window.navigateTo('acidentes');
};

window.handleDeleteAcidente = (id) => {
  if (confirm('Tem certeza que deseja excluir este registro de acidente?')) {
    appState.acidentes = appState.acidentes.filter(a => a.id != id);
    updateStats();
    window.navigateTo('acidentes');
  }
};

window.handleSaveEpi = (e) => {
  e.preventDefault();
  const nf = document.getElementById('epi-nf').value;
  const data = document.getElementById('epi-data').value;
  const valor = document.getElementById('epi-valor-total').value;

  const novaCompra = {
    id: Date.now(),
    nf: nf,
    data: data,
    valorTotal: parseFloat(valor),
    itens: []
  };

  appState.comprasEpi.push(novaCompra);
  saveState();
  closeModal();
  window.navigateTo('epis');
};

window.handleDeleteCompraEpi = (id) => {
  if (confirm('Tem certeza que deseja excluir esta nota fiscal?')) {
    appState.comprasEpi = appState.comprasEpi.filter(c => c.id != id);
    saveState();
    window.navigateTo('epis');
  }
};
const mainContent = document.getElementById('page-container'); // Agora usando o container interno
const navItems = document.querySelectorAll('.nav-item');

const navigateTo = (pageId) => {
  window.currentPage = pageId;
  // 1. Atualizar o conteúdo principal
  if (pageId === 'dashboard') {
    mainContent.innerHTML = renderDashboard();
  } else if (pageId === 'empresas') {
    mainContent.innerHTML = renderEmpresas();
  } else if (pageId === 'funcionarios') {
    mainContent.innerHTML = renderFuncionarios();
  } else if (pageId === 'documentos') {
    mainContent.innerHTML = renderDocumentos();
  } else if (pageId === 'treinamentos') {
    mainContent.innerHTML = renderTreinamentos();
  } else if (pageId === 'asos') {
    mainContent.innerHTML = renderAsos();
  } else if (pageId === 'epis') {
    mainContent.innerHTML = renderEpis();
  } else if (pageId === 'acidentes') {
    mainContent.innerHTML = renderAcidentes();
  }

  // 2. Atualizar o visual do menu (quem está ativo)
  navItems.forEach(item => {
    if (item.getAttribute('data-page') === pageId) {
      item.classList.add('active');
      item.classList.remove('text-slate-500', 'hover:bg-slate-50', 'hover:text-indigo-600');
    } else {
      item.classList.remove('active');
      item.classList.add('text-slate-500', 'hover:bg-slate-50', 'hover:text-indigo-600');
    }
  });
};

// Exportar navigateTo para o escopo global
window.navigateTo = navigateTo;

// Configurar cliques no menu
navItems.forEach(item => {
  item.addEventListener('click', () => {
    const pageId = item.getAttribute('data-page');
    navigateTo(pageId);
  });
});

// Configurar botão de Logout
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    window.location.href = '/index.html';
  });
}

// Inicializar na página Dashboard
navigateTo('dashboard');
