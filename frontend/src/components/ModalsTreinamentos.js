import { appState, cartState, INITIAL_STATE, saveState, getFuncionarioCount } from '../store/state.js';
import { calculateStatus } from '../utils/status.js';
import { updateStats } from '../store/stats.js';
import { openModal, closeModal } from '../components/modalConfig.js';
import { api, BASE_URL } from '../services/api.js';
import { showToast } from '../utils/toast.js';
import { showConfirmDialog } from '../utils/confirmDialog.js';

export const renderFormTreinamento = (id = null) => {
  const trei = id ? appState.treinamentos.find(t => t.id == id) : null;
  const empresas = appState.empresas;
  const funcionarios = appState.funcionarios;

  // Tipos dinâmicos baseados no que já existe no estado
  const defaultTipos = ['NR-35', 'NR-10', 'NR-33'];
  const customTipos = [...new Set(appState.treinamentos.map(t => t.tipo))].filter(t => !defaultTipos.includes(t));
  const todosTipos = [...defaultTipos, ...customTipos].sort();

  const getTipoLabel = (tipo) => {
    if (tipo === 'NR-35') return 'NR-35 (Trabalho em Altura)';
    if (tipo === 'NR-10') return 'NR-10 (Elétrica)';
    if (tipo === 'NR-33') return 'NR-33 (Espaço Confinado)';
    return tipo;
  };

  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100">
      <h3 class="text-xl font-bold text-slate-900">${trei ? 'Editar Treinamento' : 'Registrar Treinamento'}</h3>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    <form id="form-treinamento" class="p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-hide" onsubmit="window.handleSaveTreinamento(event)">
      <input type="hidden" id="trei-id" value="${id || ''}">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-sm font-semibold text-slate-700">Tipo de Treinamento</label>
            <button type="button" onclick="document.getElementById('novo-tipo-treinamento').classList.toggle('hidden')" class="text-[10px] uppercase tracking-wider font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md border border-indigo-100">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              Novo
            </button>
          </div>
          <select id="trei-tipo" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
            <option value="">Selecione...</option>
            ${todosTipos.map(t => `<option value="${t}" ${trei?.tipo === t ? 'selected' : ''}>${getTipoLabel(t)}</option>`).join('')}
          </select>
          <div id="novo-tipo-treinamento" class="hidden mt-3 bg-indigo-50/50 border border-indigo-100/60 p-3 rounded-xl space-y-2 relative">
            <p class="text-[10px] font-bold text-indigo-800 uppercase tracking-wider mb-1">Cadastrar Novo Tipo</p>
            <input type="text" id="trei-novo-tipo-sigla" placeholder="Sigla/NR (ex: NR-12)" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
            <input type="text" id="trei-novo-tipo-desc" placeholder="Descrição (ex: Segurança em Máquinas)" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
            <button type="button" onclick="window.addTipoTreinamento()" class="w-full py-1.5 bg-indigo-600 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-indigo-700 transition-colors mt-1">Incorporar à Lista</button>
          </div>
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Funcionário</label>
          <select id="trei-funcionario" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
            <option value="">Selecione...</option>
            ${empresas.map(emp => `
              <optgroup label="${emp.nome}">
                ${funcionarios.filter(f => f.empresaId == emp.id).map(f => `
                  <option value="${f.id}" ${trei?.funcionarioId == f.id ? 'selected' : ''}>${f.nome} - Mat: ${f.matricula}</option>
                `).join('')}
              </optgroup>
            `).join('')}
          </select>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Data de Realização</label>
          <input type="date" id="trei-realizacao" value="${trei ? trei.dataRealizacao : ''}" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Data de Vencimento</label>
          <input type="date" id="trei-vencimento" value="${trei ? trei.dataVencimento : ''}" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
        </div>
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">Matrícula do Instrutor <span class="text-slate-400 font-normal">- Opcional</span></label>
        <input type="text" id="trei-instrutor" value="${trei ? trei.instrutor : ''}" placeholder="Ex: 90012" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">Observações</label>
        <textarea id="trei-obs" rows="2" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm">${trei ? trei.observacoes || '' : ''}</textarea>
      </div>
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">Certificado (Anexo)</label>
        <input type="file" id="trei-anexo" accept=".pdf,.jpg,.png" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer">
      </div>
      <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
        <button type="button" onclick="closeModal()" class="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancelar</button>
        <button type="submit" class="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all">Salvar Treinamento</button>
      </div>
    </form>
  `;
};

export const renderDetailsTreinamento = (id) => {
  const trei = appState.treinamentos.find(t => t.id == id);
  if (!trei) return '<div class="p-10 text-center font-bold text-slate-500">Treinamento não encontrado.</div>';

  const func = appState.funcionarios.find(f => f.id == trei.funcionarioId);
  const initials = func ? func.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';
  
  const instrutorFunc = appState.funcionarios.find(f => f.matricula == trei.instrutor);

  const getDescricao = (t) => {
    if (t === 'NR-35') return 'Trabalho em Altura';
    if (t === 'NR-10') return 'Elétrica';
    if (t === 'NR-33') return 'Espaço Confinado';
    return 'Treinamento de Segurança';
  };

  const statusClass = trei.status === 'Válido' ? 'bg-emerald-600' : (trei.status === 'Vencendo' ? 'bg-amber-600' : 'bg-red-600');
  const statusTextClass = trei.status === 'Válido' ? 'text-emerald-800' : (trei.status === 'Vencendo' ? 'text-amber-800' : 'text-red-800');
  const statusBgClass = trei.status === 'Válido' ? 'bg-emerald-50 border-emerald-100' : (trei.status === 'Vencendo' ? 'bg-amber-50 border-amber-100' : 'bg-red-50 border-red-100');

  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg border border-purple-100">
          ${trei.tipo.replace('NR-', '').substring(0, 2)}
        </div>
        <div>
          <h3 class="text-xl font-bold text-slate-900">${trei.tipo}</h3>
          <p class="text-sm text-slate-500 font-medium mt-0.5">${getDescricao(trei.tipo)}</p>
        </div>
      </div>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    
    <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto scrollbar-hide bg-slate-50/50">
      
      <!-- Detalhes do Treinamento -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Informações do Aluno</h4>
          <div class="space-y-3 text-sm">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100">${initials}</div>
              <div>
                <p class="font-bold text-slate-900 text-base">${trei.funcionarioNome}</p>
                <p class="text-xs text-slate-500">Matrícula: #${func ? func.matricula : 'N/A'}</p>
              </div>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">Cargo:</span>
              <span class="font-semibold text-slate-900">${func ? func.cargo : 'N/A'}</span>
            </div>
            <div class="flex justify-between pt-1">
              <span class="text-slate-500">Empresa:</span>
              <span class="font-bold text-indigo-600">${trei.empresaNome}</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Status e Datas</h4>
          <div class="flex items-center justify-between ${statusBgClass} p-3 rounded-lg border mb-4">
            <span class="font-bold ${statusTextClass}">Situação Atual:</span>
            <span class="inline-flex items-center px-3 py-1 ${statusClass} text-white rounded text-xs font-bold shadow-sm">${trei.status}</span>
          </div>
          <div class="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div>
              <span class="block text-xs text-slate-400 mb-1">Realização</span>
              <span class="font-bold text-slate-700">${trei.dataRealizacao.split('-').reverse().join('/')}</span>
            </div>
            <div>
              <span class="block text-xs text-slate-400 mb-1">Vencimento</span>
              <span class="font-bold text-slate-700">${trei.dataVencimento.split('-').reverse().join('/')}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Informações do Instrutor -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between">
        <div>
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Instrutor Responsável</h4>
          <p class="font-bold text-slate-800 text-lg">${instrutorFunc ? instrutorFunc.nome : (trei.instrutor || 'Não informado')}</p>
          <p class="text-sm text-slate-500">Registro/Matrícula: ${instrutorFunc ? '#' + instrutorFunc.matricula : 'N/A'}</p>
        </div>
        <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
        </div>
      </div>

      <!-- Observações -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Observações Adicionais</h4>
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p class="text-sm text-slate-700 leading-relaxed">${trei.observacoes || 'Nenhuma observação adicional.'}</p>
        </div>
      </div>

      <!-- Anexos -->
      <div class="bg-purple-600 p-5 rounded-2xl shadow-[0_2px_10px_rgba(147,51,234,0.2)] text-white flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <div>
            <p class="font-bold text-lg">${trei.nomeArquivo || 'Certificado_' + trei.tipo.replace(/\s+/g, '_') + '.pdf'}</p>
            <p class="text-purple-200 text-sm">${trei.temArquivo ? 'Certificado anexado' : 'Sem certificado'}</p>
          </div>
        </div>
        ${trei.temArquivo ? `
        <div class="flex gap-2">
            <button onclick="window.viewTreinamento('${trei.id}')" class="bg-purple-700 text-white hover:bg-purple-800 px-4 py-2.5 rounded-xl font-bold transition-colors shadow-sm">
            Visualizar
            </button>
            <button onclick="window.downloadTreinamento('${trei.id}')" class="bg-white text-purple-600 hover:bg-purple-50 px-4 py-2.5 rounded-xl font-bold transition-colors shadow-sm">
            Baixar
            </button>
        </div>` : '<p class="text-sm text-purple-200 italic">Arquivo não enviado</p>'}
      </div>

    </div>
  `;
};

