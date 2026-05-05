import './style.css'

// ==========================================
// 1. O CONCEITO DE "ESTADO" (STATE)
// ==========================================
// Como ainda não temos um banco de dados conectado, guardamos 
// o e-mail e a senha em "variáveis de estado". Enquanto a página 
// não recarregar (F5), essas informações ficam na memória RAM do navegador.
let bancoDeDadosSimulado = {
  emailAtual: 'admin@sst.com.br',
  senhaAtual: 'admin123'
};


// ==========================================
// 2. LÓGICA DE LOGIN
// ==========================================
const loginForm = document.getElementById('login-form');

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Impede o F5 da tela

    const emailDigitado = document.getElementById('email').value;
    const senhaDigitada = document.getElementById('password').value;

    // Verificamos com os dados "salvos" no nosso estado
    if (emailDigitado === bancoDeDadosSimulado.emailAtual && senhaDigitada === bancoDeDadosSimulado.senhaAtual) {
      // O conceito de Navegação:
      // Se o login der certo, usamos a API do navegador para abrir a página do sistema.
      window.location.href = '/dashboard.html';
    } else {
      alert('E-mail ou senha incorretos.');
    }
  });
}


// ==========================================
// 3. LÓGICA DO MODAL (ALTERAR CREDENCIAIS)
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
  changeCredentialsForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // 1. Pegar os dados de confirmação (Atuais)
    const currentEmailDigitado = document.getElementById('current-email').value;
    const currentPasswordDigitada = document.getElementById('current-password').value;
    
    // 2. Pegar os novos dados desejados (Novos)
    const newEmailDigitado = document.getElementById('new-email').value;
    const newPasswordDigitada = document.getElementById('new-password').value;

    // 3. Validar a identidade: O que ele diz que é o atual, realmente bate com o banco de dados?
    if (currentEmailDigitado === bancoDeDadosSimulado.emailAtual && currentPasswordDigitada === bancoDeDadosSimulado.senhaAtual) {
      
      // SUCESSO! A identidade foi confirmada. 
      // Atualizamos o nosso "Banco de Dados" em memória com os novos valores.
      bancoDeDadosSimulado.emailAtual = newEmailDigitado;
      bancoDeDadosSimulado.senhaAtual = newPasswordDigitada;
      
      alert('Credenciais alteradas com sucesso! Agora você deve usar o novo email e senha para o Login.');
      
      // Escondemos o modal
      modal.classList.add('hidden');
      changeCredentialsForm.reset();
      
      // Dica para a interface do usuário: limpar o formulário principal de login
      loginForm.reset();
      
    } else {
      // FALHA: Alguém tentou mudar a senha sem saber a senha atual
      alert('Atenção: O E-mail ou Senha ATUAL que você informou estão incorretos.');
    }
  });
}
