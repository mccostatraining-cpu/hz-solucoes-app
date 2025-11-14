# 🧹 Script para Limpar Referências ao pnpm
# Remove arquivos e referências que fazem o Railway usar pnpm

Write-Host "🧹 LIMPANDO REFERÊNCIAS AO PNPM" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$removidos = @()
$corrigidos = @()

# 1. Remover pnpm-lock.yaml (se existir)
if (Test-Path "pnpm-lock.yaml") {
    Remove-Item "pnpm-lock.yaml" -Force
    $removidos += "✅ pnpm-lock.yaml removido"
    Write-Host "✅ pnpm-lock.yaml removido" -ForegroundColor Green
} else {
    Write-Host "ℹ️  pnpm-lock.yaml não encontrado (ok)" -ForegroundColor Gray
}

# 2. Verificar e corrigir railway.json
if (Test-Path "railway.json") {
    $content = Get-Content "railway.json" -Raw
    $original = $content
    
    # Substituir pnpm por npm
    $content = $content -replace "pnpm install", "npm install"
    $content = $content -replace "pnpm run build", "npm run build"
    $content = $content -replace "pnpm build", "npm run build"
    $content = $content -replace "pnpm start", "npm start"
    
    if ($content -ne $original) {
        Set-Content "railway.json" -Value $content -NoNewline
        $corrigidos += "✅ railway.json corrigido"
        Write-Host "✅ railway.json corrigido" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  railway.json já está correto" -ForegroundColor Gray
    }
}

# 3. Verificar e corrigir Procfile
if (Test-Path "Procfile") {
    $content = Get-Content "Procfile" -Raw
    $original = $content
    
    $content = $content -replace "pnpm", "npm"
    
    if ($content -ne $original) {
        Set-Content "Procfile" -Value $content -NoNewline
        $corrigidos += "✅ Procfile corrigido"
        Write-Host "✅ Procfile corrigido" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  Procfile já está correto" -ForegroundColor Gray
    }
}

# 4. Verificar package.json (apenas avisar, não corrigir automaticamente)
if (Test-Path "package.json") {
    $content = Get-Content "package.json" -Raw
    if ($content -match '"start"\s*:\s*"[^"]*pnpm[^"]*"') {
        Write-Host "⚠️  package.json: script 'start' contém 'pnpm' - verifique manualmente" -ForegroundColor Yellow
    } else {
        Write-Host "ℹ️  package.json está correto" -ForegroundColor Gray
    }
}

# 5. Garantir que .npmrc existe e está correto
if (Test-Path ".npmrc") {
    $current = Get-Content ".npmrc" -Raw
    if ($current -notmatch "package-manager=npm") {
        Add-Content ".npmrc" -Value "`npackage-manager=npm"
        $corrigidos += "✅ .npmrc atualizado"
        Write-Host "✅ .npmrc atualizado" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  .npmrc já está correto" -ForegroundColor Gray
    }
} else {
    $npmrcContent = "# Force npm to be used, not pnpm`npackage-manager=npm"
    Set-Content ".npmrc" -Value $npmrcContent
    $corrigidos += "✅ .npmrc criado"
    Write-Host "✅ .npmrc criado" -ForegroundColor Green
}

# RESUMO
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📊 RESUMO DA LIMPEZA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($removidos.Count -gt 0) {
    Write-Host "🗑️  ARQUIVOS REMOVIDOS:" -ForegroundColor Yellow
    foreach ($r in $removidos) {
        Write-Host "   $r" -ForegroundColor Yellow
    }
    Write-Host ""
}

if ($corrigidos.Count -gt 0) {
    Write-Host "✅ ARQUIVOS CORRIGIDOS:" -ForegroundColor Green
    foreach ($c in $corrigidos) {
        Write-Host "   $c" -ForegroundColor Green
    }
    Write-Host ""
}

if ($removidos.Count -eq 0 -and $corrigidos.Count -eq 0) {
    Write-Host "✅ Nada para limpar - tudo já está correto!" -ForegroundColor Green
    Write-Host ""
}

Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "   1. Execute: .\verificar-railway.ps1 (para verificar tudo)" -ForegroundColor White
Write-Host "   2. Verifique o dashboard do Railway (Settings → Service)" -ForegroundColor White
Write-Host "   3. Remova qualquer configuração manual com 'pnpm'" -ForegroundColor White
Write-Host "   4. Faça commit e push:" -ForegroundColor White
Write-Host "      git add ." -ForegroundColor Gray
Write-Host "      git commit -m 'fix: remove pnpm e força npm'" -ForegroundColor Gray
Write-Host "      git push" -ForegroundColor Gray

