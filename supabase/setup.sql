-- POCO · Supabase 설정 스크립트
-- Supabase 대시보드 → SQL Editor 에 전체를 붙여 넣고 Run 한 번. 여러 번 실행해도 안전함.
--
-- 구조: 아이디·비밀번호 계정(이메일 없음) + 계정별 기록(JSON) 저장.
-- 표는 모두 RLS로 잠가 두고(정책 없음 = 외부에서 직접 읽기·쓰기 불가),
-- 브라우저는 아래 poco_* 함수(RPC)로만 접근한다. 비밀번호는 bcrypt 해시로만 저장.

create extension if not exists pgcrypto with schema extensions;

-- ───────── 표 ─────────
create table if not exists public.poco_users (
  id            uuid primary key default gen_random_uuid(),
  username      text not null,                 -- 화면에 보이는 아이디(입력한 그대로)
  username_key  text not null unique,          -- 중복 검사용(소문자)
  pw_hash       text not null,
  fails         int  not null default 0,       -- 연속 로그인 실패 횟수
  locked_until  timestamptz,
  created_at    timestamptz not null default now(),
  last_login_at timestamptz
);

create table if not exists public.poco_sessions (
  token_hash   text primary key,               -- 토큰 원문은 저장하지 않음(sha256)
  user_id      uuid not null references public.poco_users(id) on delete cascade,
  created_at   timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);
create index if not exists poco_sessions_user_idx on public.poco_sessions(user_id);

create table if not exists public.poco_states (
  user_id    uuid primary key references public.poco_users(id) on delete cascade,
  state      jsonb not null default '{}'::jsonb,   -- 태깅(tags)·읽는 중(prog)·반응·찜 등 앱 기록 전체
  updated_at timestamptz not null default now()
);

alter table public.poco_users    enable row level security;
alter table public.poco_sessions enable row level security;
alter table public.poco_states   enable row level security;
revoke all on public.poco_users, public.poco_sessions, public.poco_states from anon, authenticated;

-- ───────── 내부 도우미 (외부 호출 불가) ─────────
create or replace function public.poco__hash(p_token text) returns text
language sql immutable as $$ select encode(sha256(convert_to(coalesce(p_token,''),'UTF8')),'hex') $$;

create or replace function public.poco__uid(p_token text) returns uuid
language plpgsql security definer set search_path = public, extensions as $$
declare v uuid;
begin
  if p_token is null or length(p_token) < 32 then return null; end if;
  update poco_sessions set last_seen_at = now()
   where token_hash = poco__hash(p_token) and created_at > now() - interval '180 days'
   returning user_id into v;
  return v;
end $$;

create or replace function public.poco__new_session(p_user uuid) returns text
language plpgsql security definer set search_path = public, extensions as $$
declare v_token text := encode(extensions.gen_random_bytes(32),'hex');
begin
  insert into poco_sessions(token_hash,user_id) values (poco__hash(v_token), p_user);
  return v_token;
end $$;

-- 시연 독자 이름(화면에서 구분이 안 되므로 가입 불가). 앱 POCO_RESERVED()와 같은 목록, 소문자
create or replace function public.poco__reserved(p_key text) returns boolean
language sql immutable as $$ select p_key = any(array['남형석','조은','김려원','김한결','이은수','김민지','이수동','joyce','신형철','김찬영']) $$;

