-- ============================================================
-- MIGRASI: Fitur Admin + Pesan Pin
-- Jalankan ini di Supabase Dashboard > SQL Editor > New query
-- (aman dijalankan di database yang sudah ada isinya)
-- ============================================================

-- 1) Tambah kolom pesan khusus di tournaments
alter table public.tournaments add column if not exists admin_message text;

-- 2) Pastikan kolom is_admin ada di profiles
alter table public.profiles add column if not exists is_admin boolean not null default false;

-- 3) Izinkan admin mengubah admin_message di turnamen SIAPA SAJA
drop policy if exists "Admin bisa update turnamen manapun (untuk pesan admin)" on public.tournaments;
create policy "Admin bisa update turnamen manapun (untuk pesan admin)"
  on public.tournaments for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

-- 4) Jadikan akun ini sebagai admin
-- (akun ini harus sudah pernah daftar lewat aplikasi terlebih dahulu)
update public.profiles
set is_admin = true
where id = (select id from auth.users where email = 'nizamtvchannel153@gmail.com');

-- 5) Cegah user biasa mengubah is_admin miliknya sendiri lewat aplikasi
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
