# 🚀 O QUE FAZER AGORA - Passo a Passo Visual

## ✅ O QUE VOCÊ VÊ NA TELA

Você tem:
- ✅ Novo serviço: **"hz-solucoes-app"** (verde, tag "New")
- ⚠️ Precisa configurar: **"2 Variables and 2 Settings"**
- ❌ Serviço antigo: **"web"** (vermelho, será deletado)

---

## 🎯 PASSO 1: CLICAR NO NOVO SERVIÇO

1. **Clique no card verde** "hz-solucoes-app"
2. Isso vai abrir as configurações do serviço

---

## 🎯 PASSO 2: CONFIGURAR VARIÁVEIS (2 Variables)

1. Procure por **"Variables"** ou **"Settings → Variables"**
2. Clique em **"+ New Variable"** ou **"Add Variable"**
3. Adicione estas variáveis (uma por uma):

### Variável 1 (OBRIGATÓRIA):
```
Name: NPM_CONFIG_PACKAGE_MANAGER
Value: npm
```
Clique em "Add"

### Variável 2:
```
Name: NODE_ENV
Value: production
```
Clique em "Add"

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
Gere uma chave:
- Acesse: https://www.random.org/strings/
- Gere: 32 caracteres, alfanuméricos
- Copie

Depois adicione:
```
Name: JWT_SECRET
Value: [cole-a-chave-gerada]
```

### Variável 9 - DATABASE_URL (se você tem MySQL):
Se você tem MySQL no Railway:
1. Vá no serviço MySQL → Variables
2. Copie `MYSQL_URL`
3. Adicione:
```
Name: DATABASE_URL
Value: [cole-a-url]
```

---

## 🎯 PASSO 3: CONFIGURAR SETTINGS (2 Settings)

1. Vá em **"Settings"** → **"Service"**
2. Configure:

### Setting 1 - Healthcheck Path:
- Procure por **"Healthcheck Path"** ou **"Healthcheck"**
- Defina como: `/health`

### Setting 2 - Healthcheck Timeout:
- Procure por **"Healthcheck Timeout"**
- Defina como: `300` (ou 5 minutos)

**OU** se não encontrar essas opções, pode deixar - o `railway.json` já está configurado!

---

## 🎯 PASSO 4: FAZER DEPLOY

1. Volte para a tela principal (onde você vê os cards)
2. Clique no botão roxo **"Deploy"** (canto superior direito)
3. Ou clique em **"Apply 6 changes"** se aparecer
4. Aguarde o deploy iniciar

---

## ✅ PASSO 5: AGUARDAR E VERIFICAR

1. Clique no serviço "hz-solucoes-app"
2. Vá em **"Logs"** ou **"Deploy Logs"**
3. Você deve ver:
   - `npm install` ✅
   - `npm run build` ✅
   - `npm start` ✅
   - `Server running` ✅

---

## 🚨 SE DER ERRO

Me envie:
1. Screenshot dos logs
2. Qualquer mensagem de erro
3. O que você vê na tela

---

## 💡 DICA

**NÃO clique em "Deploy" ainda!** Primeiro configure as variáveis, depois faça o deploy.

