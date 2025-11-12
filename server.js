const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');
const mimeTypes = {
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.css': 'text/css',
	'.json': 'application/json',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml',
	'.txt': 'text/plain'
};
async function serveFile(filePath, res) {
	const ext = path.extname(filePath);
	const contentType = mimeTypes[ext] || 'application/octet-stream';

	fs.readFile(filePath, (err, data) => {
		if (err) {
			res.writeHead(500, { 'Content-Type': 'text/plain' });
			res.end('Server error');
			return;
		}

		res.writeHead(200, { 'Content-Type': contentType });
		res.end(data);
	});
}
const server = http.createServer((req, res) => {
	const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
	let pathname = path.join(path.resolve('.'), parsedUrl.pathname);

	fs.stat(pathname, (err, stats) => {
		if (err) {
			res.writeHead(404, { 'Content-Type': 'text/html' });
			res.end('');
			return;
		}

		if (stats.isDirectory()) {
			pathname = path.join(pathname, 'index.html');
			fs.stat(pathname, (err, stats) => {
				if (err || !stats.isFile()) {
					res.writeHead(404, { 'Content-Type': 'text/html' });
					res.end('');
					return;
				}
				serveFile(pathname, res);
			});
		}

		else if (stats.isFile()) {
			serveFile(pathname, res);
		}

		else {
			res.writeHead(404, { 'Content-Type': 'text/html' });
			res.end('');
		}
	});
});

server.listen(2025, () => {});