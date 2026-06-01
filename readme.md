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
node seed-admin.js
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
├── bin/
│   └── www                 # Entry point utama untuk menjalankan server Node.js
├── src/
│   ├── config/             # Konfigurasi database & Sequelize
│   ├── helpers/            # Fungsi pembantu global (utility functions)
│   ├── middlewares/        # Middleware Express (misal: validasi auth/session)
│   ├── modules/            # Logika utama aplikasi (Dikelompokkan per-fitur/modul)
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── customer/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── service/        # Contoh struktur komponen di dalam satu modul:
│   │   │   ├── service.controller.js # Pintu gerbang utama yang ngatur request & response (render .hbs / kirim JSON)
│   │   │   ├── service.helper.js     # Fungsi pembantu lokal khusus modul ini (misal: format status)
│   │   │   ├── service.model.js      # Definisi tabel database (Sequelize model) untuk modul ini
│   │   │   ├── service.route.js      # Daftar URL / Endpoint khusus untuk modul ini
│   │   │   ├── service.service.js    # Tempat query database berat (pemisah antara controller dan model)
│   │   │   └── service.validation.js # Validasi input form data sebelum masuk ke controller
│   │   ├── service_history/
│   │   └── tracking/
│   ├── public/             # Aset statis frontend (CSS, JS client-side, gambar, favicon)
│   ├── routes/             # Routing sentral / penggabung route antar modul
│   ├── views/              # Template engine Handlebars (.hbs)
│   │   ├── errors/         # Halaman error (404, 500)
│   │   ├── layouts/        # Layout utama (auth, main, public)
│   │   └── pages/          # View/halaman spesifik berdasarkan modul
│   └── app.js              # Setup utama Express, middleware, & konfigurasi hbs
├── .env                    # File konfigurasi environment variable (rahasia)
├── package.json            # File manifest project & daftar dependensi npm
└── seed-admin.js           # Script untuk mengisi data awal (seeding) database
```
