import { build } from 'esbuild';

// Build do servidor para produção (Railway):
// - Gera um único bundle CommonJS (index.cjs)
// - Mantém módulos nativos do Node como externos
// - Inclui os arquivos locais (oauth, context, vite, etc.) dentro do bundle

const nodeBuiltins = [
  'assert', 'buffer', 'child_process', 'cluster', 'console', 'constants',
  'crypto', 'dgram', 'dns', 'domain', 'events', 'fs', 'http', 'http2',
  'https', 'module', 'net', 'os', 'path', 'perf_hooks', 'process',
  'punycode', 'querystring', 'readline', 'repl', 'stream', 'string_decoder',
  'timers', 'tls', 'tty', 'url', 'util', 'v8', 'vm', 'worker_threads', 'zlib',
  'node:assert', 'node:buffer', 'node:child_process', 'node:cluster',
  'node:console', 'node:constants', 'node:crypto', 'node:dgram', 'node:dns',
  'node:domain', 'node:events', 'node:fs', 'node:http', 'node:http2',
  'node:https', 'node:module', 'node:net', 'node:os', 'node:path',
  'node:perf_hooks', 'node:process', 'node:punycode', 'node:querystring',
  'node:readline', 'node:repl', 'node:stream', 'node:string_decoder',
  'node:timers', 'node:tls', 'node:tty', 'node:url', 'node:util', 'node:v8',
  'node:vm', 'node:worker_threads', 'node:zlib'
];

build({
  entryPoints: ['server/_core/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: 'dist-server/index.cjs',
  external: nodeBuiltins
}).then(() => {
  console.log('Build completed successfully');
}).catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});

