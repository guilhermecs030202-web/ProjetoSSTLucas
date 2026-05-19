import { appState, cartState, INITIAL_STATE, saveState, getFuncionarioCount } from '../store/state.js';
import { calculateStatus } from '../utils/status.js';
import { updateStats } from '../store/stats.js';
import { openModal, closeModal } from '../components/modalConfig.js';

export const renderFormAso = (id = null) => {
  const aso = id ? appState.asos.find(a => a.id == id) : null;
  const empresas = appState.empresas;
  const funcionarios = appState.funcionarios;

  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100">
      <h3 class="text-xl font-bold text-slate-900">${aso ? 'Editar ASO' : 'Registrar ASO'}</h3>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    <form id="form-aso" class="p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-hide" onsubmit="window.handleSaveAso(event)">
      <input type="hidden" id="aso-id" value="${id || ''}">
      <div class="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 mb-4">
        <label class="block text-sm font-semibold text-indigo-900 mb-2">Selecionar Funcionário</label>
        <select id="aso-funcionario" required onchange="window.updateAsoEmployeeInfo(this.value)" class="w-full px-4 py-2 bg-white border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm mb-3">
          <option value="">Selecione...</option>
          ${empresas.map(emp => `
            <optgroup label="${emp.nome}">
              ${funcionarios.filter(f => f.empresaId == emp.id).map(f => `
                <option value="${f.id}" ${aso?.funcionarioId == f.id ? 'selected' : ''}>${f.nome} - ${emp.nome}</option>
              `).join('')}
            </optgroup>
          `).join('')}
        </select>
        <div class="grid grid-cols-3 gap-3 text-xs text-indigo-800">
          <div id="aso-info-cpf"><span class="font-bold">CPF:</span> ${aso ? funcionarios.find(f => f.id == aso.funcionarioId)?.cpf : 'Selecione...'}</div>
          <div id="aso-info-cargo"><span class="font-bold">Cargo:</span> ${aso ? funcionarios.find(f => f.id == aso.funcionarioId)?.cargo : 'Selecione...'}</div>
          <div id="aso-info-empresa"><span class="font-bold">Empresa:</span> ${aso ? aso.empresaNome : 'Selecione...'}</div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Tipo de ASO</label>
          <select id="aso-tipo" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
            <option value="Admissional" ${aso?.tipo === 'Admissional' ? 'selected' : ''}>Admissional</option>
            <option value="Periodico" ${aso?.tipo === 'Periodico' ? 'selected' : ''}>Periódico</option>
            <option value="Demissional" ${aso?.tipo === 'Demissional' ? 'selected' : ''}>Demissional</option>
            <option value="Retorno" ${aso?.tipo === 'Retorno' ? 'selected' : ''}>Retorno ao Trabalho</option>
            <option value="Mudanca" ${aso?.tipo === 'Mudanca' ? 'selected' : ''}>Mudança de Risco</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Aptidão</label>
          <select id="aso-aptidao" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm text-slate-900 font-semibold">
            <option value="Apto" ${aso?.aptidao === 'Apto' ? 'selected' : ''}>APTO</option>
            <option value="Inapto" ${aso?.aptidao === 'Inapto' ? 'selected' : ''}>INAPTO</option>
          </select>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Data de Realização</label>
          <input type="date" id="aso-realizacao" value="${aso ? aso.dataRealizacao : ''}" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Data de Validade</label>
          <input type="date" id="aso-vencimento" value="${aso ? aso.dataVencimento : ''}" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">
        </div>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-semibold text-slate-700 mb-1">Exames Complementares</label>
        <div class="flex gap-2">
          <input type="text" id="aso-exame-nome" placeholder="Nome do exame" class="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
          <input type="date" id="aso-exame-data" class="w-36 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
          <button type="button" onclick="window.addExameAso()" class="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          </button>
        </div>
        <div id="aso-exames-list" class="space-y-2 max-h-32 overflow-y-auto pr-1">
          ${aso?.exames ? aso.exames.split(',').filter(ex => ex.trim() !== '').map(ex => {
            const parts = ex.trim().split('(');
            const nome = parts[0].trim();
            const data = parts[1] ? parts[1].replace(')', '').trim() : '-';
            return `
              <div class="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100 text-xs shadow-sm">
                <span class="font-medium text-slate-700">${nome} <span class="text-slate-400">(${data})</span></span>
                <button type="button" onclick="this.parentElement.remove()" class="text-slate-400 hover:text-red-500 p-1 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            `;
          }).join('') : ''}
        </div>
      </div>

      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1">Observações</label>
        <textarea id="aso-obs" rows="2" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm">${aso ? aso.observacoes || '' : ''}</textarea>
      </div>
      
      <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
        <button type="button" onclick="closeModal()" class="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancelar</button>
        <button type="submit" class="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all">Salvar ASO</button>
      </div>
    </form>
  `;
};

export const renderDetailsAso = (id) => {
  const aso = appState.asos.find(a => a.id == id);
  if (!aso) return '<div class="p-10 text-center font-bold text-slate-500">ASO não encontrado.</div>';

  const func = appState.funcionarios.find(f => f.id == aso.funcionarioId);
  const initials = func ? func.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';

  return `
    <div class="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl ${aso.aptidao === 'Inapto' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'} flex items-center justify-center border">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        </div>
        <div>
          <h3 class="text-xl font-bold text-slate-900">ASO - ${aso.tipo}</h3>
          <p class="text-sm text-slate-500 font-medium mt-0.5">${aso.funcionarioNome} • ${aso.empresaNome}</p>
        </div>
      </div>
      <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
    
    <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto scrollbar-hide bg-slate-50/50">
      
      <!-- Dados da ASO Atual + Funcionário -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Dados do Funcionário</h4>
          <div class="space-y-3 text-sm">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100">${initials}</div>
              <div>
                <p class="font-bold text-slate-900 text-base">${aso.funcionarioNome}</p>
                <p class="text-xs text-slate-500">CPF: ${func?.cpf || 'N/A'}</p>
              </div>
            </div>
            <div class="flex justify-between border-b border-slate-50 pb-2">
              <span class="text-slate-500">Cargo:</span>
              <span class="font-semibold text-slate-900">${func?.cargo || 'N/A'}</span>
            </div>
            <div class="flex justify-between pt-1">
              <span class="text-slate-500">Empresa:</span>
              <span class="font-bold text-indigo-600">${aso.empresaNome}</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Resultado Atual</h4>
          <div class="flex items-center justify-between ${aso.aptidao === 'Inapto' ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'} p-3 rounded-lg border mb-3">
            <span class="font-bold ${aso.aptidao === 'Inapto' ? 'text-red-800' : 'text-emerald-800'}">Aptidão:</span>
            <span class="inline-flex items-center px-4 py-1.5 ${aso.aptidao === 'Inapto' ? 'bg-red-600' : 'bg-emerald-600'} text-white rounded-md text-sm font-bold shadow-sm uppercase">${aso.aptidao || 'Apto'}</span>
          </div>
          <div class="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div>
              <span class="block text-xs text-slate-400 mb-1">Realização</span>
              <span class="font-bold text-slate-700">${aso.dataRealizacao}</span>
            </div>
            <div>
              <span class="block text-xs text-slate-400 mb-1">Validade</span>
              <span class="font-bold ${aso.status === 'Vencido' ? 'text-red-600' : (aso.status === 'Vencendo' ? 'text-amber-600' : 'text-emerald-600')}">${aso.dataVencimento}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Exames Complementares -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
          Exames Complementares
        </h4>
        <div class="overflow-x-auto border border-slate-100 rounded-xl">
          <table class="w-full text-left">
            <thead class="bg-slate-50">
              <tr class="border-b border-slate-100">
                <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Exame</th>
                <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Data</th>
                <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${aso.exames ? aso.exames.split(',').map(ex => {
                const parts = ex.trim().split('(');
                const nome = parts[0].trim();
                const data = parts[1] ? parts[1].replace(')', '').trim() : '-';
                return `
                  <tr class="hover:bg-slate-50/50">
                    <td class="px-4 py-3 text-sm font-semibold text-slate-800">${nome}</td>
                    <td class="px-4 py-3 text-sm text-slate-600">${data}</td>
                    <td class="px-4 py-3 text-center">
                      <span class="inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs font-bold border border-emerald-200">Realizado</span>
                    </td>
                  </tr>
                `;
              }).join('') : `
                <tr>
                  <td colspan="3" class="px-4 py-6 text-center text-sm text-slate-400 italic">Nenhum exame complementar registrado.</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Observações -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Observações do Médico</h4>
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p class="text-sm text-slate-700 leading-relaxed">${aso.observacoes || 'Nenhuma observação registrada.'}</p>
        </div>
      </div>

      <!-- Histórico de ASOs Anteriores -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Histórico de ASOs Anteriores
        </h4>
        <div class="relative border-l-2 border-slate-200 ml-4 space-y-6">
          ${(() => {
            const history = appState.asos
              .filter(a => a.funcionarioId == aso.funcionarioId && a.id != aso.id)
              .sort((a, b) => new Date(b.dataRealizacao.split('/').reverse().join('-')) - new Date(a.dataRealizacao.split('/').reverse().join('-')));
            
            if (history.length === 0) {
              return '<p class="text-sm text-slate-400 pl-6 italic">Nenhum registro anterior encontrado.</p>';
            }

            return history.map(h => `
              <div class="relative pl-6">
                <div class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-300 border-2 border-white"></div>
                <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div class="flex items-center justify-between mb-2">
                    <div>
                      <p class="font-bold text-slate-800 text-sm">${h.tipo}</p>
                      <p class="text-xs text-slate-500">Realizado em ${h.dataRealizacao}</p>
                    </div>
                    <span class="inline-flex items-center px-2 py-0.5 ${h.aptidao === 'Inapto' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'} rounded text-xs font-bold border uppercase">${h.aptidao || 'Apto'}</span>
                  </div>
                  <p class="text-xs text-slate-500">Validade: ${h.dataVencimento}</p>
                </div>
              </div>
            `).join('');
          })()}
        </div>
      </div>
      </div>

    </div>
  `;
};

export const handleDeleteASO = (id) => {
  if (confirm('Tem certeza que deseja excluir este ASO?')) {
    appState.asos = appState.asos.filter(a => a.id != id);
    updateStats();
    window.navigateTo('asos');
  }
};

export const updateAsoEmployeeInfo = (funcId) => {
  const func = appState.funcionarios.find(f => f.id == funcId);
  const cpfEl = document.getElementById('aso-info-cpf');
  const cargoEl = document.getElementById('aso-info-cargo');
  const empresaEl = document.getElementById('aso-info-empresa');

  if (func && cpfEl && cargoEl && empresaEl) {
    cpfEl.innerHTML = `<span class="font-bold">CPF:</span> ${func.cpf}`;
    cargoEl.innerHTML = `<span class="font-bold">Cargo:</span> ${func.cargo}`;
    empresaEl.innerHTML = `<span class="font-bold">Empresa:</span> ${func.empresaNome}`;
  } else if (cpfEl && cargoEl && empresaEl) {
    cpfEl.innerHTML = `<span class="font-bold">CPF:</span> Selecione...`;
    cargoEl.innerHTML = `<span class="font-bold">Cargo:</span> Selecione...`;
    empresaEl.innerHTML = `<span class="font-bold">Empresa:</span> Selecione...`;
  }
};

export const addExameAso = () => {
  const nome = document.getElementById('aso-exame-nome').value.trim();
  const data = document.getElementById('aso-exame-data').value;
  const list = document.getElementById('aso-exames-list');

  if (!nome) {
    alert('Por favor, informe o nome do exame.');
    return;
  }

  const dataFormatada = data ? data.split('-').reverse().join('/') : '-';

  const item = document.createElement('div');
  item.className = "flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100 text-xs shadow-sm";
  item.innerHTML = `
    <span class="font-medium text-slate-700">${nome} <span class="text-slate-400">(${dataFormatada})</span></span>
    <button type="button" onclick="this.parentElement.remove()" class="text-slate-400 hover:text-red-500 p-1 transition-colors">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
  `;
  list.appendChild(item);

  // Limpar campos e focar no nome
  document.getElementById('aso-exame-nome').value = '';
  document.getElementById('aso-exame-data').value = '';
  document.getElementById('aso-exame-nome').focus();
};

export const handleSaveAso = (e) => {
  e.preventDefault();
  const id = document.getElementById('aso-id')?.value;
  const funcId = document.getElementById('aso-funcionario').value;
  const func = appState.funcionarios.find(f => f.id == funcId);

  const dados = {
    tipo: document.getElementById('aso-tipo').value,
    funcionarioId: parseInt(funcId),
    funcionarioNome: func ? func.nome : 'N/A',
    empresaNome: func ? func.empresaNome : 'N/A',
    status: calculateStatus(document.getElementById('aso-vencimento').value),
    aptidao: document.getElementById('aso-aptidao').value,
    dataRealizacao: document.getElementById('aso-realizacao').value,
    dataVencimento: document.getElementById('aso-vencimento').value,
    exames: (() => {
      const items = document.querySelectorAll('#aso-exames-list > div span.font-medium');
      return Array.from(items).map(span => span.textContent.trim()).join(', ');
    })(),
    observacoes: document.getElementById('aso-obs').value
  };

  if (id) {
    const index = appState.asos.findIndex(a => a.id == id);
    if (index !== -1) {
      appState.asos[index] = { ...appState.asos[index], ...dados };
    }
  } else {
    appState.asos.push({
      id: Date.now(),
      ...dados
    });
  }

  updateStats();
  closeModal();
  window.navigateTo('asos');
};