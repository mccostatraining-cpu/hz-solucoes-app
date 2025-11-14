# 🔄 RECRIAR SERVIÇO - PASSO A PASSO DETALHADO

## 🎯 VAMOS RECRIAR DO ZERO

Se algo deu errado, vamos recriar o serviço passo a passo.

---

## ✅ PASSO 1: VERIFICAR O PROJETO

1. Acesse: https://railway.app
2. Faça login
3. Você vê seu projeto na lista?
   - ✅ Se SIM: Continue para Passo 2
   - ❌ Se NÃO: Crie um novo projeto primeiro

---

## ✅ PASSO 2: CRIAR NOVO SERVIÇO

1. Clique no seu projeto
2. Você vê uma tela com serviços?
   - Se houver um serviço antigo, pode deletar (3 pontinhos → Delete)
3. Clique no botão **"+ New"** (canto superior direito ou no meio da tela)
4. Selecione **"GitHub Repo"** ou **"GitHub"**
5. Se aparecer lista de repositórios:
   - Selecione: `hz-solucoes-app` (ou o nome do seu repositório)
6. Se pedir para conectar GitHub:
   - Autorize o acesso
   - Selecione o repositório
7. Clique em **"Deploy"** ou **"Add"**

---

## ✅ PASSO 3: AGUARDAR PRIMEIRO DEPLOY

1. O Railway vai começar a fazer deploy automaticamente
2. Você deve ver:
   - Status "Deploying" ou "Building"
   - Uma barra de progresso
   - Logs aparecendo
3. **NÃO configure nada ainda!**
4. Aguarde alguns minutos

---

## ✅ PASSO 4: VERIFICAR SE O DEPLOY INICIOU

1. Clique no serviço que foi criado
2. Você deve ver abas: **"Logs"**, **"Settings"**, **"Variables"**, etc.
3. Clique em **"Logs"** ou **"Deploy Logs"**
4. Você vê alguma coisa nos logs?
   - ✅ Se SIM: Continue para Passo 5
   - ❌ Se NÃO: Veja seção "Problemas" abaixo

---

## ✅ PASSO 5: ADICIONAR VARIÁVEIS

**IMPORTANTE:** Adicione as variáveis ANTES do deploy terminar!

1. Clique na aba **"Variables"** ou **"Settings" → "Variables"**
2. Clique em **"+ New Variable"** ou **"Add Variable"**
3. Adicione estas variáveis (uma por uma):

### Variável 1 (OBRIGATÓRIA):
```
Name: NPM_CONFIG_PACKAGE_MANAGER
Value: npm
```

### Variável 2:
```
Name: NODE_ENV
Value: production
```

### Variável 3:
```
Name: OAUTH_SERVER_URL
Value: https://api.manus.im
```

### Variável 4:
```
Name: VITE_OAUTH_PORTAL_URL
Value: https://portal.manus.im
```

### Variável 5:
```
Name: VITE_APP_ID
Value: hz-solucoes
```

### Variável 6:
```
Name: VITE_APP_TITLE
Value: HZ Soluções
```

### Variável 7:
```
Name: BUILT_IN_FORGE_API_URL
Value: https://forge.manus.app
```

### Variável 8 - JWT_SECRET:
Gere uma chave primeiro:
- Acesse: https://www.random.org/strings/
- Gere: 32 caracteres, alfanuméricos
- Copie a chave gerada

Depois adicione:
```
Name: JWT_SECRET
Value: [cole-a-chave-gerada]
```

### Variável 9 - DATABASE_URL:
Se você tem MySQL no Railway:
1. Vá no serviço MySQL → Variables
2. Copie `MYSQL_URL` ou `DATABASE_URL`
3. Adicione como:
```
Name: DATABASE_URL
Value: [cole-a-url-copiada]
```

Se você NÃO tem MySQL:
1. No projeto, clique em "+ New" → "Database" → "Add MySQL"
2. Aguarde criar
3. Vá no MySQL → Variables
4. Copie `MYSQL_URL`
5. Adicione no serviço web como `DATABASE_URL`

---

## ✅ PASSO 6: AGUARDAR DEPLOY COMPLETAR

1. Volte para a aba **"Logs"**
2. Acompanhe o progresso
3. Você deve ver:
   - `npm install` (não `pnpm`)
   - `npm run build`
   - `npm start`
   - `Server running on http://0.0.0.0:PORT/`
   - `Healthcheck available at http://0.0.0.0:PORT/health`

---

## ✅ PASSO 7: VERIFICAR SE FUNCIONOU

1. Vá em **"Settings" → "Service"**
2. Verifique:
   - **Healthcheck Path:** `/health`
   - **Healthcheck Timeout:** `300`
3. Vá em **"Settings" → "Networking"** ou **"Domains"**
4. Copie a URL do serviço
5. Teste: `https://SUA-URL.railway.app/health`
   - Deve retornar: `OK`

---

## 🚨 PROBLEMAS COMUNS

### Problema: "Nada aparece"
**Solução:**
- Recarregue a página (F5)
- Verifique se está logado
- Verifique se está no projeto correto
- Tente criar o serviço novamente

### Problema: "Deploy não inicia"
**Solução:**
- Verifique se o repositório está conectado
- Verifique se há código no GitHub
- Tente desconectar e reconectar o repositório

### Problema: "Erro nos logs"
**Solução:**
- Copie o erro completo
- Verifique se todas as variáveis foram adicionadas
- Verifique se `NPM_CONFIG_PACKAGE_MANAGER=npm` foi adicionada

### Problema: "Ainda aparece pnpm"
**Solução:**
- Verifique se `NPM_CONFIG_PACKAGE_MANAGER=npm` está adicionada
- Faça um novo deploy (Settings → Redeploy)

---

## 🆘 PRECISA DE AJUDA?

Me diga:
1. O que você vê na tela do Railway?
2. Os logs aparecem? O que dizem?
3. Há algum erro visível?
4. Você conseguiu criar o serviço?

