const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const assets = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/src/uiEntry.js', ['src/uiEntry.js', 'text/javascript; charset=utf-8']],
  ['/src/components/UiDemo.js', ['src/components/UiDemo.js', 'text/javascript; charset=utf-8']],
  ['/src/components/OrderHistory.js', ['src/components/OrderHistory.js', 'text/javascript; charset=utf-8']],
  ['/src/services/orderHistory.js', ['src/services/orderHistory.js', 'text/javascript; charset=utf-8']],
  ['/src/theme.css', ['src/theme.css', 'text/css; charset=utf-8']],
]);

const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end('Method not allowed');
    return;
  }

  if (pathname === '/health') {
    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('ok');
    return;
  }

  const asset = assets.get(pathname);
  if (!asset) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  const [relativePath, contentType] = asset;
  fs.readFile(path.join(__dirname, relativePath), (error, content) => {
    if (error) {
      console.error(`Failed to serve ${relativePath}:`, error);
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Failed to load page');
      return;
    }

    response.writeHead(200, {
      'Content-Type': contentType,
      'X-Content-Type-Options': 'nosniff',
    });
    response.end(request.method === 'HEAD' ? undefined : content);
  });
});

const port = Number.parseInt(process.env.PORT || '3000', 10);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid PORT: ${process.env.PORT}`);
}

server.listen(port, '0.0.0.0', () => {
  console.log(`Canteen UI listening on port ${port}`);
});
