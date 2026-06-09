import { appState, cartState, INITIAL_STATE, saveState, getFuncionarioCount } from '../store/state.js';
import { updateStats } from '../store/stats.js';
import { openModal, closeModal } from '../components/modalConfig.js';
import { api, BASE_URL } from '../services/api.js';
import { showToast } from '../utils/toast.js';
import { showConfirmDialog } from '../utils/confirmDialog.js';

export const renderFormAcidente = (id = null) => {
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

      <!-- Seção 4: Testemunhas e Anexos -->
      <div class="bg-amber-50/50 p-4 rounded-xl border border-amber-100/60">
        <p class="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-3">4. Testemunhas e Anexos</p>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Nome da Testemunha</label>
            <input type="text" id="acid-testemunha-nome" value="${acid ? acid.testemunhaNome || '' : ''}" placeholder="Nome completo" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Telefone da Testemunha</label>
            <input type="text" id="acid-testemunha-tel" value="${acid ? acid.testemunhaTelefone || '' : ''}" placeholder="(00) 00000-0000" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm">
          </div>
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Anexo da CAT ou Laudo (PDF)</label>
          <input type="file" id="acid-anexo" accept=".pdf" class="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 transition-all cursor-pointer">
        </div>
      </div>

      <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
        <button type="button" onclick="closeModal()" class="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancelar</button>
        <button type="submit" class="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-sm shadow-red-600/20 transition-all">Salvar e Emitir CAT</button>
      </div>
    </form>
  `;
};

export const renderDetailsAcidente = (id) => {
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
            <h4 class="font-bold text-lg">${acid.nomeArquivo || 'Comunicação de Acidente (CAT)'}</h4>
            <p class="text-red-100 text-xs">${acid.temArquivo ? 'Documento anexado em PDF' : 'Nenhum documento anexado'}</p>
          </div>
        </div>
        ${acid.temArquivo ? `
        <div class="flex gap-2">
            <button onclick="window.viewAcidente('${acid.id}')" class="bg-red-700 text-white hover:bg-red-800 px-4 py-2.5 rounded-xl font-bold transition-colors shadow-sm">
            Visualizar
            </button>
            <button onclick="window.downloadAcidente('${acid.id}')" class="bg-white text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-xl font-bold transition-colors shadow-sm">
            Baixar
            </button>
        </div>` : '<p class="text-sm text-red-200 italic">Arquivo não enviado</p>'}
      </div>

    </div>
  `;
};

export const handleSaveAcidente = async (e) => {
  e.preventDefault();
  const id = document.getElementById('acid-id')?.value;
  const funcId = document.getElementById('acid-funcionario').value;
  const func = appState.funcionarios.find(f => f.id == funcId);

  const fileInput = document.getElementById('acid-anexo');
  const arquivo = fileInput && fileInput.files.length > 0 ? fileInput.files[0] : null;

  const dados = {
    data: document.getElementById('acid-data').value,
    hora: document.getElementById('acid-hora').value,
    funcionarioId: funcId,
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
    testemunhaTelefone: document.getElementById('acid-testemunha-tel').value,
    arquivo: arquivo
  };

  try {
    if (id) {
      const updated = await api.updateAcidente(id, dados);
      const index = appState.acidentes.findIndex(a => a.id == id);
      if (index !== -1) {
        appState.acidentes[index] = updated;
      }
    } else {
      const created = await api.createAcidente(dados);
      appState.acidentes.push(created);
    }

    updateStats();
    closeModal();
    window.navigateTo('acidentes');
  } catch (err) {
    showToast('Erro ao salvar acidente: ' + err.message, 'error');
  }
};

export const handleDeleteAcidente = async (id) => {
  if (await showConfirmDialog('Tem certeza que deseja excluir este registro de acidente?')) {
    try {
      await api.deleteAcidente(id);
      appState.acidentes = appState.acidentes.filter(a => a.id != id);
      updateStats();
      window.navigateTo('acidentes');
    } catch (err) {
      showToast('Erro ao excluir acidente: ' + err.message, 'error');
    }
  }
};

window.viewAcidente = (id) => {
  window.open(`${BASE_URL}/acidentes/${id}/view`, '_blank');
};

window.downloadAcidente = (id) => {
  window.location.href = `${BASE_URL}/acidentes/${id}/download`;
};