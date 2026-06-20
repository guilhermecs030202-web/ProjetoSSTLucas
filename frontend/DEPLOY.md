# Como fazer o Deploy do Frontend no Vercel

O frontend deste projeto foi desenvolvido utilizando **Vite** e está localizado na pasta `/frontend`. O Vercel possui suporte nativo ao Vite, o que torna o processo muito simples.

---

## 🚀 Passo a Passo

### 1. Criar uma Conta no Vercel
Se você ainda não tem uma conta, acesse [vercel.com](https://vercel.com) e crie uma conta gratuita vinculada ao seu GitHub/GitLab.

### 2. Importar o Projeto
1. No painel do Vercel, clique em **"Add New"** e selecione **"Project"**.
2. Selecione o repositório Git do projeto SST.

### 3. Configurar os Parâmetros do Projeto (CRÍTICO)
Antes de clicar em Deploy, você precisa fazer as seguintes configurações na tela de importação:

* **Root Directory (Diretório Raiz):**
  * Altere de `./` para `frontend` (Clique em "Edit" ao lado de Root Directory, selecione a pasta `frontend` e confirme).
* **Framework Preset:**
  * O Vercel deve detectar automaticamente o **Vite**. Se não detectar, selecione **Vite** na lista.
* **Build and Development Settings:**
  * Build Command: `npm run build` (ou `vite build`)
  * Output Directory: `dist`
  * Install Command: `npm install` (ou deixar padrão)

### 4. Configurar as Variáveis de Ambiente
Abra a seção **Environment Variables** na mesma tela de importação e adicione a seguinte variável:

* **Key:** `VITE_API_BASE_URL`
* **Value:** A URL pública de produção do seu backend (ex: `https://seu-backend.herokuapp.com/api` ou `https://api.meusite.com/api`).
  * *Nota: Se você ainda não tiver a URL do backend de produção, você pode deixar vazio ou colocar a URL provisória e alterar depois nas configurações do projeto no painel da Vercel.*

### 5. Finalizar o Deploy
Clique em **"Deploy"**. Em menos de 2 minutos, seu frontend estará online com um domínio gratuito fornecido pelo Vercel (ex: `projeto-sst-lucas.vercel.app`).
