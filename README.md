# HZ Soluções - Sistema de Gestão Financeira PWA

Sistema completo de gestão financeira para casais com **sincronização em tempo real** e **integração WhatsApp bidirecional**.

## 🎯 Sobre o Projeto

O **HZ Soluções** é uma aplicação web progressiva que combina funcionalidades de gestão financeira pessoal, controle de despesas, metas de economia e integração com WhatsApp. O sistema foi projetado especialmente para casais que desejam gerenciar suas finanças de forma colaborativa.

## ✨ Funcionalidades Principais

### 💰 Gestão Financeira Completa

O sistema oferece um conjunto completo de ferramentas para gestão financeira pessoal e familiar. O **Dashboard Financeiro** apresenta um resumo consolidado de faturamento, despesas e saldo, além de exibir as últimas transações e itens pendentes, com suporte a tema claro e escuro para melhor experiência visual.

A **Gestão de Despesas** permite o controle tanto de despesas variáveis quanto fixas mensais, com sistema de auto-categorização baseado em palavras-chave e registro individualizado por usuário. O módulo de **Projetos e Metas** possibilita a criação de metas de economia com acompanhamento visual do progresso.

### ⚡ Sincronização em Tempo Real (NOVO!)

A aplicação agora conta com **sincronização instantânea via WebSocket** entre todos os dispositivos conectados. Quando você ou sua esposa adicionarem uma despesa, ela aparece **imediatamente** no dispositivo do outro, sem precisar recarregar a página.

**Como funciona**:

- Conexão WebSocket persistente entre cliente e servidor.
- Atualizações automáticas do React Query quando dados mudam.
- Notificações em tempo real de todas as operações.
- Funciona entre desktop, tablet e mobile simultaneamente.

### 📱 Integração WhatsApp Bidirecional

A **Integração WhatsApp** oferece webhook para recebimento de mensagens, parser de comandos em linguagem natural e notificações automáticas. Você pode gerenciar suas finanças diretamente pelo WhatsApp.

**Comandos disponíveis**:

- `gasto 50 mercado` - Adiciona despesa de R$ 50,00.
- `saldo` - Mostra resumo financeiro do mês.
- `despesas` - Lista últimas 5 despesas.
- `itens` - Lista itens pendentes.
- `ajuda` - Mostra lista de comandos.

Quando você envia um comando pelo WhatsApp, a atualização aparece **instantaneamente** em todos os dispositivos conectados graças à sincronização em tempo real.

### 👥 Multi-usuário

O sistema é **Multi-usuário**, com suporte para múltiplos usuários (ideal para casais), identificação automática via WhatsApp e relatórios individualizados por pessoa. Cada pessoa pode usar seu próprio dispositivo e ver as atualizações do outro em tempo real.

## 🛠️ Tecnologias Utilizadas

A aplicação foi construída com tecnologias modernas e robustas. O **Frontend** utiliza React 19 com TypeScript, Vite como bundler, Tailwind CSS para estilização e Radix UI para componentes acessíveis. O **Backend** é baseado em Node.js com framework Hono e tRPC para comunicação type-safe entre cliente e servidor.

O **Banco de Dados** utiliza MySQL com Drizzle ORM para gerenciamento de schema e migrações. A visualização de dados é feita com **Recharts**, enquanto a autenticação é gerenciada via **Manus OAuth**. A aplicação é configurada como **PWA** com Service Worker para funcionamento offline, manifest.json para instalação e ícones otimizados para múltiplas resoluções.

**Novidades tecnológicas**:

- **WebSocket (ws)**: Para sincronização em tempo real entre clientes.
- **React Query**: Cache inteligente e invalidação automática de dados.
- **Twilio API**: Integração bidirecional com WhatsApp.

## 🚀 Deploy no Railway

Este projeto está configurado para deploy simplificado no Railway. Siga os passos abaixo:

### Pré-requisitos

