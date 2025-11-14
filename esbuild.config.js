import { build } from 'esbuild';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

// Lista de módulos nativos do Node que devem ser externalizados
const nodeBuiltins = [
  'node:events', 'node:fs', 'node:path', 'node:http', 'node:url', 'node:crypto',
  'node:stream', 'node:util', 'node:os', 'node:process', 'node:buffer',
  'node:querystring', 'node:net', 'node:tls', 'node:dns', 'node:zlib',
  'node:http2', 'node:perf_hooks', 'node:worker_threads', 'node:child_process',
  'node:cluster', 'node:dgram', 'node:readline', 'node:repl', 'node:string_decoder',
  'node:timers', 'node:tty', 'node:v8', 'node:vm', 'node:assert', 'node:console',
  'node:module', 'node:punycode', 'events', 'fs', 'path', 'http', 'url', 'crypto',
  'stream', 'util', 'os', 'process', 'buffer', 'querystring', 'net', 'tls', 'dns',
  'zlib', 'http2', 'perf_hooks', 'worker_threads', 'child_process', 'cluster',
  'dgram', 'readline', 'repl', 'string_decoder', 'timers', 'tty', 'v8', 'vm',
  'assert', 'console', 'module', 'punycode'
];

// Apenas algumas dependências específicas que devem ser externalizadas
// mysql2 e ws precisam ser externalizadas porque usam módulos nativos do Node
// IMPORTANTE: não externalizar imports relativos do projeto (./*) para que
// arquivos como ./oauth, ./context, ./vite etc. sejam empacotados no bundle.
const externalDeps = [
  'dotenv/config',
  'lightningcss',
  'vite',
  '@tailwindcss/*',
  '@babel/*',
  'mysql2', // Externalizar porque usa módulos nativos
  'ws'      // Externalizar porque usa módulos nativos
];

build({
  entryPoints: ['server/_core/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: 'dist-server/index.js',
  external: [...nodeBuiltins, ...externalDeps],
  alias: {
    '@shared': './shared'
  }
}).then(() => {
  console.log('Build completed successfully');
}).catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});

