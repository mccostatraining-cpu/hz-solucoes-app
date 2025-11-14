# 🗑️ DELETAR E RECRIAR SERVIÇO NO RAILWAY - GUIA SIMPLES

## 🎯 OBJETIVO
Deletar o serviço atual e criar um novo do zero. Isso vai garantir que o Railway use os arquivos de configuração corretos.

---

## ✅ PASSO 1: DELETAR O SERVIÇO ATUAL

### 1.1 Acessar o Railway
1. Abra: https://railway.app
2. Faça login

### 1.2 Encontrar o Serviço
1. Clique no seu projeto
2. Você vai ver um serviço (geralmente chamado "web" ou tem um nome)
3. **ANOTE O NOME DO SERVIÇO** (você vai precisar depois)

### 1.3 Deletar
1. Clique nos **3 pontinhos** (⋯) ao lado do serviço
   - Ou clique com botão direito no serviço
2. Clique em **"Delete"** ou **"Remove"** ou **"Delete Service"**
3. Confirme a exclusão
4. ✅ Pronto! Serviço deletado

---

## ✅ PASSO 2: CRIAR NOVO SERVIÇO

### 2.1 Criar Novo Serviço
1. Ainda no mesmo projeto
2. Clique no botão **"+ New"** ou **"+ Add Service"**
3. Selecione **"GitHub Repo"** ou **"GitHub"**

### 2.2 Conectar Repositório
1. Se aparecer uma lista de repositórios, selecione o seu
2. Ou cole a URL do repositório
3. Clique em **"Deploy"** ou **"Add"**

### 2.3 IMPORTANTE: NÃO CONFIGURAR NADA!
- ❌ **NÃO** preencha Build Command
- ❌ **NÃO** preencha Start Command  
- ❌ **NÃO** configure nada manualmente
- ✅ **DEIXE** o Railway detectar automaticamente
- ✅ O Railway vai usar os arquivos `railway.json` e `Procfile`

---

## ✅ PASSO 3: ADICIONAR VARIÁVEIS DE AMBIENTE

### 3.1 Abrir Variables
1. No novo serviço criado
2. Clique em **"Settings"** → **"Variables"**

### 3.2 Adicionar Variáveis Essenciais

#### Variável 1: Forçar npm
- **Name:** `NPM_CONFIG_PACKAGE_MANAGER`
- **Value:** `npm`
- Clique em **"Add"**

#### Variável 2: Node Environment (Opcional mas recomendado)
- **Name:** `NODE_ENV`
- **Value:** `production`
- Clique em **"Add"**

#### Variável 3: Database (Se você usa banco de dados)
- **Name:** `DATABASE_URL`
- **Value:** Cole a URL do seu banco (a mesma que você tinha antes)
- Clique em **"Add"**

#### Variável 4: Outras variáveis que você tinha
Adicione todas as outras variáveis de ambiente que você tinha configuradas antes:
- `OAUTH_SERVER_URL`
- `JWT_SECRET`
- `VITE_APP_ID`
- `TWILIO_ACCOUNT_SID` (se usar WhatsApp)
- `TWILIO_AUTH_TOKEN` (se usar WhatsApp)
- Etc.

---

## ✅ PASSO 4: AGUARDAR DEPLOY

1. O Railway vai fazer o deploy automaticamente
2. Acompanhe os logs:
   - Clique em **"Deploy Logs"** ou **"Logs"**
3. Você deve ver:
   ```
   ✅ npm install
   ✅ npm run build
   ✅ npm start
   ✅ Server running on http://0.0.0.0:PORT/
   ✅ Healthcheck available at http://0.0.0.0:PORT/health
   ```

---

## ✅ PASSO 5: VERIFICAR SE FUNCIONOU

### 5.1 Verificar Logs
Nos logs, procure por:
- ✅ `npm install` (deve aparecer)
- ✅ `npm run build` (deve aparecer)
- ✅ `npm start` (deve aparecer)
- ✅ `Server running` (deve aparecer)
- ✅ `Healthcheck available` (deve aparecer)

### 5.2 Verificar Healthcheck
1. Vá em **"Settings"** → **"Service"**
2. Verifique se:
   - **Healthcheck Path:** `/health`
   - **Healthcheck Timeout:** `300`

### 5.3 Testar o Serviço
1. Vá em **"Settings"** → **"Networking"** ou **"Domains"**
2. Copie a URL do serviço
3. Acesse: `https://SUA-URL.railway.app/health`
4. Deve retornar: `OK`

---

## 🎯 CHECKLIST FINAL

Antes de considerar que está pronto:

- [ ] Serviço antigo deletado
- [ ] Novo serviço criado
- [ ] Nenhuma configuração manual adicionada
- [ ] Variável `NPM_CONFIG_PACKAGE_MANAGER=npm` adicionada
- [ ] Variável `NODE_ENV=production` adicionada (opcional)
- [ ] Todas as outras variáveis de ambiente adicionadas
- [ ] Deploy iniciado
- [ ] Logs mostram `npm` (não `pnpm`)
- [ ] Healthcheck funcionando

---

## 🆘 SE AINDA DER ERRO

Se mesmo recriando ainda der erro:

1. **Compartilhe os logs completos** (Build Logs + Deploy Logs)
2. **Me diga quais variáveis você adicionou**
3. **Me diga se você configurou algo manualmente**

Vou te ajudar a resolver! 🚀

---

## 💡 DICA IMPORTANTE

**NUNCA** configure Build Command, Install Command ou Start Command manualmente no dashboard se você tem os arquivos `railway.json` e `Procfile` configurados.

Deixe o Railway usar os arquivos automaticamente! Isso evita conflitos.

