-- AlexGPT Database Schema

-- Table des agents IA personnalisés
create table public.agents (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text default '',
  avatar_url text,
  system_prompt text not null default 'Tu es un assistant IA utile et amical.',
  user_id uuid references auth.users(id) on delete cascade not null,
  is_public boolean default false,
  created_at timestamptz default now()
);

-- Table des conversations
create table public.conversations (
  id uuid default gen_random_uuid() primary key,
  title text default 'Nouvelle conversation',
  agent_id uuid references public.agents(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now()
);

-- Table des messages
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now()
);

-- Table des likes sur les agents publics
create table public.agent_likes (
  id uuid default gen_random_uuid() primary key,
  agent_id uuid references public.agents(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique (agent_id, user_id)
);

-- Row Level Security
alter table public.agents enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.agent_likes enable row level security;

-- Policies: Agents
create policy "Users can view their own agents" on public.agents
  for select using (auth.uid() = user_id);
create policy "Users can view public agents" on public.agents
  for select using (is_public = true);
create policy "Users can create agents" on public.agents
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own agents" on public.agents
  for update using (auth.uid() = user_id);
create policy "Users can delete their own agents" on public.agents
  for delete using (auth.uid() = user_id);

-- Policies: Conversations
create policy "Users can manage their conversations" on public.conversations
  for all using (auth.uid() = user_id);

-- Policies: Messages
create policy "Users can manage their messages" on public.messages
  for all using (auth.uid() = user_id);

-- Policies: Likes
create policy "Users can view all likes" on public.agent_likes
  for select using (true);
create policy "Users can like agents" on public.agent_likes
  for insert with check (auth.uid() = user_id);
create policy "Users can unlike agents" on public.agent_likes
  for delete using (auth.uid() = user_id);
