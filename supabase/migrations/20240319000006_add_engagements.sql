-- Create engagements table
create table public.engagements (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  types text[] not null,
  framework_id uuid references public.frameworks(id),
  effective_from date not null,
  effective_to date not null,
  status text not null default 'DRAFT',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create engagement_parties table
create table public.engagement_parties (
  id uuid primary key default uuid_generate_v4(),
  engagement_id uuid references public.engagements(id) on delete cascade,
  party_id uuid references public.parties(id),
  party_name text not null,
  role text not null,
  is_primary boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create engagement_documents table
create table public.engagement_documents (
  id uuid primary key default uuid_generate_v4(),
  engagement_id uuid references public.engagements(id) on delete cascade,
  name text not null,
  type text not null,
  url text not null,
  comments text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create engagement_attributes table
create table public.engagement_attributes (
  id uuid primary key default uuid_generate_v4(),
  engagement_id uuid references public.engagements(id) on delete cascade,
  name text not null,
  type text not null,
  value text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create engagement_history table
create table public.engagement_history (
  id uuid primary key default uuid_generate_v4(),
  engagement_id uuid references public.engagements(id) on delete cascade,
  action text not null,
  description text not null,
  user_id uuid references auth.users(id),
  user_name text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.engagements enable row level security;
alter table public.engagement_parties enable row level security;
alter table public.engagement_documents enable row level security;
alter table public.engagement_attributes enable row level security;
alter table public.engagement_history enable row level security;

-- Create policies
create policy "Enable read access for authenticated users" on public.engagements
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on public.engagements
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on public.engagements
  for update using (auth.role() = 'authenticated');

create policy "Enable read access for authenticated users" on public.engagement_parties
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on public.engagement_parties
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on public.engagement_parties
  for update using (auth.role() = 'authenticated');

create policy "Enable read access for authenticated users" on public.engagement_documents
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on public.engagement_documents
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on public.engagement_documents
  for update using (auth.role() = 'authenticated');

create policy "Enable read access for authenticated users" on public.engagement_attributes
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on public.engagement_attributes
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on public.engagement_attributes
  for update using (auth.role() = 'authenticated');

create policy "Enable read access for authenticated users" on public.engagement_history
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on public.engagement_history
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on public.engagement_history
  for update using (auth.role() = 'authenticated');

-- Add indexes
create index idx_engagements_framework_id on public.engagements(framework_id);
create index idx_engagement_parties_engagement_id on public.engagement_parties(engagement_id);
create index idx_engagement_documents_engagement_id on public.engagement_documents(engagement_id);
create index idx_engagement_attributes_engagement_id on public.engagement_attributes(engagement_id);
create index idx_engagement_history_engagement_id on public.engagement_history(engagement_id);