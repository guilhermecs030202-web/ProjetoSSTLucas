// src/services/api.js
// ------------------------------------------------------------
// Service layer – centraliza todas as chamadas à API do backend.
// Utiliza fetch (ESM) e retorna objetos JSON prontos para uso nos
// componentes do dashboard.
// ------------------------------------------------------------

/**
 * Base URL da API. Pode ser sobrescrita via variável de ambiente
 * VITE_API_BASE_URL (Vite expõe variáveis que começam com VITE_).
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

/**
 * Helper genérico para fazer requisições GET.
 * @param {string} endpoint - caminho relativo da API (ex.: '/kpis')
 * @returns {Promise<any>} Dados JSON da resposta ou objeto de erro.
 */
async function get(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.warn(`Falha ao acessar ${endpoint}: ${err.message}`);
    // Fallback para mock local (arquivo JSON dentro de /public/mocks)
    return fetchMock(endpoint);
  }
}

/**
 * Busca dados de mock quando a API real não está disponível.
 * Os arquivos de mock devem estar em public/mocks/<endpoint>.json
 */
async function fetchMock(endpoint) {
  const mockPath = `/mocks${endpoint}.json`;
  try {
    const res = await fetch(mockPath);
    if (!res.ok) throw new Error('Mock not found');
    return await res.json();
  } catch (e) {
    console.error(`Nenhum mock disponível para ${endpoint}`);
    return { error: 'Data not available' };
  }
}

// ------------------------------------------------------------
// Funções específicas do dashboard
// ------------------------------------------------------------
export async function getKPIs() {
  // Espera que o backend retorne: { totalAccidents, pendingEPI, activeCompanies, ... }
  return get('/dashboard/kpis');
}

export async function getAccidentTrend(params = {}) {
  // Params pode conter filtros como { year: 2025 }
  const query = new URLSearchParams(params).toString();
  return get(`/dashboard/accidents-trend${query ? `?${query}` : ''}`);
}

export async function getAlerts() {
  // Lista de alertas críticos a exibir na tabela
  return get('/dashboard/alerts');
}

// Exporta o objeto completo para conveniência
export const api = { getKPIs, getAccidentTrend, getAlerts };
