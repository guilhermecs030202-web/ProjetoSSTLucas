import './style.css';
import { updateStats } from './store/stats.js';
import { initDashboardCharts, destroyAllCharts } from './charts.js';

// Components (Modals)
import { openModal, closeModal } from './components/modalConfig.js';
import { renderFormEmpresa, renderDetailsEmpresa, handleSaveEmpresa, handleDeleteEmpresa } from './components/ModalsEmpresas.js';
import { renderFormFuncionario, renderDetailsFuncionario, handleSaveFuncionario, handleDeleteFuncionario } from './components/ModalsFuncionarios.js';
import { renderFormDocumento, renderDetailsDocumento, handleSaveDocumento, handleDeleteDocumento, addTipoDocumento } from './components/ModalsDocumentos.js';
import { renderFormTreinamento, renderDetailsTreinamento, handleSaveTreinamento, handleDeleteTreinamento, addTipoTreinamento } from './components/ModalsTreinamentos.js';
import { renderFormAso, renderDetailsAso, handleSaveAso, handleDeleteASO, updateAsoEmployeeInfo, addExameAso } from './components/ModalsAsos.js';
import { renderFormEpi, renderDetailsEpi, openEpiModal, addItemToCart, removeItemFromCart, addDistribution, removeDistribution, openEstoqueModal, addManualItemToEstoque, updateEstoqueQtd, deleteItemEstoque, syncEstoqueFromNf, handleSaveCompraEpi, handleDeleteCompraEpi } from './components/ModalsEpis.js';
import { renderFormAcidente, renderDetailsAcidente, handleSaveAcidente, handleDeleteAcidente } from './components/ModalsAcidentes.js';

// Utils (Filters and Formatters)
import { handleSearch } from './utils/filters.js';
import { maskCNPJ } from './utils/formatters.js';

// Pages (Views)
import { handleSectorFilter } from './pages/Empresas.js';
import { toggleCipa } from './pages/Funcionarios.js';
import { handleTreinamentoStatusFilter } from './pages/Treinamentos.js';
import { handleAsoAptidaoFilter } from './pages/Asos.js';
import { handleEpiDateFilter } from './pages/Epis.js';
import { handleAcidenteStatusFilter } from './pages/Acidentes.js';

// Routes
import { navigateTo } from './routes/router.js';

// ==========================================
// Expose functions to window (for inline HTML events)
// ==========================================

// Modals Setup
window.openModal = openModal;
window.closeModal = closeModal;

// Empresas
window.renderFormEmpresa = renderFormEmpresa;
window.renderDetailsEmpresa = renderDetailsEmpresa;
window.handleSaveEmpresa = handleSaveEmpresa;
window.handleDeleteEmpresa = handleDeleteEmpresa;

// Funcionarios
window.renderFormFuncionario = renderFormFuncionario;
window.renderDetailsFuncionario = renderDetailsFuncionario;
window.handleSaveFuncionario = handleSaveFuncionario;
window.handleDeleteFuncionario = handleDeleteFuncionario;
window.toggleCipa = toggleCipa;

// Documentos
window.renderFormDocumento = renderFormDocumento;
window.renderDetailsDocumento = renderDetailsDocumento;
window.handleSaveDocumento = handleSaveDocumento;
window.handleDeleteDocumento = handleDeleteDocumento;
window.addTipoDocumento = addTipoDocumento;

// Treinamentos
window.renderFormTreinamento = renderFormTreinamento;
window.renderDetailsTreinamento = renderDetailsTreinamento;
window.handleSaveTreinamento = handleSaveTreinamento;
window.handleDeleteTreinamento = handleDeleteTreinamento;
window.addTipoTreinamento = addTipoTreinamento;

// ASOs
window.renderFormAso = renderFormAso;
window.renderDetailsAso = renderDetailsAso;
window.handleSaveAso = handleSaveAso;
window.handleDeleteASO = handleDeleteASO;
window.updateAsoEmployeeInfo = updateAsoEmployeeInfo;
window.addExameAso = addExameAso;

// EPIs
window.renderFormEpi = renderFormEpi;
window.renderDetailsEpi = renderDetailsEpi;
window.openEpiModal = openEpiModal;
window.addItemToCart = addItemToCart;
window.removeItemFromCart = removeItemFromCart;
window.addDistribution = addDistribution;
window.removeDistribution = removeDistribution;
window.openEstoqueModal = openEstoqueModal;
window.addManualItemToEstoque = addManualItemToEstoque;
window.updateEstoqueQtd = updateEstoqueQtd;
window.deleteItemEstoque = deleteItemEstoque;
window.syncEstoqueFromNf = syncEstoqueFromNf;
window.handleSaveCompraEpi = handleSaveCompraEpi;
window.handleDeleteCompraEpi = handleDeleteCompraEpi;

// Acidentes
window.renderFormAcidente = renderFormAcidente;
window.renderDetailsAcidente = renderDetailsAcidente;
window.handleSaveAcidente = handleSaveAcidente;
window.handleDeleteAcidente = handleDeleteAcidente;

// Filters & Formatters
window.handleSearch = handleSearch;
window.handleSectorFilter = handleSectorFilter;
window.handleTreinamentoStatusFilter = handleTreinamentoStatusFilter;
window.handleAsoAptidaoFilter = handleAsoAptidaoFilter;
window.handleEpiDateFilter = handleEpiDateFilter;
window.handleAcidenteStatusFilter = handleAcidenteStatusFilter;
window.maskCNPJ = maskCNPJ;

// Router
window.navigateTo = navigateTo;

// ==========================================
// Initialization
// ==========================================

// Global error handler for debugging
window.onerror = function (message, source, lineno, colno, error) {
  console.error('[Global Error]', { message, source, lineno, colno, error });
  return false;
};

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    window.location.href = '/index.html';
  });
}

// Initial calculations and rendering
const init = async () => {
  try {
    console.log('[Dashboard] Initializing application...');
    await updateStats();

    // Garantir que o DOM está pronto antes de navegar
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => navigateTo('dashboard'));
    } else {
      navigateTo('dashboard');
    }
  } catch (err) {
    console.error('[Dashboard] Critical error during initialization:', err);
    const container = document.getElementById('page-container');
    if (container) {
      container.innerHTML = `<div class="p-10 text-red-500 font-bold">Erro crítico na inicialização. Verifique o console.</div>`;
    }
  }
};

init();