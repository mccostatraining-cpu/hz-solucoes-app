# 🚀 Configuração Operacional Completa - Sistema Financeiro WhatsApp

## ✅ O que já está implementado:

### Notificações WhatsApp Automáticas:
- ✅ **Despesa Adicionada**: Quando alguém adiciona uma despesa, envia notificação
- ✅ **Item Pago**: Quando um item é marcado como pago, envia notificação
- ✅ **Meta Atingida**: Quando uma meta de economia é atingida (pronto para usar)
- ✅ **Resumo Mensal**: Envia resumo financeiro do mês (pronto para usar)

## 📋 Passo a Passo para Tornar Operacional

### 1️⃣ Configurar Banco de Dados MySQL

#### 1.1 Instalar MySQL
- **Windows**: Baixe [MySQL Installer](https://dev.mysql.com/downloads/installer/)
- Ou use [XAMPP](https://www.apachefriends.org/) que inclui MySQL

#### 1.2 Criar Banco de Dados
Abra o MySQL (via linha de comando ou phpMyAdmin) e execute:

```sql
CREATE DATABASE finance_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 1.3 Configurar Variáveis de Ambiente

Edite o arquivo `.env` na raiz do projeto:

```env
# ============================================
# CONFIGURAÇÃO DO BANCO DE DADOS
# ============================================
DATABASE_URL=mysql://usuario:senha@localhost:3306/finance_db

# Exemplo:
# DATABASE_URL=mysql://root:123456@localhost:3306/finance_db

# ============================================
# CONFIGURAÇÃO DE NOTIFICAÇÕES (Manus)
# ============================================
# Essas variáveis são configuradas automaticamente pelo Manus
# Mas você pode verificar se estão presentes:
BUILT_IN_FORGE_API_URL=https://forge.manus.app
BUILT_IN_FORGE_API_KEY=seu_api_key_aqui

# ============================================
# CONFIGURAÇÃO WHATSAPP (Opcional - Twilio)
# ============================================
# Se quiser usar Twilio diretamente (além do Manus):
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# ============================================
# CONFIGURAÇÃO OAuth (Manus)
# ============================================
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://oauth.manus.app
JWT_SECRET=seu_jwt_secret
OWNER_OPEN_ID=seu_open_id
```

### 2️⃣ Executar Migrations do Banco

Execute para criar todas as tabelas:

```bash
pnpm db:migrate
```

Isso cria:
- ✅ Tabela de usuários
- ✅ Tabela de households (famílias)
- ✅ Tabela de despesas
- ✅ Tabela de receitas
- ✅ Tabela de itens/pagamentos
- ✅ Tabela de projetos/metas
- ✅ Tabela de categorias
- ✅ Tabela de configurações WhatsApp

### 3️⃣ Instalar e Iniciar

```bash
# Instalar dependências (se ainda não fez)
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev
```

### 4️⃣ Configurar Notificações WhatsApp

#### Opção A: Usar Sistema Manus (Recomendado - Já Configurado)

O sistema já usa o Manus para notificações. As notificações são enviadas automaticamente quando:
- ✅ Despesa é adicionada
- ✅ Item é marcado como pago
- ✅ Meta é atingida (pronto para usar)
- ✅ Resumo mensal (pronto para usar)

**Como funciona:**
- As notificações são enviadas através do sistema Manus
- Você recebe no WhatsApp configurado na sua conta Manus
- Não precisa configurar Twilio separadamente

#### Opção B: Configurar Twilio (Opcional - Para Controle Total)

Se quiser usar Twilio diretamente:

1. **Criar conta no Twilio:**
   - Acesse: https://www.twilio.com/
   - Crie uma conta gratuita
   - Ative o WhatsApp Sandbox (gratuito para testes)

2. **Obter Credenciais:**
   - Account SID
   - Auth Token
   - Número do WhatsApp Sandbox

3. **Adicionar no .env:**
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxx
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   ```

4. **Configurar Webhook (se quiser receber mensagens):**
   - URL: `https://seu-dominio.com/api/trpc/whatsapp.webhook`
   - Configure no painel do Twilio

### 5️⃣ Testar Notificações

#### Teste 1: Adicionar Despesa
1. Acesse o sistema no navegador
2. Vá em "Adicionar Despesa"
3. Adicione uma despesa (ex: "Mercado - R$ 50,00")
4. **Verifique seu WhatsApp** - deve receber notificação!

#### Teste 2: Marcar Item como Pago
1. Vá em "Itens"
2. Adicione um item (ex: "Conta de luz - R$ 100,00")
3. Marque como "Pago"
4. **Verifique seu WhatsApp** - deve receber notificação!

#### Teste 3: Comandos WhatsApp (entrada automática)
1. Envie para seu número WhatsApp configurado:
   - `gasto 50 mercado`
   - `receita 120 vendas`
   - `saldo` ou `resumo`
2. Verifique as respostas automáticas e registros no sistema

#### Teste 4: Enviar Resumo Diário (push)
- Endpoint tRPC protegido: `/api/trpc/alerts.dailySummary`
- Requer usuário autenticado
- Uso recomendado: configure um cron diário chamando esta mutation para enviar o resumo via WhatsApp (Manus)

## 📱 Notificações Implementadas

### ✅ Já Funcionando:

1. **Nova Despesa Registrada**
   - Quando: Alguém adiciona uma despesa
   - Mensagem: `"[Nome] adicionou: [Descrição] - R$ [Valor]"`

2. **Item Pago**
   - Quando: Item é marcado como pago
   - Mensagem: `"[Nome do Item] foi marcado como pago - R$ [Valor]"`

### 🔄 Prontos para Usar (já implementados):

3. **Meta Atingida**
   - Quando: Meta de economia é atingida
   - Mensagem: `"Parabéns! Você atingiu a meta de [Nome]: R$ [Valor]"`

4. **Resumo Mensal**
   - Quando: Enviar resumo do mês
   - Mensagem: `"Faturamento: R$ X | Despesas: R$ Y | Saldo: R$ Z"`

## 🎯 Como Ativar Notificações Adicionais

### Adicionar Notificação quando Meta é Atingida:

Edite `server/routers.ts` e adicione na função de atualizar projeto:

```typescript
import { notifyTargetReached } from "./whatsapp";

// Dentro da função de atualizar projeto:
if (projeto.savedAmount >= projeto.targetAmount) {
  await notifyTargetReached(projeto.name, projeto.targetAmount / 100);
}
```

### Adicionar Notificação de Resumo Mensal:

Use o endpoint já pronto `alerts.dailySummary` (tRPC). Exemplo de integração:

```ts
// Chamar diariamente via cron/agenda
await fetch("https://seu-dominio.com/api/trpc/alerts.dailySummary", {
  method: "POST",
  credentials: "include", // se estiver autenticando por cookie/session
});
```

## 🔍 Verificar se Está Funcionando

### 1. Verificar Logs:
No terminal onde o servidor está rodando, você deve ver:
- ✅ Mensagens de conexão com banco
- ✅ Mensagens de notificação sendo enviadas

### 2. Testar Manualmente:
1. Adicione uma despesa
2. Verifique seu WhatsApp
3. Se não receber, verifique:
   - Variáveis de ambiente estão configuradas?
   - Banco de dados está conectado?
   - Logs mostram algum erro?

### 3. Verificar Banco de Dados:
```bash
pnpm db:studio
```
Isso abre o Drizzle Studio para visualizar o banco.

## 🐛 Resolução de Problemas

### Notificações não estão chegando:
1. ✅ Verifique se `BUILT_IN_FORGE_API_URL` e `BUILT_IN_FORGE_API_KEY` estão configurados
2. ✅ Verifique os logs do terminal para erros
3. ✅ Teste se o banco de dados está funcionando

### Erro de conexão com banco:
1. ✅ Verifique se MySQL está rodando
2. ✅ Confira a URL no `.env` (formato: `mysql://usuario:senha@localhost:3306/finance_db`)
3. ✅ Teste a conexão manualmente

### Erro de porta em uso:
- O sistema detecta automaticamente portas disponíveis
- Ou altere a porta no `.env`: `PORT=3001`

## 📊 Estrutura de Notificações

Todas as notificações seguem este formato:

```typescript
await notifyOwner({
  title: "Título da Notificação",
  content: "Conteúdo detalhado da notificação"
});
```

As notificações são enviadas através do sistema Manus, que por sua vez envia para o WhatsApp configurado.

## 🎉 Pronto para Produção!

Agora o sistema está:
- ✅ Com banco de dados configurado
- ✅ Com notificações WhatsApp funcionando
- ✅ Com todas as funcionalidades operacionais

**Próximos passos:**
1. Configure o banco de dados
2. Execute as migrations
3. Teste as notificações
4. Comece a usar!

