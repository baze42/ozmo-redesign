import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { pathToFileURL } from 'node:url';

const port = Number(process.env.PORT || 4321);
const host = process.env.HOST || '127.0.0.1';

const contentTypes: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
};

export function resolveStaticRoot(cwd = process.cwd()) {
  const serverBuildStaticRoot = join(cwd, 'dist', 'client');

  if (existsSync(serverBuildStaticRoot)) {
    return serverBuildStaticRoot;
  }

  return join(cwd, 'dist');
}

export function resolveRequestPath(
  url = '/',
  options: { root?: string; host?: string; port?: number } = {},
) {
  const root = options.root ?? resolveStaticRoot();
  const host = options.host ?? '127.0.0.1';
  const port = options.port ?? 4321;
  const pathname = decodeURIComponent(new URL(url, `http://${host}:${port}`).pathname);
  const safePath = normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, '');
  const absolutePath = join(root, safePath);

  if (existsSync(absolutePath) && statSync(absolutePath).isFile()) {
    return { filePath: absolutePath, status: 200 };
  }

  const indexPath = join(absolutePath, 'index.html');
  if (existsSync(indexPath)) {
    return { filePath: indexPath, status: 200 };
  }

  return { filePath: join(root, '404.html'), status: 404 };
}

export function startStaticServer(options: { root?: string; host?: string; port?: number } = {}) {
  const root = options.root ?? resolveStaticRoot();
  const serverHost = options.host ?? host;
  const serverPort = options.port ?? port;
  const server = createServer((request, response) => {
    const { filePath, status } = resolveRequestPath(request.url, {
      root,
      host: serverHost,
      port: serverPort,
    });
    const type = contentTypes[extname(filePath)] || 'application/octet-stream';

    response.writeHead(status, { 'content-type': type });
    createReadStream(filePath).pipe(response);
  });

  server.listen(serverPort, serverHost, () => {
    console.log(`Serving dist at http://${serverHost}:${serverPort}/`);
  });

  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = startStaticServer();

  for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.on(signal, () => {
      server.close(() => process.exit(0));
    });
  }
}
