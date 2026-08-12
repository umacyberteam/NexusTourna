-- ============================================================
-- MIGRASI: Login dengan Google
-- Jalankan ini di Supabase Dashboard > SQL Editor > New query
-- (aman dijalankan di database yang sudah ada isinya — jangan
-- jalankan ulang schema.sql, cukup file migration ini saja)
--
-- File ini HANYA mengubah trigger pembuatan profil supaya:
-- 1) avatar_url & full_name dari Google ikut kesimpan otomatis
-- 2) tidak gagal kalau username hasil auto-generate bentrok
--
-- Aktivasi provider Google sendiri dilakukan di Supabase Dashboard,
-- bukan lewat SQL — lihat README bagian "Login dengan Google".
-- ============================================================

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
