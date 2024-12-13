```sql
-- Create projects table
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  project_id text not null unique,
  name text not null,
  description text,
  type text not null,
  status text not null default 'DRAFT',
  framework_id uuid references public.frameworks(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create project_parties table
create table public.project_parties (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete cascade,
  party_id uuid references public.parties(id),
  party_name text not null,
  role text not null,
  is_primary boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create project_documents table
create table public.project_documents (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete cascade,
  name text not null,
  type text not null,
  url text not null,
  comments text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create project_attributes table
create table public.project_attributes (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete cascade,
  name text not null,
  type text not null,
  value text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create project_history table
create table public.project_history (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete cascade,
  action text not null,
  description text not null,
  user_id uuid references auth.users(id),
  user_name text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.projects enable row level security;
alter table public.project_parties enable row level security;
alter table public.project_documents enable row level security;
alter table public.project_attributes enable row level security;
alter table public.project_history enable row level security;

-- Create policies
create policy "Enable read access for authenticated users" on public.projects
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on public.projects
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on public.projects
  for update using (auth.role() = 'authenticated');

-- Add indexes
create index idx_projects_framework_id on public.projects(framework_id);
create index idx_project_parties_project_id on public.project_parties(project_id);
create index idx_project_documents_project_id on public.project_documents(project_id);
create index idx_project_attributes_project_id on public.project_attributes(project_id);
create index idx_project_history_project_id on public.project_history(project_id);
```