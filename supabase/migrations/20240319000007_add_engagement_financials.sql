-- Create engagement_financials table
create table public.engagement_financials (
  id uuid primary key default uuid_generate_v4(),
  engagement_id uuid references public.engagements(id) on delete cascade,
  reference text not null,
  currency text not null,
  amount numeric not null,
  date date,
  comments text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.engagement_financials enable row level security;

-- Create policies
create policy "Enable read access for authenticated users" on public.engagement_financials
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on public.engagement_financials
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on public.engagement_financials
  for update using (auth.role() = 'authenticated');

create policy "Enable delete access for authenticated users" on public.engagement_financials
  for delete using (auth.role() = 'authenticated');

-- Add index
create index idx_engagement_financials_engagement_id on public.engagement_financials(engagement_id); 