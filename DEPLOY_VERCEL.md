# 🚀 Deploy na Vercel - Guia Simples

## 📋 O que você precisa saber:

### ✅ O que é Vercel?
A Vercel é uma plataforma que coloca seu projeto na internet (deploy). É como ter seu site funcionando 24/7.

### ⚠️ SIM, você precisa de MySQL!
**Mas NÃO precisa instalar MySQL no seu computador!** Você pode usar um banco de dados na nuvem (online).

## 🎯 Opções de Banco de Dados (Escolha UMA):

### Opção 1: Railway (Recomendado - Grátis e Fácil) ⭐
- ✅ **$5 crédito grátis por mês** (suficiente para começar!)
- ✅ **Muito fácil** de configurar
- ✅ Funciona perfeitamente com Vercel
- ✅ MySQL incluído

**Passo a passo:**
1. Acesse: https://railway.app/
2. Crie conta usando GitHub (grátis)
3. Clique em "New" → "Database" → "Add MySQL"
4. Copie a URL de conexão (ela vem assim: `mysql://root:senha@host:porta/nome_banco`)

### Opção 2: Render (100% Grátis) ⭐
- ✅ **100% GRATUITO** (plano free disponível)
- ✅ MySQL grátis
- ✅ Fácil de configurar

**Passo a passo:**
1. Acesse: https://render.com/
2. Crie conta (grátis)
3. Clique em "New +" → "PostgreSQL" ou "MySQL"
4. Escolha "Free" plan
5. Copie a URL de conexão

### Opção 2: Railway (Também Grátis)
- ✅ **Grátis** para começar
- ✅ Fácil de usar
- ✅ Funciona com Vercel

**Passo a passo:**
1. Acesse: https://railway.app/
2. Crie uma conta
3. Crie um novo projeto
4. Adicione "MySQL"
5. Copie a URL de conexão

### Opção 3: Render (Gratuito com Limitações)
- ✅ **Grátis** (mas para depois de 90 dias)
- ✅ Fácil de configurar

## 🔧 Como Configurar na Vercel:

### Passo 1: Conectar seu Repositório GitHub

1. No Vercel, clique em **"Connect Git"**
2. Escolha seu repositório: `finance-whatsapp-app`
3. Clique em **"Import"**

### Passo 2: Configurar Variáveis de Ambiente

No painel do Vercel, vá em **Settings** → **Environment Variables** e adicione:

```env
# Banco de Dados (URL que você copiou do PlanetScale/Railway)
DATABASE_URL=mysql://usuario:senha@host:porta/nome_banco

# OAuth (Manus - geralmente já configurado)
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://oauth.manus.app
JWT_SECRET=seu_jwt_secret
OWNER_OPEN_ID=seu_open_id

# Notificações (Manus)
BUILT_IN_FORGE_API_URL=https://forge.manus.app
BUILT_IN_FORGE_API_KEY=seu_api_key

# Node Environment
NODE_ENV=production
```

### Passo 3: Configurar Build Settings

Na Vercel, vá em **Settings** → **General** e verifique:

- **Framework Preset**: Other
- **Build Command**: `pnpm build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

### Passo 4: Executar Migrations (Criar Tabelas)

**IMPORTANTE:** Antes do deploy, você precisa criar as tabelas no banco!

#### Opção A: Executar localmente (Recomendado)
1. Configure o `.env` local com a URL do banco na nuvem
2. Execute:
   ```bash
   pnpm db:migrate
   ```

#### Opção B: Executar após deploy
Crie um script ou use o Drizzle Studio:
```bash
pnpm db:studio
```

## 🔍 Verificar se está Funcionando

1. Após o deploy, acesse a URL que a Vercel forneceu
2. Se aparecer erro, verifique:
   - ✅ Variáveis de ambiente estão configuradas?
   - ✅ Banco de dados está acessível?
   - ✅ Migrations foram executadas?

## 📝 Checklist Completo:

- [ ] Banco de dados criado (PlanetScale/Railway)
- [ ] URL do banco copiada
- [ ] Repositório conectado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Migrations executadas (criar tabelas)
- [ ] Deploy feito
- [ ] Testado no navegador

## 🎯 Resumo Rápido:

1. **Crie banco na nuvem** (PlanetScale ou Railway) → Copie URL
2. **Conecte GitHub na Vercel** → Importe projeto
3. **Adicione variáveis de ambiente** → Cole a URL do banco
4. **Execute migrations** → Crie as tabelas
5. **Pronto!** → Seu site está no ar!

## ⚠️ Importante:

- **NÃO precisa instalar MySQL no seu PC**
- Use um banco na nuvem (PlanetScale é o mais fácil)
- A URL do banco fica nas variáveis de ambiente da Vercel
- Execute as migrations ANTES de usar o site

## 🆘 Precisa de Ajuda?

Se tiver dúvidas:
1. Verifique os logs do deploy na Vercel
2. Confira se todas as variáveis estão configuradas
3. Teste a conexão com o banco usando Drizzle Studio

