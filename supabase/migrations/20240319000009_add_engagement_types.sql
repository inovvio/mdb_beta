-- Insert engagement types
insert into public.application_ref_data (reference_data_name, code, description, sort_order)
values 
  ('Engagement Type', 'INVESTMENT', 'Investment', 1),
  ('Engagement Type', 'RISK_MITIGATION', 'Risk Mitigation', 2),
  ('Engagement Type', 'TRADE_FINANCE', 'Trade Finance', 3),
  ('Engagement Type', 'GREEN', 'Green', 4);