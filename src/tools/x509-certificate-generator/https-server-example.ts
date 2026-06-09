/* eslint-disable no-console */
/**
 * HTTPS Server Example
 *
 * This is an example demonstrating how to use the generated X509 certificate
 * in a Node.js HTTPS server.
 *
 * Usage:
 * 1. Generate a certificate using the X509 Certificate Generator tool
 * 2. Save the certificate as 'certificate.crt' and private key as 'privateKey.key'
 * 3. Create a 'cert' folder in your project root
 * 4. Place the files in the cert folder
 * 5. Run this file with: ts-node https-server-example.ts
 * 6. Access the server at: https://localhost:8443
 *
 * Note: Since this is a self-signed certificate, your browser will show a security warning.
 * You can proceed safely for development/testing purposes.
 */

import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';

const PORT = 8443;

// Certificate and private key file paths (modify as needed)
const crtPath = path.join(__dirname, 'cert/certificate.crt');
const keyPath = path.join(__dirname, 'cert/privateKey.key');

const options: https.ServerOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(crtPath),
};

const server = https.createServer(options, (req, res) => {
  const { method, url } = req;

  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(
    JSON.stringify(
      {
        code: 0,
        message: 'HTTPS server is running',
        method,
        url,
      },
      null,
      2,
    ),
  );
});

server.listen(PORT, () => {
  console.log(`HTTPS server: https://localhost:${PORT}`);
  console.log(`Certificate: ${crtPath}`);
  console.log(`Private Key: ${keyPath}`);
  console.log('\nNote: Your browser will show a security warning because this is a self-signed certificate.');
  console.log('This is normal for development/testing purposes.');
});