export const handleDeleteTreinamento = async (id) => {
  if (await showConfirmDialog('Tem certeza que deseja excluir este treinamento?')) {
    try {
      await api.deleteTreinamento(id);
      appState.treinamentos = appState.treinamentos.filter(t => t.id != id);
      updateStats();
      window.navigateTo('treinamentos');
    } catch (err) {
      showToast('Erro ao excluir treinamento: ' + err.message, 'error');
    }
  }
};

export const handleSaveTreinamento = async (e) => {
  e.preventDefault();
  const id = document.getElementById('trei-id')?.value;
  const sigla = document.getElementById('trei-novo-tipo-sigla').value;
  const tipo = sigla || document.getElementById('trei-tipo').value;
  const funcId = document.getElementById('trei-funcionario').value;
  const func = appState.funcionarios.find(f => f.id == funcId);

  const fileInput = document.getElementById('trei-anexo');
  const arquivo = fileInput && fileInput.files.length > 0 ? fileInput.files[0] : null;

  const dados = {
    tipo: tipo,
    funcionarioId: funcId,
    funcionarioNome: func ? func.nome : 'N/A',
    empresaNome: func ? func.empresaNome : 'N/A',
    status: calculateStatus(document.getElementById('trei-vencimento').value),
    dataRealizacao: document.getElementById('trei-realizacao').value,
    dataVencimento: document.getElementById('trei-vencimento').value,
    instrutor: document.getElementById('trei-instrutor').value || 'Não informado',
    observacoes: document.getElementById('trei-obs').value,
    arquivo: arquivo
  };

  try {
    if (id) {
      const updated = await api.updateTreinamento(id, dados);
      const index = appState.treinamentos.findIndex(t => t.id == id);
      if (index !== -1) {
        appState.treinamentos[index] = updated;
      }
    } else {
      const created = await api.createTreinamento(dados);
      appState.treinamentos.push(created);
    }

    updateStats();
    closeModal();
    window.navigateTo('treinamentos');
  } catch (err) {
    showToast('Erro ao salvar treinamento: ' + err.message, 'error');
  }
};

export const addTipoTreinamento = () => {
  const sigla = document.getElementById('trei-novo-tipo-sigla').value.trim();
  const desc = document.getElementById('trei-novo-tipo-desc').value.trim();
  const select = document.getElementById('trei-tipo');

  if (!sigla) {
    showToast('Por favor, informe ao menos a sigla do novo tipo.', 'warning');
    return;
  }

  // Verificar se já existe
  const exists = Array.from(select.options).some(opt => opt.value === sigla);
  if (exists) {
    select.value = sigla;
  } else {
    const option = document.createElement('option');
    option.value = sigla;
    option.text = desc ? `${sigla} (${desc})` : sigla;
    option.selected = true;
    select.add(option);
  }

  // Esconder o form de novo tipo e limpar
  document.getElementById('novo-tipo-treinamento').classList.add('hidden');
  document.getElementById('trei-novo-tipo-sigla').value = '';
  document.getElementById('trei-novo-tipo-desc').value = '';
};

window.viewTreinamento = (id) => {
  window.open(`${BASE_URL}/treinamentos/${id}/view`, '_blank');
};

window.downloadTreinamento = (id) => {
  window.location.href = `${BASE_URL}/treinamentos/${id}/download`;
};