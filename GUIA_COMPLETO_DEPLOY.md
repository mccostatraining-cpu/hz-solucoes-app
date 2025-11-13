# Guia Completo: Como Hospedar e Usar seu App HZ Soluções

Este guia vai te ajudar a colocar seu aplicativo financeiro no ar e instalá-lo no celular de vocês dois (você e sua esposa).

## 📋 O que você vai precisar

- Conta no GitHub (para armazenar o código)
- Conta no Railway (para hospedar o app) - você já criou!
- 10-15 minutos do seu tempo

## 🚀 Passo 1: Subir o Código para o GitHub

### 1.1 Criar Repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login
2. Clique no botão **"+"** no canto superior direito
3. Selecione **"New repository"**
4. Configure o repositório:
   - **Nome**: `hz-solucoes-app` (ou o nome que preferir)
   - **Visibilidade**: Escolha **Private** (privado) para manter seu código seguro
   - **NÃO** marque "Initialize with README"
5. Clique em **"Create repository"**

### 1.2 Fazer Upload do Código

Você tem duas opções:

**Opção A: Via Interface Web (Mais Fácil)**

1. Na página do repositório criado, clique em **"uploading an existing file"**
2. Arraste todos os arquivos da pasta `hz-solucoes-railway` para a área de upload
3. Aguarde o upload completar
4. Clique em **"Commit changes"**

**Opção B: Via Git (Se você tem Git instalado)**

```bash
cd hz-solucoes-railway
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/hz-solucoes-app.git
git push -u origin main
```

## 🛤️ Passo 2: Configurar o Railway

### 2.1 Criar Novo Projeto

