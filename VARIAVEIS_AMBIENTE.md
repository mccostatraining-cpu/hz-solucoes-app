# 🔐 VARIÁVEIS DE AMBIENTE PARA O RAILWAY

## 📋 LISTA DE VARIÁVEIS NECESSÁRIAS

Quando você recriar o serviço no Railway, adicione estas variáveis em **Settings → Variables**:

---

## ✅ VARIÁVEIS OBRIGATÓRIAS

### 1. Forçar uso do npm
```
Name: NPM_CONFIG_PACKAGE_MANAGER
Value: npm
```
**Importante:** Esta variável força o Railway a usar npm ao invés de pnpm.

### 2. Ambiente de produção
```
Name: NODE_ENV
Value: production
```
**Opcional mas recomendado:** Define que está em produção.

---

## 🔗 VARIÁVEIS DO BANCO DE DADOS

### 3. URL do banco de dados
```
Name: DATABASE_URL
Value: mysql://usuario:senha@host:porta/banco
```
**Onde encontrar:** 
- Se você tem um serviço MySQL no Railway: Settings → Variables → DATABASE_URL (já está lá)
- Copie o valor e adicione no novo serviço

---

## 🔐 VARIÁVEIS DE AUTENTICAÇÃO (OAuth)

### 4. Servidor OAuth
```
Name: OAUTH_SERVER_URL
Value: https://api.manus.im
```
(ou a URL do seu servidor OAuth)

### 5. Secret JWT
```
Name: JWT_SECRET
Value: sua-chave-secreta-aqui
```
**Importante:** Use uma chave segura e aleatória.

### 6. App ID
```
Name: VITE_APP_ID
Value: hz-solucoes
```
(ou o ID da sua aplicação)

### 7. Owner Open ID (Opcional)
```
Name: OWNER_OPEN_ID
Value: seu-open-id
```
Se você tem um Open ID de administrador.

---

## 📱 VARIÁVEIS DO WHATSAPP (Opcional)

Se você usa integração com WhatsApp via Twilio:

### 8. Twilio Account SID
```
Name: TWILIO_ACCOUNT_SID
Value: ACxxxxxxxxxxxx
```

### 9. Twilio Auth Token
```
Name: TWILIO_AUTH_TOKEN
Value: xxxxxxxxxxxxxxx
```

### 10. Twilio WhatsApp Number
```
Name: TWILIO_WHATSAPP_NUMBER
Value: whatsapp:+14155238886
```

---

## 🌐 VARIÁVEIS DO FRONTEND (Opcional)

### 11. URL Pública
```
Name: VITE_PUBLIC_URL
Value: https://seu-app.up.railway.app
```
**Importante:** Depois que o deploy funcionar, copie a URL do Railway e adicione aqui.

### 12. Portal OAuth
```
Name: VITE_OAUTH_PORTAL_URL
Value: https://portal.manus.im
```
(ou a URL do seu portal OAuth)

### 13. Título do App
```
Name: VITE_APP_TITLE
Value: HZ Soluções
```
(ou o título que você quer)

---

## 🔧 VARIÁVEIS DE NOTIFICAÇÕES (Opcional)

### 14. Forge API URL
```
Name: BUILT_IN_FORGE_API_URL
Value: https://forge.manus.app
```

### 15. Forge API Key
```
Name: BUILT_IN_FORGE_API_KEY
Value: sua-api-key
```

---

## 📝 COMO ADICIONAR NO RAILWAY

1. Vá em **Settings** → **Variables**
2. Clique em **"+ New Variable"** ou **"Add Variable"**
3. Preencha:
   - **Name:** (nome da variável)
   - **Value:** (valor da variável)
4. Clique em **"Add"** ou **"Save"**
5. Repita para cada variável

---

## ⚠️ IMPORTANTE

- **NÃO** compartilhe essas variáveis publicamente
- **NÃO** commite valores sensíveis no Git
- **SEMPRE** use variáveis de ambiente para dados sensíveis
- Se você tinha essas variáveis no serviço antigo, **copie os valores** antes de deletar

---

## 🔄 COMO COPIAR VARIÁVEIS DO SERVIÇO ANTIGO

Antes de deletar o serviço antigo:

1. Vá em **Settings** → **Variables** do serviço antigo
2. **Anote ou copie** todos os valores
3. Depois de criar o novo serviço, adicione todas novamente

---

## ✅ CHECKLIST

Antes de fazer deploy, verifique se você adicionou:

- [ ] `NPM_CONFIG_PACKAGE_MANAGER=npm` (OBRIGATÓRIO)
- [ ] `NODE_ENV=production` (recomendado)
- [ ] `DATABASE_URL` (se usa banco de dados)
- [ ] `OAUTH_SERVER_URL` (se usa OAuth)
- [ ] `JWT_SECRET` (se usa OAuth)
- [ ] `VITE_APP_ID` (se usa OAuth)
- [ ] Outras variáveis que você precisa

