Proyek Demo LDAP & OAuth 2.0 dengan Keycloak & Docker

Proyek ini mendemonstrasikan alur otentikasi dan otorisasi lengkap menggunakan OpenLDAP sebagai user store dan Keycloak sebagai Identity Provider (OAuth 2.0/OIDC). Aplikasi terdiri dari frontend React dan backend Node.js (Express), yang semuanya diorkestrasi menggunakan Docker Compose.

Prasyarat

Git

Docker & Docker Compose

Langkah-Langkah Menjalankan Proyek

Clone Repositori

code
Bash
download
content_copy
expand_less
git clone [URL_GITHUB_ANDA]
cd [NAMA_FOLDER_PROYEK]

Jalankan Semua Layanan dengan Docker

code
Bash
download
content_copy
expand_less
docker compose up --build -d

Perintah ini akan membangun image Docker untuk frontend dan backend, lalu menjalankan semua kontainer (OpenLDAP, Keycloak, Backend, Frontend) di background.

Langkah-Langkah Konfigurasi Manual Keycloak

Setelah semua kontainer berjalan, Anda harus mengonfigurasi Keycloak secara manual. Proses ini mensimulasikan setup dunia nyata.

Buka Keycloak Admin Console di browser: http://localhost:8080

Login dengan kredensial berikut:

Username: admin

Password: admin

A. Buat Realm

Sebuah Realm adalah ruang terisolasi untuk mengelola pengguna dan aplikasi.

Arahkan kursor ke tulisan master di pojok kiri atas dan klik Create Realm.

Realm name: myrealm.

Klik Create.

B. Konfigurasi User Federation (LDAP)

Hubungkan Keycloak ke database pengguna OpenLDAP.

Pastikan Anda berada di realm myrealm.

Dari menu kiri, klik User Federation.

Klik Add provider... dan pilih ldap.

Isi form dengan detail berikut:

Connection URL: ldap://openldap:389 (gunakan nama service Docker, bukan localhost)

Users DN: ou=users,dc=mycompany,dc=com

Authentication Type: simple

Bind DN: cn=admin,dc=mycompany,dc=com

Bind Credential: adminpassword

Gulir ke bawah dan klik Test connection. Anda harus melihat notifikasi sukses berwarna hijau.

Klik Test authentication. Masukkan username john.doe dan password password123. Anda harus melihat notifikasi sukses.

Save konfigurasi.

Setelah disimpan, pergi ke tab Mappers dan klik tombol Sync LDAP Users to Keycloak untuk memastikan pengguna disinkronkan.

C. Buat Klien Frontend

Klien ini merepresentasikan aplikasi React Anda.

Dari menu kiri, klik Clients -> Create client.

Isi detail berikut:

Client ID: my-frontend-client

Valid Redirect URIs: http://localhost:3000/*

Save.

D. Buat Klien Backend

Klien ini merepresentasikan API Node.js Anda yang akan memvalidasi token.

Dari menu kiri, klik Clients -> Create client.

Client ID: my-backend-client.

Save.

Di halaman detail klien, matikan toggle switch untuk Client authentication. Ini mengaturnya sebagai klien publik (bearer-only).

Save.

E. Buat Audience Mapper

Ini adalah langkah krusial untuk mengizinkan token dari frontend digunakan di backend.

Pergi ke Clients -> my-frontend-client.

Klik tab Client scopes.

Klik nama scope di dalam tabel: my-frontend-client-dedicated.

Klik tab Mappers.

Klik Add mapper -> By configuration.

Dari daftar, pilih Audience.

Isi form mapper:

Name: backend-audience

Included Client Audience: Pilih my-backend-client dari dropdown.

Pastikan Add to access token dalam keadaan On.

Save.

F. Perbarui Public Key di Backend

Setiap instalasi Keycloak menghasilkan kunci yang unik. Anda harus menyalin kunci ini ke konfigurasi backend.

Di Keycloak, pergi ke Realm Settings -> tab Keys.

Di dalam tabel, temukan baris dengan algoritma RS256 dan klik tombol Public key di sebelah kanan.

Salin seluruh string kunci yang muncul di dialog.

Buka file backend/server.js di proyek Anda.

Tempel kunci yang baru disalin ke dalam nilai "realm-public-key".

Simpan file. Lalu restart kontainer backend agar memuat kunci baru:

code
Bash
download
content_copy
expand_less
docker compose restart backend
Cara Menggunakan Aplikasi

Buka aplikasi frontend di browser: http://localhost:3000.

Klik Login. Anda akan diarahkan ke halaman login Keycloak.

Masukkan kredensial pengguna LDAP:

Username: john.doe

Password: password123

Setelah berhasil login dan kembali ke aplikasi, klik tombol "Panggil API Terproteksi".

Anda akan melihat pesan sukses dari backend: "SELAMAT! Anda berhasil mengakses data terproteksi!".
