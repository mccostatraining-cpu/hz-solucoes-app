# 🔍 Script de Verificação para Deploy no Railway
# Verifica todas as configurações e identifica problemas

Write-Host "🔍 VERIFICANDO CONFIGURAÇÕES DO RAILWAY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$erros = @()
$avisos = @()
$sucessos = @()

# 1. Verificar railway.json
Write-Host "📄 Verificando railway.json..." -ForegroundColor Yellow
if (Test-Path "railway.json") {
    $railwayJson = Get-Content "railway.json" -Raw | ConvertFrom-Json
    $buildCmd = $railwayJson.build.buildCommand
    $startCmd = $railwayJson.deploy.startCommand
    
    if ($buildCmd -match "pnpm") {
        $erros += "❌ railway.json: buildCommand contém 'pnpm'"
    } elseif ($buildCmd -match "npm") {
        $sucessos += "✅ railway.json: buildCommand usa 'npm'"
    }
    
    if ($startCmd -match "pnpm") {
        $erros += "❌ railway.json: startCommand contém 'pnpm'"
    } elseif ($startCmd -match "npm") {
        $sucessos += "✅ railway.json: startCommand usa 'npm'"
    }
    
    if ($railwayJson.deploy.healthcheckPath -ne "/health") {
        $avisos += "⚠️  railway.json: healthcheckPath não é '/health'"
    } else {
        $sucessos += "✅ railway.json: healthcheckPath configurado corretamente"
    }
} else {
    $erros += "❌ railway.json não encontrado"
}

# 2. Verificar Procfile
Write-Host "📄 Verificando Procfile..." -ForegroundColor Yellow
if (Test-Path "Procfile") {
    $procfile = Get-Content "Procfile"
    if ($procfile -match "pnpm") {
        $erros += "❌ Procfile: contém 'pnpm'"
    } elseif ($procfile -match "npm") {
        $sucessos += "✅ Procfile: usa 'npm'"
    }
} else {
    $avisos += "⚠️  Procfile não encontrado (opcional)"
}

# 3. Verificar package.json
Write-Host "📄 Verificando package.json..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    $startScript = $packageJson.scripts.start
    
    if ($startScript -match "pnpm") {
        $erros += "❌ package.json: script 'start' contém 'pnpm'"
    } elseif ($startScript -match "npm") {
        $avisos += "⚠️  package.json: script 'start' contém 'npm' (deveria ser apenas 'node')"
    } else {
        $sucessos += "✅ package.json: script 'start' correto"
    }
    
    # Verificar se tem package-lock.json (indica npm)
    if (Test-Path "package-lock.json") {
        $sucessos += "✅ package-lock.json encontrado (usando npm)"
    } else {
        $avisos += "⚠️  package-lock.json não encontrado"
    }
    
    # Verificar se tem pnpm-lock.yaml (problema!)
    if (Test-Path "pnpm-lock.yaml") {
        $erros += "❌ pnpm-lock.yaml encontrado! Delete este arquivo - ele faz o Railway detectar pnpm"
    }
} else {
    $erros += "❌ package.json não encontrado"
}

# 4. Verificar nixpacks.toml
Write-Host "📄 Verificando nixpacks.toml..." -ForegroundColor Yellow
if (Test-Path "nixpacks.toml") {
    $nixpacks = Get-Content "nixpacks.toml" -Raw
    if ($nixpacks -match "pnpm") {
        $avisos += "⚠️  nixpacks.toml: contém referências a 'pnpm' nos comentários (ok, mas verifique os comandos)"
    }
    if ($nixpacks -match "cmd\s*=\s*[\"']pnpm") {
        $erros += "❌ nixpacks.toml: comandos usando 'pnpm'"
    } elseif ($nixpacks -match "cmd\s*=\s*[\"']npm") {
        $sucessos += "✅ nixpacks.toml: comandos usando 'npm'"
    }
} else {
    $avisos += "⚠️  nixpacks.toml não encontrado (opcional se usar RAILPACK)"
}

# 5. Verificar .npmrc
Write-Host "📄 Verificando .npmrc..." -ForegroundColor Yellow
if (Test-Path ".npmrc") {
    $npmrc = Get-Content ".npmrc" -Raw
    if ($npmrc -match "package-manager=npm") {
        $sucessos += "✅ .npmrc: força uso do npm"
    } else {
        $avisos += "⚠️  .npmrc: não força uso do npm explicitamente"
    }
} else {
    $avisos += "⚠️  .npmrc não encontrado (criado automaticamente)"
}

