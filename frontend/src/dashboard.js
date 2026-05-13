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
    { id: 1, tipo: 'NR-35', funcionarioId: 1, funcionarioNome: 'João Silva', empresaNome: 'Logística Beta', dataRealizacao: '12/04/2026', dataVencimento: '12/04/2027', instrutor: '10045', status: 'Válido' }
  ],
  asos: [
    { id: 1, tipo: 'Admissional', funcionarioId: 1, funcionarioNome: 'João Silva', empresaNome: 'Logística Beta', dataRealizacao: '10/05/2026', dataVencimento: '10/05/2027', status: 'Vencendo', aptidao: 'Apto' }
  ],
  pendTipo: [
    { tipo: 'Documentos', val: 9, pct: 47, cor: 'bg-indigo-500' },
    { tipo: 'ASOs', val: 6, pct: 32, cor: 'bg-emerald-500' },
    { tipo: 'Treinamentos', val: 4, pct: 21, cor: 'bg-amber-500' }
  ],
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

// Carregar do localStorage ou usar o inicial
let appState = JSON.parse(localStorage.getItem('sst_app_data')) || INITIAL_STATE;

// Garantir que novas coleções existam no estado (migração simples)
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

// Estado temporário para o carrinho de compras (não persistente em F5 para simplicidade do form)
let cartState = {
  items: [],
  nf: '',
  data: '',
  valorTotal: 0
};

const saveState = () => {
  localStorage.setItem('sst_app_data', JSON.stringify(appState));
};

