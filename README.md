# OSCE Assessment System

Sistem Penilaian Objective Structured Clinical Examination (OSCE) professional untuk Universitas. Dibangun dengan Next.js 14, TypeScript, Tailwind CSS, dan Supabase.

## Fitur Utama

- **Admin Dashboard**: Manajemen data Ujian, Peserta (Mahasiswa & Dosen), Rubrik, dan Stase.
- **Rekap Nilai**: Tabel pivot nilai mahasiswa per stase dengan fitur ekspor ke Excel (.xlsx).
- **Examiner Flow**: Alur penilaian yang mobile-friendly bagi penguji dengan akses kode ujian.
- **Scoring Engine**: Perhitungan skor ternormalisasi (0-100) berdasarkan bobot dan skala tiap item rubrik.
- **Security**: Autentikasi Admin dan Row Level Security (RLS) pada database Supabase.
- **Localization**: Antarmuka 100% dalam Bahasa Indonesia.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & shadcn/ui
- **Database & Auth**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Export**: xlsx

## Persiapan Database (Supabase)

1. Buat proyek baru di [Supabase](https://supabase.com/).
2. Buka tab **SQL Editor** di Dashboard Supabase.
3. Salin dan jalankan isi dari file `schema.sql` yang tersedia di root proyek ini.
4. Pergi ke **Settings > API** untuk mendapatkan `Project URL` dan `Anon Key`.
5. Untuk membuat Admin pertama kali:
   - Pergi ke **Authentication > Users**.
   - Klik **Add User > Create new user**.
   - Masukkan Email dan Password untuk Admin.

## Instalasi Lokal

1. Clone repositori ini.
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Buat file `.env.local` di root proyek dan isi dengan kredensial Supabase Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Jalankan aplikasi dalam mode pengembangan:
   ```bash
   npm run dev
   ```
5. Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Struktur Direktori

- `src/app`: Rute aplikasi (Next.js App Router)
- `src/components`: Komponen UI (termasuk shadcn/ui)
- `src/lib`: Utilitas dan konfigurasi klien Supabase
- `src/types`: Definisi tipe TypeScript dan skema database
- `src/middleware.ts`: Proteksi rute admin

## Panduan Deployment (Vercel)

1. Push kode Anda ke repositori GitHub.
2. Hubungkan repositori GitHub ke akun [Vercel](https://vercel.com/).
3. Masukkan Environment Variables (`NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`) di Dashboard Vercel.
4. Klik **Deploy**.

## Lisensi

&copy; 2024 OSCE Assessment System.
