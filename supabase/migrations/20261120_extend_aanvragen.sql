-- OPTIONAL migration for the new multi-step plan form.
-- The website works WITHOUT this migration: new fields are then stored in `opmerkingen`.
-- After running it, set VITE_AANVRAGEN_EXTENDED=true and rebuild.
--
-- Run in the Supabase SQL editor (project wgsbzlimdzaaqqflalrh). Review first!

alter table public.aanvragen
  add column if not exists reisvorm text check (reisvorm in ('group', 'individual', 'tailor-made')),
  add column if not exists reis_slug text,
  add column if not exists aantal_rijders integer check (aantal_rijders between 1 and 50),
  add column if not exists aantal_duo integer check (aantal_duo between 0 and 50),
  add column if not exists motor_keuze text check (motor_keuze in ('own', 'rent', 'undecided')),
  add column if not exists rijervaring text check (rijervaring in ('lt2', '2to5', '5to10', 'gt10')),
  add column if not exists contact_voorkeur text check (contact_voorkeur in ('email', 'phone', 'whatsapp')),
  add column if not exists privacy_akkoord boolean not null default false;

-- Server-side spam protection: max 5 requests per e-mail address per hour.
create or replace function public.aanvragen_rate_limit()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.aanvragen
      where lower(email) = lower(new.email) and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;
  return new;
end $$;

drop trigger if exists aanvragen_rate_limit on public.aanvragen;
create trigger aanvragen_rate_limit before insert on public.aanvragen
  for each row execute function public.aanvragen_rate_limit();

create or replace function public.contact_messages_rate_limit()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.contact_messages
      where lower(email) = lower(new.email) and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;
  return new;
end $$;

drop trigger if exists contact_messages_rate_limit on public.contact_messages;
create trigger contact_messages_rate_limit before insert on public.contact_messages
  for each row execute function public.contact_messages_rate_limit();
