// frontend/src/App.jsx (VERSI FINAL)

import React, { useState, useEffect, useRef } from 'react';
import Keycloak from 'keycloak-js';
import axios from 'axios';
import './App.css';

// frontend/src/App.jsx
const keycloak = new Keycloak({
  url: 'http://localhost:8080', // <-- UBAH KEMBALI KE INI
  realm: 'myrealm',
  clientId: 'my-frontend-client',
});

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [protectedData, setProtectedData] = useState('');
  const [loading, setLoading] = useState(false);
  const hasInitialized = useRef(false); // Gunakan ref untuk mencegah inisialisasi ganda

  useEffect(() => {
    if (hasInitialized.current) return; // Jika sudah diinisialisasi, jangan jalankan lagi
    hasInitialized.current = true;      // Tandai bahwa proses inisialisasi akan berjalan

    keycloak.init({ onLoad: 'check-sso' })
      .then(auth => {
        setAuthenticated(auth);
        if (auth) {
          console.log("Token Akses:", keycloak.token);
        }
      })
      .catch(error => {
        console.error("Inisialisasi Keycloak GAGAL. Ini error dari frontend.", error);
      });
  }, []);

  const fetchProtectedData = () => {
    setLoading(true);
    setProtectedData('Memuat data...');

    axios.get('http://localhost:5001/api/protected', {
      headers: {
        'Authorization': `Bearer ${keycloak.token}`
      }
    })
    .then(response => {
      setProtectedData(response.data.message);
    })
    .catch(error => {
      if (error.response) {
        setProtectedData(`Error ${error.response.status}: ${error.response.data.message || 'Akses Ditolak dari Backend'}`);
      } else {
        setProtectedData(`Error Jaringan: ${error.message}`);
      }
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tugas Demo LDAP & OAuth 2.0</h1>
        {!authenticated && (
          <button className="button" onClick={() => keycloak.login()}>
            Login
          </button>
        )}
        {authenticated && (
          <div>
            <p>Anda telah berhasil login!</p>
            <button className="button logout" onClick={() => keycloak.logout()}>
              Logout
            </button>
            <hr />
            <button className="button api" onClick={fetchProtectedData} disabled={loading}>
              {loading ? 'Memuat...' : 'Panggil API Terproteksi'}
            </button>
            {protectedData && (
              <div className="api-response">
                <p>Respon dari Backend:</p>
                <strong>{protectedData}</strong>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;