#!/usr/bin/env node

// Script de start robusto para Railway
// Verifica se o arquivo existe e inicia o servidor com logs detalhados

const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('🚀 START SERVER SCRIPT');
console.log('========================================');
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);
console.log('PORT:', process.env.PORT || 'not set');

const serverFile = path.join(__dirname, 'dist-server', 'index.cjs');
console.log('Server file path:', serverFile);
console.log('Server file exists:', fs.existsSync(serverFile));

if (!fs.existsSync(serverFile)) {
  console.error('========================================');
  console.error('❌ ERROR: Server file not found!');
  console.error('========================================');
  console.error('Expected file:', serverFile);
  console.error('Current directory contents:');
  try {
    const files = fs.readdirSync(__dirname);
    console.error('Files in root:', files.filter(f => !f.startsWith('.')).join(', '));
  } catch (e) {
    console.error('Could not read directory:', e.message);
  }
  
  try {
    const distServerExists = fs.existsSync(path.join(__dirname, 'dist-server'));
    console.error('dist-server directory exists:', distServerExists);
    if (distServerExists) {
      const distFiles = fs.readdirSync(path.join(__dirname, 'dist-server'));
      console.error('Files in dist-server:', distFiles.join(', '));
    }
  } catch (e) {
    console.error('Could not read dist-server:', e.message);
  }
  
  process.exit(1);
}

console.log('✅ Server file found, starting...');
console.log('========================================');

// Garantir que o processo não termine
process.on('uncaughtException', (error) => {
  console.error('========================================');
  console.error('❌ UNCAUGHT EXCEPTION');
  console.error('========================================');
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  // Não sair - manter o processo vivo para debug
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('========================================');
  console.error('❌ UNHANDLED REJECTION');
  console.error('========================================');
  console.error('Reason:', reason);
  // Não sair - manter o processo vivo para debug
});

try {
  console.log('Requiring server file...');
  require(serverFile);
  console.log('✅ Server file required successfully');
  console.log('Server should be starting...');
  // Manter o processo vivo
  setInterval(() => {
    // Heartbeat para garantir que o processo não termine
  }, 60000);
} catch (error) {
  console.error('========================================');
  console.error('❌ ERROR STARTING SERVER');
  console.error('========================================');
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  console.error('Error name:', error.name);
  console.error('Error code:', error.code);
  
  // Tentar fallback com serve se disponível
  console.log('========================================');
  console.log('⚠️  Attempting fallback with serve...');
  console.log('========================================');
  try {
    const { spawn } = require('child_process');
    const serve = spawn('npx', ['serve', 'dist-client', '-s', '-p', process.env.PORT || '3000'], {
      stdio: 'inherit'
    });
    serve.on('error', (err) => {
      console.error('Serve also failed:', err);
      process.exit(1);
    });
  } catch (fallbackError) {
    console.error('Fallback also failed:', fallbackError);
    process.exit(1);
  }
}

