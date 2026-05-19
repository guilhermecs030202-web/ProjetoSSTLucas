import { appState, cartState, INITIAL_STATE, saveState, getFuncionarioCount } from '../store/state.js';
import { formatDate } from '../utils/formatters.js';
import { openModal, closeModal } from '../components/modalConfig.js';
import * as Modals from '../components/ModalsDocumentos.js';

export const renderDocumentos = () => {
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