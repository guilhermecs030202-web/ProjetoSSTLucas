import { appState, cartState, INITIAL_STATE, saveState, getFuncionarioCount } from '../store/state.js';
import { updateStats } from '../store/stats.js';
import { openModal, closeModal } from '../components/modalConfig.js';
import { api } from '../services/api.js';
import { showToast } from '../utils/toast.js';
import { showConfirmDialog } from '../utils/confirmDialog.js';

export const renderFormEmpresa = (id = null) => {
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
        <input type="text" id="cnpj" value="${empresa ? empresa.cnpj : ''}" required placeholder="00.000.000/0000-00" maxlength="18" oninput="window.maskCNPJ(event)" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900">
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

export const renderDetailsEmpresa = (id) => {
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
            <input type="checkbox" class="sr-only peer" ${f.isCipa ? 'checked' : ''} onchange="window.toggleCipa('${f.id}', this.checked)">
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

export const handleSaveEmpresa = async (event) => {
  event.preventDefault();
  const form = event.target;
  const id = form.querySelector('#emp-id')?.value;

  const dados = {
    nome: form.querySelector('#razao-social').value,
    cnpj: form.querySelector('#cnpj').value,
    setor: form.querySelector('#setor').value === 'limpeza' ? 'Sistema de limpeza' : 'Serviço industrial',
    status: 'Ativa'
  };

  try {
    if (id) {
      const updated = await api.updateEmpresa(id, dados);
      const index = appState.empresas.findIndex(e => e.id == id);
      if (index !== -1) {
        appState.empresas[index] = updated;
      }
    } else {
      const created = await api.createEmpresa(dados);
      appState.empresas.push(created);
    }

    updateStats();
    closeModal();
    window.navigateTo('empresas');
  } catch (err) {
    showToast('Erro ao salvar empresa: ' + err.message, 'error');
  }
};

export const handleDeleteEmpresa = async (id, force = false) => {
  if (force || await showConfirmDialog('Tem certeza que deseja excluir esta empresa?')) {
    try {
      await api.deleteEmpresa(id, force);
      appState.empresas = appState.empresas.filter(emp => emp.id != id);
      updateStats();
      window.navigateTo('empresas');
    } catch (err) {
      if (err.status === 409) {
        if (await showConfirmDialog(err.message)) {
          return handleDeleteEmpresa(id, true);
        }
      } else {
        showToast('Erro ao excluir empresa: ' + err.message, 'error');
      }
    }
  }
};