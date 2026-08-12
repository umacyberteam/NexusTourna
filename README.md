# Nexus Tournament — Platform Turnamen

Website untuk membuat & mendaftar turnamen (resmi, iseng-iseng, atau berhadiah).
Dibangun dengan **Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase**,
siap deploy ke **Vercel**.

## Fitur

- Daftar/masuk akun (Supabase Auth): email/password **dan** Login dengan Google
- Buat turnamen (nama, game, deskripsi, aturan, hadiah, biaya, kuota, jadwal, banner)
- Papan turnamen publik (siapa saja bisa lihat & jelajah)
- Form pendaftaran peserta + upload bukti pembayaran/screenshot
- Dashboard organizer: lihat & approve/reject pendaftaran
- Row Level Security (RLS) di Supabase — organizer hanya bisa kelola turnamennya sendiri

## 1. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com) (gratis).
2. Buka **SQL Editor** → jalankan seluruh isi file `supabase/schema.sql`.
   Ini akan membuat tabel `profiles`, `tournaments`, `registrations`, RLS policy,
   dan 2 storage bucket (`tournament-banners`, `registration-proofs`).
3. Buka **Project Settings > API**, salin:
   - `Project URL`
   - `anon public` key
4. (Opsional) Di **Authentication > Providers**, pastikan Email provider aktif.
   Untuk testing cepat, kamu bisa matikan "Confirm email" di
   **Authentication > Settings** supaya tidak perlu klik link email tiap daftar akun.

## 1.5 Aktifkan Login dengan Google

Login Google di app ini jalan lewat **Supabase Auth** (bukan Clerk/NextAuth) —
jadi tidak ada dependency tambahan, cukup 2 langkah setup:

**A. Buat OAuth Client di Google Cloud Console**

