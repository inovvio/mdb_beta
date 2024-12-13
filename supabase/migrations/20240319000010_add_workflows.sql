-- Create workflow_transitions table
create table public.workflow_transitions (
  id uuid primary key default uuid_generate_v4(),
  entity_type text not null,
  start_state text not null,
  end_state text not null,
  stp_flag boolean default false,
  create_task_flag boolean default false,
  create_notification_flag boolean default false,
  active_flag boolean default true,
  rules jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.workflow_transitions enable row level security;

-- Create policies
create policy "Enable read access for authenticated users" on public.workflow_transitions
  for select using (auth.role() = 'authenticated');

create policy "Enable write access for authenticated users" on public.workflow_transitions
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on public.workflow_transitions
  for update using (auth.role() = 'authenticated');

-- Add indexes
create index idx_workflow_transitions_entity_type on public.workflow_transitions(entity_type);
create index idx_workflow_transitions_states on public.workflow_transitions(start_state, end_state);