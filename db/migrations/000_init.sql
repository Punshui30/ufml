create extension if not exists vector;
create extension if not exists "uuid-ossp";

create table if not exists accounts (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  plan text not null
);

create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  account_id uuid references accounts(id),
  email text unique not null,
  role text not null,
  pw_hash text not null,
  created_at timestamptz default now()
);

create table if not exists credit_reports (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  bureau text,
  report_date date,
  raw_pdf_url text,
  parsed_json jsonb,
  created_at timestamptz default now()
);

create table if not exists tradelines (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  bureau text,
  creditor text,
  acct_hash text,
  opened_on date,
  status text,
  balance_cents int,
  last_reported_on date
);

create table if not exists disputes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  target text,
  bureau text,
  reason_code text,
  narrative text,
  letter_url text,
  tracking_no text,
  status text default 'draft',
  sent_at timestamptz,
  due_at timestamptz
);

create table if not exists relief_programs (
  id uuid primary key default uuid_generate_v4(),
  slug text unique,
  title text,
  jurisdiction text,
  eligibility jsonb,
  docs_required jsonb,
  source_url text,
  embedding vector(768)
);

create table if not exists relief_recommendations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  program_id uuid references relief_programs(id),
  why text,
  confidence numeric,
  created_at timestamptz default now(),
  status text default 'proposed'
);

create table if not exists events (
  id bigserial primary key,
  user_id uuid references users(id),
  entity text,
  entity_id uuid,
  action text,
  meta jsonb,
  created_at timestamptz default now()
);
