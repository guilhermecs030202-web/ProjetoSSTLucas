import { appState, cartState, INITIAL_STATE, saveState, getFuncionarioCount } from '../store/state.js';
import { openModal, closeModal } from '../components/modalConfig.js';
import * as Modals from '../components/ModalsAcidentes.js';

export const renderAcidentes = () => {
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

export const handleAcidenteStatusFilter = (event) => {
  appState.filters.acidentesStatus = event.target.value;
  navigateTo('acidentes');
};