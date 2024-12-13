-- Create eligibility_criteria table
create table public.eligibility_criteria (
  id uuid primary key default uuid_generate_v4(),
  framework_id uuid references public.frameworks(id) on delete cascade unique,
  permitted_sics text[],
  environment_category text,
  countries_of_operation text[],
  transition_impact_primary_quality text,
  client_types text[],
  product_types text[],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create eligibility_criteria_attributes table
create table public.eligibility_criteria_attributes (
  id uuid primary key default uuid_generate_v4(),
  eligibility_criteria_id uuid references public.eligibility_criteria(id) on delete cascade,
  key text not null,
  value text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create framework_attributes table
create table public.framework_attributes (
  id uuid primary key default uuid_generate_v4(),
  framework_id uuid references public.frameworks(id) on delete cascade,
  name text not null,
  type text not null,
  value text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create framework_documents table
create table public.framework_documents (
  id uuid primary key default uuid_generate_v4(),
  framework_id uuid references public.frameworks(id) on delete cascade,
  name text not null,
  type text not null,
  url text not null,
  comments text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS for new tables
alter table public.eligibility_criteria enable row level security;
alter table public.eligibility_criteria_attributes enable row level security;
alter table public.framework_attributes enable row level security;
alter table public.framework_documents enable row level security;

-- Create policies for new tables
create policy "Enable read access for authenticated users" on public.eligibility_criteria
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on public.eligibility_criteria
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on public.eligibility_criteria
  for update using (auth.role() = 'authenticated');

create policy "Enable read access for authenticated users" on public.eligibility_criteria_attributes
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on public.eligibility_criteria_attributes
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on public.eligibility_criteria_attributes
  for update using (auth.role() = 'authenticated');

create policy "Enable read access for authenticated users" on public.framework_attributes
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on public.framework_attributes
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on public.framework_attributes
  for update using (auth.role() = 'authenticated');

create policy "Enable read access for authenticated users" on public.framework_documents
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on public.framework_documents
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on public.framework_documents
  for update using (auth.role() = 'authenticated');