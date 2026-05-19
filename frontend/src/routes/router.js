import { appState } from '../store/state.js';
import { renderDashboard } from '../pages/Dashboard.js';
import { renderEmpresas } from '../pages/Empresas.js';
import { renderFuncionarios } from '../pages/Funcionarios.js';
import { renderDocumentos } from '../pages/Documentos.js';
import { renderTreinamentos } from '../pages/Treinamentos.js';
import { renderAsos } from '../pages/Asos.js';
import { renderEpis } from '../pages/Epis.js';
import { renderAcidentes } from '../pages/Acidentes.js';
import { initDashboardCharts, destroyAllCharts } from '../charts.js';

// Seleção de elementos com fallback
const getElements = () => ({
  mainContent: document.getElementById('page-container'),
  navItems: document.querySelectorAll('.nav-item')
});

export const navigateTo = (pageId) => {
  console.log(`[Router] Navegando para: ${pageId}`);
  window.currentPage = pageId;

  const { mainContent, navItems } = getElements();

  if (!mainContent) {
    console.error('[Router] Erro: Elemento #page-container não encontrado no DOM.');
    return;
  }

  // 📊 [ApexCharts] Limpeza
  try {
    destroyAllCharts();
  } catch (e) {
    console.warn('[Router] Erro ao destruir gráficos:', e);
  }

  // 1. Atualizar o conteúdo principal
  try {
    let html = '';
    switch (pageId) {
      case 'dashboard':
        html = renderDashboard();
        break;
      case 'empresas':
        html = renderEmpresas();
        break;
      case 'funcionarios':
        html = renderFuncionarios();
        break;
      case 'documentos':
        html = renderDocumentos();
        break;
      case 'treinamentos':
        html = renderTreinamentos();
        break;
      case 'asos':
        html = renderAsos();
        break;
      case 'epis':
        html = renderEpis();
        break;
      case 'acidentes':
        html = renderAcidentes();
        break;
      default:
        console.warn(`[Router] Página desconhecida: ${pageId}`);
        html = '<div class="p-10 text-slate-500">Página em construção...</div>';
    }

    mainContent.innerHTML = html;

    // Inicializar gráficos se for dashboard
    if (pageId === 'dashboard') {
      initDashboardCharts(appState);
    }
  } catch (error) {
    console.error(`[Router] Erro ao renderizar página ${pageId}:`, error);
    mainContent.innerHTML = `
      <div class="p-10 text-red-500 bg-red-50 rounded-2xl border border-red-200 m-10">
        <h2 class="text-lg font-bold mb-2">Erro de Renderização</h2>
        <p class="text-sm">Não foi possível carregar a página <strong>${pageId}</strong>.</p>
        <pre class="mt-4 p-4 bg-slate-900 text-slate-100 rounded-xl text-xs overflow-auto">${error.stack || error.message}</pre>
      </div>
    `;
  }

  // 2. Atualizar o visual do menu
  if (navItems.length > 0) {
    navItems.forEach(item => {
      if (item.getAttribute('data-page') === pageId) {
        item.classList.add('active');
        item.classList.remove('text-slate-500', 'hover:bg-slate-50', 'hover:text-indigo-600');
      } else {
        item.classList.remove('active');
        item.classList.add('text-slate-500', 'hover:bg-slate-50', 'hover:text-indigo-600');
      }
    });
  }
};

// Inicializar listeners
const initRouter = () => {
  const { navItems } = getElements();
  console.log(`[Router] Inicializando listeners para ${navItems.length} itens de menu.`);
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const pageId = item.getAttribute('data-page');
      navigateTo(pageId);
    });
  });
};

// Executar inicialização quando o módulo for carregado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRouter);
} else {
  initRouter();
}