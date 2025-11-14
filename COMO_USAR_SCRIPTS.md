# 🚀 Como Usar os Scripts de Correção

## 📋 Ordem de Execução

### 1️⃣ Primeiro: Limpar Referências ao pnpm
```powershell
.\limpar-pnpm.ps1
```
Este script vai:
- ✅ Remover `pnpm-lock.yaml` (se existir)
- ✅ Corrigir `railway.json` (substituir pnpm por npm)
- ✅ Corrigir `Procfile` (substituir pnpm por npm)
- ✅ Criar/atualizar `.npmrc` para forçar npm

### 2️⃣ Segundo: Verificar Tudo
```powershell
.\verificar-railway.ps1
```
Este script vai:
- ✅ Verificar todos os arquivos de configuração
- ✅ Identificar problemas restantes
- ✅ Mostrar o que está correto e o que precisa ser corrigido
- ✅ Dar instruções específicas

### 3️⃣ Terceiro: Verificar Dashboard do Railway

**CRÍTICO!** O dashboard pode ter configurações que sobrescrevem os arquivos.

1. Acesse: https://railway.app → Seu Projeto → Settings → Service
2. Procure por:
   - **Build Command**
   - **Install Command**  
   - **Start Command**
3. Se algum contiver `pnpm`, **DELETE ou altere para `npm`**
4. Ou deixe todos **vazios** para usar os arquivos de configuração

### 4️⃣ Quarto: Adicionar Variável (Opcional mas Recomendado)

1. No Railway: **Settings** → **Variables**
2. Adicione:
   - **Name**: `NPM_CONFIG_PACKAGE_MANAGER`
   - **Value**: `npm`

### 5️⃣ Quinto: Commit e Push

```bash
git add .
git commit -m "fix: remove pnpm e força uso do npm no Railway"
git push
```

## 🎯 Resumo Rápido

```powershell
# 1. Limpar
.\limpar-pnpm.ps1

# 2. Verificar
.\verificar-railway.ps1

# 3. Verificar dashboard do Railway (manual)
# 4. Adicionar variável NPM_CONFIG_PACKAGE_MANAGER=npm (opcional)
# 5. Commit e push
```

## ⚠️ Se Ainda Der Erro

Se após executar os scripts e verificar o dashboard ainda der erro:

1. **Delete o serviço no Railway**
2. **Crie um novo serviço** do zero
3. **Conecte ao mesmo repositório**
4. **NÃO configure nada manualmente** - deixe usar os arquivos
5. Adicione apenas variáveis de ambiente (DATABASE_URL, etc.)

## 📞 Ajuda

Se precisar de ajuda:
1. Execute `.\verificar-railway.ps1` e compartilhe o resultado
2. Compartilhe screenshot do Settings → Service do Railway
3. Compartilhe os logs do Railway (Build Logs + Deploy Logs)

