# 🚀 Guia Simplificado de Deploy no Railway

Este guia resolve os problemas comuns de deploy no Railway.

## ✅ Problemas Corrigidos

1. **Configuração unificada**: Todos os arquivos de configuração agora usam os mesmos comandos
2. **Uso correto do npm**: Garantido que o Railway usa `npm` e não `pnpm`
3. **Comando de start direto**: Usa `node dist-server/index.cjs` diretamente
4. **Migrações**: Removida tentativa automática de migração (deve ser feita manualmente)

## 📋 Passo a Passo para Deploy

### 1. Preparar o Repositório GitHub

Certifique-se de que todos os arquivos estão commitados:

```bash
git add .
git commit -m "fix: corrigir configuração do Railway"
git push
```

### 2. Criar Projeto no Railway

1. Acesse [https://railway.app](https://railway.app)
2. Faça login com sua conta GitHub
3. Clique em **"+ New Project"**
4. Selecione **"Deploy from GitHub repo"**
5. Escolha seu repositório

### 3. Configurar o Serviço

O Railway deve detectar automaticamente as configurações do `railway.json`. Se não detectar:

1. Vá em **Settings** → **Service**
2. **Build Command**: Deixe vazio (usa o do `railway.json`)
3. **Start Command**: Deixe vazio (usa o do `railway.json`)
4. **Healthcheck Path**: `/health`
5. **Healthcheck Timeout**: `300`

### 4. Adicionar Banco de Dados MySQL

1. No **Project Canvas**, clique em **"+ New"**
2. Selecione **"Database"** → **"MySQL"**
3. O Railway criará automaticamente as variáveis de conexão

### 5. Configurar Variáveis de Ambiente

Vá em **Settings** → **Variables** e adicione:

#### Obrigatórias:
- `DATABASE_URL`: Use `${{MySQL.MYSQL_URL}}` (substitua `MySQL` pelo nome do seu serviço MySQL)
- `PORT`: Deixe o Railway gerenciar automaticamente (não precisa adicionar)

#### Opcionais (mas recomendadas):
- `NODE_ENV`: `production`
- `OAUTH_SERVER_URL`: URL do servidor OAuth
- `VITE_OAUTH_PORTAL_URL`: URL do portal OAuth
- `VITE_APP_ID`: ID da aplicação
- `JWT_SECRET`: Chave secreta para JWT
- `VITE_APP_TITLE`: Título do app
- `VITE_PUBLIC_URL`: URL pública (será `https://seu-app.up.railway.app`)

#### Para WhatsApp (opcional):
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_NUMBER`

### 6. Criar Tabelas no Banco de Dados

**IMPORTANTE**: As migrações devem ser executadas manualmente antes do primeiro deploy.

#### Opção 1: Usando Drizzle Kit (recomendado)

No seu computador local:

```bash
# Configure a DATABASE_URL no .env
DATABASE_URL=mysql://user:pass@host:port/db

# Execute o push do schema
npx drizzle-kit push
```

#### Opção 2: Executar SQL manualmente

1. No Railway, vá no serviço MySQL
2. Clique em **"Data"** → **"Query"**
3. Execute os arquivos SQL da pasta `drizzle/migrations/`

### 7. Fazer Deploy

1. O Railway fará deploy automaticamente após o push
2. Ou clique em **"Deploy"** → **"Redeploy"** no dashboard
3. Aguarde o build completar
4. Verifique os logs em **"Deployments"** → **"View Logs"**

### 8. Verificar se Funcionou

1. Acesse a URL fornecida pelo Railway (ex: `https://seu-app.up.railway.app`)
2. Teste o endpoint de healthcheck: `https://seu-app.up.railway.app/health`
3. Verifique os logs para erros

## 🔍 Troubleshooting

### Erro: "Cannot find module 'dist-server/index.cjs'"

**Causa**: O build não foi executado ou falhou.

**Solução**:
1. Verifique os logs de build no Railway
2. Certifique-se de que o comando `npm run build` está funcionando
3. Verifique se há erros de TypeScript ou dependências

### Erro: "Port already in use"

**Causa**: Configuração incorreta da porta.

**Solução**: O servidor já está configurado para usar `process.env.PORT`. Não precisa fazer nada.

### Erro: "Database connection failed"

**Causa**: `DATABASE_URL` não configurada ou incorreta.

**Solução**:
1. Verifique se a variável `DATABASE_URL` está configurada
2. Use a sintaxe de referência: `${{MySQL.MYSQL_URL}}`
3. Verifique se o serviço MySQL está rodando

### Erro: "pnpm: command not found"

**Causa**: Railway tentando usar pnpm.

**Solução**:
1. Verifique se não há configurações manuais no dashboard usando pnpm
2. O `railway.json` já está configurado para usar `npm`
3. Adicione a variável: `NPM_CONFIG_PACKAGE_MANAGER=npm`

### Build falha

**Solução**:
1. Verifique os logs completos (role para cima, o erro pode estar no meio)
2. Certifique-se de que todas as dependências estão no `package.json`
3. Verifique se há erros de TypeScript: `npm run check`

## 📝 Checklist Final

- [ ] Código commitado e pushado no GitHub
- [ ] Projeto criado no Railway
- [ ] Serviço MySQL adicionado
- [ ] Variáveis de ambiente configuradas
- [ ] Tabelas criadas no banco de dados
- [ ] Build executado com sucesso
- [ ] Servidor iniciado sem erros
- [ ] Healthcheck respondendo em `/health`
- [ ] Aplicação acessível pela URL pública

## 🎯 Arquivos de Configuração

O projeto usa os seguintes arquivos (já corrigidos):

- `railway.json`: Configuração principal do Railway (RAILPACK)
- `Procfile`: Fallback para outros serviços
- `nixpacks.toml`: Fallback para modo legado
- `package.json`: Scripts de build e start

Todos estão configurados para usar `npm` e `node dist-server/index.cjs`.

