-- Create parties table
create table public.parties (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  legal_name text not null,
  short_name text,
  roles text[] not null,
  country text not null,
  status text not null default 'ACTIVE',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create party_contacts table
create table public.party_contacts (
  id uuid primary key default uuid_generate_v4(),
  party_id uuid references public.parties(id) on delete cascade,
  name text not null,
  designation text,
  email text,
  phone text,
  mobile text,
  address text,
  is_primary boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.parties enable row level security;
alter table public.party_contacts enable row level security;

-- Create policies
create policy "Enable read access for authenticated users" on public.parties
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on public.parties
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on public.parties
  for update using (auth.role() = 'authenticated');

create policy "Enable read access for authenticated users" on public.party_contacts
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on public.party_contacts
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on public.party_contacts
  for update using (auth.role() = 'authenticated');