1. Acesse [railway.app](https://railway.app) e faça login
2. Clique em **"+ New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Autorize o Railway a acessar seus repositórios (se solicitado)
5. Selecione o repositório **hz-solucoes-app** que você criou
6. Clique em **"Deploy Now"**

O Railway vai começar a fazer o build do seu app. **Aguarde alguns minutos** - é normal que o primeiro deploy demore um pouco.

### 2.2 Adicionar Banco de Dados MySQL

1. No **Project Canvas** (tela do projeto), clique no botão **"+ New"** ou pressione `Ctrl+K` (Windows) / `Cmd+K` (Mac)
2. Selecione **"Database"**
3. Escolha **"Add MySQL"**
4. Aguarde o Railway provisionar o banco de dados (leva cerca de 1 minuto)

Pronto! O Railway automaticamente conectou seu app ao banco de dados.

### 2.3 Configurar Variáveis de Ambiente

Agora você precisa configurar algumas informações importantes:

1. No **Project Canvas**, clique no **serviço do seu app** (não no MySQL)
2. Vá na aba **"Variables"** (Variáveis)
3. Clique em **"+ New Variable"** e adicione as seguintes variáveis:

**Variáveis Obrigatórias:**

| Nome da Variável | Valor | Explicação |
|------------------|-------|------------|
| `DATABASE_URL` | `${{MySQL.MYSQL_URL}}` | Conexão com o banco (referência automática) |
| `JWT_SECRET` | `hz-solucoes-secret-2024-xyz` | Chave secreta (invente uma aleatória) |
| `VITE_APP_ID` | `hz-solucoes` | ID do seu app |
| `VITE_APP_TITLE` | `HZ Soluções - Gestão Financeira` | Título que aparece no app |

**Variáveis que já vêm automáticas (não precisa adicionar):**
- `PORT` - O Railway define automaticamente
- `VITE_PUBLIC_URL` - O Railway define automaticamente

**Variáveis Opcionais (só se quiser WhatsApp):**
- `TWILIO_ACCOUNT_SID` - Deixe em branco por enquanto
- `TWILIO_AUTH_TOKEN` - Deixe em branco por enquanto
- `TWILIO_WHATSAPP_NUMBER` - Deixe em branco por enquanto

4. Depois de adicionar todas as variáveis, o Railway vai fazer um **novo deploy automaticamente**

### 2.4 Obter a URL do seu App

1. No **Project Canvas**, clique no serviço do seu app
2. Vá na aba **"Settings"** (Configurações)
3. Role até a seção **"Networking"** ou **"Domains"**
4. Clique em **"Generate Domain"** para criar uma URL pública
5. Copie a URL gerada (será algo como `https://hz-solucoes-production.up.railway.app`)

**Guarde essa URL!** É ela que vocês vão usar para acessar o app.

## 📱 Passo 3: Instalar no Celular

Agora que o app está no ar, vocês podem instalá-lo nos celulares!

### Para Android (Chrome)

1. **Abra a URL** do app no navegador **Google Chrome**
2. Espere a página carregar completamente
3. Toque no **menu de três pontos** (⋮) no canto superior direito
4. Selecione **"Instalar aplicativo"** ou **"Adicionar à tela inicial"**
5. Confirme tocando em **"Instalar"**
6. Pronto! O ícone do **HZ Soluções** aparecerá na tela inicial

### Para iPhone (Safari)

1. **Abra a URL** do app no navegador **Safari**
2. Espere a página carregar completamente
3. Toque no **ícone de compartilhamento** (quadrado com seta para cima) na barra inferior
4. Role para baixo e selecione **"Adicionar à Tela de Início"**
5. Confirme o nome e toque em **"Adicionar"**
6. Pronto! O ícone do **HZ Soluções** estará na tela de início

## ✅ Passo 4: Primeiro Acesso

1. **Abra o app** tocando no ícone na tela inicial
2. Faça o **cadastro/login** (o sistema usa OAuth do Manus)
3. Comece a usar as funcionalidades:
   - Adicionar despesas
   - Criar metas de economia
   - Registrar faturamento
   - Controlar itens de compra

## 🔧 Solução de Problemas

### O app não abre / tela branca

1. Volte no Railway
2. Vá em **Deployments** (Deploys)
3. Clique no deploy mais recente
4. Verifique os **logs** para ver se há erros
5. Procure por mensagens de erro em vermelho

### Erro de conexão com banco de dados

1. Verifique se a variável `DATABASE_URL` está configurada como `${{MySQL.MYSQL_URL}}`
2. Certifique-se de que o serviço MySQL está rodando (deve ter um indicador verde)
3. Tente fazer um novo deploy clicando em **"Redeploy"**

### O app não instala no celular

1. Certifique-se de que está usando **HTTPS** (a URL do Railway já é HTTPS)
2. No Android, use o **Chrome** (não funciona em outros navegadores)
3. No iPhone, use o **Safari** (não funciona no Chrome do iPhone)
4. Limpe o cache do navegador e tente novamente

## 💰 Custos do Railway

- **Trial Gratuito**: $5 de crédito para começar
- **Plano Hobby**: $5/mês (suficiente para uso pessoal)
- **Consumo estimado**: ~$3-4/mês para um app pequeno com 2 usuários

O Railway cobra por uso (CPU, RAM, transferência), mas para um app pessoal o custo é bem baixo.

## 📊 Monitoramento

Para ver se está tudo funcionando:

1. Acesse o Railway
2. Vá no seu projeto
3. Clique no serviço do app
4. Veja as métricas:
   - **CPU Usage** - Deve estar baixo (< 10%)
   - **Memory** - Deve estar estável
   - **Network** - Mostra quantas requisições estão sendo feitas

## 🎉 Próximos Passos

Agora que o app está funcionando, vocês podem:

1. **Configurar categorias** de despesas personalizadas
2. **Criar metas** de economia para objetivos específicos
3. **Adicionar despesas fixas** mensais (aluguel, contas, etc)
4. **Explorar os relatórios** com gráficos de gastos
5. **Configurar WhatsApp** (opcional, requer conta Twilio)

## 📞 Suporte

Se tiver alguma dúvida ou problema:

1. Consulte os arquivos de documentação na pasta do projeto
2. Verifique os logs no Railway
3. Revise este guia passo a passo

---

**Parabéns! Seu app de gestão financeira está no ar! 🎊**

Agora você e sua esposa podem gerenciar as finanças de forma organizada e colaborativa, direto do celular!