- Conta no [Railway.app](https://railway.app)
- Repositório GitHub com o código do projeto
- Node.js 22+ instalado localmente (para testes)
- Conta no [Twilio](https://www.twilio.com) (opcional, para WhatsApp)

### Passo a Passo

1. **Faça login no Railway** usando sua conta GitHub.
2. **Crie um novo projeto** e conecte seu repositório.
3. **Adicione o serviço MySQL** ao projeto (o Railway criará automaticamente as variáveis de conexão).
4. **Configure as variáveis de ambiente** necessárias (veja seção abaixo).
5. **Faça o deploy** - o Railway detectará automaticamente as configurações via `nixpacks.toml`.

Para instruções detalhadas, consulte o arquivo **[GUIA_COMPLETO_DEPLOY.md](./GUIA_COMPLETO_DEPLOY.md)**.

### Variáveis de Ambiente Necessárias

Configure as seguintes variáveis no Railway (Settings → Variables):

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `DATABASE_URL` | URL de conexão MySQL (automática) | `mysql://user:pass@host:3306/db` |
| `PORT` | Porta do servidor (automática) | `3000` |
| `OAUTH_SERVER_URL` | URL do servidor OAuth | `https://api.manus.im` |
| `VITE_OAUTH_PORTAL_URL` | URL do portal OAuth | `https://portal.manus.im` |
| `VITE_APP_ID` | ID da aplicação | `hz-solucoes` |
| `JWT_SECRET` | Chave secreta para JWT | `sua-chave-aleatoria-segura` |
| `VITE_APP_TITLE` | Título do app | `HZ Soluções` |
| `VITE_PUBLIC_URL` | URL pública (automática) | `https://seu-app.up.railway.app` |

Variáveis opcionais para integração WhatsApp:

| Variável | Descrição |
| :--- | :--- |
| `TWILIO_ACCOUNT_SID` | SID da conta Twilio |
| `TWILIO_AUTH_TOKEN` | Token de autenticação Twilio |
| `TWILIO_WHATSAPP_NUMBER` | Número WhatsApp Business (ex: `whatsapp:+14155238886`) |

Consulte o arquivo **[.env.example](./.env.example)** para referência completa.

## 📱 Instalação como PWA

Após o deploy, seus usuários podem instalar o aplicativo diretamente no celular:

### Android (Chrome)

1. Abra o site no Chrome.
2. Toque em "Adicionar à tela inicial".
3. Confirme a instalação.

### iOS (Safari)

1. Abra o site no Safari.
2. Toque no botão "Compartilhar".
3. Selecione "Adicionar à Tela de Início".

Para instruções detalhadas com imagens, consulte **[COMO_INSTALAR_PWA.md](./COMO_INSTALAR_PWA.md)**.

## 📱 Configurar WhatsApp

Para habilitar a integração com WhatsApp, siga o guia completo:

**[CONFIGURAR_WHATSAPP.md](./CONFIGURAR_WHATSAPP.md)** - Passo a passo para configurar Twilio e conectar ao WhatsApp.

Depois de configurado, consulte a lista de comandos disponíveis:

**[COMANDOS_WHATSAPP.md](./COMANDOS_WHATSAPP.md)** - Todos os comandos que você pode usar pelo WhatsApp.

## 🧪 Desenvolvimento Local

Para executar o projeto localmente:

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Iniciar banco de dados MySQL local (via Docker)
docker-compose up -d mysql

# Executar migrações
pnpm db:migrate

# Iniciar servidor de desenvolvimento
pnpm dev
```

O aplicativo estará disponível em `http://localhost:3000`.

## 📊 Estrutura do Banco de Dados

O banco de dados possui as seguintes tabelas principais:

- **users** - Usuários do sistema
- **households** - Unidades familiares (casal)
- **userHouseholds** - Relação usuários ↔ households
- **expenses** - Despesas variáveis
- **fixedExpenses** - Despesas fixas mensais
- **dailyRevenue** - Faturamento diário
- **projects** - Metas de economia
- **itemsControl** - Lista de compras/pagamentos
- **expenseCategories** - Categorias de despesas
- **whatsappSettings** - Configurações WhatsApp

Todos os valores monetários são armazenados em centavos (integers) para evitar problemas de precisão.

## 🔒 Segurança

O sistema implementa diversas camadas de segurança, incluindo autenticação via OAuth (Manus), procedures protegidas com `protectedProcedure`, validação de entrada com Zod e type-safety end-to-end com tRPC. Todas as senhas e tokens são armazenados de forma segura através de variáveis de ambiente.

A integração WhatsApp usa verificação de assinatura digital do Twilio para garantir que apenas mensagens legítimas sejam processadas.

## 📝 Arquivos de Configuração

O projeto inclui diversos arquivos de configuração para facilitar o deploy:

- **nixpacks.toml** - Configuração de build para Railway
- **railway.toml** - Configurações de deploy e healthcheck
- **start.sh** - Script de inicialização com migrações automáticas
- **Procfile** - Comando de inicialização
- **.env.example** - Template de variáveis de ambiente

## 📚 Documentação Adicional

- **[GUIA_COMPLETO_DEPLOY.md](./GUIA_COMPLETO_DEPLOY.md)** - Guia passo a passo simplificado
- **[DEPLOY_RAILWAY.md](./DEPLOY_RAILWAY.md)** - Guia técnico completo de deploy no Railway
- **[CONFIGURAR_BANCO.md](./CONFIGURAR_BANCO.md)** - Instruções para configuração do MySQL
- **[PRE_DEPLOY.md](./PRE_DEPLOY.md)** - Checklist pré-deploy
- **[COMO_INSTALAR_PWA.md](./COMO_INSTALAR_PWA.md)** - Guia de instalação para usuários finais
- **[CONFIGURAR_WHATSAPP.md](./CONFIGURAR_WHATSAPP.md)** - Como configurar integração WhatsApp
- **[COMANDOS_WHATSAPP.md](./COMANDOS_WHATSAPP.md)** - Lista de comandos WhatsApp disponíveis
- **[README_PWA.md](./README_PWA.md)** - Informações sobre a configuração PWA

## 🤝 Suporte

Para questões relacionadas ao código, abra uma issue no repositório. Para suporte ao Railway, consulte a [documentação oficial](https://docs.railway.app).

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ para gestão financeira de casais**

**Versão 2.0** - Agora com sincronização em tempo real e WhatsApp!
