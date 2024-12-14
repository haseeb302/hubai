-- Enable the pgvector extension
create extension if not exists vector;

-- Create tables
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  created_by uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  status text not null default 'todo',
  project_id uuid references public.projects(id) on delete cascade not null,
  assigned_to uuid references public.users(id),
  created_by uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  content text,
  metadata jsonb,
  embedding vector(1536),
  project_id uuid references public.projects(id) on delete cascade,
  created_by uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.conversations (
  id uuid default uuid_generate_v4() primary key,
  messages jsonb[],
  project_id uuid references public.projects(id) on delete cascade,
  created_by uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
); 