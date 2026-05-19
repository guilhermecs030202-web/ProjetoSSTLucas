import { appState, cartState, INITIAL_STATE, saveState, getFuncionarioCount } from '../store/state.js';
import { updateStats } from '../store/stats.js';
import { openModal, closeModal } from '../components/modalConfig.js';

const updateEpiModalUI = () => {
  // Salvar valores atuais da NF antes de re-renderizar
  const nfInput = document.getElementById('epi-nf');
  const dataInput = document.getElementById('epi-data');
  if (nfInput) Object.assign(cartState, { nf: nfInput.value });
  if (dataInput) Object.assign(cartState, { data: dataInput.value });

  // Calcular valor total
  cartState.valorTotal = cartState.items.reduce((acc, item) => acc + (item.quantidade * item.valorUnitario), 0);

  openModal(renderFormEpi(), 'max-w-4xl');
};

export const openEpiModal = (id = null) => {
  if (id) {
    const compra = appState.comprasEpi.find(c => c.id == id);
    if (compra) {
      Object.assign(cartState, {
        id: compra.id,
        items: JSON.parse(JSON.stringify(compra.itens)),
        nf: compra.nf,
        data: compra.data,
        valorTotal: compra.valorTotal
      });
    }
  } else {
    Object.assign(cartState, {
      items: [],
      nf: '',
      data: '',
      valorTotal: 0
    });
  }
  openModal(renderFormEpi(), 'max-w-4xl');
};

export const addItemToCart = () => {
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

export const removeItemFromCart = (index) => {
  cartState.items.splice(index, 1);
  updateEpiModalUI();
};

export const addDistribution = (itemIndex) => {
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

export const removeDistribution = (itemIndex, distIndex) => {
  cartState.items[itemIndex].distribuicoes.splice(distIndex, 1);
  updateEpiModalUI();
};

export const openEstoqueModal = () => {
  openModal(renderEstoqueModal(), 'max-w-4xl');
};

export const addManualItemToEstoque = () => {
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

export const updateEstoqueQtd = (index, delta) => {
  appState.estoque[index].quantidade += delta;
  if (appState.estoque[index].quantidade < 0) appState.estoque[index].quantidade = 0;
  saveState();
  window.openEstoqueModal();
};

export const deleteItemEstoque = (index) => {
  if (confirm('Remover este item do controle de estoque?')) {
    appState.estoque.splice(index, 1);
    saveState();
    window.openEstoqueModal();
  }
};

export const syncEstoqueFromNf = () => {
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

export const renderEstoqueModal = () => {
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

export const renderFormEpi = () => {
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

export const renderDetailsEpi = (id) => {
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

export const handleSaveCompraEpi = (e) => {
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

export const handleDeleteCompraEpi = (id) => {
  if (confirm('Tem certeza que deseja excluir esta nota fiscal?')) {
    appState.comprasEpi = appState.comprasEpi.filter(c => c.id != id);
    updateStats();
    window.navigateTo('epis');
  }
};