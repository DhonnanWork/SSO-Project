# frontend/Dockerfile

# Gunakan base image Node.js
FROM node:20-alpine

# Set direktori kerja di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Install dependensi
RUN npm install

# Salin sisa file proyek
COPY . .

# Buka port 3000
EXPOSE 3000

# Perintah untuk menjalankan dev server Vite
# Flag '--host' penting agar server bisa diakses dari luar container
CMD ["npm", "run", "dev", "--", "--host"]