# 6. Verificar arquivos de build
Write-Host "📄 Verificando arquivos de build..." -ForegroundColor Yellow
if (Test-Path "dist-server/index.js") {
    $sucessos += "✅ dist-server/index.js encontrado (build do servidor OK)"
} else {
    $avisos += "⚠️  dist-server/index.js não encontrado (execute 'npm run build' primeiro)"
}

if (Test-Path "dist-client") {
    $sucessos += "✅ dist-client encontrado (build do cliente OK)"
} else {
    $avisos += "⚠️  dist-client não encontrado (execute 'npm run build' primeiro)"
}

# 7. Verificar server/_core/index.ts
Write-Host "📄 Verificando server/_core/index.ts..." -ForegroundColor Yellow
if (Test-Path "server/_core/index.ts") {
    $indexTs = Get-Content "server/_core/index.ts" -Raw
    if ($indexTs -match 'app\.get\(["\']/health["\']') {
        $sucessos += "✅ Endpoint /health configurado no servidor"
    } else {
        $erros += "❌ Endpoint /health não encontrado no servidor"
    }
    
    if ($indexTs -match 'process\.env\.PORT') {
        $sucessos += "✅ Servidor usa process.env.PORT"
    } else {
        $erros += "❌ Servidor não usa process.env.PORT"
    }
} else {
    $erros += "❌ server/_core/index.ts não encontrado"
}

# 8. Buscar referências a pnpm em todos os arquivos de configuração
Write-Host "🔍 Buscando referências a 'pnpm' em arquivos de configuração..." -ForegroundColor Yellow
$configFiles = @("railway.json", "Procfile", "package.json", "nixpacks.toml", "railway.toml", "start.sh")
foreach ($file in $configFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        if ($content -match "pnpm\s+(install|build|start|run)") {
            $erros += "❌ $file: contém comando 'pnpm' (linha com comando executável)"
        }
    }
}

# RESUMO
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📊 RESUMO DA VERIFICAÇÃO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($sucessos.Count -gt 0) {
    Write-Host "✅ SUCESSOS ($($sucessos.Count)):" -ForegroundColor Green
    foreach ($s in $sucessos) {
        Write-Host "   $s" -ForegroundColor Green
    }
    Write-Host ""
}

if ($avisos.Count -gt 0) {
    Write-Host "⚠️  AVISOS ($($avisos.Count)):" -ForegroundColor Yellow
    foreach ($a in $avisos) {
        Write-Host "   $a" -ForegroundColor Yellow
    }
    Write-Host ""
}

if ($erros.Count -gt 0) {
    Write-Host "❌ ERROS ENCONTRADOS ($($erros.Count)):" -ForegroundColor Red
    foreach ($e in $erros) {
        Write-Host "   $e" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "🔧 AÇÕES NECESSÁRIAS:" -ForegroundColor Red
    Write-Host "   1. Corrija os erros acima" -ForegroundColor Red
    Write-Host "   2. Se encontrar 'pnpm-lock.yaml', DELETE este arquivo" -ForegroundColor Red
    Write-Host "   3. Verifique o dashboard do Railway (Settings → Service)" -ForegroundColor Red
    Write-Host "   4. Remova qualquer configuração manual que use 'pnpm'" -ForegroundColor Red
    exit 1
} else {
    Write-Host "✅ NENHUM ERRO CRÍTICO ENCONTRADO!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
    Write-Host "   1. Verifique o dashboard do Railway:" -ForegroundColor White
    Write-Host "      - Settings → Service → Build Command (deve estar vazio ou usar npm)" -ForegroundColor Gray
    Write-Host "      - Settings → Service → Start Command (deve estar vazio ou usar npm)" -ForegroundColor Gray
    Write-Host "   2. Se houver configurações manuais com 'pnpm', DELETE ou altere para 'npm'" -ForegroundColor White
    Write-Host "   3. Faça commit e push:" -ForegroundColor White
    Write-Host "      git add ." -ForegroundColor Gray
    Write-Host "      git commit -m 'fix: configura Railway para usar npm'" -ForegroundColor Gray
    Write-Host "      git push" -ForegroundColor Gray
    Write-Host "   4. Se ainda não funcionar, delete o serviço no Railway e crie um novo" -ForegroundColor White
}

