import { build } from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  'node:vm', 'node:worker_threads', 'node:zlib',
  // Módulos opcionais e nativos que devem ser externos
  'dotenv/config',
  'dotenv',
  'esbuild',
  'lightningcss',
  'vite'
];

// Plugin para resolver aliases @shared/*
const aliasPlugin = {
  name: 'alias',
  setup(build) {
    build.onResolve({ filter: /^@shared/ }, (args) => {
      let resolvedPath = args.path;
      
      // Resolver @shared/const -> ./shared/const.ts
      if (resolvedPath === '@shared/const') {
        return { path: path.resolve(__dirname, './shared/const.ts') };
      }
      
      // Resolver @shared/_core/errors -> ./shared/_core/errors.ts
      if (resolvedPath === '@shared/_core/errors') {
        return { path: path.resolve(__dirname, './shared/_core/errors.ts') };
      }
      
      // Resolver @shared/* -> ./shared/*
      if (resolvedPath.startsWith('@shared/')) {
        const relativePath = resolvedPath.replace('@shared/', '');
        return { path: path.resolve(__dirname, './shared', relativePath + '.ts') };
      }
      
      return null;
    });
  },
};

// Plugin para substituir import.meta.url por __dirname em CommonJS
const importMetaPlugin = {
  name: 'import-meta-polyfill',
  setup(build) {
    build.onLoad({ filter: /vite\.ts$/ }, async (args) => {
      const contents = await readFile(args.path, 'utf8');
      // Substituir import.meta.url por uma versão compatível com CJS
      // Em CJS, __filename já existe, então podemos usar path.dirname(__filename)
      const modified = contents
        .replace(
          /const __dirname = fileURLToPath\(new URL\('\.', import\.meta\.url\)\);/g,
          "const __dirname = path.dirname(__filename);"
        )
        // Remover import de fileURLToPath se não for mais usado
        .replace(/import \{ fileURLToPath \} from ["']url["'];?\n/g, '');
      return { contents: modified, loader: 'ts' };
    });
  },
};

build({
  entryPoints: ['server/_core/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: 'dist-server/index.cjs',
  external: nodeBuiltins,
  plugins: [aliasPlugin, importMetaPlugin],
  // Ignorar avisos sobre require.resolve e globs vazios
  logOverride: {
    'require-resolve-not-external': 'silent',
    'empty-glob': 'silent',
  }
}).then(() => {
  console.log('Build completed successfully');
}).catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});

