-- Add priority column to workflow_transitions
alter table public.workflow_transitions
add column priority integer not null default 2;

-- Add index for priority
create index idx_workflow_transitions_priority on public.workflow_transitions(priority);