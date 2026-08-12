-- ============================================================
-- Nexus Tournament — Skema Database Supabase
-- Jalankan file ini di: Supabase Dashboard > SQL Editor > New query
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (1 baris per user, dibuat otomatis saat sign up)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  is_admin boolean not null default false,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Profil bisa dilihat siapa saja"
  on public.profiles for select
  using (true);

create policy "User bisa insert profil sendiri"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "User bisa update profil sendiri"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-buat profil setiap ada user baru daftar
-- (jalan untuk signup email/password maupun login Google — Supabase mengisi
-- raw_user_meta_data dengan 'full_name' & 'avatar_url' otomatis untuk Google)
create or replace function public.handle_new_user()
returns trigger as $$
declare
  base_username text;
  final_username text;
begin
  base_username := coalesce(
    nullif(new.raw_user_meta_data->>'username', ''),
    nullif(new.raw_user_meta_data->>'user_name', ''),
    split_part(new.email, '@', 1)
  );
  final_username := base_username;

  -- kalau username sudah dipakai (mis. dua akun beda provider, email prefix sama)
  -- tambahkan suffix acak biar tetap unik, bukan bikin signup gagal
  while exists (select 1 from public.profiles where username = final_username) loop
    final_username := base_username || '_' || substr(md5(random()::text), 1, 4);
  end loop;

  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    final_username,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- TOURNAMENTS
-- ============================================================
create table if not exists public.tournaments (
  id uuid primary key default uuid_generate_v4(),
  organizer_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  game text,
  banner_url text,
  rules text,
  prize text,
  entry_fee numeric default 0,
  max_participants integer,
  registration_deadline timestamptz,
  start_date timestamptz,
  status text default 'open' check (status in ('open', 'closed', 'ongoing', 'finished', 'cancelled')),
  admin_message text,
  created_at timestamptz default now()
);

alter table public.tournaments enable row level security;

create policy "Turnamen bisa dilihat siapa saja"
  on public.tournaments for select
  using (true);

create policy "Organizer bisa buat turnamen sendiri"
  on public.tournaments for insert
  with check (auth.uid() = organizer_id);

create policy "Organizer bisa update turnamen sendiri"
  on public.tournaments for update
  using (auth.uid() = organizer_id);

create policy "Organizer bisa hapus turnamen sendiri"
  on public.tournaments for delete
  using (auth.uid() = organizer_id);

create policy "Admin bisa update turnamen manapun (untuk pesan admin)"
  on public.tournaments for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

-- ============================================================
-- REGISTRATIONS (pendaftaran peserta ke sebuah turnamen)
-- ============================================================
create table if not exists public.registrations (
  id uuid primary key default uuid_generate_v4(),
  tournament_id uuid references public.tournaments(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  team_name text,
  player_names text,
  contact text,
  proof_url text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now(),
  unique (tournament_id, user_id)
);

alter table public.registrations enable row level security;

create policy "User bisa lihat pendaftaran sendiri"
  on public.registrations for select
  using (auth.uid() = user_id);

create policy "Organizer bisa lihat pendaftaran ke turnamennya"
  on public.registrations for select
  using (
    exists (
      select 1 from public.tournaments t
      where t.id = tournament_id and t.organizer_id = auth.uid()
    )
  );

create policy "User bisa daftar sendiri"
  on public.registrations for insert
  with check (auth.uid() = user_id);

create policy "Organizer bisa update status pendaftaran"
  on public.registrations for update
  using (
    exists (
      select 1 from public.tournaments t
      where t.id = tournament_id and t.organizer_id = auth.uid()
    )
  );

create policy "User bisa batalkan pendaftaran sendiri"
  on public.registrations for delete
  using (auth.uid() = user_id);

-- ============================================================
-- ADMIN: jadikan akun tertentu sebagai admin
-- (akun ini harus sudah pernah daftar lewat aplikasi)
-- ============================================================
update public.profiles
set is_admin = true
where id = (select id from auth.users where email = 'nizamtvchannel153@gmail.com');

-- Cegah user biasa mengubah is_admin miliknya sendiri lewat aplikasi.
-- Harus dibuat SETELAH update di atas, supaya tidak ikut memblokir
-- pemberian status admin pertama kali.
create or replace function public.protect_is_admin()
returns trigger as $$
begin
  if new.is_admin is distinct from old.is_admin then
    new.is_admin := old.is_admin;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists protect_is_admin_trigger on public.profiles;
create trigger protect_is_admin_trigger
  before update on public.profiles
  for each row execute procedure public.protect_is_admin();

-- ============================================================
-- STORAGE BUCKETS (banner turnamen & bukti pendaftaran/pembayaran)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('tournament-banners', 'tournament-banners', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('registration-proofs', 'registration-proofs', true)
on conflict (id) do nothing;

create policy "Banner bisa dilihat siapa saja"
  on storage.objects for select
  using (bucket_id = 'tournament-banners');

create policy "User login bisa upload banner"
  on storage.objects for insert
  with check (bucket_id = 'tournament-banners' and auth.role() = 'authenticated');

create policy "Bukti bisa dilihat siapa saja"
  on storage.objects for select
  using (bucket_id = 'registration-proofs');

create policy "User login bisa upload bukti"
  on storage.objects for insert
  with check (bucket_id = 'registration-proofs' and auth.role() = 'authenticated');
