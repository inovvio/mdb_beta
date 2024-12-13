-- Create party_attributes table
create table public.party_attributes (
  id uuid primary key default uuid_generate_v4(),
  party_id uuid references public.parties(id) on delete cascade,
  name text not null,
  value text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create party_documents table
create table public.party_documents (
  id uuid primary key default uuid_generate_v4(),
  party_id uuid references public.parties(id) on delete cascade,
  name text not null,
  type text not null,
  url text not null,
  comments text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS for new tables
alter table public.party_attributes enable row level security;
alter table public.party_documents enable row level security;

-- Create policies for party_attributes
create policy "Enable read access for authenticated users" on public.party_attributes
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on public.party_attributes
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on public.party_attributes
  for update using (auth.role() = 'authenticated');

create policy "Enable delete access for authenticated users" on public.party_attributes
  for delete using (auth.role() = 'authenticated');

-- Create policies for party_documents
create policy "Enable read access for authenticated users" on public.party_documents
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on public.party_documents
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on public.party_documents
  for update using (auth.role() = 'authenticated');

create policy "Enable delete access for authenticated users" on public.party_documents
  for delete using (auth.role() = 'authenticated');

-- Add indexes for better performance
create index idx_party_attributes_party_id on public.party_attributes(party_id);
create index idx_party_documents_party_id on public.party_documents(party_id);
create index idx_party_contacts_party_id on public.party_contacts(party_id);