-- ───────── 공개 함수 (브라우저가 부르는 것) ─────────
-- 아이디 규칙: 한글·영문·숫자·밑줄 2~16자. 대소문자만 다른 아이디는 같은 아이디로 본다.
create or replace function public.poco_username_available(p_username text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare v_name text := btrim(coalesce(p_username,''));
begin
  if v_name !~ '^[A-Za-z0-9_가-힣]{2,16}$' then return jsonb_build_object('ok',false,'error','invalid_username'); end if;
  if poco__reserved(lower(v_name)) or exists(select 1 from poco_users where username_key = lower(v_name)) then return jsonb_build_object('ok',false,'error','taken'); end if;
  return jsonb_build_object('ok',true);
end $$;

create or replace function public.poco_signup(p_username text, p_password text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare v_name text := btrim(coalesce(p_username,'')); v_id uuid;
begin
  if v_name !~ '^[A-Za-z0-9_가-힣]{2,16}$' then return jsonb_build_object('ok',false,'error','invalid_username'); end if;
  if p_password is null or char_length(p_password) < 6 or char_length(p_password) > 72 then return jsonb_build_object('ok',false,'error','weak_password'); end if;
  if poco__reserved(lower(v_name)) then return jsonb_build_object('ok',false,'error','taken'); end if;
  insert into poco_users(username, username_key, pw_hash)
  values (v_name, lower(v_name), extensions.crypt(p_password, extensions.gen_salt('bf', 10)))
  on conflict (username_key) do nothing
  returning id into v_id;
  if v_id is null then return jsonb_build_object('ok',false,'error','taken'); end if;
  update poco_users set last_login_at = now() where id = v_id;
  return jsonb_build_object('ok',true,'username',v_name,'token',poco__new_session(v_id));
end $$;

create or replace function public.poco_login(p_username text, p_password text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare u poco_users%rowtype;
begin
  select * into u from poco_users where username_key = lower(btrim(coalesce(p_username,'')));
  if not found then return jsonb_build_object('ok',false,'error','bad_credentials'); end if;
  if u.locked_until is not null and u.locked_until > now() then return jsonb_build_object('ok',false,'error','locked'); end if;
  if p_password is null or u.pw_hash <> extensions.crypt(p_password, u.pw_hash) then
    -- 10번 연속 틀리면 10분 잠금
    update poco_users set fails = case when fails + 1 >= 10 then 0 else fails + 1 end,
                          locked_until = case when fails + 1 >= 10 then now() + interval '10 minutes' else locked_until end
     where id = u.id;
    return jsonb_build_object('ok',false,'error','bad_credentials');
  end if;
  update poco_users set fails = 0, locked_until = null, last_login_at = now() where id = u.id;
  return jsonb_build_object('ok',true,'username',u.username,'token',poco__new_session(u.id));
end $$;

create or replace function public.poco_load(p_token text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare v_id uuid := poco__uid(p_token); v_name text; v_state jsonb;
begin
  if v_id is null then return jsonb_build_object('ok',false,'error','no_session'); end if;
  select username into v_name from poco_users where id = v_id;
  select state into v_state from poco_states where user_id = v_id;
  return jsonb_build_object('ok',true,'username',v_name,'state',v_state);
end $$;

create or replace function public.poco_save(p_token text, p_state jsonb) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare v_id uuid := poco__uid(p_token);
begin
  if v_id is null then return jsonb_build_object('ok',false,'error','no_session'); end if;
  if p_state is null or jsonb_typeof(p_state) <> 'object' or octet_length(p_state::text) > 400000 then
    return jsonb_build_object('ok',false,'error','bad_state');
  end if;
  insert into poco_states(user_id, state, updated_at) values (v_id, p_state, now())
  on conflict (user_id) do update set state = excluded.state, updated_at = now();
  return jsonb_build_object('ok',true);
end $$;

create or replace function public.poco_logout(p_token text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
begin
  delete from poco_sessions where token_hash = poco__hash(p_token);
  return jsonb_build_object('ok',true);
end $$;

-- 계정 삭제: 로그인된 본인만. 기록·세션도 함께 지워짐(cascade)
create or replace function public.poco_delete_account(p_token text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare v_id uuid := poco__uid(p_token);
begin
  if v_id is null then return jsonb_build_object('ok',false,'error','no_session'); end if;
  delete from poco_users where id = v_id;
  return jsonb_build_object('ok',true);
end $$;

-- 권한: 내부 도우미는 막고, 공개 함수만 anon(브라우저)에게 허용
revoke all on function public.poco__hash(text), public.poco__uid(text), public.poco__new_session(uuid), public.poco__reserved(text) from public, anon, authenticated;
revoke all on function public.poco_username_available(text), public.poco_signup(text,text), public.poco_login(text,text),
  public.poco_load(text), public.poco_save(text,jsonb), public.poco_logout(text), public.poco_delete_account(text) from public;
grant execute on function public.poco_username_available(text), public.poco_signup(text,text), public.poco_login(text,text),
  public.poco_load(text), public.poco_save(text,jsonb), public.poco_logout(text), public.poco_delete_account(text) to anon, authenticated;

-- ───────── 연구자용 보기 (대시보드 Table Editor / SQL Editor에서만 보임) ─────────
-- 계정 × 시 × 행마다 고른 색 코드 한 줄. status: done = 다 읽은 시, reading = 읽는 중
create or replace view public.poco_line_tags with (security_invoker = true) as
select u.username, t.poem, 'done'::text as status, (e.ord - 1)::int as line_index, e.code as color, s.updated_at
  from public.poco_states s
  join public.poco_users u on u.id = s.user_id
  cross join lateral jsonb_each(case when jsonb_typeof(s.state->'tags') = 'object' then s.state->'tags' else '{}'::jsonb end) as t(poem, codes)
  cross join lateral jsonb_array_elements_text(case when jsonb_typeof(t.codes) = 'array' then t.codes else '[]'::jsonb end) with ordinality as e(code, ord)
union all
select u.username, t.poem, 'reading'::text, (e.ord - 1)::int, e.code, s.updated_at
  from public.poco_states s
  join public.poco_users u on u.id = s.user_id
  cross join lateral jsonb_each(case when jsonb_typeof(s.state->'prog') = 'object' then s.state->'prog' else '{}'::jsonb end) as t(poem, codes)
  cross join lateral jsonb_array_elements_text(case when jsonb_typeof(t.codes) = 'array' then t.codes else '[]'::jsonb end) with ordinality as e(code, ord)
 where e.code is not null and not (s.state->'tags' ? t.poem);
revoke all on public.poco_line_tags from anon, authenticated;

notify pgrst, 'reload schema';
