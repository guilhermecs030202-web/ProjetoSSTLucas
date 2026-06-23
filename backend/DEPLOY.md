# Como fazer o Deploy do Backend no Railway.app

O backend deste projeto foi preparado para rodar perfeitamente no Railway.app com banco de dados PostgreSQL e persistência de arquivos. A sincronização do banco de dados (tabelas, novas colunas e usuário admin inicial) ocorre de forma **100% automática** a cada inicialização do servidor.

---

## 🚀 Passo a Passo

### 1. Criar conta no Railway
Acesse [railway.app](https://railway.app) e crie uma conta gratuita integrada com o seu GitHub.

### 2. Criar um Novo Projeto com PostgreSQL
1. No painel do Railway, clique em **"New Project"**.
2. Selecione a opção **"Provision PostgreSQL"**.
3. Aguarde alguns segundos enquanto o banco de dados é criado.

### 3. Conectar o Repositório do Backend
1. No mesmo painel do projeto, clique em **"New"** (ou no botão "+") -> **"GitHub Repo"**.
2. Selecione o repositório Git do projeto SST.
3. Nas configurações da tela de importação:
   * **Root Directory (Diretório Raiz):** Altere para `backend` (importante para que ele ignore a pasta do frontend).

### 4. Configurar as Variáveis de Ambiente (Environment Variables)
No Railway, acesse a aba **"Variables"** do serviço do seu backend e adicione as seguintes variáveis:

* **Variáveis de Conexão com o Banco (Railway Link):**
  * O Railway já cria essas variáveis automaticamente se você provisionou o PostgreSQL no mesmo projeto. Nós preparamos o código para ler o padrão do Railway automaticamente!
* **Diretório de Uploads:**
  * **Key:** `UPLOAD_DIR`
  * **Value:** `/app/uploads`
* **Origem do CORS:**
  * **Key:** `ALLOWED_ORIGINS`
  * **Value:** A URL do seu frontend no Vercel (ex: `https://seu-projeto.vercel.app`).
* **Credenciais do Administrador Inicial (Opcional - mas recomendado):**
  * **Key:** `INITIAL_ADMIN_EMAIL` -> `admin@sst.com.br` (ou o email que preferir)
  * **Key:** `INITIAL_ADMIN_PASSWORD` -> `sua_senha_secreta_aqui`

### 5. Configurar o Volume Persistente para Uploads (ESSENCIAL)
Para evitar que os PDFs sejam apagados quando o servidor reiniciar ou houver deploy de nova versão:
1. No painel do serviço do seu backend no Railway, vá para a aba **"Settings"**.
2. Role a página até a seção **"Volumes"** e clique em **"Mount Volume"** (ou "Add Volume").
3. Configure o volume da seguinte forma:
   * **Mount Path (Caminho de montagem):** `/app/uploads`
4. Salve a configuração. O Railway fará o redeploy automático com o disco persistente conectado.

---

## ⚡ Conclusão
O Railway irá compilar o código TypeScript automaticamente e iniciar o servidor na porta correta. O endereço gerado pelo Railway (ex: `https://backend-production.up.railway.app`) será a URL base que você deve colocar na variável `VITE_API_BASE_URL` lá no Vercel!
