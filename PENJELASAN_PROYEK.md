# Penjelasan Proyek: Sistem Penilaian OSCE

Halo! Selamat datang di proyek **OSCE Assessment System** (Sistem Penilaian *Objective Structured Clinical Examination*). Saya mengerti Anda adalah seorang developer pemula, jadi saya akan menjelaskan struktur proyek, modul, teknologi yang digunakan, serta konsep-konsep penting dalam bahasa yang mudah dipahami.

---

## 1. Apa itu Proyek Ini?

Proyek ini adalah sebuah aplikasi web yang digunakan untuk mengelola ujian **OSCE** (ujian praktik/klinis) di universitas, seperti fakultas kedokteran atau keperawatan.

Di dalam sistem ini, ada dua peran utama:
1.  **Admin (Dosen/Staf):** Mereka bertugas membuat jadwal ujian, mengatur data mahasiswa (peserta), dosen penguji, stase (pos ujian/prasat), dan membuat rubrik penilaian.
2.  **Dosen Penguji (Examiner):** Mereka bertugas memberikan nilai kepada mahasiswa yang sedang diuji pada stase tertentu menggunakan perangkat mereka (hp atau tablet), berdasarkan rubrik yang sudah disiapkan oleh admin.

---

## 2. Tech Stack (Teknologi yang Digunakan)

Proyek ini dibangun menggunakan teknologi modern yang sangat populer saat ini:

*   **Next.js 14 (App Router):** Ini adalah framework dari React.js. Next.js digunakan untuk membangun antarmuka pengguna (UI) dan mengatur *routing* (perpindahan antar halaman web). Proyek ini menggunakan fitur terbaru Next.js yaitu *App Router* yang menggunakan direktori `src/app`.
*   **TypeScript:** Ini adalah bahasa pemrograman JavaScript yang ditambahkan fitur "tipe data". TypeScript membantu mencegah error (bug) saat kita menulis kode karena ia akan mengingatkan kita jika tipe data yang digunakan tidak sesuai.
*   **Tailwind CSS:** Ini adalah *framework* CSS. Alih-alih menulis kode CSS yang panjang, kita menggunakan nama *class* (seperti `bg-blue-500` untuk membuat latar belakang biru) langsung di elemen HTML untuk mendesain tampilan.
*   **shadcn/ui & Radix UI:** Ini adalah kumpulan komponen desain (seperti tombol, form, modal) yang sudah jadi dan terlihat profesional. Komponen ini dapat kita gunakan dan sesuaikan untuk membangun antarmuka dengan cepat.
*   **Supabase (PostgreSQL & Auth):** Ini adalah *Backend as a Service* (BaaS). Supabase berfungsi sebagai **Database** (menyimpan data ujian, mahasiswa, nilai menggunakan sistem PostgreSQL) dan **Autentikasi** (mengurus sistem login aman untuk Admin). Supabase juga memiliki fitur **Row Level Security (RLS)** untuk mengatur siapa yang boleh melihat/mengubah data tertentu.
*   **Lucide React:** Ini adalah kumpulan ikon yang digunakan untuk mempercantik tampilan aplikasi (seperti ikon pensil untuk edit, ikon tempat sampah untuk hapus).
*   **xlsx:** *Library* (pustaka) JavaScript yang digunakan untuk mengekspor (mengunduh) data nilai mahasiswa dalam bentuk file Excel (`.xlsx`).

---

## 3. Struktur Direktori Proyek

Agar kode rapi, proyek ini dipecah ke dalam beberapa folder (direktori) utama di dalam folder `src/`:

*   **`src/app/`**: Ini adalah pusat dari Next.js (App Router). Semua halaman web ada di sini.
    *   Jika Anda membuat folder `src/app/admin/`, maka halamannya bisa diakses di browser melalui URL `namawesbite.com/admin`.
