-- Setup Cron Jobs for AI Gift Generation
-- Runs 5 times per day: 8 AM, 12 PM, 3 PM, 6 PM, 9 PM (UTC)

-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Remove existing jobs if they exist
SELECT cron.unschedule('generate-gifts-8am');
SELECT cron.unschedule('generate-gifts-12pm');
SELECT cron.unschedule('generate-gifts-3pm');
SELECT cron.unschedule('generate-gifts-6pm');
SELECT cron.unschedule('generate-gifts-9pm');

-- Schedule generation at 8 AM UTC (midnight PST)
SELECT cron.schedule(
  'generate-gifts-8am',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url := 'https://svspwjunukphqdjjfvef.supabase.co/functions/v1/generate-gift-suggestions',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object('batch', true)
  );
  $$
);

-- Schedule generation at 12 PM UTC (4 AM PST)
SELECT cron.schedule(
  'generate-gifts-12pm',
  '0 12 * * *',
  $$
  SELECT net.http_post(
    url := 'https://svspwjunukphqdjjfvef.supabase.co/functions/v1/generate-gift-suggestions',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object('batch', true)
  );
  $$
);

-- Schedule generation at 3 PM UTC (7 AM PST)
SELECT cron.schedule(
  'generate-gifts-3pm',
  '0 15 * * *',
  $$
  SELECT net.http_post(
    url := 'https://svspwjunukphqdjjfvef.supabase.co/functions/v1/generate-gift-suggestions',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object('batch', true)
  );
  $$
);

-- Schedule generation at 6 PM UTC (10 AM PST)
SELECT cron.schedule(
  'generate-gifts-6pm',
  '0 18 * * *',
  $$
  SELECT net.http_post(
    url := 'https://svspwjunukphqdjjfvef.supabase.co/functions/v1/generate-gift-suggestions',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object('batch', true)
  );
  $$
);

-- Schedule generation at 9 PM UTC (1 PM PST)
SELECT cron.schedule(
  'generate-gifts-9pm',
  '0 21 * * *',
  $$
  SELECT net.http_post(
    url := 'https://svspwjunukphqdjjfvef.supabase.co/functions/v1/generate-gift-suggestions',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object('batch', true)
  );
  $$
);

-- Verify cron jobs were created
SELECT jobname, schedule, command 
FROM cron.job 
WHERE jobname LIKE 'generate-gifts%'
ORDER BY jobname;
