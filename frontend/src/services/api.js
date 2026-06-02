// src/services/api.js
// ------------------------------------------------------------
// Service layer – centraliza todas as chamadas à API do backend.
// Utiliza fetch (ESM) e retorna objetos JSON prontos para uso.
// ------------------------------------------------------------

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Formatting and cleaning helpers
function cleanNumber(val) {
  return val ? String(val).replace(/\D/g, '') : '';
}

function formatCNPJ(cnpj) {
  if (!cnpj) return '';
  const clean = cleanNumber(cnpj);
  if (clean.length !== 14) return cnpj;
  return `${clean.substring(0, 2)}.${clean.substring(2, 5)}.${clean.substring(5, 8)}/${clean.substring(8, 12)}-${clean.substring(12, 14)}`;
}

function formatCPF(cpf) {
  if (!cpf) return '';
  const clean = cleanNumber(cpf);
  if (clean.length !== 11) return cpf;
  return `${clean.substring(0, 3)}.${clean.substring(3, 6)}.${clean.substring(6, 9)}-${clean.substring(9, 11)}`;
}

function formatToBR(dateStr) {
  if (!dateStr) return '';
  if (dateStr.includes('T')) {
    dateStr = dateStr.split('T')[0];
  }
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function formatToISO(dateStr) {
  if (!dateStr) return '';
  if (dateStr.includes('-')) return dateStr.split('T')[0];
  const parts = dateStr.split('/');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

/**
 * Helper genérico para fazer requisições GET.
 */
export async function get(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.warn(`Falha ao acessar ${endpoint}: ${err.message}`);
    throw err;
  }
}

/**
 * Helper genérico para fazer requisições POST.
 */
export async function post(endpoint, data) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.warn(`Falha ao acessar ${endpoint}: ${err.message}`);
    throw err;
  }
}

/**
 * Helper genérico para fazer requisições PUT.
 */
export async function put(endpoint, data) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.warn(`Falha ao acessar ${endpoint}: ${err.message}`);
    throw err;
  }
}

/**
 * Helper genérico para fazer requisições DELETE.
 */
export async function del(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.status === 204 ? null : await response.json();
  } catch (err) {
    console.warn(`Falha ao acessar ${endpoint}: ${err.message}`);
    throw err;
  }
}

/**
 * Helper para buscar ou cadastrar cargo dinamicamente.
 */
export async function getOrCreateCargo(nomeCargo, idEmpresa) {
  if (!nomeCargo) return null;
  try {
    const cargos = await get('/cargos');
    const existing = cargos.find(
      c => c.nomeCargo.toLowerCase() === nomeCargo.toLowerCase() && c.idEmpresa === idEmpresa
    );
    if (existing) {
      return existing.idCargo;
    }
    const newCargo = await post('/cargos', { nomeCargo, idEmpresa });
    return newCargo.idCargo;
  } catch (err) {
    console.error('Erro ao buscar/criar cargo:', err);
    return null;
  }
}

