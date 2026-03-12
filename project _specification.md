# **PROJECT SPECIFICATION: INGAT PAJAK**

**Versi:** 1.1 (Updated)

**Fokus Utama:** Manajemen dan Pengingat Pajak Kendaraan Bermotor (PKB)

## **1\. PENDAHULUAN**

**IngatPajak** adalah aplikasi berbasis web yang dirancang untuk memfasilitasi masyarakat luas (khususnya wajib pajak) dalam mengelola kewajiban Pajak Kendaraan Bermotor (PKB). Platform ini mencatat riwayat pajak, menampilkan kalender jatuh tempo, dan mengirimkan notifikasi pengingat otomatis agar wajib pajak terhindar dari denda keterlambatan.

## **2\. TECH STACK (Zero-Cost / Vercel Ecosystem)**

* **Frontend & Framework:** Next.js 14+ (App Router), React.js  
* **Styling (UI/UX):** Tailwind CSS \+ shadcn/ui \+ Lucide React (Icons)  
* **Database:** Supabase (PostgreSQL) \- Free Tier  
* **ORM:** Prisma  
* **Notifikasi:** Resend.com (Email) & WhatsApp API (Opsional untuk MVP)  
* **Deployment & Cron Jobs:** Vercel (Gratis)

## **3\. RINCIAN FITUR (FRONTEND)**

Aplikasi harus dibuat *Pixel-Perfect* dan *Responsive* berdasarkan referensi gambar UI Mockup yang dilampirkan.

**A. Autentikasi (Login Screen)**

* Form Login: Input menggunakan NIK (16 digit) / NPWP (15 digit), No. HP aktif, dan Email.  
* Opsi "Login via Kode OTP".

**B. Dashboard Utama (Beranda)**

* *Greeting* dinamis & *Alert Banner* kuning jika pajak segera jatuh tempo.  
* *Widget* Mini Kalender Pajak.  
* Kartu Berita & Info Pajak.  
* Placeholder "Coming Soon" untuk Panduan Pajak Penghasilan (Menegaskan fokus saat ini hanya PKB).  
* **CRITICAL RULE:** Hapus/Jangan buat tombol biru besar "Butuh Bantuan Mengurus Pajak? Hubungi Call Center" di bagian bawah.

**C. Kalender Pajak Interaktif**

* Grid Kalender Bulanan dengan indikator warna.  
* *Sidebar* Detail Kendaraan (saat tanggal diklik muncul plat nomor, rincian biaya, dan tombol e-Samsat).  
* *Toggle Switch* Notifikasi (WhatsApp & Email).

**D. Riwayat & Dokumen Kendaraan**

* Kartu Status PKB Tahunan (Aktif/Mati).  
* Tabel Riwayat Pajak (Tahun, Kendaraan, Nominal, Status, Bukti).  
* Arsip STNK/BPKB Digital (List dokumen PDF untuk diunduh).

## **4\. BACKEND & LOGIC (Vercel Serverless)**

* **API Routes:** Menggunakan Next.js Route Handlers untuk Autentikasi, CRUD Kendaraan, dan Riwayat Pajak.  
* **Cron Jobs:** Menggunakan vercel.json untuk *trigger* endpoint pengecekan notifikasi harian (H-30, H-7, H-1 jatuh tempo).

## **5\. MOCK DATA REQUIREMENT**

Untuk MVP awal, buatkan file data/mock.ts yang berisi *dummy data* komprehensif (user, vehicles, tax histories, calendar events) agar UI dapat berfungsi penuh tanpa harus terhubung ke *database* asli di tahap awal pengembangan.