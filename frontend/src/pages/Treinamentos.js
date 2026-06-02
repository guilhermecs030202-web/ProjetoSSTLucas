import { appState, cartState, INITIAL_STATE, saveState, getFuncionarioCount } from '../store/state.js';
import { openModal, closeModal } from '../components/modalConfig.js';
import * as Modals from '../components/ModalsTreinamentos.js';

export const renderTreinamentos = () => {
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
                    <button onclick="openModal(renderDetailsTreinamento('${trei.id}'), 'max-w-2xl')" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Visualizar">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                    <button onclick="openModal(renderFormTreinamento('${trei.id}'))" class="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Editar">
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.125rem; height: 1.125rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button onclick="handleDeleteTreinamento('${trei.id}')" class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
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

export const handleTreinamentoStatusFilter = (event) => {
  appState.filters.treinamentosStatus = event.target.value;
  navigateTo('treinamentos');
};