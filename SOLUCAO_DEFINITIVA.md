# 🚀 SOLUÇÃO DEFINITIVA - Erro "pnpm: command not found" no Railway

## 🔍 PASSO 1: Executar Script de Verificação

Execute o script de verificação para identificar todos os problemas:

```powershell
.\verificar-railway.ps1
```

O script vai verificar:
- ✅ Todos os arquivos de configuração
- ✅ Referências a pnpm
- ✅ Configurações corretas
- ✅ Arquivos de build

## 🎯 PASSO 2: Corrigir Problemas Identificados

### Se o script encontrar `pnpm-lock.yaml`:
```bash
# DELETE este arquivo - ele faz o Railway detectar pnpm automaticamente
Remove-Item pnpm-lock.yaml -ErrorAction SilentlyContinue
```

### Se encontrar referências a pnpm em arquivos:
O script vai mostrar exatamente onde estão. Corrija manualmente.

## 🔧 PASSO 3: Verificar Dashboard do Railway (CRÍTICO!)

**Este é o passo mais importante!** O dashboard pode ter configurações que sobrescrevem os arquivos.

### 3.1 Acesse o Dashboard
1. Vá em: https://railway.app
2. Selecione seu projeto
3. Clique no serviço (geralmente chamado "web")

### 3.2 Verifique Settings → Service

Procure por estas seções e **DELETE ou CORRIJA** qualquer referência a `pnpm`:

#### Build Settings:
- **Build Command**: 
  - ❌ ERRADO: `pnpm install && pnpm build`
  - ✅ CORRETO: Deixe vazio OU `npm install && npm run build`
  
- **Install Command**:
  - ❌ ERRADO: `pnpm install`
  - ✅ CORRETO: Deixe vazio OU `npm install`

#### Deploy Settings:
- **Start Command**:
  - ❌ ERRADO: `pnpm start`
  - ✅ CORRETO: Deixe vazio OU `npm start`

### 3.3 Adicionar Variável de Ambiente (Opcional mas Recomendado)

1. Vá em **Settings** → **Variables**
2. Clique em **+ New Variable**
3. Adicione:
   - **Name**: `NPM_CONFIG_PACKAGE_MANAGER`
   - **Value**: `npm`
4. Clique em **Add**

## 📤 PASSO 4: Fazer Commit e Push

```bash
git add .
git commit -m "fix: remove pnpm e força uso do npm no Railway"
git push
```

## 🔄 PASSO 5: Aguardar Deploy

O Railway vai fazer um novo deploy automaticamente. Acompanhe os logs:
- **Build Logs**: Deve mostrar `npm install` e `npm run build`
- **Deploy Logs**: Deve mostrar `npm start`

## 🚨 SE AINDA NÃO FUNCIONAR - Solução Nuclear

Se após todos esses passos ainda der erro, faça isso:

### Opção A: Recriar Serviço
1. No Railway, **DELETE o serviço atual**
2. **Crie um novo serviço** do zero
3. **Conecte ao mesmo repositório GitHub**
4. **NÃO configure NADA manualmente** - deixe o Railway usar os arquivos
5. Adicione apenas as variáveis de ambiente necessárias (DATABASE_URL, etc.)

### Opção B: Usar Dockerfile (Alternativa)
Se quiser ter controle total, podemos criar um Dockerfile que força o uso do npm.

## ✅ CHECKLIST FINAL

Antes de fazer deploy, verifique:

- [ ] Script de verificação executado sem erros críticos
- [ ] `pnpm-lock.yaml` deletado (se existia)
- [ ] `railway.json` usa `npm` em todos os comandos
- [ ] `Procfile` usa `npm start`
- [ ] `package.json` script `start` não usa `pnpm`
- [ ] Dashboard do Railway não tem configurações manuais com `pnpm`
- [ ] Variável `NPM_CONFIG_PACKAGE_MANAGER=npm` adicionada (opcional)
- [ ] Commit e push feitos
- [ ] Deploy iniciado no Railway

## 📞 Se Nada Funcionar

Se após seguir TODOS esses passos ainda der erro:
1. Compartilhe os logs completos do Railway (Build Logs + Deploy Logs)
2. Compartilhe screenshot do Settings → Service do dashboard
3. Verifique se há algum script customizado rodando antes do start

## 🎯 Por Que Isso Acontece?

O Railway detecta automaticamente o gerenciador de pacotes baseado em:
1. Arquivos de lock (`pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`)
2. Configurações no dashboard (que têm prioridade sobre arquivos)
3. Configurações em arquivos (`railway.json`, `nixpacks.toml`)

Se houver `pnpm-lock.yaml` OU configurações manuais no dashboard, o Railway vai tentar usar `pnpm` mesmo que os arquivos digam para usar `npm`.

