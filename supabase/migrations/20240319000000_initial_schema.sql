-- Create frameworks table
create table public.frameworks (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text not null,
  short_description text not null,
  long_description text,
  initial_allocated_amount numeric not null default 0,
  currency text not null default 'USD',
  status text not null default 'DRAFT',
  framework_lead text,
  funding_type text,
  funding_source text,
  allocation_type text,
  max_amount_per_transaction numeric not null default 0,
  priority text,
  parent_framework_id uuid references public.frameworks(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create projects table
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text not null,
  framework_id uuid references public.frameworks(id),
  party_id text not null,
  party_name text not null,
  role text not null,
  max_limit_amount numeric not null default 0,
  currency text not null default 'USD',
  status text not null default 'DRAFT',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS for all tables
alter table public.frameworks enable row level security;
alter table public.projects enable row level security;

-- Create policies
create policy "Enable read access for authenticated users" on public.frameworks
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on public.frameworks
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on public.frameworks
  for update using (auth.role() = 'authenticated');

create policy "Enable read access for authenticated users" on public.projects
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on public.projects
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on public.projects
  for update using (auth.role() = 'authenticated');