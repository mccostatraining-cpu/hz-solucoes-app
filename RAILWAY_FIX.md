# 🔧 CORREÇÃO DO ERRO "pnpm: command not found" NO RAILWAY

## ⚠️ PROBLEMA
O Railway está tentando usar `pnpm` mas o comando não existe. Isso acontece porque:
1. O Railway pode estar detectando automaticamente o gerenciador de pacotes
2. Pode haver configurações no dashboard que sobrescrevem os arquivos

## ✅ SOLUÇÃO DEFINITIVA

### PASSO 1: Verificar no Dashboard do Railway

1. **Acesse o Dashboard do Railway**: https://railway.app
2. **Vá no seu projeto** → **Settings** → **Service**
3. **Verifique estas configurações**:

#### Build Settings:
- **Build Command**: Deve estar vazio OU `npm install && npm run build`
- **Install Command**: Deve estar vazio OU `npm install`
- **Start Command**: Deve estar vazio OU `npm start`

#### Deploy Settings:
- **Start Command**: `npm start`
- **Healthcheck Path**: `/health`
- **Healthcheck Timeout**: `300`

### PASSO 2: Limpar Configurações Antigas

Se você configurou algo manualmente no dashboard que usa `pnpm`, **DELETE essas configurações** e deixe o Railway usar os arquivos de configuração (`railway.json`).

### PASSO 3: Forçar o uso do npm

No dashboard do Railway, vá em **Settings** → **Variables** e adicione (se não existir):
- `NPM_CONFIG_PACKAGE_MANAGER=npm`

### PASSO 4: Fazer Deploy

1. Faça commit das alterações:
```bash
git add .
git commit -m "fix: força uso do npm no Railway"
git push
```

2. O Railway vai fazer um novo deploy automaticamente

3. **IMPORTANTE**: Se ainda der erro, vá no dashboard e:
   - **Delete o serviço atual**
   - **Crie um novo serviço** conectando ao mesmo repositório
   - Isso vai forçar o Railway a ler os arquivos de configuração do zero

## 📋 CHECKLIST FINAL

- [ ] `railway.json` está usando `npm` (✅ já corrigido)
- [ ] `Procfile` está usando `npm start` (✅ já corrigido)
- [ ] `package.json` tem script `start` com `npm` (✅ já corrigido)
- [ ] Dashboard do Railway não tem configurações manuais com `pnpm`
- [ ] Variável `NPM_CONFIG_PACKAGE_MANAGER=npm` está definida (opcional)
- [ ] Deploy foi feito após as correções

## 🚨 SE AINDA NÃO FUNCIONAR

1. **Delete o serviço no Railway**
2. **Crie um novo serviço** do zero
3. **Conecte ao repositório GitHub**
4. **NÃO configure nada manualmente** - deixe o Railway usar os arquivos de configuração
5. **Adicione apenas as variáveis de ambiente necessárias** (DATABASE_URL, etc.)

