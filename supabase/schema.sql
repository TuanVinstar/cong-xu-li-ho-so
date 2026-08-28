-- Bảng trường tham chiếu (điểm chuẩn) cho DuHoc24.
-- Chạy toàn bộ file này trong Supabase → SQL Editor → New query → Run.

-- 1) Tạo bảng
create table if not exists public.schools (
  id         text primary key default gen_random_uuid()::text,
  name       text not null,
  country    text not null,
  min_gpa    real not null,
  min_ielts  real not null,
  created_at timestamptz not null default now()
);

-- 2) Bật Row Level Security và cho phép ai cũng ĐỌC được (dữ liệu công khai)
alter table public.schools enable row level security;

drop policy if exists "Public read schools" on public.schools;
create policy "Public read schools"
  on public.schools
  for select
  using (true);

-- 3) Nạp dữ liệu 4 trường (idempotent — chạy lại không bị trùng)
insert into public.schools (id, name, country, min_gpa, min_ielts) values
  ('sch_01', 'Đại học Deakin',     'Úc',          7.0, 6.0),
  ('sch_02', 'Đại học Swinburne',  'Úc',          7.0, 6.0),
  ('sch_03', 'Đại học Melbourne',  'Úc',          8.5, 7.0),
  ('sch_04', 'Đại học Auckland',   'New Zealand', 7.5, 6.5)
on conflict (id) do update set
  name      = excluded.name,
  country   = excluded.country,
  min_gpa   = excluded.min_gpa,
  min_ielts = excluded.min_ielts;
