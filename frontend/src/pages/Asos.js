import { appState, cartState, INITIAL_STATE, saveState, getFuncionarioCount } from '../store/state.js';
import { formatDate } from '../utils/formatters.js';
import { openModal, closeModal } from '../components/modalConfig.js';
import * as Modals from '../components/ModalsAsos.js';

export const renderAsos = () => {
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

export const handleAsoAptidaoFilter = (event) => {
  appState.filters.asosAptidao = event.target.value;
  navigateTo('asos');
};