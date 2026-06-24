# Maps Frontend

Aplikasi frontend pemetaan geografis interaktif yang dibangun menggunakan **Vue 3, Vite, Tailwind CSS, dan Leaflet**.

## Cara Penggunaan (Development)

1. Pastikan Anda telah menginstal Node.js.
2. Buka terminal di dalam folder `maps-frontend`.
3. Install dependensi dengan menjalankan:
   ```bash
   npm install
   ```
4. Jalankan server pengembangan (development server):
   ```bash
   npm run dev
   ```
5. Buka tautan URL lokal yang muncul di terminal (misal: `http://localhost:5173`) di browser Anda.

## Desain & Fungsi Halaman

Berikut adalah penjelasan dan gambaran desain dari setiap halaman/tampilan yang ada pada aplikasi:

### 1. Halaman Dashboard Utama
Halaman ini adalah halaman depan untuk pengguna yang menampilkan peta interaktif dengan titik-titik lokasi dan ringkasan data yang relevan.

![Dashboard Utama](gambar1.png)

- **Fungsi:** Menampilkan pemetaan lokasi secara komprehensif. Pengguna dapat berinteraksi dengan peta, melihat detail titik, dan melihat visualisasi informasi (grafik) dari data lokasi.

### 2. Halaman Basic Map
Halaman ini menyajikan tampilan peta secara lebih sederhana tanpa terlalu banyak elemen antarmuka tambahan.

![Basic Map](gambar2.png)

- **Fungsi:** Berfokus sepenuhnya pada navigasi peta dan penandaan titik, sangat berguna bagi pengguna yang hanya ingin fokus menjelajahi titik koordinat spasial tanpa gangguan visual lainnya.

### 3. Halaman Admin Dashboard
Panel kendali khusus untuk administrator.

![Admin Dashboard](gambar3.png)

- **Fungsi:** Menampilkan statistik keseluruhan data dalam bentuk grafik (menggunakan Chart.js) dan rekapitulasi data poin di database. Admin dapat memantau aktivitas, total lokasi, serta manajemen data.

### 4. Halaman Manajemen Kategori
Halaman untuk mengatur berbagai jenis atau kategori dari lokasi/POI (Point of Interest).

![Category Manager](gambar4.png)

- **Fungsi:** Memungkinkan admin untuk menambah, mengubah (edit), atau menghapus kategori lokasi (seperti Rumah Sakit, Sekolah, dsb), lengkap dengan pengaturan warna dan ikon penanda di peta.

### 5. Halaman Form Lokasi
Halaman untuk mengisi atau mengedit informasi detail dari suatu titik koordinat.

![Location Form](gambar5.png)

- **Fungsi:** Berisi formulir input untuk merekam data nama tempat, koordinat (lat/lng), alamat, foto lokasi, jam operasional, dan deksripsi. Halaman ini digunakan baik untuk penambahan data baru maupun modifikasi data yang sudah ada.