1. Buka [Google Cloud Console](https://console.cloud.google.com/apis/credentials) →
   buat project baru (atau pakai yang sudah ada).
2. **Create Credentials > OAuth client ID** → Application type: **Web application**.
3. Di **Authorized redirect URIs**, tambahkan (ganti `<project-ref>` dengan ref
   project Supabase kamu, terlihat di URL dashboard atau di Project Settings > API):
   ```
   https://<project-ref>.supabase.co/auth/v1/callback
   ```
4. Simpan, lalu salin **Client ID** dan **Client Secret** yang muncul.
5. Kalau app-nya masih testing, tambahkan email kamu di **OAuth consent screen >
   Test users** supaya bisa login sebelum app di-verifikasi Google.

**B. Aktifkan provider di Supabase**

1. Buka **Authentication > Providers > Google** di dashboard Supabase.
2. Toggle jadi **Enabled**, isi **Client ID** & **Client Secret** dari langkah A, Save.
3. Buka **Authentication > URL Configuration**, pastikan:
   - **Site URL** = `http://localhost:3000` (waktu lokal) / domain production kamu
   - **Redirect URLs** mengizinkan `http://localhost:3000/**` dan
     `https://domain-production-kamu/**`

   (Ini juga dipakai oleh flow konfirmasi email, jadi kalau login email sudah
   jalan sebelumnya biasanya bagian ini sudah beres.)

4. Kalau database kamu **sudah pernah** menjalankan `schema.sql` sebelum fitur ini
   ditambahkan, jalankan juga `supabase/migration_google_login.sql` di SQL Editor
   (aman dijalankan berkali-kali). File ini memastikan foto profil & nama dari
   akun Google ikut otomatis tersimpan ke tabel `profiles`.

Setelah itu tombol **"Lanjutkan dengan Google"** di halaman `/login` dan
`/register` langsung berfungsi — user baru otomatis dapat baris di `profiles`
(sama seperti signup email), tanpa perlu isi password.

## 2. Jalankan di Lokal

```bash
npm install
cp .env.local.example .env.local
# isi .env.local dengan URL & anon key dari Supabase
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## 3. Deploy ke Vercel

1. Push folder ini ke repo GitHub.
2. Buka [vercel.com](https://vercel.com) → **Add New Project** → import repo tadi.
3. Vercel otomatis mendeteksi Next.js. Sebelum deploy, tambahkan **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Klik **Deploy**. Selesai — situs langsung live.

Setiap kali kamu push ke branch utama, Vercel akan otomatis build ulang.

## Kenapa Supabase?

Untuk kebutuhan seperti ini (akun user, data turnamen, upload gambar/bukti), Supabase
cocok karena satu paket sudah mencakup:

- **Auth** siap pakai (email/password + Login Google, bisa tambah Discord dkk nanti)
- **Postgres database** sungguhan, dengan Row Level Security untuk kontrol akses per baris
- **Storage** untuk upload banner turnamen & bukti pendaftaran
- **Free tier** cukup besar untuk mulai (500MB database, 1GB storage, 50rb monthly active user)
- Native cocok dengan Vercel — tidak perlu server sendiri, murni serverless

Alternatif lain yang bisa dipertimbangkan: Firebase (mirip tapi NoSQL, bukan SQL),
atau Neon/PlanetScale + Clerk/NextAuth kalau mau pisah auth & database provider —
tapi itu berarti lebih banyak bagian yang perlu disatukan sendiri dibanding Supabase.

## Struktur Folder

```
tournament-app/
├── README.md
├── package.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── .env.local.example
├── .gitignore
├── supabase/
│   ├── schema.sql               # tabel, RLS policy, storage bucket
│   ├── migration_admin.sql      # migrasi fitur admin (database lama)
│   └── migration_google_login.sql  # migrasi login Google (database lama)
├── public/
└── src/
    ├── middleware.ts           # refresh session Supabase tiap request
    ├── types/
    │   └── database.types.ts   # tipe data Tournament/Registration/Profile
    ├── lib/
    │   └── supabase/
    │       ├── client.ts       # Supabase client untuk Client Component
    │       └── server.ts       # Supabase client untuk Server Component
    ├── components/
    │   ├── Navbar.tsx
    │   ├── UserMenu.tsx        # avatar + dropdown "Keluar" saat sudah login
    │   ├── GoogleButton.tsx    # tombol "Lanjutkan dengan Google"
    │   ├── LogoutButton.tsx
    │   ├── TournamentCard.tsx
    │   └── RegistrationRow.tsx
    └── app/
        ├── layout.tsx
        ├── globals.css
        ├── page.tsx                          # papan turnamen (home)
        ├── login/page.tsx
        ├── register/page.tsx                 # sign up akun
        ├── auth/callback/route.ts            # callback konfirmasi email
        ├── tournaments/
        │   ├── create/page.tsx               # form buat turnamen
        │   └── [id]/
        │       ├── page.tsx                  # detail turnamen
        │       └── register/page.tsx         # form daftar peserta
        ├── dashboard/
        │   ├── page.tsx                      # daftar turnamen milik organizer
        │   └── [id]/page.tsx                 # kelola peserta per turnamen
        └── api/
            └── registrations/[id]/status/route.ts   # approve/reject peserta
```

## Fitur Pesan Admin

Ada 1 akun admin (bukan role publik) yang bisa menempelkan pesan singkat di
turnamen manapun (misal "Direkomendasikan", "Segera Ditutup") — muncul sebagai
badge 📌 di kartu turnamen. Untuk mengaktifkan:

1. Jalankan `supabase/migration_admin.sql` di SQL Editor (kalau database kamu
   sudah pernah menjalankan `schema.sql` sebelumnya — jangan jalankan ulang
   `schema.sql`, cukup file migration ini saja)
2. Di bagian bawah file itu, ganti `USERNAME_KAMU` dengan username akun yang
   ingin dijadikan admin, lalu jalankan
3. Login dengan akun tersebut → buka halaman detail turnamen mana saja → akan
   muncul kotak kuning "Pesan Admin" untuk mengisi/menghapus pesan

## Ide Pengembangan Selanjutnya

- Bracket/bagan otomatis (single/double elimination)
- Notifikasi WhatsApp/email saat pendaftaran diterima
- Login Discord (Google sudah tersedia)
- Halaman publik daftar peserta yang sudah diterima
- Pembayaran otomatis (Midtrans/Xendit) untuk turnamen berbayar
