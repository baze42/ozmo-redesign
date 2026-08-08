import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const root = join(process.cwd(), 'dist');
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

function resolveRequestPath(url = '/') {
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

const server = createServer((request, response) => {
  const { filePath, status } = resolveRequestPath(request.url);
  const type = contentTypes[extname(filePath)] || 'application/octet-stream';

  response.writeHead(status, { 'content-type': type });
  createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Serving dist at http://${host}:${port}/`);
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
  });
}
