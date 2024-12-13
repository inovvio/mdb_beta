-- Create application_ref_data table
create table public.application_ref_data (
  id uuid primary key default uuid_generate_v4(),
  reference_data_name text not null,
  code text not null,
  description text not null,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(reference_data_name, code)
);

-- Enable RLS
alter table public.application_ref_data enable row level security;

-- Create policies
create policy "Enable read access for authenticated users" on public.application_ref_data
  for select using (auth.role() = 'authenticated');

-- Insert framework types
insert into public.application_ref_data (reference_data_name, code, description, sort_order)
values 
  ('Framework Type', 'INVESTMENT', 'Investment Framework', 1),
  ('Framework Type', 'GUARANTEES', 'Guarantee Framework', 2),
  ('Framework Type', 'TRADE FINANCE', 'Trade Finance Framework', 3);