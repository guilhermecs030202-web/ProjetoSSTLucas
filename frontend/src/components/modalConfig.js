
export const openModal = (htmlContent, widthClass = 'max-w-lg') => {
  const container = document.getElementById('modal-container');
  const content = document.getElementById('modal-content');

  content.innerHTML = htmlContent;

  // Limpar classes de largura anteriores e aplicar a nova
  content.classList.remove('max-w-sm', 'max-w-md', 'max-w-lg', 'max-w-xl', 'max-w-2xl', 'max-w-3xl', 'max-w-4xl', 'max-w-5xl');
  content.classList.add(widthClass);

  container.classList.remove('opacity-0', 'pointer-events-none');
  content.classList.remove('scale-95');
};

export const closeModal = () => {
  const container = document.getElementById('modal-container');
  const content = document.getElementById('modal-content');

  container.classList.add('opacity-0', 'pointer-events-none');
  content.classList.add('scale-95');

  setTimeout(() => {
    content.innerHTML = '';
  }, 300);
};