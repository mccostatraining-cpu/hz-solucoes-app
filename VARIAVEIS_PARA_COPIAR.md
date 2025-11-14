# 📋 VARIÁVEIS DE AMBIENTE - COPIE E COLE NO RAILWAY

## 🚀 VARIÁVEIS OBRIGATÓRIAS (Adicione estas primeiro!)

### 1. Forçar npm (CRÍTICO!)
```
NPM_CONFIG_PACKAGE_MANAGER = npm
```

### 2. Ambiente de produção
```
NODE_ENV = production
```

---

## 🔗 BANCO DE DADOS

### 3. URL do Banco de Dados
**IMPORTANTE:** Se você tem um serviço MySQL no Railway no mesmo projeto:

1. Vá no serviço MySQL → Settings → Variables
2. Copie o valor de `MYSQL_URL` ou `DATABASE_URL`
3. Adicione no seu serviço web como:

```
DATABASE_URL = [cole o valor que você copiou]
```

**OU** se você não tem MySQL no Railway, você precisa criar:
1. No projeto, clique em "+ New" → "Database" → "Add MySQL"
2. Depois copie a URL e adicione como `DATABASE_URL`

**Formato esperado:**
```
DATABASE_URL = mysql://usuario:senha@host:porta/banco
```

---

## 🔐 AUTENTICAÇÃO (OAuth - Manus)

### 4. Servidor OAuth
```
OAUTH_SERVER_URL = https://api.manus.im
```

### 5. Portal OAuth
```
VITE_OAUTH_PORTAL_URL = https://portal.manus.im
```

### 6. App ID
```
VITE_APP_ID = hz-solucoes
```
(ou o ID que você usa no Manus)

### 7. JWT Secret
```
JWT_SECRET = [gere uma chave aleatória]
```

**Como gerar uma chave:**
- Use: https://www.random.org/strings/
- Ou gere no terminal: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Use pelo menos 32 caracteres aleatórios

**Exemplo:**
```
JWT_SECRET = a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

### 8. Owner Open ID (Opcional)
Se você tem um Open ID de administrador:
```
OWNER_OPEN_ID = [seu-open-id]
```
Se não tiver, pode deixar sem essa variável.

---

## 🌐 FRONTEND

### 9. Título do App
```
VITE_APP_TITLE = HZ Soluções
```
(ou o título que você quer)

### 10. URL Pública
**IMPORTANTE:** Adicione DEPOIS que o deploy funcionar!

1. Depois do deploy, vá em Settings → Networking
2. Copie a URL do Railway (ex: `https://seu-app.up.railway.app`)
3. Adicione como:

```
VITE_PUBLIC_URL = https://seu-app.up.railway.app
```

---

## 🔔 NOTIFICAÇÕES (Opcional - Manus)

### 11. Forge API URL
```
BUILT_IN_FORGE_API_URL = https://forge.manus.app
```

### 12. Forge API Key
```
BUILT_IN_FORGE_API_KEY = [sua-api-key-do-manus]
```
Se você não tem, pode deixar sem essa variável por enquanto.

---

## 📱 WHATSAPP (Opcional - Twilio)

Se você usa WhatsApp via Twilio, adicione:

### 13. Twilio Account SID
```
TWILIO_ACCOUNT_SID = ACxxxxxxxxxxxx
```

### 14. Twilio Auth Token
```
TWILIO_AUTH_TOKEN = xxxxxxxxxxxxxxx
```

### 15. Twilio WhatsApp Number
```
TWILIO_WHATSAPP_NUMBER = whatsapp:+14155238886
```

Se você não usa Twilio, pode deixar essas variáveis sem adicionar.

---

## 📝 COMO ADICIONAR NO RAILWAY

1. No seu novo serviço, vá em **Settings** → **Variables**
2. Clique em **"+ New Variable"**
3. Para cada variável:
   - **Name:** (nome da variável)
   - **Value:** (valor da variável)
   - Clique em **"Add"**
4. Repita para todas as variáveis

---

## ✅ CHECKLIST - VARIÁVEIS MÍNIMAS PARA FUNCIONAR

Adicione pelo menos estas:

- [x] `NPM_CONFIG_PACKAGE_MANAGER = npm` ⚠️ OBRIGATÓRIO!
- [x] `NODE_ENV = production`
- [x] `DATABASE_URL = [sua-url-do-mysql]` ⚠️ OBRIGATÓRIO se usa banco!
- [x] `OAUTH_SERVER_URL = https://api.manus.im`
- [x] `VITE_OAUTH_PORTAL_URL = https://portal.manus.im`
- [x] `VITE_APP_ID = hz-solucoes`
- [x] `JWT_SECRET = [gere-uma-chave-aleatoria]` ⚠️ OBRIGATÓRIO!
- [x] `VITE_APP_TITLE = HZ Soluções`

As outras são opcionais e podem ser adicionadas depois.

---

## 🆘 VALORES PADRÃO SE VOCÊ NÃO SOUBER

Se você não souber alguns valores, use estes padrões:

```
NPM_CONFIG_PACKAGE_MANAGER = npm
NODE_ENV = production
OAUTH_SERVER_URL = https://api.manus.im
VITE_OAUTH_PORTAL_URL = https://portal.manus.im
VITE_APP_ID = hz-solucoes
VITE_APP_TITLE = HZ Soluções
BUILT_IN_FORGE_API_URL = https://forge.manus.app
```

Para `JWT_SECRET`, gere uma nova chave (veja instruções acima).

Para `DATABASE_URL`, você precisa criar o MySQL no Railway primeiro.

---

## 💡 DICA

**Adicione primeiro as variáveis obrigatórias**, faça o deploy, e depois adicione as opcionais conforme necessário.