// ------------------------------------------------------------
// Funções específicas exportadas
// ------------------------------------------------------------
export const api = {
  getStats: () => get('/stats'),

  // Empresas
  getEmpresas: async () => {
    const res = await get('/empresas');
    return res.map(item => ({
      id: item.idEmpresa,
      nome: item.razaoSocial,
      cnpj: formatCNPJ(item.cnpj),
      setor: item.setor || 'Serviço industrial',
      status: item.status || 'Ativa',
      dataCriacao: item.dataCriacao || 'Jan 2026'
    }));
  },
  createEmpresa: async (data) => {
    const body = {
      razaoSocial: data.nome,
      cnpj: cleanNumber(data.cnpj),
      setor: data.setor,
      status: data.status || 'Ativa',
      dataCriacao: data.dataCriacao || new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
    };
    const res = await post('/empresas', body);
    return {
      id: res.idEmpresa,
      nome: res.razaoSocial,
      cnpj: formatCNPJ(res.cnpj),
      setor: res.setor,
      status: res.status,
      dataCriacao: res.dataCriacao
    };
  },
  updateEmpresa: async (id, data) => {
    const body = {
      razaoSocial: data.nome,
      cnpj: cleanNumber(data.cnpj),
      setor: data.setor,
      status: data.status,
      dataCriacao: data.dataCriacao
    };
    const res = await put(`/empresas/${id}`, body);
    return {
      id: res.idEmpresa,
      nome: res.razaoSocial,
      cnpj: formatCNPJ(res.cnpj),
      setor: res.setor,
      status: res.status,
      dataCriacao: res.dataCriacao
    };
  },
  deleteEmpresa: (id) => del(`/empresas/${id}`),

  // Funcionarios
  getFuncionarios: async () => {
    const res = await get('/funcionarios');
    return res.map(item => ({
      id: item.idFuncionario,
      matricula: item.matricula,
      nome: item.nomeCompleto,
      cpf: formatCPF(item.cpf),
      dataNascimento: item.dataNascimento ? item.dataNascimento.split('T')[0] : '',
      dataAdmissao: item.dataAdmissao ? item.dataAdmissao.split('T')[0] : '',
      empresaId: item.idEmpresa,
      empresaNome: item.empresa ? item.empresa.razaoSocial : 'N/A',
      cargo: item.cargo ? item.cargo.nomeCargo : 'N/A'
    }));
  },
  createFuncionario: async (data) => {
    const idCargo = await getOrCreateCargo(data.cargo, data.empresaId);
    const body = {
      matricula: data.matricula,
      nomeCompleto: data.nome,
      cpf: cleanNumber(data.cpf),
      dataAdmissao: formatToISO(data.dataAdmissao),
      dataNascimento: formatToISO(data.dataNascimento),
      idEmpresa: data.empresaId,
      idCargo: idCargo
    };
    const res = await post('/funcionarios', body);
    return {
      id: res.idFuncionario,
      matricula: res.matricula,
      nome: res.nomeCompleto,
      cpf: formatCPF(res.cpf),
      dataNascimento: res.dataNascimento ? res.dataNascimento.split('T')[0] : '',
      dataAdmissao: res.dataAdmissao ? res.dataAdmissao.split('T')[0] : '',
      empresaId: res.idEmpresa,
      empresaNome: data.empresaNome || 'N/A',
      cargo: data.cargo || 'N/A'
    };
  },
  updateFuncionario: async (id, data) => {
    const idCargo = await getOrCreateCargo(data.cargo, data.empresaId);
    const body = {
      matricula: data.matricula,
      nomeCompleto: data.nome,
      cpf: cleanNumber(data.cpf),
      dataAdmissao: formatToISO(data.dataAdmissao),
      dataNascimento: formatToISO(data.dataNascimento),
      idEmpresa: data.empresaId,
      idCargo: idCargo
    };
    const res = await put(`/funcionarios/${id}`, body);
    return {
      id: res.idFuncionario,
      matricula: res.matricula,
      nome: res.nomeCompleto,
      cpf: formatCPF(res.cpf),
      dataNascimento: res.dataNascimento ? res.dataNascimento.split('T')[0] : '',
      dataAdmissao: res.dataAdmissao ? res.dataAdmissao.split('T')[0] : '',
      empresaId: res.idEmpresa,
      empresaNome: data.empresaNome || 'N/A',
      cargo: data.cargo || 'N/A'
    };
  },
  deleteFuncionario: (id) => del(`/funcionarios/${id}`),

  // Documentos
  getDocumentos: async () => {
    const res = await get('/documentos-sst');
    return res.map(item => ({
      id: item.idDocumento,
      tipo: item.tipoDocumento,
      empresaId: item.idEmpresa,
      empresaNome: item.empresa ? item.empresa.razaoSocial : 'N/A',
      dataEmissao: formatToBR(item.dataEmissaoUpload),
      dataVencimento: formatToBR(item.dataValidade),
      status: item.statusDocumento
    }));
  },
  createDocumento: async (data) => {
    const body = {
      tipoDocumento: data.tipo,
      dataEmissaoUpload: formatToISO(data.dataEmissao),
      dataValidade: formatToISO(data.dataVencimento),
      statusDocumento: data.status,
      idEmpresa: data.empresaId
    };
    const res = await post('/documentos-sst', body);
    return {
      id: res.idDocumento,
      tipo: res.tipoDocumento,
      empresaId: res.idEmpresa,
      empresaNome: data.empresaNome || 'N/A',
      dataEmissao: formatToBR(res.dataEmissaoUpload),
      dataVencimento: formatToBR(res.dataValidade),
      status: res.statusDocumento
    };
  },
  updateDocumento: async (id, data) => {
    const body = {
      tipoDocumento: data.tipo,
      dataEmissaoUpload: formatToISO(data.dataEmissao),
      dataValidade: formatToISO(data.dataVencimento),
      statusDocumento: data.status,
      idEmpresa: data.empresaId
    };
    const res = await put(`/documentos-sst/${id}`, body);
    return {
      id: res.idDocumento,
      tipo: res.tipoDocumento,
      empresaId: res.idEmpresa,
      empresaNome: data.empresaNome || 'N/A',
      dataEmissao: formatToBR(res.dataEmissaoUpload),
      dataVencimento: formatToBR(res.dataValidade),
      status: res.statusDocumento
    };
  },
  deleteDocumento: (id) => del(`/documentos-sst/${id}`),

  // Treinamentos
  getTreinamentos: async () => {
    const res = await get('/treinamentos');
    return res.map(item => ({
      id: item.idTreinamento,
      tipo: item.tipoTreinamento,
      funcionarioId: item.idFuncionario,
      funcionarioNome: item.funcionario ? item.funcionario.nomeCompleto : 'N/A',
      empresaNome: item.funcionario && item.funcionario.empresa ? item.funcionario.empresa.razaoSocial : 'N/A',
      dataRealizacao: item.dataRealizacao ? item.dataRealizacao.split('T')[0] : '',
      dataVencimento: item.dataValidade ? item.dataValidade.split('T')[0] : '',
      instrutor: item.instrutor || 'Não informado',
      observacoes: item.observacoes,
      status: item.statusTreinamento
    }));
  },
  createTreinamento: async (data) => {
    const body = {
      tipoTreinamento: data.tipo,
      dataRealizacao: formatToISO(data.dataRealizacao),
      dataValidade: formatToISO(data.dataVencimento),
      statusTreinamento: data.status,
      observacoes: data.observacoes,
      instrutor: data.instrutor,
      idFuncionario: data.funcionarioId
    };
    const res = await post('/treinamentos', body);
    return {
      id: res.idTreinamento,
      tipo: res.tipoTreinamento,
      funcionarioId: res.idFuncionario,
      funcionarioNome: data.funcionarioNome || 'N/A',
      empresaNome: data.empresaNome || 'N/A',
      dataRealizacao: res.dataRealizacao ? res.dataRealizacao.split('T')[0] : '',
      dataVencimento: res.dataValidade ? res.dataValidade.split('T')[0] : '',
      instrutor: res.instrutor || 'Não informado',
      observacoes: res.observacoes,
      status: res.statusTreinamento
    };
  },
  updateTreinamento: async (id, data) => {
    const body = {
      tipoTreinamento: data.tipo,
      dataRealizacao: formatToISO(data.dataRealizacao),
      dataValidade: formatToISO(data.dataVencimento),
      statusTreinamento: data.status,
      observacoes: data.observacoes,
      instrutor: data.instrutor,
      idFuncionario: data.funcionarioId
    };
    const res = await put(`/treinamentos/${id}`, body);
    return {
      id: res.idTreinamento,
      tipo: res.tipoTreinamento,
      funcionarioId: res.idFuncionario,
      funcionarioNome: data.funcionarioNome || 'N/A',
      empresaNome: data.empresaNome || 'N/A',
      dataRealizacao: res.dataRealizacao ? res.dataRealizacao.split('T')[0] : '',
      dataVencimento: res.dataValidade ? res.dataValidade.split('T')[0] : '',
      instrutor: res.instrutor || 'Não informado',
      observacoes: res.observacoes,
      status: res.statusTreinamento
    };
  },
  deleteTreinamento: (id) => del(`/treinamentos/${id}`),

  // Asos
  getAsos: async () => {
    const res = await get('/asos');
    return res.map(item => ({
      id: item.idAso,
      tipo: item.tipoExame,
      funcionarioId: item.idFuncionario,
      funcionarioNome: item.funcionario ? item.funcionario.nomeCompleto : 'N/A',
      empresaNome: item.funcionario && item.funcionario.empresa ? item.funcionario.empresa.razaoSocial : 'N/A',
      dataRealizacao: formatToBR(item.dataExame),
      dataVencimento: formatToBR(item.dataValidade),
      aptidao: item.statusAptidao,
      status: formatToISO(item.dataValidade) < new Date().toISOString().split('T')[0] ? 'Vencido' : 'Válido', // calculate locally
      exames: item.exames || '',
      observacoes: item.observacoes || ''
    }));
  },
  createAso: async (data) => {
    const body = {
      tipoExame: data.tipo,
      dataExame: formatToISO(data.dataRealizacao),
      dataValidade: formatToISO(data.dataVencimento),
      statusAptidao: data.aptidao,
      riscosOcupacionais: 'Nenhum', // default as required by database schema
      idFuncionario: data.funcionarioId,
      observacoes: data.observacoes,
      exames: data.exames
    };
    const res = await post('/asos', body);
    return {
      id: res.idAso,
      tipo: res.tipoExame,
      funcionarioId: res.idFuncionario,
      funcionarioNome: data.funcionarioNome || 'N/A',
      empresaNome: data.empresaNome || 'N/A',
      dataRealizacao: formatToBR(res.dataExame),
      dataVencimento: formatToBR(res.dataValidade),
      aptidao: res.statusAptidao,
      status: data.status,
      exames: res.exames || '',
      observacoes: res.observacoes || ''
    };
  },
  updateAso: async (id, data) => {
    const body = {
      tipoExame: data.tipo,
      dataExame: formatToISO(data.dataRealizacao),
      dataValidade: formatToISO(data.dataVencimento),
      statusAptidao: data.aptidao,
      riscosOcupacionais: 'Nenhum',
      idFuncionario: data.funcionarioId,
      observacoes: data.observacoes,
      exames: data.exames
    };
    const res = await put(`/asos/${id}`, body);
    return {
      id: res.idAso,
      tipo: res.tipoExame,
      funcionarioId: res.idFuncionario,
      funcionarioNome: data.funcionarioNome || 'N/A',
      empresaNome: data.empresaNome || 'N/A',
      dataRealizacao: formatToBR(res.dataExame),
      dataVencimento: formatToBR(res.dataValidade),
      aptidao: res.statusAptidao,
      status: data.status,
      exames: res.exames || '',
      observacoes: res.observacoes || ''
    };
  },
  deleteAso: (id) => del(`/asos/${id}`),

  // Compras EPI
  getEpis: async () => {
    const res = await get('/compras-epi');
    return res.map(item => ({
      id: item.idCompra,
      nf: item.nf || 'S/N',
      data: item.dataCompra ? item.dataCompra.split('T')[0] : '',
      valorTotal: item.valorTotalCompra || 0,
      itens: (item.itensCompra || []).map(it => ({
        id: it.idItemCompra,
        tipo: it.epi ? it.epi.descricaoMaterial : 'EPI',
        descricao: it.epi ? it.epi.nomeEquipamento : 'Equipamento',
        ca: it.epi ? it.epi.ca : '',
        quantidade: it.quantidadeComprada || 0,
        valorUnitario: it.precoPraticado || 0,
        distribuicoes: (it.distribuicoes || []).map(d => ({
          id: d.idDistribuicao,
          empresaId: d.idEmpresa,
          empresaNome: d.empresa ? d.empresa.razaoSocial : 'N/A',
          quantidade: d.quantidadeDestinada || 0
        }))
      }))
    }));
  },
  createEpi: async (data) => {
    const body = {
      dataCompra: data.data,
      valorTotalCompra: data.valorTotal,
      nf: data.nf,
      itens: data.itens
    };
    const res = await post('/compras-epi', body);
    return res;
  },
  updateEpi: async (id, data) => {
    const body = {
      dataCompra: data.data,
      valorTotalCompra: data.valorTotal,
      nf: data.nf,
      itens: data.itens
    };
    const res = await put(`/compras-epi/${id}`, body);
    return res;
  },
  deleteEpi: (id) => del(`/compras-epi/${id}`),

  // Acidentes
  getAcidentes: async () => {
    const res = await get('/acidentes');
    return res.map(item => ({
      id: item.idAcidente,
      data: item.dataAcidente ? item.dataAcidente.split('T')[0] : '',
      hora: item.hora || '12:00',
      funcionarioId: item.idFuncionario,
      funcionarioNome: item.funcionario ? item.funcionario.nomeCompleto : 'N/A',
      empresaNome: item.funcionario && item.funcionario.empresa ? item.funcionario.empresa.razaoSocial : 'N/A',
      tipo: item.tipo || 'Tipico',
      catEmitida: !!item.catEmitida,
      status: item.catEmitida ? 'CAT Emitida' : 'Cat Pendente',
      descricao: item.descricaoEvento,
      local: item.local || 'Não informado',
      parteCorpo: item.parteCorpo || '',
      agente: item.agente || '',
      cid: item.cid || '',
      afastamento: item.afastamento || 'Nao',
      obito: item.obito || 'Nao',
      medico: item.medico || '',
      crm: item.crm || '',
      testemunhaNome: item.testemunhaNome || '',
      testemunhaTelefone: item.testemunhaTelefone || ''
    }));
  },
  createAcidente: async (data) => {
    const body = {
      dataAcidente: formatToISO(data.data),
      gravidadeLesao: data.parteCorpo || 'N/A',
      descricaoEvento: data.descricao,
      medidasAdotadas: data.agente || 'N/A',
      idFuncionario: data.funcionarioId,
      hora: data.hora,
      local: data.local,
      parteCorpo: data.parteCorpo,
      agente: data.agente,
      cid: data.cid,
      afastamento: data.afastamento,
      obito: data.obito,
      medico: data.medico,
      crm: data.crm,
      testemunhaNome: data.testemunhaNome,
      testemunhaTelefone: data.testemunhaTelefone,
      catEmitida: !!data.catEmitida,
      tipo: data.tipo
    };
    const res = await post('/acidentes', body);
    return {
      id: res.idAcidente,
      data: res.dataAcidente ? res.dataAcidente.split('T')[0] : '',
      hora: res.hora || '12:00',
      funcionarioId: res.idFuncionario,
      funcionarioNome: data.funcionarioNome || 'N/A',
      empresaNome: data.empresaNome || 'N/A',
      tipo: res.tipo || 'Tipico',
      catEmitida: !!res.catEmitida,
      status: res.catEmitida ? 'CAT Emitida' : 'Cat Pendente',
      descricao: res.descricaoEvento,
      local: res.local || 'Não informado',
      parteCorpo: res.parteCorpo || '',
      agente: res.agente || '',
      cid: res.cid || '',
      afastamento: res.afastamento || 'Nao',
      obito: res.obito || 'Nao',
      medico: res.medico || '',
      crm: res.crm || '',
      testemunhaNome: res.testemunhaNome || '',
      testemunhaTelefone: res.testemunhaTelefone || ''
    };
  },
  updateAcidente: async (id, data) => {
    const body = {
      dataAcidente: formatToISO(data.data),
      gravidadeLesao: data.parteCorpo || 'N/A',
      descricaoEvento: data.descricao,
      medidasAdotadas: data.agente || 'N/A',
      idFuncionario: data.funcionarioId,
      hora: data.hora,
      local: data.local,
      parteCorpo: data.parteCorpo,
      agente: data.agente,
      cid: data.cid,
      afastamento: data.afastamento,
      obito: data.obito,
      medico: data.medico,
      crm: data.crm,
      testemunhaNome: data.testemunhaNome,
      testemunhaTelefone: data.testemunhaTelefone,
      catEmitida: !!data.catEmitida,
      tipo: data.tipo
    };
    const res = await put(`/acidentes/${id}`, body);
    return {
      id: res.idAcidente,
      data: res.dataAcidente ? res.dataAcidente.split('T')[0] : '',
      hora: res.hora || '12:00',
      funcionarioId: res.idFuncionario,
      funcionarioNome: data.funcionarioNome || 'N/A',
      empresaNome: data.empresaNome || 'N/A',
      tipo: res.tipo || 'Tipico',
      catEmitida: !!res.catEmitida,
      status: res.catEmitida ? 'CAT Emitida' : 'Cat Pendente',
      descricao: res.descricaoEvento,
      local: res.local || 'Não informado',
      parteCorpo: res.parteCorpo || '',
      agente: res.agente || '',
      cid: res.cid || '',
      afastamento: res.afastamento || 'Nao',
      obito: res.obito || 'Nao',
      medico: res.medico || '',
      crm: res.crm || '',
      testemunhaNome: res.testemunhaNome || '',
      testemunhaTelefone: res.testemunhaTelefone || ''
    };
  },
  deleteAcidente: (id) => del(`/acidentes/${id}`),

  getKPIs: () => get('/dashboard/kpis'),
  getAccidentTrend: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return get(`/dashboard/accidents-trend${query ? `?${query}` : ''}`);
  },
  getAlerts: () => get('/dashboard/alerts')
};
