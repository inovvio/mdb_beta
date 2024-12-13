-- Add action column to workflow_transitions
alter table public.workflow_transitions
add column action text not null default 'SYSTEM_UPDATE';

-- Add index for action
create index idx_workflow_transitions_action on public.workflow_transitions(action);