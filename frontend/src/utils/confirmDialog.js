export const showConfirmDialog = (message, title = 'Confirmar Ação') => {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 opacity-0 transition-opacity duration-300';
    
    const modal = document.createElement('div');
    modal.className = 'bg-white rounded-2xl shadow-xl w-full max-w-sm transform scale-95 transition-transform duration-300 overflow-hidden';
    
    modal.innerHTML = `
      <div class="p-6">
        <div class="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4 mx-auto">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h3 class="text-lg font-bold text-slate-900 text-center mb-2">${title}</h3>
        <p class="text-sm text-slate-500 text-center">${message}</p>
      </div>
      <div class="bg-slate-50 px-6 py-4 flex gap-3 justify-end">
        <button id="confirm-cancel-btn" class="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancelar</button>
        <button id="confirm-ok-btn" class="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-sm shadow-red-600/20 transition-all">Confirmar</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.classList.remove('opacity-0');
      modal.classList.remove('scale-95');
    });

    const closeDialog = (result) => {
      overlay.classList.add('opacity-0');
      modal.classList.add('scale-95');
      setTimeout(() => {
        if (overlay.parentElement) overlay.remove();
        resolve(result);
      }, 300);
    };

    modal.querySelector('#confirm-cancel-btn').addEventListener('click', () => closeDialog(false));
    modal.querySelector('#confirm-ok-btn').addEventListener('click', () => closeDialog(true));
  });
};
