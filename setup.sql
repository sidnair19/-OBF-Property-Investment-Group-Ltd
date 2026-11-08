-- =====================================================================
-- OBF Properties — online database setup (Supabase)
-- 1. Change the email on the LAST LINE to the email you'll sign in with.
-- 2. Paste this whole file into Supabase → SQL Editor → New query → Run.
-- Safe to run more than once.
-- =====================================================================

-- Who is allowed to manage the website
create table if not exists public.admins (
  email text primary key
);
alter table public.admins enable row level security;
-- (no policies: nobody can read or change this list from the website)

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- Properties shown on the website
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null default '{}'::jsonb,
  published boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.properties enable row level security;

drop policy if exists "Visitors see published properties" on public.properties;
create policy "Visitors see published properties" on public.properties
  for select using (published or public.is_admin());

drop policy if exists "Admins add properties" on public.properties;
create policy "Admins add properties" on public.properties
  for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins edit properties" on public.properties;
create policy "Admins edit properties" on public.properties
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins delete properties" on public.properties;
create policy "Admins delete properties" on public.properties
  for delete to authenticated using (public.is_admin());

-- Enquiries sent from the website form
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new',
  data jsonb not null,
  constraint enquiry_size check (pg_column_size(data) < 8000)
);
alter table public.enquiries enable row level security;

drop policy if exists "Anyone can send an enquiry" on public.enquiries;
create policy "Anyone can send an enquiry" on public.enquiries
  for insert to anon, authenticated with check (status = 'new');

drop policy if exists "Admins read enquiries" on public.enquiries;
create policy "Admins read enquiries" on public.enquiries
  for select to authenticated using (public.is_admin());

drop policy if exists "Admins update enquiries" on public.enquiries;
create policy "Admins update enquiries" on public.enquiries
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins delete enquiries" on public.enquiries;
create policy "Admins delete enquiries" on public.enquiries
  for delete to authenticated using (public.is_admin());

-- Photo storage (public so the website can show the photos)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('property-photos', 'property-photos', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true;

drop policy if exists "Anyone can view property photos" on storage.objects;
create policy "Anyone can view property photos" on storage.objects
  for select using (bucket_id = 'property-photos');

drop policy if exists "Admins upload property photos" on storage.objects;
create policy "Admins upload property photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'property-photos' and public.is_admin());

drop policy if exists "Admins delete property photos" on storage.objects;
create policy "Admins delete property photos" on storage.objects
  for delete to authenticated using (bucket_id = 'property-photos' and public.is_admin());

-- >>> CHANGE THIS EMAIL to the one you'll sign in with (add more lines for more people) <<<
insert into public.admins (email) values ('siddharthdileep2003@gmail.com') on conflict do nothing;
