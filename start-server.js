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

try {
  require(serverFile);
} catch (error) {
  console.error('========================================');
  console.error('❌ ERROR STARTING SERVER');
  console.error('========================================');
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}