const calculateStatus = (dateStr) => {
  if (!dateStr) return 'Válido';
  
  let date;
  if (dateStr.includes('/')) {
    const [d, m, y] = dateStr.split('/');
    date = new Date(y, m - 1, d);
  } else {
    date = new Date(dateStr);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = date - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Vencido';
  if (diffDays <= 30) return 'Vencendo';
  return 'Válido';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  if (dateStr.includes('-')) return dateStr.split('-').reverse().join('/');
  return dateStr;
};

// Atalho para recalcular estatísticas básicas
const updateStats = () => {
  // Recalcular status baseado nas datas atuais
  if (appState.documentos) {
    appState.documentos.forEach(d => d.status = calculateStatus(d.dataVencimento));
  }
  if (appState.treinamentos) {
    appState.treinamentos.forEach(t => t.status = calculateStatus(t.dataVencimento));
  }
  if (appState.asos) {
    appState.asos.forEach(a => a.status = calculateStatus(a.dataVencimento));
  }

  appState.stats.totalEmpresas = appState.empresas.length;
  appState.stats.totalFuncionarios = appState.funcionarios.length;

  // Calcular pendências reais
  const docsPend = (appState.documentos || []).filter(d => d.status !== 'Válido').length;
  const treinPend = (appState.treinamentos || []).filter(t => t.status !== 'Válido').length;
  const asosPend = (appState.asos || []).filter(a => a.status !== 'Válido').length;

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

// Funções para gerenciar o Carrinho de EPIs
window.openEpiModal = (id = null) => {
  if (id) {
    const compra = appState.comprasEpi.find(c => c.id == id);
    if (compra) {
      cartState = {
        id: compra.id,
        items: JSON.parse(JSON.stringify(compra.itens)),
        nf: compra.nf,
        data: compra.data,
        valorTotal: compra.valorTotal
      };
    }
  } else {
    cartState = {
      items: [],
      nf: '',
      data: '',
      valorTotal: 0
    };
  }
  openModal(renderFormEpi(), 'max-w-4xl');
};

window.addItemToCart = () => {
  const tipo = document.getElementById('epi-item-tipo').value;
  const desc = document.getElementById('epi-item-desc').value.trim();
  const ca = document.getElementById('epi-item-ca').value.trim();
  const qtd = parseInt(document.getElementById('epi-item-qtd').value) || 0;
  const valorUnit = parseFloat(document.getElementById('epi-item-valor').value.replace(',', '.')) || 0;

  if (!desc || qtd <= 0 || valorUnit <= 0) {
    alert('Preencha a descrição, quantidade e valor unitário corretamente.');
    return;
  }

  // Verificar se já existe um item igual no carrinho para somar a quantidade
  const existingItem = cartState.items.find(item => 
    item.descricao.toLowerCase() === desc.toLowerCase() && 
    item.ca === ca && 
    item.tipo === tipo
  );

  if (existingItem) {
    existingItem.quantidade += qtd;
    // Opcionalmente podemos atualizar o valor unitário se for diferente? 
    // Geralmente em uma mesma nota o valor é o mesmo, mas vamos manter o primeiro ou atualizar?
    // Usuário disse que possivelmente esqueceu da quantidade, então o valor deve ser o mesmo.
    existingItem.valorUnitario = valorUnit; 
  } else {
    cartState.items.push({
      tipo,
      descricao: desc,
      ca,
      quantidade: qtd,
      valorUnitario: valorUnit,
      distribuicoes: []
    });
  }

  // Salvar campos da NF para não perder no re-render
  cartState.nf = document.getElementById('epi-nf').value;
  cartState.data = document.getElementById('epi-data').value;

  updateEpiModalUI();
};

window.removeItemFromCart = (index) => {
  cartState.items.splice(index, 1);
  updateEpiModalUI();
};

window.addDistribution = (itemIndex) => {
  const select = document.getElementById(`dist-emp-select-${itemIndex}`);
  const input = document.getElementById(`dist-emp-qtd-${itemIndex}`);
  
  const empresaId = select.value;
  const empresaNome = select.options[select.selectedIndex].text;
  const qtd = parseInt(input.value) || 0;

  if (!empresaId || qtd <= 0) {
    alert('Selecione uma empresa e informe uma quantidade válida.');
    return;
  }

  const item = cartState.items[itemIndex];
  const totalDistribuido = item.distribuicoes.reduce((acc, d) => acc + d.quantidade, 0);

  if (totalDistribuido + qtd > item.quantidade) {
    alert('A quantidade distribuída não pode ser maior que a quantidade total comprada.');
    return;
  }

  // Verificar se a empresa já recebeu esse item para somar
  const existingDist = item.distribuicoes.find(d => d.empresaId == empresaId);
  if (existingDist) {
    existingDist.quantidade += qtd;
  } else {
    item.distribuicoes.push({ empresaId, empresaNome, quantidade: qtd });
  }

  updateEpiModalUI();
};

window.removeDistribution = (itemIndex, distIndex) => {
  cartState.items[itemIndex].distribuicoes.splice(distIndex, 1);
  updateEpiModalUI();
};

const updateEpiModalUI = () => {
  // Salvar valores atuais da NF antes de re-renderizar
  const nfInput = document.getElementById('epi-nf');
  const dataInput = document.getElementById('epi-data');
  if (nfInput) cartState.nf = nfInput.value;
  if (dataInput) cartState.data = dataInput.value;

  // Calcular valor total
  cartState.valorTotal = cartState.items.reduce((acc, item) => acc + (item.quantidade * item.valorUnitario), 0);

  openModal(renderFormEpi(), 'max-w-4xl');
};

// --- Gestão de Estoque Geral ---
window.openEstoqueModal = () => {
  openModal(renderEstoqueModal(), 'max-w-4xl');
};

window.addManualItemToEstoque = () => {
  const tipo = document.getElementById('est-item-tipo').value;
  const desc = document.getElementById('est-item-desc').value.trim();
  const ca = document.getElementById('est-item-ca').value.trim();
  const qtd = parseInt(document.getElementById('est-item-qtd').value) || 0;

  if (!desc || qtd <= 0) {
    alert('Informe a descrição e uma quantidade válida.');
    return;
  }

  const existing = appState.estoque.find(i => 
    i.descricao.toLowerCase() === desc.toLowerCase() && 
    i.ca === ca && 
    i.tipo === tipo
  );

  if (existing) {
    existing.quantidade += qtd;
  } else {
    appState.estoque.push({ tipo, descricao: desc, ca, quantidade: qtd });
  }

  saveState();
  window.openEstoqueModal();
};

window.updateEstoqueQtd = (index, delta) => {
  appState.estoque[index].quantidade += delta;
  if (appState.estoque[index].quantidade < 0) appState.estoque[index].quantidade = 0;
  saveState();
  window.openEstoqueModal();
};

window.deleteItemEstoque = (index) => {
  if (confirm('Remover este item do controle de estoque?')) {
    appState.estoque.splice(index, 1);
    saveState();
    window.openEstoqueModal();
  }
};

window.syncEstoqueFromNf = () => {
  // Puxar saldos de NFs que ainda não estão no estoque consolidado
  (appState.comprasEpi || []).forEach(compra => {
    (compra.itens || []).forEach(item => {
      const totalDist = (item.distribuicoes || []).reduce((acc, d) => acc + d.quantidade, 0);
      const saldo = item.quantidade - totalDist;
      
      if (saldo > 0) {
        const existing = appState.estoque.find(i => 
          i.descricao.toLowerCase() === item.descricao.toLowerCase() && 
          i.ca === item.ca && 
          i.tipo === item.tipo
        );
        
        if (existing) {
          // Só sincronizamos se o usuário quiser, mas aqui vamos somar apenas se não houver conflito de NF?
          // Para simplificar, vamos apenas adicionar o saldo como um novo item ou somar.
          // Mas cuidado para não duplicar se clicar várias vezes.
          // O usuário pediu algo que "recebe as informações".
        }
      }
    });
  });
  alert('Funcionalidade de sincronização automática pendente de refinamento para evitar duplicatas. Por favor, adicione os itens manualmente ou use os saldos das NFs listadas.');
};

const renderEstoqueModal = () => {
  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2m16 4h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 15H4"></path></svg>
        </div>
        <div>
          <h3 class="text-xl font-bold text-slate-900">Controle de Estoque (Geral)</h3>
          <p class="text-xs text-slate-500 font-medium">Gerencie itens armazenados e entradas manuais.</p>
        </div>
      </div>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>

    <div class="p-6 bg-slate-50/30">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Coluna de Cadastro -->
        <div class="space-y-6">
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Adicionar ao Estoque</h4>
            <div class="space-y-3">
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tipo</label>
                <select id="est-item-tipo" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20">
                  <option value="EPI">EPI</option>
                  <option value="Uniforme">Uniforme</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Descrição</label>
                <input type="text" id="est-item-desc" placeholder="Ex: Luva Nitrílica" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20">
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">CA</label>
                  <input type="text" id="est-item-ca" placeholder="0000" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20">
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Qtd Inicial</label>
                  <input type="number" id="est-item-qtd" value="1" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20">
                </div>
              </div>
              <button onclick="window.addManualItemToEstoque()" class="w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 mt-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Adicionar Item
              </button>
            </div>
          </div>
          
          <div class="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 border-dashed">
            <p class="text-[10px] text-amber-700 font-medium leading-relaxed">
              <strong>Nota:</strong> Este controle é independente do histórico de Notas Fiscais. Use-o para gerenciar retiradas manuais ou itens que já estavam em estoque antes do sistema.
            </p>
          </div>
        </div>

        <!-- Coluna da Listagem -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Inventário Atual</h4>
              <span class="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">${appState.estoque.length} itens</span>
            </div>
            
            <div class="max-h-[50vh] overflow-y-auto divide-y divide-slate-100">
              ${appState.estoque.length === 0 ? `
                <div class="p-12 text-center">
                  <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2m16 4h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 15H4"></path></svg>
                  </div>
                  <p class="text-sm font-medium text-slate-400">Nenhum item no estoque.</p>
                </div>
              ` : appState.estoque.map((item, idx) => `
                <div class="p-4 hover:bg-slate-50/50 transition-colors flex items-center justify-between group">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg ${item.tipo === 'Uniforme' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'} flex items-center justify-center font-bold text-[10px] border">
                      ${item.tipo === 'Uniforme' ? 'U' : 'E'}
                    </div>
                    <div>
                      <p class="text-sm font-bold text-slate-800">${item.descricao}</p>
                      ${item.ca ? `<p class="text-[10px] text-slate-400 font-bold uppercase">CA ${item.ca}</p>` : ''}
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-4">
                    <div class="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                      <button onclick="window.updateEstoqueQtd(${idx}, -1)" class="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-white hover:text-red-500 rounded-md transition-all">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
                      </button>
                      <span class="w-10 text-center text-sm font-black text-slate-800">${item.quantidade}</span>
                      <button onclick="window.updateEstoqueQtd(${idx}, 1)" class="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-white hover:text-emerald-500 rounded-md transition-all">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                      </button>
                    </div>
                    
                    <button onclick="window.deleteItemEstoque(${idx})" class="p-1.5 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="p-6 border-t border-slate-100 bg-white rounded-b-3xl">
      <div class="flex justify-end">
        <button onclick="closeModal()" class="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all">Fechar</button>
      </div>
    </div>
  `;
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
  const setores = [...new Set(appState.empresas.map(e => e.setor))].sort();

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
            <input type="text" 
              data-search-page="empresas"
              value="${appState.filters.empresas || ''}"
              oninput="window.handleSearch(event, 'empresas')"
              placeholder="Buscar empresa por nome ou CNPJ..." 
              class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm">
          </div>
          <div class="flex-1">
            <select 
              onchange="window.handleSectorFilter(event)"
              class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm bg-white text-slate-600 font-medium">
              <option value="">Todos os Setores</option>
              ${setores.map(s => `<option value="${s}" ${appState.filters.empresasSetor === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
        </div>

        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200/80">
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Razão Social</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">CNPJ / Setor</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Funcionários</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100/80">
            ${(appState.empresas || [])
      .filter(emp => {
        const matchesSearch = emp.nome.toLowerCase().includes((appState.filters.empresas || '').toLowerCase()) ||
                             emp.cnpj.toLowerCase().includes((appState.filters.empresas || '').toLowerCase());
        const matchesSector = !appState.filters.empresasSetor || emp.setor === appState.filters.empresasSetor;
        return matchesSearch && matchesSector;
      })
      .map(emp => `
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
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="openModal(renderDetailsEmpresa(${emp.id}), 'max-w-4xl')" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Visualizar">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                    <button onclick="openModal(renderFormEmpresa(${emp.id}))" class="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Editar">
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
            <input type="text" 
              data-search-page="funcionarios"
              value="${appState.filters.funcionarios || ''}"
              oninput="window.handleSearch(event, 'funcionarios')"
              placeholder="Buscar funcionário por nome, CPF ou matrícula..." 
              class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm">
          </div>
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
            ${(appState.funcionarios || [])
      .filter(func =>
        func.nome.toLowerCase().includes((appState.filters.funcionarios || '').toLowerCase()) ||
        func.cpf.toLowerCase().includes((appState.filters.funcionarios || '').toLowerCase()) ||
        func.matricula.toLowerCase().includes((appState.filters.funcionarios || '').toLowerCase())
      )
      .map(func => `
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
                    <button onclick="openModal(renderFormFuncionario(${func.id}))" class="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Editar">
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
            <input type="text" 
              data-search-page="documentos"
              value="${appState.filters.documentos || ''}"
              oninput="window.handleSearch(event, 'documentos')"
              placeholder="Buscar documento por tipo ou empresa..." 
              class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm">
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
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Datas (Venc. / Elab.)</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Anexos</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100/80">
            ${(appState.documentos || [])
      .filter(doc =>
        doc.tipo.toLowerCase().includes((appState.filters.documentos || '').toLowerCase()) ||
        doc.empresaNome.toLowerCase().includes((appState.filters.documentos || '').toLowerCase())
      )
      .map(doc => `
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
                  <p class="text-sm ${doc.status === 'Vencido' ? 'text-red-600' : (doc.status === 'Vencendo' ? 'text-amber-500' : 'text-emerald-600')} font-medium"><span class="text-slate-400">V:</span> ${formatDate(doc.dataVencimento)}</p>
                  <p class="text-sm text-slate-500 mt-0.5"><span class="text-slate-400">E:</span> ${formatDate(doc.dataEmissao)}</p>
                </td>
                <td class="px-6 py-4 text-center">
                  <button class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors" title="Ver PDF anexado">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                  </button>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="openModal(renderDetailsDocumento(${doc.id}), 'max-w-2xl')" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Visualizar">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                    <button onclick="openModal(renderFormDocumento(${doc.id}))" class="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Editar">
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
            <input type="text" 
              data-search-page="treinamentos"
              value="${appState.filters.treinamentos}"
              oninput="window.handleSearch(event, 'treinamentos')"
              placeholder="Buscar por tipo de treinamento ou instrutor..." 
              class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm">
          </div>
          <select 
            onchange="window.handleTreinamentoStatusFilter(event)"
            class="pl-4 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm bg-white text-slate-600 font-medium">
            <option ${appState.filters.treinamentosStatus === 'Todos os Status' ? 'selected' : ''}>Todos os Status</option>
            <option ${appState.filters.treinamentosStatus === 'Válido' ? 'selected' : ''}>Válido</option>
            <option ${appState.filters.treinamentosStatus === 'Vencendo' ? 'selected' : ''}>Vencendo</option>
            <option ${appState.filters.treinamentosStatus === 'Vencido' ? 'selected' : ''}>Vencido</option>
          </select>
        </div>

        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200/80">
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo (NR)</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Funcionário</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Instrutor</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100/80">
            ${(appState.treinamentos || [])
      .filter(trei => {
        const matchesSearch = 
          trei.tipo.toLowerCase().includes((appState.filters.treinamentos || '').toLowerCase()) ||
          trei.funcionarioNome.toLowerCase().includes((appState.filters.treinamentos || '').toLowerCase()) ||
          trei.instrutor.toLowerCase().includes((appState.filters.treinamentos || '').toLowerCase());
        
        const matchesStatus = 
          !appState.filters.treinamentosStatus ||
          appState.filters.treinamentosStatus === 'Todos os Status' || 
          trei.status === appState.filters.treinamentosStatus;
          
        return matchesSearch && matchesStatus;
      })
      .map(trei => `
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
                <td class="px-6 py-4 text-slate-600 text-sm font-medium">
                  ${(() => {
        const instr = appState.funcionarios.find(f => f.matricula == trei.instrutor);
        return instr ? instr.nome : '-';
      })()}
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-1 ${trei.status === 'Válido' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'} rounded-md text-xs font-semibold border">
                    ${trei.status}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="openModal(renderDetailsTreinamento(${trei.id}), 'max-w-2xl')" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Visualizar">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                    <button onclick="openModal(renderFormTreinamento(${trei.id}))" class="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Editar">
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
            <input type="text" 
              data-search-page="asos"
              value="${appState.filters.asos}"
              oninput="window.handleSearch(event, 'asos')"
              placeholder="Buscar por funcionário ou tipo de ASO..." 
              class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm">
          </div>
          <select onchange="window.handleAsoAptidaoFilter(event)" class="pl-4 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm bg-white text-slate-600 font-medium">
            <option ${appState.filters.asosAptidao === 'Todas as Aptidões' ? 'selected' : ''}>Todas as Aptidões</option>
            <option ${appState.filters.asosAptidao === 'Apto' ? 'selected' : ''}>Apto</option>
            <option ${appState.filters.asosAptidao === 'Inapto' ? 'selected' : ''}>Inapto</option>
          </select>
        </div>

        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200/80">
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo de ASO</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Funcionário</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Datas (Valid. / Realiz.)</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Aptidão</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100/80">
            ${(() => {
              const latestAsosMap = new Map();
              (appState.asos || []).forEach(aso => {
                const existing = latestAsosMap.get(aso.funcionarioId);
                if (!existing) {
                  latestAsosMap.set(aso.funcionarioId, aso);
                } else {
                  const parseDate = d => new Date(d.includes('/') ? d.split('/').reverse().join('-') : d);
                  if (parseDate(aso.dataRealizacao) > parseDate(existing.dataRealizacao)) {
                    latestAsosMap.set(aso.funcionarioId, aso);
                  }
                }
              });
              return Array.from(latestAsosMap.values());
            })()
      .filter(aso => {
        const matchesSearch = 
          aso.funcionarioNome.toLowerCase().includes(appState.filters.asos.toLowerCase()) ||
          aso.tipo.toLowerCase().includes(appState.filters.asos.toLowerCase());
        
        const matchesAptidao = 
          !appState.filters.asosAptidao || 
          appState.filters.asosAptidao === 'Todas as Aptidões' || 
          aso.aptidao === appState.filters.asosAptidao;
          
        return matchesSearch && matchesAptidao;
      })
      .map(aso => `
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
                  <p class="text-sm ${aso.status === 'Vencido' ? 'text-red-600' : (aso.status === 'Vencendo' ? 'text-amber-600' : 'text-emerald-600')} font-medium"><span class="text-slate-400">V:</span> ${formatDate(aso.dataVencimento)}</p>
                  <p class="text-sm text-slate-500 mt-0.5"><span class="text-slate-400">R:</span> ${formatDate(aso.dataRealizacao)}</p>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-1 ${aso.aptidao === 'Inapto' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'} rounded-md text-xs font-semibold border uppercase">
                    ${aso.aptidao || 'Apto'}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="openModal(renderDetailsAso(${aso.id}), 'max-w-2xl')" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Visualizar">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                    <button onclick="openModal(renderFormAso(${aso.id}))" class="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Editar">
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
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  
  // Extrair meses/anos únicos das compras
  const dateOptions = [...new Set((appState.comprasEpi || []).map(c => {
    const [y, m] = c.data.split('-');
    return `${m}/${y}`;
  }))].sort((a, b) => {
    const [m1, y1] = a.split('/');
    const [m2, y2] = b.split('/');
    return new Date(y2, m2 - 1) - new Date(y1, m1 - 1);
  });

  const selectedDateFilter = appState.filters.episData || 'Todos';

  return `
    <div class="p-10 max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-10">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">Gestão de EPIs</h1>
          <p class="text-slate-500 text-base">Histórico de compras e notas fiscais por empresa.</p>
        </div>
        <div class="flex items-center gap-3">
          <button onclick="window.openEstoqueModal()" class="bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2m16 4h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 15H4"></path></svg>
            Consultar Estoque
          </button>
          <button onclick="window.openEpiModal()" class="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Registrar Compra (NF)
          </button>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="p-5 border-b border-slate-100 flex gap-4 bg-slate-50/50">
          <select onchange="window.handleEpiDateFilter(event)" class="pl-4 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm bg-white text-slate-600 font-medium">
            <option value="Todos" ${selectedDateFilter === 'Todos' ? 'selected' : ''}>Todos os Meses</option>
            ${dateOptions.map(opt => {
              const [m, y] = opt.split('/');
              return `<option value="${opt}" ${selectedDateFilter === opt ? 'selected' : ''}>${monthNames[parseInt(m)-1]} ${y}</option>`;
            }).join('')}
          </select>
          <div class="relative flex-1">
            <svg class="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" 
              data-search-page="epis"
              value="${appState.filters.epis || ''}"
              oninput="window.handleSearch(event, 'epis')"
              placeholder="Buscar por Nº da Nota Fiscal..." 
              class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm">
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
            ${(appState.comprasEpi || [])
      .filter(compra => {
        const matchesSearch = compra.nf.toLowerCase().includes((appState.filters.epis || '').toLowerCase());
        if (selectedDateFilter === 'Todos') return matchesSearch;
        const [y, m] = compra.data.split('-');
        return matchesSearch && `${m}/${y}` === selectedDateFilter;
      })
      .map(compra => `
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
                    <button onclick="openModal(renderDetailsEpi(${compra.id}), 'max-w-4xl')" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Visualizar">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                    <button onclick="window.openEpiModal(${compra.id})" class="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Editar">
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
            <input type="text" 
              data-search-page="acidentes"
              value="${appState.filters.acidentes || ''}"
              oninput="window.handleSearch(event, 'acidentes')"
              placeholder="Buscar por funcionário ou empresa..." 
              class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm">
          </div>
          <select onchange="window.handleAcidenteStatusFilter(event)" class="pl-4 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm bg-white text-slate-600 font-medium cursor-pointer hover:border-slate-300 transition-colors">
            <option value="">Todos os Status</option>
            <option value="CAT Emitida" ${appState.filters.acidentesStatus === 'CAT Emitida' ? 'selected' : ''}>CAT Emitida</option>
            <option value="Cat Pendente" ${appState.filters.acidentesStatus === 'Cat Pendente' ? 'selected' : ''}>CAT Pendente</option>
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
            ${(appState.acidentes || [])
      .filter(acid => {
        const matchesSearch = acid.funcionarioNome.toLowerCase().includes((appState.filters.acidentes || '').toLowerCase()) ||
          acid.empresaNome.toLowerCase().includes((appState.filters.acidentes || '').toLowerCase());
        const matchesStatus = !appState.filters.acidentesStatus || acid.status === appState.filters.acidentesStatus;
        return matchesSearch && matchesStatus;
      })
      .map(acid => `
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
                  <span class="inline-flex items-center px-2 py-0.5 ${
                    acid.tipo === 'Tipico' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                    acid.tipo === 'Trajeto' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                    'bg-purple-50 text-purple-700 border-purple-200'
                  } rounded text-xs font-bold border">${acid.tipo}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 ${acid.catEmitida ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'} rounded-md text-xs font-bold border transition-all">
                    ${acid.catEmitida 
                      ? '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>' 
                      : '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>'}
                    ${acid.catEmitida ? 'CAT Emitida' : 'Cat Pendente'}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="openModal(renderDetailsAcidente(${acid.id}), 'max-w-2xl')" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Visualizar Detalhes">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                    <button onclick="openModal(renderFormAcidente(${acid.id}))" class="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Editar">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
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
const renderFormEmpresa = (id = null) => {
  const empresa = id ? appState.empresas.find(e => e.id == id) : null;
  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100">
      <h3 class="text-xl font-bold text-slate-900">${empresa ? 'Editar Empresa' : 'Nova Empresa'}</h3>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    <form id="form-empresa" class="p-6 space-y-5" onsubmit="window.handleSaveEmpresa(event)">
      <input type="hidden" id="emp-id" value="${id || ''}">
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">Razão Social</label>
        <input type="text" id="razao-social" value="${empresa ? empresa.nome : ''}" required placeholder="Ex: Construtora Alpha S.A" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900">
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">CNPJ</label>
        <input type="text" id="cnpj" value="${empresa ? empresa.cnpj : ''}" required placeholder="00.000.000/0000-00" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900">
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">Setor de Atuação</label>
        <select id="setor" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900">
          <option value="">Selecione o setor...</option>
          <option value="limpeza" ${empresa?.setor === 'Sistema de limpeza' ? 'selected' : ''}>Sistema de limpeza</option>
          <option value="industrial" ${empresa?.setor === 'Serviço industrial' ? 'selected' : ''}>Serviço industrial</option>
        </select>
      </div>
      
      <div class="pt-4 flex items-center justify-end gap-3">
        <button type="button" onclick="closeModal()" class="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancelar</button>
        <button type="submit" class="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all">Salvar Empresa</button>
      </div>
    </form>
  `;
};
window.renderFormEmpresa = renderFormEmpresa;

// Formulário: Novo Funcionário
const renderFormFuncionario = (id = null) => {
  const func = id ? appState.funcionarios.find(f => f.id == id) : null;
  const empresasLimpeza = appState.empresas.filter(e => e.setor === 'Sistema de limpeza');
  const empresasIndustrial = appState.empresas.filter(e => e.setor === 'Serviço industrial');

  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100">
      <h3 class="text-xl font-bold text-slate-900">${func ? 'Editar Funcionário' : 'Novo Funcionário'}</h3>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    <form id="form-funcionario" class="p-6 space-y-4 max-h-[70vh] overflow-y-auto" onsubmit="window.handleSaveFuncionario(event)">
      <input type="hidden" id="func-id" value="${id || ''}">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Matrícula</label>
          <input type="text" id="func-matricula" value="${func ? func.matricula : ''}" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">CPF</label>
          <input type="text" id="func-cpf" value="${func ? func.cpf : ''}" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
        </div>
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">Nome Completo</label>
        <input type="text" id="func-nome" value="${func ? func.nome : ''}" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Data de Nascimento</label>
          <input type="date" id="func-nascimento" value="${func ? func.dataNascimento : ''}" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Data de Admissão</label>
          <input type="date" id="func-admissao" value="${func ? func.dataAdmissao : ''}" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
        </div>
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">Cargo</label>
        <input type="text" id="func-cargo" value="${func ? func.cargo : ''}" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">Empresa</label>
        <select id="func-empresa" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
          <option value="">Selecione a empresa...</option>
          ${empresasIndustrial.length > 0 ? `<optgroup label="Serviço industrial">${empresasIndustrial.map(e => `<option value="${e.id}" ${func?.empresaId == e.id ? 'selected' : ''}>${e.nome}</option>`).join('')}</optgroup>` : ''}
          ${empresasLimpeza.length > 0 ? `<optgroup label="Sistema de limpeza">${empresasLimpeza.map(e => `<option value="${e.id}" ${func?.empresaId == e.id ? 'selected' : ''}>${e.nome}</option>`).join('')}</optgroup>` : ''}
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
const renderFormDocumento = (id = null) => {
  const doc = id ? appState.documentos.find(d => d.id == id) : null;
  const defaultTipos = ['PGR', 'PCMSO', 'LTCAT'];
  const customTipos = [...new Set(appState.documentos.map(d => d.tipo))].filter(t => !defaultTipos.includes(t));
  const todosTipos = [...defaultTipos, ...customTipos];

  const empresasPorSetor = appState.empresas.reduce((acc, emp) => {
    const setor = emp.setor || 'Outros';
    if (!acc[setor]) acc[setor] = [];
    acc[setor].push(emp);
    return acc;
  }, {});

  const empresasOptions = Object.keys(empresasPorSetor).map(setor => `
    <optgroup label="${setor}">
      ${empresasPorSetor[setor].map(e => `<option value="${e.id}" ${doc?.empresaId == e.id ? 'selected' : ''}>${e.nome}</option>`).join('')}
    </optgroup>
  `).join('');

  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100">
      <h3 class="text-xl font-bold text-slate-900">${doc ? 'Editar Documento' : 'Novo Documento'}</h3>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    <form id="form-documento" class="p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-hide" onsubmit="window.handleSaveDocumento(event)">
      <input type="hidden" id="doc-id" value="${id || ''}">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-sm font-semibold text-slate-700">Tipo de Documento</label>
            <button type="button" onclick="const p=document.getElementById('novo-tipo-doc'); const s=document.getElementById('doc-tipo'); p.classList.toggle('hidden'); s.required = p.classList.contains('hidden');" class="text-[10px] uppercase tracking-wider font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md border border-indigo-100">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              Novo
            </button>
          </div>
          <select id="doc-tipo" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
            <option value="">Selecione...</option>
            ${todosTipos.map(t => `<option value="${t}" ${doc?.tipo === t ? 'selected' : ''}>${t}</option>`).join('')}
          </select>
          <div id="novo-tipo-doc" class="hidden mt-3 bg-indigo-50/50 border border-indigo-100/60 p-3 rounded-xl space-y-2 relative">
            <p class="text-[10px] font-bold text-indigo-800 uppercase tracking-wider mb-1">Cadastrar Novo Tipo</p>
            <input type="text" id="doc-novo-tipo-sigla" placeholder="Sigla (ex: AET)" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
            <input type="text" id="doc-novo-tipo-desc" placeholder="Descrição (ex: Análise Ergonômica)" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
            <button type="button" onclick="window.addTipoDocumento()" class="w-full py-1.5 bg-indigo-600 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-indigo-700 transition-colors mt-1">Incorporar à Lista</button>
          </div>
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Empresa</label>
          <select id="doc-empresa" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
            <option value="">Selecione...</option>
            ${empresasOptions}
          </select>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Data de Elaboração</label>
          <input type="date" id="doc-elaboracao" value="${doc ? doc.dataEmissao : ''}" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Data de Revisão</label>
          <input type="date" id="doc-revisao" value="${doc ? doc.dataVencimento : ''}" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
        </div>
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">Observações</label>
        <textarea id="doc-obs" rows="3" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">${doc ? doc.observacoes : ''}</textarea>
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
const renderFormTreinamento = (id = null) => {
  const trei = id ? appState.treinamentos.find(t => t.id == id) : null;
  const empresas = appState.empresas;
  const funcionarios = appState.funcionarios;

  // Tipos dinâmicos baseados no que já existe no estado
  const defaultTipos = ['NR-35', 'NR-10', 'NR-33'];
  const customTipos = [...new Set(appState.treinamentos.map(t => t.tipo))].filter(t => !defaultTipos.includes(t));
  const todosTipos = [...defaultTipos, ...customTipos].sort();

  const getTipoLabel = (tipo) => {
    if (tipo === 'NR-35') return 'NR-35 (Trabalho em Altura)';
    if (tipo === 'NR-10') return 'NR-10 (Elétrica)';
    if (tipo === 'NR-33') return 'NR-33 (Espaço Confinado)';
    return tipo;
  };

  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100">
      <h3 class="text-xl font-bold text-slate-900">${trei ? 'Editar Treinamento' : 'Registrar Treinamento'}</h3>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    <form id="form-treinamento" class="p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-hide" onsubmit="window.handleSaveTreinamento(event)">
      <input type="hidden" id="trei-id" value="${id || ''}">
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
            ${todosTipos.map(t => `<option value="${t}" ${trei?.tipo === t ? 'selected' : ''}>${getTipoLabel(t)}</option>`).join('')}
          </select>
          <div id="novo-tipo-treinamento" class="hidden mt-3 bg-indigo-50/50 border border-indigo-100/60 p-3 rounded-xl space-y-2 relative">
            <p class="text-[10px] font-bold text-indigo-800 uppercase tracking-wider mb-1">Cadastrar Novo Tipo</p>
            <input type="text" id="trei-novo-tipo-sigla" placeholder="Sigla/NR (ex: NR-12)" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
            <input type="text" id="trei-novo-tipo-desc" placeholder="Descrição (ex: Segurança em Máquinas)" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
            <button type="button" onclick="window.addTipoTreinamento()" class="w-full py-1.5 bg-indigo-600 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-indigo-700 transition-colors mt-1">Incorporar à Lista</button>
          </div>
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Funcionário</label>
          <select id="trei-funcionario" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
            <option value="">Selecione...</option>
            ${empresas.map(emp => `
              <optgroup label="${emp.nome}">
                ${funcionarios.filter(f => f.empresaId == emp.id).map(f => `
                  <option value="${f.id}" ${trei?.funcionarioId == f.id ? 'selected' : ''}>${f.nome} - Mat: ${f.matricula}</option>
                `).join('')}
              </optgroup>
            `).join('')}
          </select>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Data de Realização</label>
          <input type="date" id="trei-realizacao" value="${trei ? trei.dataRealizacao : ''}" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Data de Vencimento</label>
          <input type="date" id="trei-vencimento" value="${trei ? trei.dataVencimento : ''}" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
        </div>
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">Matrícula do Instrutor <span class="text-slate-400 font-normal">- Opcional</span></label>
        <input type="text" id="trei-instrutor" value="${trei ? trei.instrutor : ''}" placeholder="Ex: 90012" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">Observações</label>
        <textarea id="trei-obs" rows="2" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">${trei ? trei.observacoes || '' : ''}</textarea>
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
const renderFormAso = (id = null) => {
  const aso = id ? appState.asos.find(a => a.id == id) : null;
  const empresas = appState.empresas;
  const funcionarios = appState.funcionarios;

  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100">
      <h3 class="text-xl font-bold text-slate-900">${aso ? 'Editar ASO' : 'Registrar ASO'}</h3>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    <form id="form-aso" class="p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-hide" onsubmit="window.handleSaveAso(event)">
      <input type="hidden" id="aso-id" value="${id || ''}">
      <div class="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 mb-4">
        <label class="block text-sm font-semibold text-indigo-900 mb-2">Selecionar Funcionário</label>
        <select id="aso-funcionario" required onchange="window.updateAsoEmployeeInfo(this.value)" class="w-full px-4 py-2 bg-white border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm mb-3">
          <option value="">Selecione...</option>
          ${empresas.map(emp => `
            <optgroup label="${emp.nome}">
              ${funcionarios.filter(f => f.empresaId == emp.id).map(f => `
                <option value="${f.id}" ${aso?.funcionarioId == f.id ? 'selected' : ''}>${f.nome} - ${emp.nome}</option>
              `).join('')}
            </optgroup>
          `).join('')}
        </select>
        <div class="grid grid-cols-3 gap-3 text-xs text-indigo-800">
          <div id="aso-info-cpf"><span class="font-bold">CPF:</span> ${aso ? funcionarios.find(f => f.id == aso.funcionarioId)?.cpf : 'Selecione...'}</div>
          <div id="aso-info-cargo"><span class="font-bold">Cargo:</span> ${aso ? funcionarios.find(f => f.id == aso.funcionarioId)?.cargo : 'Selecione...'}</div>
          <div id="aso-info-empresa"><span class="font-bold">Empresa:</span> ${aso ? aso.empresaNome : 'Selecione...'}</div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Tipo de ASO</label>
          <select id="aso-tipo" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
            <option value="Admissional" ${aso?.tipo === 'Admissional' ? 'selected' : ''}>Admissional</option>
            <option value="Periodico" ${aso?.tipo === 'Periodico' ? 'selected' : ''}>Periódico</option>
            <option value="Demissional" ${aso?.tipo === 'Demissional' ? 'selected' : ''}>Demissional</option>
            <option value="Retorno" ${aso?.tipo === 'Retorno' ? 'selected' : ''}>Retorno ao Trabalho</option>
            <option value="Mudanca" ${aso?.tipo === 'Mudanca' ? 'selected' : ''}>Mudança de Risco</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Aptidão</label>
          <select id="aso-aptidao" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm text-slate-900 font-semibold">
            <option value="Apto" ${aso?.aptidao === 'Apto' ? 'selected' : ''}>APTO</option>
            <option value="Inapto" ${aso?.aptidao === 'Inapto' ? 'selected' : ''}>INAPTO</option>
          </select>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Data de Realização</label>
          <input type="date" id="aso-realizacao" value="${aso ? aso.dataRealizacao : ''}" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Data de Validade</label>
          <input type="date" id="aso-vencimento" value="${aso ? aso.dataVencimento : ''}" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
        </div>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-semibold text-slate-700 mb-1">Exames Complementares</label>
        <div class="flex gap-2">
          <input type="text" id="aso-exame-nome" placeholder="Nome do exame" class="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
          <input type="date" id="aso-exame-data" class="w-36 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
          <button type="button" onclick="window.addExameAso()" class="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          </button>
        </div>
        <div id="aso-exames-list" class="space-y-2 max-h-32 overflow-y-auto pr-1">
          ${aso?.exames ? aso.exames.split(',').filter(ex => ex.trim() !== '').map(ex => {
            const parts = ex.trim().split('(');
            const nome = parts[0].trim();
            const data = parts[1] ? parts[1].replace(')', '').trim() : '-';
            return `
              <div class="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100 text-xs shadow-sm">
                <span class="font-medium text-slate-700">${nome} <span class="text-slate-400">(${data})</span></span>
                <button type="button" onclick="this.parentElement.remove()" class="text-slate-400 hover:text-red-500 p-1 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            `;
          }).join('') : ''}
        </div>
      </div>

      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">Observações</label>
        <textarea id="aso-obs" rows="2" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">${aso ? aso.observacoes || '' : ''}</textarea>
      </div>
      
      <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
        <button type="button" onclick="closeModal()" class="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancelar</button>
        <button type="submit" class="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all">Salvar ASO</button>
      </div>
    </form>
  `;
};
window.renderFormAso = renderFormAso;

// Formulário: Acidente (CAT)
const renderFormAcidente = (id = null) => {
  const acid = id ? appState.acidentes.find(a => a.id == id) : null;
  const empresas = appState.empresas;
  const funcionarios = appState.funcionarios;

  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-slate-900">${acid ? 'Editar Registro (CAT)' : 'Registrar Acidente (CAT)'}</h3>
      </div>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    <form id="form-acidente" class="p-6 space-y-5 max-h-[75vh] overflow-y-auto scrollbar-hide" onsubmit="window.handleSaveAcidente(event)">
      <input type="hidden" id="acid-id" value="${id || ''}">

      <!-- Seção 1: Dados do Acidentado -->
      <div class="bg-red-50/50 p-4 rounded-xl border border-red-100/60">
        <p class="text-[10px] font-bold text-red-800 uppercase tracking-wider mb-3">1. Dados do Acidentado</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Funcionário</label>
            <select id="acid-funcionario" required class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm">
              <option value="">Selecione...</option>
              ${empresas.map(emp => `
                <optgroup label="${emp.nome}">
                  ${funcionarios.filter(f => f.empresaId == emp.id).map(f => `
                    <option value="${f.id}" ${acid?.funcionarioId == f.id ? 'selected' : ''}>${f.nome} - Mat: ${f.matricula}</option>
                  `).join('')}
                </optgroup>
              `).join('')}
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Tipo de Acidente</label>
            <select id="acid-tipo" required class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
              <option value="Tipico" ${acid?.tipo === 'Tipico' ? 'selected' : ''}>Típico</option>
              <option value="Trajeto" ${acid?.tipo === 'Trajeto' ? 'selected' : ''}>De Trajeto</option>
              <option value="Doenca" ${acid?.tipo === 'Doenca' ? 'selected' : ''}>Doença Ocupacional</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">CAT Emitida?</label>
            <div class="flex items-center h-[42px] bg-white border border-slate-200 rounded-xl px-4">
              <input type="checkbox" id="acid-cat-emitida" ${acid?.catEmitida ? 'checked' : ''} class="w-5 h-5 text-red-600 border-slate-300 rounded focus:ring-red-500/20 transition-all cursor-pointer">
              <label for="acid-cat-emitida" class="ml-2 text-sm text-slate-600 font-medium cursor-pointer">Sim, a CAT já foi emitida</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Seção 2: Dados do Acidente -->
      <div class="bg-slate-50/50 p-4 rounded-xl border border-slate-100/60">
        <p class="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-3">2. Dados do Acidente</p>
        <div class="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Data</label>
            <input type="date" id="acid-data" value="${acid ? acid.data : ''}" required class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Hora</label>
            <input type="time" id="acid-hora" value="${acid ? acid.hora : ''}" required class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Local</label>
            <input type="text" id="acid-local" value="${acid ? acid.local || '' : ''}" placeholder="Ex: Galpão, Setor C" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
          </div>
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Descrição Detalhada</label>
          <textarea id="acid-descricao" rows="3" required placeholder="Como ocorreu o evento..." class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">${acid ? acid.descricao : ''}</textarea>
        </div>
      </div>

      <!-- Seção 3: Dados Médicos -->
      <div class="bg-blue-50/50 p-4 rounded-xl border border-blue-100/60">
        <p class="text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-3">3. Diagnóstico e Atendimento</p>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Parte do Corpo Atingida</label>
            <input type="text" id="acid-parte-corpo" value="${acid ? acid.parteCorpo || '' : ''}" placeholder="Ex: Mão direita" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Agente Causador</label>
            <input type="text" id="acid-agente" value="${acid ? acid.agente || '' : ''}" placeholder="Ex: Queda, Máquina" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm">
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">CID</label>
            <input type="text" id="acid-cid" value="${acid ? acid.cid || '' : ''}" placeholder="Ex: S61.0" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Afastamento?</label>
            <select id="acid-afastamento" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm">
              <option value="Nao" ${acid?.afastamento === 'Nao' ? 'selected' : ''}>Não</option>
              <option value="Sim" ${acid?.afastamento === 'Sim' ? 'selected' : ''}>Sim</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Houve Óbito?</label>
            <select id="acid-obito" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm">
              <option value="Nao" ${acid?.obito === 'Nao' ? 'selected' : ''}>Não</option>
              <option value="Sim" ${acid?.obito === 'Sim' ? 'selected' : ''}>Sim</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Médico Responsável</label>
            <input type="text" id="acid-medico" value="${acid ? acid.medico || '' : ''}" placeholder="Nome do médico" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">CRM</label>
            <input type="text" id="acid-crm" value="${acid ? acid.crm || '' : ''}" placeholder="CRM e UF" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm">
          </div>
        </div>
      </div>

      <!-- Seção 4: Testemunhas -->
      <div class="bg-amber-50/50 p-4 rounded-xl border border-amber-100/60">
        <p class="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-3">4. Testemunhas</p>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Nome</label>
            <input type="text" id="acid-testemunha-nome" value="${acid ? acid.testemunhaNome || '' : ''}" placeholder="Nome completo" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Telefone</label>
            <input type="text" id="acid-testemunha-tel" value="${acid ? acid.testemunhaTelefone || '' : ''}" placeholder="(00) 00000-0000" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm">
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


// Formulário: Gestão de Compras (EPI/Uniforme) com Distribuição
const renderFormEpi = () => {
  const empresas = appState.empresas || [];
  const empresasIndustrial = empresas.filter(e => e.setor === 'Serviço industrial');
  const empresasLimpeza = empresas.filter(e => e.setor === 'Sistema de limpeza');

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
              <input type="text" id="epi-nf" value="${cartState.nf || ''}" placeholder="000.000" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Data da Compra</label>
              <input type="date" id="epi-data" value="${cartState.data || ''}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100">
          <h4 class="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Adicionar Item</h4>
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Tipo de Item</label>
              <select id="epi-item-tipo" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
                <option value="EPI">EPI - Equipamento de Proteção</option>
                <option value="Uniforme">Uniforme</option>
              </select>
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div class="col-span-2">
                <label class="block text-xs font-semibold text-slate-700 mb-1">Descrição</label>
                <input type="text" id="epi-item-desc" placeholder="Ex: Bota de Segurança" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">CA <span class="font-normal text-slate-400">(Opc)</span></label>
                <input type="text" id="epi-item-ca" placeholder="12345" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Quantidade Total</label>
                <input type="number" id="epi-item-qtd" value="1" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Valor Unitário (R$)</label>
                <input type="text" id="epi-item-valor" placeholder="0,00" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
              </div>
            </div>
            <button type="button" onclick="window.addItemToCart()" class="w-full mt-2 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors flex justify-center items-center gap-2">
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
          
          ${cartState.items.length === 0 ? `
            <div class="flex flex-col items-center justify-center h-64 text-slate-400">
              <svg class="w-12 h-12 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <p class="text-sm font-medium">O carrinho está vazio.</p>
            </div>
          ` : cartState.items.map((item, idx) => {
            const totalDistribuido = item.distribuicoes.reduce((acc, d) => acc + d.quantidade, 0);
            const pendente = item.quantidade - totalDistribuido;
            
            return `
              <div class="bg-white border border-slate-200 rounded-xl p-4 mb-4 shadow-sm">
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <p class="font-bold text-sm text-slate-900">${item.descricao} ${item.ca ? `<span class="text-xs font-normal text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded ml-1">CA ${item.ca}</span>` : ''}</p>
                    <p class="text-xs text-slate-500 mt-1">Qtd total: ${item.quantidade} | R$ ${item.valorUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} un</p>
                  </div>
                  <button onclick="window.removeItemFromCart(${idx})" class="text-slate-400 hover:text-red-500 p-1 rounded transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                </div>
                
                <div class="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50">
                  <p class="text-xs font-bold text-indigo-900 mb-2 uppercase tracking-wide">Distribuir entre as Empresas:</p>
                  
                  <div class="flex items-center gap-2 mb-3">
                    <select id="dist-emp-select-${idx}" class="flex-1 px-2 py-1.5 bg-white border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500">
                      <option value="">Selecione...</option>
                      ${empresasIndustrial.length > 0 ? `<optgroup label="Serviço industrial">${empresasIndustrial.map(e => `<option value="${e.id}">${e.nome}</option>`).join('')}</optgroup>` : ''}
                      ${empresasLimpeza.length > 0 ? `<optgroup label="Sistema de limpeza">${empresasLimpeza.map(e => `<option value="${e.id}">${e.nome}</option>`).join('')}</optgroup>` : ''}
                    </select>
                    <input type="number" id="dist-emp-qtd-${idx}" value="${pendente}" max="${pendente}" placeholder="Qtd" class="w-16 px-2 py-1.5 bg-white border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    <button onclick="window.addDistribution(${idx})" class="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-1.5 rounded text-xs font-bold transition-colors">OK</button>
                  </div>

                  <!-- Distribuiçao adicionada -->
                  <div class="space-y-1.5">
                    ${item.distribuicoes.map((dist, dIdx) => `
                      <div class="flex items-center justify-between text-xs py-1.5 border-t border-indigo-100/50 text-slate-700">
                        <span class="truncate pr-2">${dist.empresaNome}</span>
                        <div class="flex items-center gap-2">
                          <span class="font-bold whitespace-nowrap">${dist.quantidade} un</span>
                          <button onclick="window.removeDistribution(${idx}, ${dIdx})" class="text-slate-400 hover:text-red-500"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                        </div>
                      </div>
                    `).join('')}
                  </div>

                  <div class="mt-2 text-xs text-right font-bold ${totalDistribuido === item.quantidade ? 'text-emerald-600' : 'text-amber-600'}">
                    Total distribuído: ${totalDistribuido}/${item.quantidade} ${totalDistribuido === item.quantidade ? '✓' : ''}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Footer do Carrinho -->
        <div class="p-6 bg-white border-t border-slate-100 flex flex-col justify-between">
          <div class="flex justify-between items-center mb-4">
            <span class="text-sm font-bold text-slate-500 uppercase tracking-wider">Valor Total NF:</span>
            <span class="text-2xl font-black text-indigo-600">R$ ${cartState.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div class="flex gap-3">
            <button onclick="closeModal()" class="flex-1 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancelar Compra</button>
            <button onclick="window.handleSaveCompraEpi(event)" class="flex-1 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all">Salvar Nota Fiscal</button>
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

  const funcionariosEmpresa = appState.funcionarios.filter(f => f.empresaId == id);
  
  const cargosCount = funcionariosEmpresa.reduce((acc, f) => {
    acc[f.cargo] = (acc[f.cargo] || 0) + 1;
    return acc;
  }, {});

  const funcoesHtml = Object.keys(cargosCount).length > 0 
    ? Object.entries(cargosCount).map(([cargo, count]) => `
      <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
        <span class="text-sm font-semibold text-slate-700">${cargo}</span>
        <span class="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-md">${count}</span>
      </div>
    `).join('')
    : '<div class="col-span-full p-3 text-sm text-slate-500 text-center">Nenhum funcionário cadastrado.</div>';

  const documentosEmpresa = (appState.documentos || []).filter(d => d.empresaId == id);
  const documentosHtml = documentosEmpresa.length > 0
    ? documentosEmpresa.map(doc => `
      <div class="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm border border-emerald-100">${doc.tipo}</div>
          <div>
            <p class="text-sm font-bold text-slate-900">${doc.tipo}</p>
            <p class="text-xs text-slate-500 mt-0.5">${doc.status === 'Válido' ? 'Válido até ' + doc.dataVencimento : (doc.status || 'Sem vencimento')}</p>
          </div>
        </div>
        <button class="text-indigo-600 hover:text-indigo-800 text-sm font-bold px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100">Ver PDF</button>
      </div>
    `).join('')
    : '<div class="p-3 text-sm text-slate-500 text-center">Nenhum documento cadastrado.</div>';

  const cipaHtml = funcionariosEmpresa.length > 0
    ? funcionariosEmpresa.map(f => `
      <tr class="hover:bg-slate-50/50">
        <td class="px-4 py-3 text-sm font-semibold text-slate-800">${f.nome}</td>
        <td class="px-4 py-3 text-sm text-slate-600">${f.cargo}</td>
        <td class="px-4 py-3 text-center">
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" ${f.isCipa ? 'checked' : ''} onchange="window.toggleCipa(${f.id}, this.checked)">
            <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
        </td>
      </tr>
    `).join('')
    : '<tr><td colspan="3" class="px-4 py-3 text-sm text-slate-500 text-center">Nenhum funcionário cadastrado.</td></tr>';

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
          ${funcoesHtml}
        </div>
      </div>

      <!-- Seção: Documentos -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Documentos Ativos
        </h4>
        <div class="space-y-3">
          ${documentosHtml}
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
              ${cipaHtml}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
};
window.renderDetailsEmpresa = renderDetailsEmpresa;

const renderDetailsFuncionario = (id) => {
  const func = appState.funcionarios.find(f => f.id == id);
  if (!func) return '<div class="p-10 text-center font-bold text-slate-500">Funcionário não encontrado.</div>';

  const asosFunc = (appState.asos || []).filter(a => a.funcionarioId == func.id).sort((a, b) => new Date(b.dataRealizacao) - new Date(a.dataRealizacao));
  const asoAtual = asosFunc.length > 0 ? asosFunc[0] : null;

  const treinamentosFunc = (appState.treinamentos || []).filter(t => t.funcionarioId == func.id);
  const acidentesFunc = (appState.acidentes || []).filter(a => a.funcionarioId == func.id);

  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg border border-indigo-100">${func.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}</div>
        <div>
          <h3 class="text-xl font-bold text-slate-900">${func.nome}</h3>
          <p class="text-sm text-slate-500 font-medium mt-0.5">Matrícula: #${func.matricula}</p>
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
              <span class="font-semibold text-slate-900">${func.cpf}</span>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">Nascimento:</span>
              <span class="font-semibold text-slate-900">${func.dataNascimento ? func.dataNascimento.split('-').reverse().join('/') : '-'}</span>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">Admissão:</span>
              <span class="font-semibold text-slate-900">${func.dataAdmissao ? func.dataAdmissao.split('-').reverse().join('/') : '-'}</span>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">Cargo:</span>
              <span class="font-semibold text-slate-900">${func.cargo}</span>
            </div>
            <div class="flex justify-between pt-1">
              <span class="text-slate-500">Vínculo:</span>
              <span class="font-bold text-indigo-600">${func.empresaNome}</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">ASO Atual</h4>
          <div class="flex-1 flex flex-col justify-center">
            ${asoAtual ? `
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-xl ${asoAtual.aptidao === 'Apto' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'} flex items-center justify-center border">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${asoAtual.aptidao === 'Apto' ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'}"></path></svg>
              </div>
              <div>
                <p class="font-bold text-slate-900 text-lg">${asoAtual.aptidao === 'Apto' ? 'APTO' : 'INAPTO'}</p>
                <p class="text-sm text-slate-500">Exame ${asoAtual.tipo}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div>
                <span class="block text-xs text-slate-400 mb-0.5">Realização</span>
                <span class="font-semibold text-slate-700">${asoAtual.dataRealizacao.split('-').reverse().join('/')}</span>
              </div>
              <div>
                <span class="block text-xs text-slate-400 mb-0.5">Validade</span>
                <span class="font-semibold text-slate-700">${asoAtual.dataVencimento.split('-').reverse().join('/')}</span>
              </div>
            </div>
            ` : `
            <div class="flex items-center justify-center p-6 bg-slate-50 border border-dashed border-slate-300 rounded-xl h-full">
              <div class="text-center">
                <p class="text-sm font-semibold text-slate-600">Nenhum ASO registrado</p>
              </div>
            </div>
            `}
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
          ${treinamentosFunc.length > 0 ? treinamentosFunc.map(t => `
          <div class="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm border border-purple-100">${t.tipo.replace('NR-', '')}</div>
              <div>
                <p class="text-sm font-bold text-slate-900">${t.tipo}</p>
                <p class="text-xs text-slate-500 mt-0.5">Válido até ${t.dataVencimento.split('-').reverse().join('/')}</p>
              </div>
            </div>
            <span class="inline-flex items-center px-2 py-1 ${t.status === 'Válido' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : (t.status === 'Vencendo' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200')} rounded text-xs font-bold border">${t.status}</span>
          </div>
          `).join('') : `
          <div class="flex items-center justify-center p-6 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
            <div class="text-center">
              <p class="text-sm font-semibold text-slate-600">Nenhum treinamento registrado</p>
            </div>
          </div>
          `}
        </div>
      </div>

      <!-- Acidentes -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          Histórico de Acidentes (CAT)
        </h4>
        ${acidentesFunc.length > 0 ? `
        <div class="space-y-3">
          ${acidentesFunc.map(a => `
          <div class="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm border border-red-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <div>
                <p class="text-sm font-bold text-slate-900">${a.data.split('-').reverse().join('/')} - ${a.hora}h</p>
                <p class="text-xs text-slate-500 mt-0.5">${a.tipo}</p>
              </div>
            </div>
            <span class="inline-flex items-center px-2 py-1 ${a.status === 'CAT Emitida' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-700 border-slate-200'} rounded text-xs font-bold border">${a.status}</span>
          </div>
          `).join('')}
        </div>
        ` : `
        <div class="flex items-center justify-center p-6 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
          <div class="text-center">
            <svg class="w-8 h-8 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p class="text-sm font-semibold text-slate-600">Nenhum acidente registrado</p>
            <p class="text-xs text-slate-400 mt-1">Este funcionário não possui histórico de ocorrências.</p>
          </div>
        </div>
        `}
      </div>

    </div>
  `;
};
window.renderDetailsFuncionario = renderDetailsFuncionario;

const renderDetailsDocumento = (id) => {
  const doc = appState.documentos.find(d => d.id == id);
  if (!doc) return '<div class="p-10 text-center font-bold text-slate-500">Documento não encontrado.</div>';

  const formatData = formatDate;

  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-100">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        </div>
        <div>
          <h3 class="text-xl font-bold text-slate-900">${doc.tipo}</h3>
          <p class="text-sm text-slate-500 font-medium mt-0.5">${doc.nome || doc.tipo}</p>
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
            <span class="font-bold text-indigo-600">${doc.empresaNome}</span>
          </div>
          <div>
            <span class="block text-slate-500 mb-1">Status</span>
            <span class="inline-flex items-center px-2 py-1 ${doc.status === 'Válido' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : (doc.status === 'Vencendo' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200')} rounded text-xs font-bold border">${doc.status}</span>
          </div>
          <div>
            <span class="block text-slate-500 mb-1">Data de Elaboração</span>
            <span class="font-semibold text-slate-900">${formatData(doc.dataEmissao)}</span>
          </div>
          <div>
            <span class="block text-slate-500 mb-1">Data de Revisão</span>
            <span class="font-semibold text-slate-900">${formatData(doc.dataVencimento)}</span>
          </div>
        </div>
      </div>

      <!-- Observações -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Observações Adicionais</h4>
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p class="text-sm text-slate-700 leading-relaxed">${doc.observacoes || 'Nenhuma observação registrada.'}</p>
        </div>
      </div>

      <!-- Anexos -->
      <div class="bg-indigo-600 p-5 rounded-2xl shadow-[0_2px_10px_rgba(79,70,229,0.2)] text-white flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
          </div>
          <div>
            <p class="font-bold text-lg">${doc.tipo}_${doc.empresaNome.replace(/\s+/g, '_')}.pdf</p>
            <p class="text-indigo-200 text-sm">PDF</p>
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

const renderDetailsTreinamento = (id) => {
  const trei = appState.treinamentos.find(t => t.id == id);
  if (!trei) return '<div class="p-10 text-center font-bold text-slate-500">Treinamento não encontrado.</div>';

  const func = appState.funcionarios.find(f => f.id == trei.funcionarioId);
  const initials = func ? func.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';
  
  const instrutorFunc = appState.funcionarios.find(f => f.matricula == trei.instrutor);

  const getDescricao = (t) => {
    if (t === 'NR-35') return 'Trabalho em Altura';
    if (t === 'NR-10') return 'Elétrica';
    if (t === 'NR-33') return 'Espaço Confinado';
    return 'Treinamento de Segurança';
  };

  const statusClass = trei.status === 'Válido' ? 'bg-emerald-600' : (trei.status === 'Vencendo' ? 'bg-amber-600' : 'bg-red-600');
  const statusTextClass = trei.status === 'Válido' ? 'text-emerald-800' : (trei.status === 'Vencendo' ? 'text-amber-800' : 'text-red-800');
  const statusBgClass = trei.status === 'Válido' ? 'bg-emerald-50 border-emerald-100' : (trei.status === 'Vencendo' ? 'bg-amber-50 border-amber-100' : 'bg-red-50 border-red-100');

  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg border border-purple-100">
          ${trei.tipo.replace('NR-', '').substring(0, 2)}
        </div>
        <div>
          <h3 class="text-xl font-bold text-slate-900">${trei.tipo}</h3>
          <p class="text-sm text-slate-500 font-medium mt-0.5">${getDescricao(trei.tipo)}</p>
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
              <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100">${initials}</div>
              <div>
                <p class="font-bold text-slate-900 text-base">${trei.funcionarioNome}</p>
                <p class="text-xs text-slate-500">Matrícula: #${func ? func.matricula : 'N/A'}</p>
              </div>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">Cargo:</span>
              <span class="font-semibold text-slate-900">${func ? func.cargo : 'N/A'}</span>
            </div>
            <div class="flex justify-between pt-1">
              <span class="text-slate-500">Empresa:</span>
              <span class="font-bold text-indigo-600">${trei.empresaNome}</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Status e Datas</h4>
          <div class="flex items-center justify-between ${statusBgClass} p-3 rounded-lg border mb-4">
            <span class="font-bold ${statusTextClass}">Situação Atual:</span>
            <span class="inline-flex items-center px-3 py-1 ${statusClass} text-white rounded text-xs font-bold shadow-sm">${trei.status}</span>
          </div>
          <div class="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div>
              <span class="block text-xs text-slate-400 mb-1">Realização</span>
              <span class="font-bold text-slate-700">${trei.dataRealizacao.split('-').reverse().join('/')}</span>
            </div>
            <div>
              <span class="block text-xs text-slate-400 mb-1">Vencimento</span>
              <span class="font-bold text-slate-700">${trei.dataVencimento.split('-').reverse().join('/')}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Informações do Instrutor -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between">
        <div>
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Instrutor Responsável</h4>
          <p class="font-bold text-slate-800 text-lg">${instrutorFunc ? instrutorFunc.nome : (trei.instrutor || 'Não informado')}</p>
          <p class="text-sm text-slate-500">Registro/Matrícula: ${instrutorFunc ? '#' + instrutorFunc.matricula : 'N/A'}</p>
        </div>
        <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
        </div>
      </div>

      <!-- Observações -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Observações Adicionais</h4>
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p class="text-sm text-slate-700 leading-relaxed">${trei.observacoes || 'Nenhuma observação adicional.'}</p>
        </div>
      </div>

      <!-- Anexos -->
      <div class="bg-purple-600 p-5 rounded-2xl shadow-[0_2px_10px_rgba(147,51,234,0.2)] text-white flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <div>
            <p class="font-bold text-lg">Certificado_${trei.tipo.replace(/\s+/g, '_')}_${trei.funcionarioNome.replace(/\s+/g, '')}.pdf</p>
            <p class="text-purple-200 text-sm">PDF (MocK)</p>
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

const renderDetailsAso = (id) => {
  const aso = appState.asos.find(a => a.id == id);
  if (!aso) return '<div class="p-10 text-center font-bold text-slate-500">ASO não encontrado.</div>';

  const func = appState.funcionarios.find(f => f.id == aso.funcionarioId);
  const initials = func ? func.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';

  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl ${aso.aptidao === 'Inapto' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'} flex items-center justify-center border">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        </div>
        <div>
          <h3 class="text-xl font-bold text-slate-900">ASO - ${aso.tipo}</h3>
          <p class="text-sm text-slate-500 font-medium mt-0.5">${aso.funcionarioNome} • ${aso.empresaNome}</p>
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
              <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100">${initials}</div>
              <div>
                <p class="font-bold text-slate-900 text-base">${aso.funcionarioNome}</p>
                <p class="text-xs text-slate-500">CPF: ${func?.cpf || 'N/A'}</p>
              </div>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">Cargo:</span>
              <span class="font-semibold text-slate-900">${func?.cargo || 'N/A'}</span>
            </div>
            <div class="flex justify-between pt-1">
              <span class="text-slate-500">Empresa:</span>
              <span class="font-bold text-indigo-600">${aso.empresaNome}</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Resultado Atual</h4>
          <div class="flex items-center justify-between ${aso.aptidao === 'Inapto' ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'} p-3 rounded-lg border mb-3">
            <span class="font-bold ${aso.aptidao === 'Inapto' ? 'text-red-800' : 'text-emerald-800'}">Aptidão:</span>
            <span class="inline-flex items-center px-4 py-1.5 ${aso.aptidao === 'Inapto' ? 'bg-red-600' : 'bg-emerald-600'} text-white rounded-md text-sm font-bold shadow-sm uppercase">${aso.aptidao || 'Apto'}</span>
          </div>
          <div class="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div>
              <span class="block text-xs text-slate-400 mb-1">Realização</span>
              <span class="font-bold text-slate-700">${aso.dataRealizacao}</span>
            </div>
            <div>
              <span class="block text-xs text-slate-400 mb-1">Validade</span>
              <span class="font-bold ${aso.status === 'Vencido' ? 'text-red-600' : (aso.status === 'Vencendo' ? 'text-amber-600' : 'text-emerald-600')}">${aso.dataVencimento}</span>
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
                <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Data</th>
                <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${aso.exames ? aso.exames.split(',').map(ex => {
                const parts = ex.trim().split('(');
                const nome = parts[0].trim();
                const data = parts[1] ? parts[1].replace(')', '').trim() : '-';
                return `
                  <tr class="hover:bg-slate-50/50">
                    <td class="px-4 py-3 text-sm font-semibold text-slate-800">${nome}</td>
                    <td class="px-4 py-3 text-sm text-slate-600">${data}</td>
                    <td class="px-4 py-3 text-center">
                      <span class="inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs font-bold border border-emerald-200">Realizado</span>
                    </td>
                  </tr>
                `;
              }).join('') : `
                <tr>
                  <td colspan="3" class="px-4 py-6 text-center text-sm text-slate-400 italic">Nenhum exame complementar registrado.</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Observações -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Observações do Médico</h4>
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p class="text-sm text-slate-700 leading-relaxed">${aso.observacoes || 'Nenhuma observação registrada.'}</p>
        </div>
      </div>

      <!-- Histórico de ASOs Anteriores -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Histórico de ASOs Anteriores
        </h4>
        <div class="relative border-l-2 border-slate-200 ml-4 space-y-6">
          ${(() => {
            const history = appState.asos
              .filter(a => a.funcionarioId == aso.funcionarioId && a.id != aso.id)
              .sort((a, b) => new Date(b.dataRealizacao.split('/').reverse().join('-')) - new Date(a.dataRealizacao.split('/').reverse().join('-')));
            
            if (history.length === 0) {
              return '<p class="text-sm text-slate-400 pl-6 italic">Nenhum registro anterior encontrado.</p>';
            }

            return history.map(h => `
              <div class="relative pl-6">
                <div class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-300 border-2 border-white"></div>
                <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div class="flex items-center justify-between mb-2">
                    <div>
                      <p class="font-bold text-slate-800 text-sm">${h.tipo}</p>
                      <p class="text-xs text-slate-500">Realizado em ${h.dataRealizacao}</p>
                    </div>
                    <span class="inline-flex items-center px-2 py-0.5 ${h.aptidao === 'Inapto' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'} rounded text-xs font-bold border uppercase">${h.aptidao || 'Apto'}</span>
                  </div>
                  <p class="text-xs text-slate-500">Validade: ${h.dataVencimento}</p>
                </div>
              </div>
            `).join('');
          })()}
        </div>
      </div>
      </div>

    </div>
  `;
};
window.renderDetailsAso = renderDetailsAso;

const renderDetailsEpi = (id) => {
  const compra = appState.comprasEpi.find(c => c.id == id);
  if (!compra) return '<div class="p-10 text-center font-bold text-slate-500">Nota Fiscal não encontrada.</div>';

  // Agrupar distribuições por empresa para facilitar o render
  const distribuicoesPorEmpresa = (compra.itens || []).reduce((acc, item) => {
    (item.distribuicoes || []).forEach(dist => {
      if (!acc[dist.empresaId]) {
        acc[dist.empresaId] = {
          nome: dist.empresaNome,
          itens: []
        };
      }
      acc[dist.empresaId].itens.push({
        descricao: item.descricao,
        ca: item.ca,
        quantidade: dist.quantidade
      });
    });
    return acc;
  }, {});

  const totalItens = (compra.itens || []).reduce((acc, item) => acc + item.quantidade, 0);

  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        </div>
        <div>
          <h3 class="text-xl font-bold text-slate-900">NF-e ${compra.nf}</h3>
          <p class="text-sm text-slate-500 font-medium mt-0.5">Compra registrada em ${compra.data.split('-').reverse().join('/')}</p>
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
              ${compra.itens.map(item => `
                <tr class="hover:bg-slate-50/50">
                  <td class="px-4 py-3"><span class="inline-flex items-center px-2 py-0.5 ${item.tipo === 'Uniforme' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'} rounded text-xs font-bold border">${item.tipo}</span></td>
                  <td class="px-4 py-3 text-sm font-semibold text-slate-800">${item.descricao}</td>
                  <td class="px-4 py-3 text-sm text-slate-500">${item.ca || '—'}</td>
                  <td class="px-4 py-3 text-sm text-center font-bold text-slate-800">${item.quantidade}</td>
                  <td class="px-4 py-3 text-sm text-right text-slate-600">R$ ${item.valorUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td class="px-4 py-3 text-sm text-right font-bold text-slate-900">R$ ${(item.quantidade * item.valorUnitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot class="bg-indigo-50/50 border-t-2 border-indigo-100">
              <tr>
                <td colspan="3" class="px-4 py-3 text-sm font-bold text-indigo-900 uppercase">Total da NF</td>
                <td class="px-4 py-3 text-sm text-center font-bold text-indigo-900">${totalItens} itens</td>
                <td class="px-4 py-3"></td>
                <td class="px-4 py-3 text-right text-lg font-black text-indigo-600">R$ ${compra.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      ${(() => {
        const itensEmEstoque = (compra.itens || []).filter(item => {
          const totalDist = (item.distribuicoes || []).reduce((acc, d) => acc + d.quantidade, 0);
          return item.quantidade > totalDist;
        }).map(item => ({
          descricao: item.descricao,
          ca: item.ca,
          quantidade: item.quantidade - (item.distribuicoes || []).reduce((acc, d) => acc + d.quantidade, 0)
        }));

        if (itensEmEstoque.length === 0) return '';

        return `
          <!-- Itens em Estoque -->
          <div class="bg-amber-50 p-5 rounded-2xl border border-amber-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <h4 class="text-sm font-bold text-amber-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2m16 4h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 15H4"></path></svg>
              Itens em Estoque (Geral)
            </h4>
            <div class="space-y-2">
              ${itensEmEstoque.map(it => `
                <div class="flex items-center justify-between px-4 py-2.5 bg-white rounded-lg border border-amber-100">
                  <span class="text-sm text-slate-700 font-medium">${it.descricao} ${it.ca ? `<span class="text-xs text-slate-400">CA ${it.ca}</span>` : ''}</span>
                  <span class="text-sm font-bold text-amber-600">${it.quantidade} un</span>
                </div>
              `).join('')}
            </div>
            <p class="text-[10px] text-amber-600 mt-3 font-bold uppercase tracking-tight">* Itens que não foram distribuídos para nenhuma empresa específica.</p>
          </div>
        `;
      })()}

      <!-- Distribuição por Empresa -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4m-4-4l4-4"></path></svg>
          Distribuição por Empresa
        </h4>
        <div class="space-y-4">
          ${Object.keys(distribuicoesPorEmpresa).length === 0 ? `
            <p class="text-sm text-slate-400 italic text-center py-6">Nenhuma distribuição registrada para esta compra.</p>
          ` : Object.entries(distribuicoesPorEmpresa).map(([empId, data]) => `
            <div class="border border-slate-100 rounded-xl overflow-hidden">
              <div class="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-100">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100">${data.nome.substring(0, 2).toUpperCase()}</div>
                  <span class="text-sm font-bold text-slate-800">${data.nome}</span>
                </div>
                <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">${data.itens.length} itens recebidos</span>
              </div>
              <div class="divide-y divide-slate-50">
                ${data.itens.map(it => `
                  <div class="flex items-center justify-between px-4 py-2.5">
                    <span class="text-sm text-slate-700">${it.descricao} ${it.ca ? `<span class="text-xs text-slate-400">CA ${it.ca}</span>` : ''}</span>
                    <span class="text-sm font-bold text-slate-800">${it.quantidade} un</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
};
window.renderDetailsEpi = renderDetailsEpi;



// Modal: Detalhes do Acidente (CAT)
const renderDetailsAcidente = (id) => {
  const acid = appState.acidentes.find(a => a.id == id);
  if (!acid) return '<div class="p-10 text-center">Acidente não encontrado.</div>';

  const func = appState.funcionarios.find(f => f.id == acid.funcionarioId);
  const initials = func ? func.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';

  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <div>
          <h3 class="text-xl font-bold text-slate-900">CAT - Acidente ${acid.tipo}</h3>
          <p class="text-sm text-slate-500 font-medium mt-0.5">Registrado em ${acid.data.split('-').reverse().join('/')} às ${acid.hora}h</p>
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
              <div class="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm border border-red-100">${initials}</div>
              <div>
                <p class="font-bold text-slate-900 text-base">${acid.funcionarioNome}</p>
                <p class="text-xs text-slate-500">Matrícula: #${func?.matricula || 'N/A'}</p>
              </div>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">CPF:</span>
              <span class="font-semibold text-slate-900">${func?.cpf || 'N/A'}</span>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">Cargo:</span>
              <span class="font-semibold text-slate-900">${func?.cargo || 'N/A'}</span>
            </div>
            <div class="flex justify-between pt-1">
              <span class="text-slate-500">Empresa:</span>
              <span class="font-bold text-indigo-600">${acid.empresaNome}</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Resumo do Acidente</h4>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">Tipo:</span>
              <span class="inline-flex items-center px-2 py-0.5 ${
                acid.tipo === 'Tipico' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                acid.tipo === 'Trajeto' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                'bg-purple-50 text-purple-700 border-purple-200'
              } rounded text-xs font-bold border">${acid.tipo}</span>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">Local:</span>
              <span class="font-semibold text-slate-900">${acid.local || 'Não informado'}</span>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">Afastamento:</span>
              <span class="font-semibold ${acid.afastamento === 'Sim' ? 'text-red-600' : 'text-emerald-600'}">${acid.afastamento || 'Não'}</span>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">Óbito:</span>
              <span class="font-semibold text-slate-900">${acid.obito || 'Não'}</span>
            </div>
            <div class="flex justify-between pt-1">
              <span class="text-slate-500">Status CAT:</span>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 ${acid.catEmitida ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'} rounded-md text-xs font-bold border">
                ${acid.catEmitida 
                  ? '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>' 
                  : '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>'}
                ${acid.catEmitida ? 'CAT Emitida' : 'Cat Pendente'}
              </span>
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
          <p class="text-sm text-slate-700 leading-relaxed">${acid.descricao}</p>
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
            <p class="text-sm font-bold text-slate-800">${acid.parteCorpo || 'N/A'}</p>
          </div>
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
            <p class="text-xs text-slate-400 mb-1">Agente Causador</p>
            <p class="text-sm font-bold text-slate-800">${acid.agente || 'N/A'}</p>
          </div>
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
            <p class="text-xs text-slate-400 mb-1">CID</p>
            <p class="text-sm font-bold text-slate-800">${acid.cid || 'N/A'}</p>
          </div>
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
            <p class="text-xs text-slate-400 mb-1">Data CAT</p>
            <p class="text-sm font-bold text-slate-800">${acid.data.split('-').reverse().join('/')}</p>
          </div>
        </div>
        <div class="mt-4 flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <p class="text-sm font-bold text-slate-800">${acid.medico || 'Médico não informado'}</p>
            <p class="text-xs text-slate-500">CRM: ${acid.crm || 'N/A'}</p>
          </div>
          <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </div>
        </div>
      </div>

      <!-- Testemunhas -->
      ${acid.testemunhaNome ? `
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Testemunha</h4>
        <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <p class="text-sm font-semibold text-slate-800">${acid.testemunhaNome}</p>
            <p class="text-xs text-slate-500">${acid.testemunhaTelefone || 'N/A'}</p>
          </div>
          <span class="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded border border-slate-200">Testemunha 1</span>
        </div>
      </div>
      ` : ''}

      <!-- Botão de Download -->
      <div class="bg-red-600 p-5 rounded-2xl shadow-[0_2px_10px_rgba(220,38,38,0.2)] text-white flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
          </div>
          <div>
            <h4 class="font-bold text-lg">Comunicação de Acidente (CAT)</h4>
            <p class="text-red-100 text-xs">Documento pronto para download em PDF</p>
          </div>
        </div>
        <button class="bg-white text-red-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Baixar PDF
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
  const id = form.querySelector('#emp-id')?.value;

  const dados = {
    nome: form.querySelector('#razao-social').value,
    cnpj: form.querySelector('#cnpj').value,
    setor: form.querySelector('#setor').value === 'limpeza' ? 'Sistema de limpeza' : 'Serviço industrial',
    status: 'Ativa'
  };

  if (id) {
    const index = appState.empresas.findIndex(e => e.id == id);
    if (index !== -1) {
      appState.empresas[index] = { ...appState.empresas[index], ...dados };
    }
  } else {
    appState.empresas.push({
      id: Date.now(),
      dataCriacao: new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
      ...dados
    });
  }

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
  const id = form.querySelector('#func-id')?.value;

  const empresaId = form.querySelector('#func-empresa').value;
  const empresa = appState.empresas.find(e => e.id == empresaId);

  const dados = {
    matricula: form.querySelector('#func-matricula').value,
    cpf: form.querySelector('#func-cpf').value,
    nome: form.querySelector('#func-nome').value,
    cargo: form.querySelector('#func-cargo').value,
    dataNascimento: form.querySelector('#func-nascimento').value,
    dataAdmissao: form.querySelector('#func-admissao').value,
    empresaId: empresaId,
    empresaNome: empresa ? empresa.nome : 'N/A'
  };

  if (id) {
    const index = appState.funcionarios.findIndex(f => f.id == id);
    if (index !== -1) {
      appState.funcionarios[index] = { ...appState.funcionarios[index], ...dados };
    }
  } else {
    appState.funcionarios.push({
      id: Date.now(),
      ...dados
    });
  }

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
  const id = document.getElementById('doc-id')?.value;
  const sigla = document.getElementById('doc-novo-tipo-sigla').value;
  const desc = document.getElementById('doc-novo-tipo-desc').value;
  const tipo = sigla || document.getElementById('doc-tipo').value;
  const empresaId = document.getElementById('doc-empresa').value;
  const empresa = appState.empresas.find(emp => emp.id == empresaId);

  const dados = {
    tipo: tipo,
    nome: desc || tipo,
    empresaId: parseInt(empresaId),
    empresaNome: empresa ? empresa.nome : 'Empresa não encontrada',
    status: calculateStatus(document.getElementById('doc-revisao').value),
    dataEmissao: document.getElementById('doc-elaboracao').value,
    dataVencimento: document.getElementById('doc-revisao').value,
    observacoes: document.getElementById('doc-obs').value
  };

  if (id) {
    const index = appState.documentos.findIndex(d => d.id == id);
    if (index !== -1) {
      appState.documentos[index] = { ...appState.documentos[index], ...dados };
    }
  } else {
    appState.documentos.push({
      id: Date.now(),
      ...dados
    });
  }

  updateStats();
  closeModal();
  window.navigateTo('documentos');
};

window.handleSaveTreinamento = (e) => {
  e.preventDefault();
  const id = document.getElementById('trei-id')?.value;
  const sigla = document.getElementById('trei-novo-tipo-sigla').value;
  const tipo = sigla || document.getElementById('trei-tipo').value;
  const funcId = document.getElementById('trei-funcionario').value;
  const func = appState.funcionarios.find(f => f.id == funcId);

  const dados = {
    tipo: tipo,
    funcionarioId: parseInt(funcId),
    funcionarioNome: func ? func.nome : 'N/A',
    empresaNome: func ? func.empresaNome : 'N/A',
    status: calculateStatus(document.getElementById('trei-vencimento').value),
    dataRealizacao: document.getElementById('trei-realizacao').value,
    dataVencimento: document.getElementById('trei-vencimento').value,
    instrutor: document.getElementById('trei-instrutor').value || 'Não informado',
    observacoes: document.getElementById('trei-obs').value
  };

  if (id) {
    const index = appState.treinamentos.findIndex(t => t.id == id);
    if (index !== -1) {
      appState.treinamentos[index] = { ...appState.treinamentos[index], ...dados };
    }
  } else {
    appState.treinamentos.push({
      id: Date.now(),
      ...dados
    });
  }

  updateStats();
  closeModal();
  window.navigateTo('treinamentos');
};

window.updateAsoEmployeeInfo = (funcId) => {
  const func = appState.funcionarios.find(f => f.id == funcId);
  const cpfEl = document.getElementById('aso-info-cpf');
  const cargoEl = document.getElementById('aso-info-cargo');
  const empresaEl = document.getElementById('aso-info-empresa');

  if (func && cpfEl && cargoEl && empresaEl) {
    cpfEl.innerHTML = `<span class="font-bold">CPF:</span> ${func.cpf}`;
    cargoEl.innerHTML = `<span class="font-bold">Cargo:</span> ${func.cargo}`;
    empresaEl.innerHTML = `<span class="font-bold">Empresa:</span> ${func.empresaNome}`;
  } else if (cpfEl && cargoEl && empresaEl) {
    cpfEl.innerHTML = `<span class="font-bold">CPF:</span> Selecione...`;
    cargoEl.innerHTML = `<span class="font-bold">Cargo:</span> Selecione...`;
    empresaEl.innerHTML = `<span class="font-bold">Empresa:</span> Selecione...`;
  }
};

window.addExameAso = () => {
  const nome = document.getElementById('aso-exame-nome').value.trim();
  const data = document.getElementById('aso-exame-data').value;
  const list = document.getElementById('aso-exames-list');

  if (!nome) {
    alert('Por favor, informe o nome do exame.');
    return;
  }

  const dataFormatada = data ? data.split('-').reverse().join('/') : '-';

  const item = document.createElement('div');
  item.className = "flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100 text-xs shadow-sm";
  item.innerHTML = `
    <span class="font-medium text-slate-700">${nome} <span class="text-slate-400">(${dataFormatada})</span></span>
    <button type="button" onclick="this.parentElement.remove()" class="text-slate-400 hover:text-red-500 p-1 transition-colors">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
  `;
  list.appendChild(item);

  // Limpar campos e focar no nome
  document.getElementById('aso-exame-nome').value = '';
  document.getElementById('aso-exame-data').value = '';
  document.getElementById('aso-exame-nome').focus();
};

window.handleSaveAso = (e) => {
  e.preventDefault();
  const id = document.getElementById('aso-id')?.value;
  const funcId = document.getElementById('aso-funcionario').value;
  const func = appState.funcionarios.find(f => f.id == funcId);

  const dados = {
    tipo: document.getElementById('aso-tipo').value,
    funcionarioId: parseInt(funcId),
    funcionarioNome: func ? func.nome : 'N/A',
    empresaNome: func ? func.empresaNome : 'N/A',
    status: calculateStatus(document.getElementById('aso-vencimento').value),
    aptidao: document.getElementById('aso-aptidao').value,
    dataRealizacao: document.getElementById('aso-realizacao').value,
    dataVencimento: document.getElementById('aso-vencimento').value,
    exames: (() => {
      const items = document.querySelectorAll('#aso-exames-list > div span.font-medium');
      return Array.from(items).map(span => span.textContent.trim()).join(', ');
    })(),
    observacoes: document.getElementById('aso-obs').value
  };

  if (id) {
    const index = appState.asos.findIndex(a => a.id == id);
    if (index !== -1) {
      appState.asos[index] = { ...appState.asos[index], ...dados };
    }
  } else {
    appState.asos.push({
      id: Date.now(),
      ...dados
    });
  }

  updateStats();
  closeModal();
  window.navigateTo('asos');
};

window.handleSaveAcidente = (e) => {
  e.preventDefault();
  const id = document.getElementById('acid-id')?.value;
  const funcId = document.getElementById('acid-funcionario').value;
  const func = appState.funcionarios.find(f => f.id == funcId);

  const dados = {
    data: document.getElementById('acid-data').value,
    hora: document.getElementById('acid-hora').value,
    funcionarioId: parseInt(funcId),
    funcionarioNome: func ? func.nome : 'N/A',
    empresaNome: func ? func.empresaNome : 'N/A',
    tipo: document.getElementById('acid-tipo').value,
    catEmitida: document.getElementById('acid-cat-emitida').checked,
    status: document.getElementById('acid-cat-emitida').checked ? 'CAT Emitida' : 'Cat Pendente',
    descricao: document.getElementById('acid-descricao').value,
    local: document.getElementById('acid-local').value,
    parteCorpo: document.getElementById('acid-parte-corpo').value,
    agente: document.getElementById('acid-agente').value,
    cid: document.getElementById('acid-cid').value,
    afastamento: document.getElementById('acid-afastamento').value,
    obito: document.getElementById('acid-obito').value,
    medico: document.getElementById('acid-medico').value,
    crm: document.getElementById('acid-crm').value,
    testemunhaNome: document.getElementById('acid-testemunha-nome').value,
    testemunhaTelefone: document.getElementById('acid-testemunha-tel').value
  };

  if (id) {
    const index = appState.acidentes.findIndex(a => a.id == id);
    if (index !== -1) {
      appState.acidentes[index] = { ...appState.acidentes[index], ...dados };
    }
  } else {
    appState.acidentes.push({
      id: Date.now(),
      ...dados
    });
  }

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

window.handleSaveCompraEpi = (e) => {
  e.preventDefault();
  
  const nf = document.getElementById('epi-nf').value;
  const data = document.getElementById('epi-data').value;

  if (!nf || !data) {
    alert('Informe o número da nota fiscal e a data da compra.');
    return;
  }

  if (cartState.items.length === 0) {
    alert('Adicione ao menos um item ao carrinho.');
    return;
  }

  const itensComEstoque = cartState.items.filter(item => {
    const totalDistribuido = (item.distribuicoes || []).reduce((acc, d) => acc + d.quantidade, 0);
    return totalDistribuido < item.quantidade;
  });

  if (itensComEstoque.length > 0) {
    const confirmEstoque = confirm('Alguns itens possuem quantidades não distribuídas que serão enviadas para o Estoque Geral. Deseja continuar?');
    if (!confirmEstoque) return;
  }

  const novaCompra = {
    id: cartState.id || Date.now(),
    nf: nf,
    data: data,
    valorTotal: cartState.valorTotal,
    itens: cartState.items
  };

  if (cartState.id) {
    const index = appState.comprasEpi.findIndex(c => c.id == cartState.id);
    if (index !== -1) {
      appState.comprasEpi[index] = novaCompra;
    }
  } else {
    appState.comprasEpi.push(novaCompra);
    
    // Adicionar saldos ao estoque consolidado apenas no novo registro para evitar duplicatas em edições
    itensComEstoque.forEach(item => {
      const totalDistribuido = (item.distribuicoes || []).reduce((acc, d) => acc + d.quantidade, 0);
      const saldo = item.quantidade - totalDistribuido;
      
      if (saldo > 0) {
        const existing = appState.estoque.find(i => 
          i.descricao.toLowerCase() === item.descricao.toLowerCase() && 
          i.ca === item.ca && 
          i.tipo === item.tipo
        );
        
        if (existing) {
          existing.quantidade += saldo;
        } else {
          appState.estoque.push({
            tipo: item.tipo,
            descricao: item.descricao,
            ca: item.ca,
            quantidade: saldo
          });
        }
      }
    });
  }

  updateStats();
  closeModal();
  window.navigateTo('epis');
};

window.handleDeleteCompraEpi = (id) => {
  if (confirm('Tem certeza que deseja excluir esta nota fiscal?')) {
    appState.comprasEpi = appState.comprasEpi.filter(c => c.id != id);
    updateStats();
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

// Handler Global de Busca
window.handleSearch = (event, pageId) => {
  appState.filters[pageId] = event.target.value.toLowerCase();
  navigateTo(pageId);

  // Reposicionar o cursor no final do input após o re-render
  setTimeout(() => {
    const input = document.querySelector(`input[data-search-page="${pageId}"]`);
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }, 0);
};

window.handleSectorFilter = (event) => {
  appState.filters.empresasSetor = event.target.value;
  navigateTo('empresas');
};

window.handleTreinamentoStatusFilter = (event) => {
  appState.filters.treinamentosStatus = event.target.value;
  navigateTo('treinamentos');
};

window.handleAsoAptidaoFilter = (event) => {
  appState.filters.asosAptidao = event.target.value;
  navigateTo('asos');
};

window.handleEpiDateFilter = (event) => {
  appState.filters.episData = event.target.value;
  navigateTo('epis');
};

window.handleAcidenteStatusFilter = (event) => {
  appState.filters.acidentesStatus = event.target.value;
  navigateTo('acidentes');
};

window.toggleCipa = (funcionarioId, isChecked) => {
  const func = appState.funcionarios.find(f => f.id == funcionarioId);
  if (func) {
    func.isCipa = isChecked;
    saveState();
  }
};

window.addTipoTreinamento = () => {
  const sigla = document.getElementById('trei-novo-tipo-sigla').value.trim();
  const desc = document.getElementById('trei-novo-tipo-desc').value.trim();
  const select = document.getElementById('trei-tipo');

  if (!sigla) {
    alert('Por favor, informe ao menos a sigla do novo tipo.');
    return;
  }

  // Verificar se já existe
  const exists = Array.from(select.options).some(opt => opt.value === sigla);
  if (exists) {
    select.value = sigla;
  } else {
    const option = document.createElement('option');
    option.value = sigla;
    option.text = desc ? `${sigla} (${desc})` : sigla;
    option.selected = true;
    select.add(option);
  }

  // Esconder o form de novo tipo e limpar
  document.getElementById('novo-tipo-treinamento').classList.add('hidden');
  document.getElementById('trei-novo-tipo-sigla').value = '';
  document.getElementById('trei-novo-tipo-desc').value = '';
};

window.addTipoDocumento = () => {
  const sigla = document.getElementById('doc-novo-tipo-sigla').value.trim();
  const desc = document.getElementById('doc-novo-tipo-desc').value.trim();
  const select = document.getElementById('doc-tipo');

  if (!sigla) {
    alert('Por favor, informe ao menos a sigla do novo tipo.');
    return;
  }

  // Verificar se já existe
  const exists = Array.from(select.options).some(opt => opt.value === sigla);
  if (exists) {
    select.value = sigla;
  } else {
    const option = document.createElement('option');
    option.value = sigla;
    option.text = sigla;
    option.selected = true;
    select.add(option);
  }

  // Esconder o form de novo tipo e limpar
  document.getElementById('novo-tipo-doc').classList.add('hidden');
  document.getElementById('doc-novo-tipo-sigla').value = '';
  document.getElementById('doc-novo-tipo-desc').value = '';
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
updateStats();
navigateTo('dashboard');
