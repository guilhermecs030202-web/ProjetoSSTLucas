import { appState, cartState, INITIAL_STATE, saveState, getFuncionarioCount } from '../store/state.js';
import { openModal, closeModal } from '../components/modalConfig.js';
import * as Modals from '../components/ModalsEpis.js';

export const renderEpis = () => {
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
                    <button onclick="openModal(renderDetailsEpi('${compra.id}'), 'max-w-4xl')" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Visualizar">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                    <button onclick="window.openEpiModal('${compra.id}')" class="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Editar">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button onclick="handleDeleteCompraEpi('${compra.id}')" class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
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

export const handleEpiDateFilter = (event) => {
  appState.filters.episData = event.target.value;
  navigateTo('epis');
};