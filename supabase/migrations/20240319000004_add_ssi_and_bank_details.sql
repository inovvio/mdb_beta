-- Create party_bank_details table
create table public.party_bank_details (
  id uuid primary key default uuid_generate_v4(),
  party_id uuid references public.parties(id) on delete cascade,
  bank_name text not null,
  branch_name text,
  account_number text not null,
  account_name text not null,
  swift_code text,
  iban text,
  currency text not null,
  is_primary boolean default false,
  status text not null default 'ACTIVE',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create party_ssi table
create table public.party_ssi (
  id uuid primary key default uuid_generate_v4(),
  party_id uuid references public.parties(id) on delete cascade,
  currency text not null,
  correspondent_bank text not null,
  correspondent_swift text not null,
  intermediary_bank text,
  intermediary_swift text,
  beneficiary_bank text not null,
  beneficiary_swift text not null,
  beneficiary_account text not null,
  beneficiary_name text not null,
  special_instructions text,
  is_primary boolean default false,
  status text not null default 'ACTIVE',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.party_bank_details enable row level security;
alter table public.party_ssi enable row level security;

-- Create policies for party_bank_details
create policy "Enable read access for authenticated users" on public.party_bank_details
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on public.party_bank_details
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on public.party_bank_details
  for update using (auth.role() = 'authenticated');

create policy "Enable delete access for authenticated users" on public.party_bank_details
  for delete using (auth.role() = 'authenticated');

-- Create policies for party_ssi
create policy "Enable read access for authenticated users" on public.party_ssi
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on public.party_ssi
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on public.party_ssi
  for update using (auth.role() = 'authenticated');

create policy "Enable delete access for authenticated users" on public.party_ssi
  for delete using (auth.role() = 'authenticated');

-- Add indexes
create index idx_party_bank_details_party_id on public.party_bank_details(party_id);
create index idx_party_ssi_party_id on public.party_ssi(party_id);