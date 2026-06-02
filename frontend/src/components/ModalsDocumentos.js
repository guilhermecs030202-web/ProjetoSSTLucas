import { appState, cartState, INITIAL_STATE, saveState, getFuncionarioCount } from '../store/state.js';
import { formatDate } from '../utils/formatters.js';
import { calculateStatus } from '../utils/status.js';
import { updateStats } from '../store/stats.js';
import { openModal, closeModal } from '../components/modalConfig.js';
import { api } from '../services/api.js';

export const renderFormDocumento = (id = null) => {
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

export const renderDetailsDocumento = (id) => {
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

export const handleDeleteDocumento = async (id) => {
  if (confirm('Tem certeza que deseja excluir este documento?')) {
    try {
      await api.deleteDocumento(id);
      appState.documentos = appState.documentos.filter(d => d.id != id);
      updateStats();
      window.navigateTo('documentos');
    } catch (err) {
      alert('Erro ao excluir documento: ' + err.message);
    }
  }
};

export const handleSaveDocumento = async (e) => {
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
    empresaId: empresaId,
    empresaNome: empresa ? empresa.nome : 'Empresa não encontrada',
    status: calculateStatus(document.getElementById('doc-revisao').value),
    dataEmissao: document.getElementById('doc-elaboracao').value,
    dataVencimento: document.getElementById('doc-revisao').value,
    observacoes: document.getElementById('doc-obs').value
  };

  try {
    if (id) {
      const updated = await api.updateDocumento(id, dados);
      const index = appState.documentos.findIndex(d => d.id == id);
      if (index !== -1) {
        appState.documentos[index] = updated;
      }
    } else {
      const created = await api.createDocumento(dados);
      appState.documentos.push(created);
    }

    updateStats();
    closeModal();
    window.navigateTo('documentos');
  } catch (err) {
    alert('Erro ao salvar documento: ' + err.message);
  }
};

export const addTipoDocumento = () => {
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