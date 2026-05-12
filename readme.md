# 📑 TechService - Management System

TechService adalah sistem manajemen layanan servis perangkat elektronik (Laptop, Smartphone, Printer, dll) yang dirancang untuk mempercepat proses administrasi bengkel servis. Sistem ini mencatat data pelanggan, detail kerusakan unit, hingga pelacakan status servis secara real-time.

---

# 🚀 Fitur Utama

## Dashboard Analytics
Ringkasan jumlah unit masuk, proses, dan selesai.

## Smart Customer Search
Integrasi Tom Select untuk mencari pelanggan lama atau mendaftarkan pelanggan baru langsung dari satu kolom input.

## Auto-Fill Data
Nomor WhatsApp dan Email otomatis terisi ketika pelanggan lama dipilih.

## Live Validation
Sistem validasi real-time pada form untuk memastikan data yang masuk akurat (Format Email, No WA, Minimal Karakter, dll).

## Tracking Code Generator
Pembuatan kode unik otomatis untuk setiap unit servis.

---

# 🛠️ Prasyarat (Prerequisites)

Sebelum menjalankan proyek ini, pastikan sudah terinstall:

- Node.js (Versi 16.x atau lebih baru)
- MySQL atau MariaDB
- Git

---

# 📦 Instalasi

## Clone Repository

```bash
git clone https://github.com/nadiapd/capstone-project.git
cd capstone-project
```

## Install Dependencies

```bash
npm install
```

## Konfigurasi Environment

Salin file `.env.example` menjadi `.env` dan sesuaikan kredensial database masing-masing

## Setup Database

Buat database sesuai nama di `.env`, lalu jalankan migrasi database dan seed data admin:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

---

# 🏃 Cara Menjalankan

## Mode Pengembangan (Development)

Menggunakan nodemon agar server otomatis restart saat ada perubahan kode:

```bash
npm run dev
```

## Mode Produksi (Production)

```bash
npm start
```

Akses aplikasi melalui:

```txt
http://localhost:3000
```

---

# 📁 Struktur Folder

```bash
├── src/
│   ├── config/          # Konfigurasi database & Sequelize
│   ├── controllers/     # Logika aplikasi (Service, Customer, Dashboard, dll)
│   ├── helpers/         # Fungsi pembantu (Tracking code, Response. Render)
│   ├── public/
│   │   ├── css/         # Styling (Tailwind/Custom)
│   │   └── js/          # Script client-side (Validator.js, TomSelect init)
│   ├── routes/          # Definisi URL/Routing
│   ├── validation/      # Logic backend validatorjs
│   └── views/           # Template engine Handlebars (.hbs)
├── app.js               # Entry point aplikasi
└── .env                 # File rahasia konfigurasi
```
