# ⚡ COPIE E COLE RÁPIDO - Variáveis para o Railway

## 🎯 VARIÁVEIS ESSENCIAIS (Adicione estas primeiro!)

Copie e cole estas no Railway (Settings → Variables):

```
NPM_CONFIG_PACKAGE_MANAGER=npm
NODE_ENV=production
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=hz-solucoes
VITE_APP_TITLE=HZ Soluções
BUILT_IN_FORGE_API_URL=https://forge.manus.app
```

---

## 🔐 JWT_SECRET (Gere uma nova!)

Para `JWT_SECRET`, você precisa gerar uma chave aleatória.

**Opção 1 - Online:**
1. Acesse: https://www.random.org/strings/
2. Gere uma string de 32 caracteres
3. Use como valor

**Opção 2 - Terminal:**
Execute no terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Depois adicione:
```
JWT_SECRET=[cole-a-chave-gerada]
```

---

## 🗄️ DATABASE_URL (Se você usa banco)

### Se você tem MySQL no Railway:
1. Vá no serviço MySQL → Settings → Variables
2. Copie `MYSQL_URL` ou `DATABASE_URL`
3. Adicione no serviço web como `DATABASE_URL`

### Se você NÃO tem MySQL:
1. No projeto Railway, clique em "+ New" → "Database" → "Add MySQL"
2. Aguarde criar
3. Vá no MySQL → Settings → Variables
4. Copie `MYSQL_URL`
5. Adicione no serviço web como `DATABASE_URL`

---

## 📱 WHATSAPP (Opcional - só se você usa)

Se você usa Twilio para WhatsApp:
```
TWILIO_ACCOUNT_SID=[seu-account-sid]
TWILIO_AUTH_TOKEN=[seu-auth-token]
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

Se não usa, pode pular essas.

---

## 🌐 URL PÚBLICA (Adicione depois do deploy)

Depois que o deploy funcionar:

1. Vá em Settings → Networking
2. Copie a URL (ex: `https://seu-app.up.railway.app`)
3. Adicione:
```
VITE_PUBLIC_URL=https://seu-app.up.railway.app
```

---

## ✅ ORDEM DE ADIÇÃO

1. ✅ Primeiro: Adicione `NPM_CONFIG_PACKAGE_MANAGER=npm`
2. ✅ Segundo: Adicione `NODE_ENV=production`
3. ✅ Terceiro: Adicione as outras variáveis essenciais
4. ✅ Quarto: Configure o MySQL e adicione `DATABASE_URL`
5. ✅ Quinto: Gere e adicione `JWT_SECRET`
6. ✅ Sexto: Adicione variáveis opcionais (WhatsApp, etc.)
7. ✅ Sétimo: Depois do deploy, adicione `VITE_PUBLIC_URL`

---

## 🚀 DEPOIS DE ADICIONAR

O Railway vai fazer deploy automaticamente. Acompanhe os logs e verifique se aparece `npm` (não `pnpm`).

