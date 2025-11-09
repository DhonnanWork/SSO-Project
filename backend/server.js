// backend/server.js (KONFIGURASI FINAL DAN PASTI BENAR)
const express = require('express');
const cors = require('cors');
const Keycloak = require('keycloak-connect');

const app = express();
app.use(cors());

const keycloakConfig = {
  "realm": "myrealm",
  // URL ini HARUS 'localhost' agar cocok dengan issuer di token
  "auth-server-url": "http://localhost:8080/",
  "ssl-required": "none",
  "resource": "my-backend-client",
  "bearer-only": true,
  // Kunci publik Anda yang sudah dikonfirmasi
  "realm-public-key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkNRC24vjyy3u/8npJsS/fyfaYRXPxy6u/JX1wKIXC36yJusSNN0SlAeJKoNKGk5LCF3ISBqyjm3yk0QzO3IaChCj3FT9HQGz7u821XUAhkwQQ5TlBFnjJmNCezg+Z5Lp39YcFp1MYy/XiHgwDmjJUxDyMOkltv1Qd0rDQL4P22YzCGISBEqpl1vO+Hg+8UsDGbJKyRlei1VsjUj9roiKfG5j+w+aoW/eKxE+2L/WsID/afHsqK8esBjdG1mfqCXBdceFGCnt3uR/uEFttuR9rlfgr/KKS68ySsJMSM6FB7mHYp/MUzEFIFjzOZ9FnlPClAOQrQ0iVJ+MpVTXSqQTPwIDAQAB"
};

const keycloak = new Keycloak({}, keycloakConfig);

app.use(keycloak.middleware());

app.get('/api/public', (req, res) => {
  res.json({ message: 'Ini adalah data publik.' });
});

app.get('/api/protected', keycloak.protect(), (req, res) => {
  res.json({ message: 'SELAMAT! Anda berhasil mengakses data terproteksi!' });
});

app.listen(5001, () => {
  console.log('Backend berjalan di port 5001');
});