*   **`src/components/`**: Tempat menyimpan bagian-bagian UI yang bisa dipakai ulang (*reusable components*). Contohnya tombol, tabel, atau kotak *alert*. Komponen dari `shadcn/ui` juga tersimpan di sini.
*   **`src/lib/`**: Tempat menyimpan utilitas atau fungsi pembantu, serta konfigurasi khusus. Misalnya, kode untuk menghubungkan proyek ke Supabase disimpan di sini.
*   **`src/types/`**: Tempat menyimpan definisi "tipe data" TypeScript. Ini seperti cetak biru (blueprint) agar TypeScript tahu bentuk data dari database (misal: "data Mahasiswa itu terdiri dari nama, ID, dan role").
*   **`src/middleware.ts`**: Ini adalah kode yang akan dijalankan *sebelum* sebuah halaman dimuat. Dalam proyek ini, middleware digunakan untuk **keamanan**; misalnya memastikan hanya Admin yang sudah login yang bisa membuka halaman di rute `/admin/*`.

---

## 4. Struktur Database (Schema)

Sistem ini menyimpan data ke Supabase (PostgreSQL). Berikut adalah tabel-tabel utamanya (seperti lembar kerja di Excel):

1.  **`exams` (Ujian):** Menyimpan data jadwal ujian dan *access code* (kode akses) yang nantinya digunakan oleh penguji.
2.  **`participants` (Peserta):** Menyimpan daftar orang yang terlibat, baik `student` (mahasiswa) maupun `examiner` (dosen penguji).
3.  **`rubrics` (Rubrik):** Menyimpan grup panduan penilaian secara umum.
4.  **`rubric_items` (Item Rubrik):** Menyimpan detail poin per poin yang dinilai dalam sebuah rubrik. Setiap item punya bobot (`weight`) dan nilai maksimal skala (`max_scale`).
5.  **`stations` (Stase/Prasat):** Menyimpan daftar pos ujian. Setiap stase terhubung dengan ujian (`exam_id`) dan punya satu rubrik penilaian (`rubric_id`).
6.  **`submissions` (Penilaian/Nilai):** Ini tabel paling penting! Tabel ini menyimpan riwayat penilaian: "Mahasiswa A dinilai oleh Penguji B pada Stase C untuk Ujian D, dengan nilai total X". Sistem memastikan satu mahasiswa hanya bisa dinilai satu kali di satu stase (*prevent duplicate submission*).

---

## 5. Alur Kerja Sistem (System Flow)

1.  **Persiapan (Admin):**
    *   Admin masuk (login) ke halaman `/admin`.
    *   Admin membuat daftar rubrik (`rubrics`) dan detail cara menilainya (`rubric_items`).
    *   Admin membuat Ujian (`exams`) dan menambahkan mahasiswa serta dosen (`participants`).
    *   Admin membuat Stase (`stations`), lalu menghubungkannya dengan Ujian tertentu dan mengatur rubrik mana yang dipakai di stase tersebut.
2.  **Proses Ujian (Examiner/Penguji):**
    *   Dosen tidak perlu login menggunakan email/password.
    *   Mereka cukup membuka halaman utama, lalu memasukkan *Access Code* ujian yang sedang berlangsung.
    *   Dosen memilih nama mereka sendiri (sebagai penguji), memilih stase tempat mereka berjaga, lalu memilih mahasiswa yang maju.
    *   Dosen mengisi nilai berdasarkan rubrik. Perhitungan skor dari 0-100 (normalisasi) akan dihitung otomatis oleh sistem.
3.  **Laporan (Admin):**
    *   Admin bisa melihat rekap nilai seluruh mahasiswa di semua stase dalam sebuah tabel pivot.
    *   Admin bisa menekan tombol "Export" untuk mengunduh rekap tersebut dalam bentuk file Excel.

---

## 6. Tips untuk Pemula

1.  **Bahasa Indonesia:** Semua tampilan di layar (tombol, peringatan, label) menggunakan Bahasa Indonesia agar mudah dipahami pengguna.
2.  **Mobile Friendly:** Karena Dosen Penguji biasanya menilai menggunakan HP atau Tablet, tampilan aplikasi (terutama saat mengisi nilai) dibuat agar menyesuaikan ukuran layar kecil.
3.  **Baca `README.md`:** File `README.md` berisi instruksi cara menjalankan proyek ini di komputer Anda (cara `npm install`, koneksi ke Supabase, dll).

Semoga penjelasan ini membantu Anda memahami proyek secara keseluruhan! Jika Anda ingin belajar lebih dalam, Anda bisa mulai dari membaca file-file di dalam folder `src/app/` untuk melihat halaman webnya, atau `schema.sql` untuk melihat struktur databasenya secara lebih detail. Selamat belajar!
