import './style.css'
import { api } from './services/api.js'
import { showToast } from './utils/toast.js'

// ==========================================
// 2. LÓGICA DE LOGIN
// ==========================================
const loginForm = document.getElementById('login-form');

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o F5 da tela

    const emailDigitado = document.getElementById('email').value;
    const senhaDigitada = document.getElementById('password').value;

    try {
      // O sistema consulta o banco de dados para localizar o usuário informado
      const response = await api.login(emailDigitado, senhaDigitada);
      if (response && response.user) {
        // Se o login e a senha forem válidos, permitir acesso
        window.location.href = '/dashboard.html';
      } else {
        showToast('E-mail ou senha incorretos.', 'error');
      }
    } catch (err) {
      showToast('E-mail ou senha incorretos.', 'error');
    }
  });
}


// ==========================================
// 3. LÓGICA DO MODAL (ALTERAR CREDENCIAIS NO BANCO)
// ==========================================

// Pescamos os elementos do HTML
const openModalBtn = document.getElementById('open-change-credentials-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const modal = document.getElementById('credentials-modal');
const changeCredentialsForm = document.getElementById('change-credentials-form');

// Verificação de segurança: só rodar se existir na tela
if (openModalBtn && closeModalBtn && modal && changeCredentialsForm) {
  
  // Quando clicar no link discreto -> Mostramos o Modal
  openModalBtn.addEventListener('click', () => {
    // Para mostrar, nós removemos a classe "hidden" (escondido) do Tailwind
    modal.classList.remove('hidden');
  });

  // Quando clicar no "X" -> Fechamos o Modal
  closeModalBtn.addEventListener('click', () => {
    // Para esconder, adicionamos a classe "hidden" de volta
    modal.classList.add('hidden');
    // Limpa o que o usuário já tinha digitado no form
    changeCredentialsForm.reset(); 
  });

  // Quando submeter o formulário de Alteração
  changeCredentialsForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // 1. Pegar os dados de confirmação (Atuais)
    const currentEmailDigitado = document.getElementById('current-email').value;
    const currentPasswordDigitada = document.getElementById('current-password').value;
    
    // 2. Pegar os novos dados desejados (Novos)
    const newEmailDigitado = document.getElementById('new-email').value;
    const newPasswordDigitada = document.getElementById('new-password').value;

    try {
      // 3. Validar a identidade: enviar credenciais atuais e novas para o backend
      await api.changeCredentials(
        currentEmailDigitado,
        currentPasswordDigitada,
        newEmailDigitado,
        newPasswordDigitada
      );
      
      showToast('Credenciais alteradas com sucesso! Agora você deve usar o novo email e senha para o Login.', 'success');
      
      // Escondemos o modal
      modal.classList.add('hidden');
      changeCredentialsForm.reset();
      
      // Dica para a interface do usuário: limpar o formulário principal de login
      if (loginForm) {
        loginForm.reset();
      }
      
    } catch (err) {
      // FALHA: Alguém tentou mudar a senha sem saber a senha atual ou erro do servidor
      showToast('Atenção: O E-mail ou Senha ATUAL que você informou estão incorretos.', 'error');
    }
  });
}
