#!/bin/bash

# ==============================================================================
# Script de Inicialização para Deploy no Railway (start.sh)
#
# Este script é projetado para ser o comando de inicialização principal (Start
# Command) em um serviço hospedado no Railway, especialmente em ambientes
# Nixpacks. Ele garante que as etapas críticas de pré-inicialização sejam
# executadas antes de iniciar o servidor de aplicação em modo de produção.
#
# ATENÇÃO: O usuário deve substituir os placeholders de migração e inicialização
# do servidor pelos comandos específicos do seu framework/aplicação.
# ==============================================================================

# 1. Configuração de Segurança e Robustez
# ------------------------------------------------------------------------------
# 'set -e' faz com que o script saia imediatamente se um comando falhar.
# 'set -u' trata variáveis não definidas como erro.
# 'set -o pipefail' garante que falhas em pipelines sejam detectadas.
set -euo pipefail

echo "Iniciando script de inicialização (start.sh)..."

# 2. Verificação de Variáveis de Ambiente Necessárias
# ------------------------------------------------------------------------------
# A variável PORT é geralmente fornecida pelo Railway.
# A variável DATABASE_URL é crucial para migrações.

echo "Verificando variáveis de ambiente críticas..."

if [ -z "${PORT}" ]; then
  echo "ERRO: Variável de ambiente PORT não está definida. O Railway deve fornecê-la."
  exit 1
fi

if [ -z "${DATABASE_URL}" ]; then
  echo "AVISO: Variável de ambiente DATABASE_URL não está definida."
  echo "AVISO: A aplicação pode não funcionar corretamente sem banco de dados."
else
  echo "DATABASE_URL detectada."
  echo "NOTA: As migrações do banco devem ser executadas manualmente antes do deploy."
  echo "NOTA: Use 'drizzle-kit push' ou execute as migrações SQL manualmente."
fi

# 4. Inicialização do Servidor em Modo Produção
# ------------------------------------------------------------------------------
# O comando final deve ser o processo de longa duração que mantém o serviço ativo.
# Use 'exec' para substituir o processo do shell pelo processo do servidor,
# garantindo que os sinais (como SIGTERM) sejam tratados corretamente pelo servidor.
# Certifique-se de que o servidor esteja configurado para escutar na porta $PORT.

echo "Iniciando servidor de aplicação em modo de produção na porta ${PORT}..."

# SUBSTITUA o comando abaixo pelo comando de inicialização do seu servidor.
# Exemplos:
# - Python/Gunicorn: exec gunicorn myapp.wsgi:application --bind 0.0.0.0:$PORT --workers 4 --log-level info
# - Node.js/Express: exec node server.js
# - Node.js/PM2: exec pm2-runtime start dist/server.js --name my-app

# Iniciar servidor Node.js em modo produção
exec node dist-server/index.cjs
