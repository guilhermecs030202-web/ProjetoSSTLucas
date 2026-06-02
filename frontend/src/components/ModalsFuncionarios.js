import { appState, cartState, INITIAL_STATE, saveState, getFuncionarioCount } from '../store/state.js';
import { updateStats } from '../store/stats.js';
import { openModal, closeModal } from '../components/modalConfig.js';
import { api } from '../services/api.js';

export const renderFormFuncionario = (id = null) => {
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

export const renderDetailsFuncionario = (id) => {
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

export const handleSaveFuncionario = async (event) => {
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

  try {
    if (id) {
      const updated = await api.updateFuncionario(id, dados);
      const index = appState.funcionarios.findIndex(f => f.id == id);
      if (index !== -1) {
        appState.funcionarios[index] = updated;
      }
    } else {
      const created = await api.createFuncionario(dados);
      appState.funcionarios.push(created);
    }

    updateStats();
    closeModal();
    window.navigateTo('funcionarios');
  } catch (err) {
    alert('Erro ao salvar funcionário: ' + err.message);
  }
};

export const handleDeleteFuncionario = async (id) => {
  if (confirm('Tem certeza que deseja excluir este funcionário?')) {
    try {
      await api.deleteFuncionario(id);
      appState.funcionarios = appState.funcionarios.filter(f => f.id != id);
      updateStats();
      window.navigateTo('funcionarios');
    } catch (err) {
      alert('Erro ao excluir funcionário: ' + err.message);
    }
  }
};