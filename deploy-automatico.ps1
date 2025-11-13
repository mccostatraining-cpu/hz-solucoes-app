# 🚀 Script Automatizado de Deploy
# Finance WhatsApp App - Deploy Completo

Write-Host "🚀 INICIANDO DEPLOY AUTOMATIZADO" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Função para verificar se comando existe
function Test-Command {
    param($command)
    $null = Get-Command $command -ErrorAction SilentlyContinue
    return $?
}

# 1. Verificar pré-requisitos
Write-Host "📋 Verificando pré-requisitos..." -ForegroundColor Yellow

if (-not (Test-Command "git")) {
    Write-Host "❌ Git não está instalado!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "node")) {
    Write-Host "❌ Node.js não está instalado!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Pré-requisitos OK!" -ForegroundColor Green

# 2. Configurar Git (se necessário)
Write-Host "🔧 Configurando Git..." -ForegroundColor Yellow
$gitUser = git config --global user.name
$gitEmail = git config --global user.email

if (-not $gitUser -or -not $gitEmail) {
    Write-Host "⚠️  Configurando Git pela primeira vez..." -ForegroundColor Yellow
    git config --global user.name "Seu Nome"
    git config --global user.email "seu.email@example.com"
}

# 3. Instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm install
if (-not $?) {
    Write-Host "❌ Erro ao instalar dependências!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependências instaladas!" -ForegroundColor Green

# 4. Build do projeto
Write-Host "🔨 Fazendo build do projeto..." -ForegroundColor Yellow
npm run build
if (-not $?) {
    Write-Host "❌ Erro no build! Verifique os logs..." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build concluído!" -ForegroundColor Green

# 5. Deploy para GitHub
Write-Host "📤 Enviando para GitHub..." -ForegroundColor Yellow
$currentBranch = git branch --show-current

if ($currentBranch -eq "main" -or $currentBranch -eq "master") {
    git add .
    git commit -m "Deploy automático - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    git push origin $currentBranch
    Write-Host "✅ Código enviado para GitHub!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Você não está na branch main/master. Faça o push manualmente." -ForegroundColor Yellow
}

# 6. Verificar se Vercel CLI está instalado
if (-not (Test-Command "vercel")) {
    Write-Host "📥 Instalando Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# 7. Deploy no Vercel
Write-Host "🚀 Fazendo deploy no Vercel..." -ForegroundColor Yellow
$vercelDeploy = vercel --prod --yes
if (-not $?) {
    Write-Host "❌ Erro no deploy do Vercel!" -ForegroundColor Red
    Write-Host "Execute manualmente: vercel --prod" -ForegroundColor Yellow
} else {
    Write-Host "✅ Deploy no Vercel concluído!" -ForegroundColor Green
}

# 8. Verificar se Railway CLI está instalado
if (-not (Test-Command "railway")) {
    Write-Host "📥 Instalando Railway CLI..." -ForegroundColor Yellow
    npm install -g @railway/cli
}

# 9. Deploy no Railway
Write-Host "🚂 Fazendo deploy no Railway..." -ForegroundColor Yellow
$railwayStatus = railway status 2>$null
if (-not $?) {
    Write-Host "⚠️  Railway não está configurado. Iniciando configuração..." -ForegroundColor Yellow
    railway login
    railway init
    railway add --database
}

railway up
if (-not $?) {
    Write-Host "❌ Erro no deploy do Railway!" -ForegroundColor Red
    Write-Host "Execute manualmente: railway up" -ForegroundColor Yellow
} else {
    Write-Host "✅ Deploy no Railway concluído!" -ForegroundColor Green
}

# 10. Resultado final
Write-Host ""
Write-Host "🎉 DEPLOY AUTOMATIZADO CONCLUÍDO!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "1. Verifique o dashboard do Vercel: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. Verifique o dashboard do Railway: https://railway.app/dashboard" -ForegroundColor White
Write-Host "3. Configure as variáveis de ambiente se necessário" -ForegroundColor White
Write-Host "4. Teste sua aplicação online!" -ForegroundColor White
Write-Host ""
Write-Host "📞 Se precisar de ajuda, execute: ./deploy-automatico.ps1 -help" -ForegroundColor Yellow