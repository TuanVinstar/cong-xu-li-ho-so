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


-- =====================================================================
-- Yêu cầu báo giá (requests)
-- =====================================================================
create table if not exists public.requests (
  id            text primary key default gen_random_uuid()::text,
  customer_name text not null,
  package       text not null,           -- 'co_ban' | 'toan_dien'
  quote         bigint not null,
  status        text not null,           -- 'cho_duyet' | 'da_duyet' | 'tu_choi'
  created_at    text not null,           -- chuỗi hiển thị "YYYY-MM-DD HH:MM"
  inserted_at   timestamptz not null default now()
);

alter table public.requests enable row level security;
drop policy if exists "Public read requests" on public.requests;
create policy "Public read requests" on public.requests for select using (true);

insert into public.requests (id, customer_name, package, quote, status, created_at) values
  ('req_2101', 'Trần Thị Bích',    'toan_dien', 45000000, 'cho_duyet', '2026-08-06 08:20'),
  ('req_2100', 'Đỗ Ngọc Lan',      'toan_dien', 45000000, 'cho_duyet', '2026-08-05 09:12'),
  ('req_2099', 'Lê Văn Hùng',      'co_ban',    18000000, 'da_duyet',  '2026-08-04 14:30'),
  ('req_2098', 'Phạm Thu Hà',      'toan_dien', 45000000, 'da_duyet',  '2026-08-03 10:05'),
  ('req_2097', 'Nguyễn Đức Anh',   'co_ban',    18000000, 'tu_choi',   '2026-08-02 16:47')
on conflict (id) do update set
  customer_name = excluded.customer_name,
  package       = excluded.package,
  quote         = excluded.quote,
  status        = excluded.status,
  created_at    = excluded.created_at;


-- =====================================================================
-- Hồ sơ học viên (student_profiles)
-- =====================================================================
create table if not exists public.student_profiles (
  id              text primary key default gen_random_uuid()::text,
  student_name    text not null,
  email           text,
  submitted_at    text not null,         -- chuỗi hiển thị "YYYY-MM-DD"
  doc_transcript  text not null,         -- DocStatus: chua_nop | dang_xu_ly | hop_le | can_nop_lai
  doc_ielts       text not null,
  doc_identity    text not null,
  matched_schools integer not null,
  total_schools   integer not null,
  inserted_at     timestamptz not null default now()
);

alter table public.student_profiles enable row level security;
drop policy if exists "Public read student_profiles" on public.student_profiles;
create policy "Public read student_profiles" on public.student_profiles for select using (true);

insert into public.student_profiles
  (id, student_name, email, submitted_at, doc_transcript, doc_ielts, doc_identity, matched_schools, total_schools) values
  ('stu_501', 'Nguyễn Minh Anh', 'minhanh.nguyen@example.com', '2026-08-01', 'hop_le',     'dang_xu_ly', 'can_nop_lai', 2, 5),
  ('stu_502', 'Vũ Thị Mai',       'mai.vu@example.com',         '2026-07-30', 'hop_le',     'hop_le',     'hop_le',      3, 5),
  ('stu_503', 'Hoàng Gia Bảo',    'bao.hoang@example.com',      '2026-08-02', 'hop_le',     'hop_le',     'dang_xu_ly',  1, 5),
  ('stu_504', 'Trịnh Thu Trang',  'trang.trinh@example.com',    '2026-08-04', 'can_nop_lai','hop_le',     'hop_le',      0, 5),
  ('stu_505', 'Bùi Anh Tuấn',     'tuan.bui@example.com',       '2026-08-05', 'dang_xu_ly', 'dang_xu_ly', 'dang_xu_ly',  0, 5)
on conflict (id) do update set
  student_name    = excluded.student_name,
  email           = excluded.email,
  submitted_at    = excluded.submitted_at,
  doc_transcript  = excluded.doc_transcript,
  doc_ielts       = excluded.doc_ielts,
  doc_identity    = excluded.doc_identity,
  matched_schools = excluded.matched_schools,
  total_schools   = excluded.total_schools;


-- =====================================================================
-- Hội thoại chatbot (conversations)
-- =====================================================================
create table if not exists public.conversations (
  id            text primary key default gen_random_uuid()::text,
  channel       text not null,           -- 'Web'
  message_count integer not null,
  started_at    text not null,           -- chuỗi hiển thị "YYYY-MM-DD HH:MM"
  inserted_at   timestamptz not null default now()
);

alter table public.conversations enable row level security;
drop policy if exists "Public read conversations" on public.conversations;
create policy "Public read conversations" on public.conversations for select using (true);

insert into public.conversations (id, channel, message_count, started_at) values
  ('conv_2081', 'Web',  8, '2026-08-06 09:03'),
  ('conv_2080', 'Web',  4, '2026-08-05 20:15'),
  ('conv_2079', 'Web', 12, '2026-08-05 11:42'),
  ('conv_2078', 'Web',  3, '2026-08-04 18:57'),
  ('conv_2077', 'Web',  6, '2026-08-03 13:21')
on conflict (id) do update set
  channel       = excluded.channel,
  message_count = excluded.message_count,
  started_at    = excluded.started_at;
