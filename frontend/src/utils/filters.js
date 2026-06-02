import { appState, cartState, INITIAL_STATE, saveState, getFuncionarioCount } from '../store/state.js';

export const handleSearch = (event, pageId) => {
  appState.filters[pageId] = event.target.value.toLowerCase();
  
  // Recarrega a view localmente de forma síncrona, sem chamar a API (forceFetch = false)
  navigateTo(pageId, false);

  // Reposicionar o cursor no final do input após a troca do HTML
  setTimeout(() => {
    const input = document.querySelector(`input[data-search-page="${pageId}"]`);
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }, 0);
};