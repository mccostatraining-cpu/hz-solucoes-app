# 🧪 Como Testar o Projeto - Sistema Financeiro WhatsApp

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:
- **Node.js** (versão 18 ou superior)
- **npm** ou **pnpm** (qualquer um funciona)
- **MySQL** (banco de dados)

## 🚀 Passo a Passo para Testar

### 1️⃣ Instalar Dependências

Primeiro, instale todas as dependências do projeto:

```bash
pnpm install
```

Isso vai instalar todas as bibliotecas necessárias (React, tRPC, Drizzle, etc.)

### 2️⃣ Configurar Banco de Dados

#### 2.1 Criar Banco de Dados MySQL

Crie um banco de dados MySQL chamado `finance_db` (ou outro nome que preferir):

```sql
CREATE DATABASE finance_db;
```

#### 2.2 Configurar Variáveis de Ambiente

Edite o arquivo `.env` na raiz do projeto e configure:

```env
# Database
DATABASE_URL=mysql://usuario:senha@localhost:3306/finance_db

# Exemplo:
# DATABASE_URL=mysql://root:senha123@localhost:3306/finance_db

# Twilio (opcional - para WhatsApp)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

**Nota:** Se não tiver Twilio configurado, o sistema ainda funcionará, mas sem integração WhatsApp.

#### 2.3 Executar Migrations

Aplique as migrations para criar as tabelas no banco:

```bash
pnpm db:migrate
```

Ou, se preferir usar o Drizzle Kit:

```bash
pnpm db:generate
pnpm db:migrate
```

### 3️⃣ Iniciar o Servidor de Desenvolvimento

Opção rápida (Windows):

```powershell
./start-local.ps1
```

Isso valida Node/npm/pnpm, instala dependências e inicia o **servidor Express + Vite** (tudo em um).

Opção manual:

```bash
# Instalar dependências
npm install   # ou pnpm install

# Iniciar servidor Express + Vite
npm run dev:server   # ou pnpm run dev:server
```

O servidor sobe em `http://localhost:3000` (ou próxima porta livre). O tRPC fica em `http://localhost:3000/api/trpc` e o webhook WhatsApp em `http://localhost:3000/api/trpc/whatsapp.webhook`.

### 4️⃣ Acessar o Projeto

Abra seu navegador e acesse:

```
http://localhost:3000
```

Ou a porta que aparecer no terminal após executar o servidor.

### 5️⃣ Fazer Login

O projeto usa autenticação OAuth (Manus). Você precisará:
1. Fazer login com sua conta
2. Autorizar o acesso

### 6️⃣ Testar Funcionalidades

#### ✅ Dashboard
- Ver resumo financeiro
- Últimas transações
- Gráficos de despesas

#### ✅ Adicionar Despesas
- Despesas variáveis
- Despesas fixas mensais
- Auto-categorização

#### ✅ Relatórios
- Gráficos por categoria
- Gráficos por pessoa
- Exportar para CSV

#### ✅ WhatsApp (se configurado)
- Enviar mensagem para o número configurado
- Testar comandos: `gasto 50 mercado`, `receita 120 vendas`, `saldo`/`resumo`, `despesas`

Você também pode testar via `curl` (exemplos em `TESTE_RAPIDO.md`).

## 🔍 Verificar se Está Funcionando

### Ver logs no terminal:
- Se aparecerem erros, verifique:
  - Banco de dados está rodando?
  - Variáveis de ambiente estão corretas?
  - Porta não está em uso?

### Verificar no navegador:
- Abra o DevTools (F12)
- Vá na aba "Console"
- Veja se há erros de JavaScript

## 🐛 Problemas Comuns

### Erro: "Cannot connect to database"
- Verifique se o MySQL está rodando
- Confira a URL no `.env`
- Teste a conexão manualmente

### Erro: "Port already in use"
- Feche outros processos usando a porta
- Ou altere a porta no `vite.config.ts`

### Erro: "Module not found"
- Execute `pnpm install` novamente
- Delete `node_modules` e `pnpm-lock.yaml` e reinstale

## 📝 Comandos Úteis

```bash
# Verificar tipos TypeScript
pnpm check

# Formatar código
pnpm format

# Rodar testes
pnpm test

# Abrir Drizzle Studio (visualizar banco)
pnpm db:studio
```

## 🎉 Pronto!

Se tudo funcionar, você verá o dashboard do sistema financeiro!

