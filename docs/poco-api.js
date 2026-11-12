// Poco 계정·기록 서버 연결 (Supabase RPC). 라이브러리 없이 fetch만 사용.
// - 가입·로그인: 아이디 + 비밀번호(이메일 없음). 서버가 준 토큰을 localStorage 'poco.session'에 보관
// - 기록: 앱 상태(localStorage 'poco.state.v1')를 계정별로 서버에 저장(1초 모아서), 시작할 때 서버 것을 내려받음
// - poco-config.js가 비어 있으면: localhost에서만 이 브라우저 안의 연습용 저장소로 동작(개발 확인용), 그 밖에서는 안내 문구
(function(){
  const CFG = window.POCO_SUPABASE || {};
  const SESSION_KEY = 'poco.session', STATE_KEY = 'poco.state.v1', MOCK_KEY = 'poco.mock.db';
  const configured = !!(CFG.url && CFG.key);
  const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  // localhost에서 localStorage 'poco.mock'='1' 이면 설정이 있어도 연습용 저장소를 씀(검증용, 실제 서버에 계정을 만들지 않으려고)
  const mock = isLocal && (!configured || localStorage.getItem('poco.mock')==='1');
  const NAME_RE = /^[A-Za-z0-9_가-힣]{2,16}$/;
  const ERR = {
    invalid_username: '아이디는 한글·영문·숫자·밑줄(_) 2~16자로 정해 주세요.',
    taken: '이미 쓰고 있는 아이디예요. 다른 아이디를 골라 주세요.',
    weak_password: '비밀번호는 6자 이상으로 입력해 주세요.',
    bad_credentials: '아이디 또는 비밀번호가 맞지 않아요.',
    locked: '여러 번 틀려서 잠시 잠겼어요. 10분 뒤에 다시 시도해 주세요.',
    no_session: '로그인이 만료되었어요. 다시 로그인해 주세요.',
    bad_state: '기록을 저장하지 못했어요.',
    not_configured: '서버 연결 설정이 아직 없어요. (poco-config.js)',
    network: '서버에 연결하지 못했어요. 잠시 뒤 다시 시도해 주세요.',
  };

  const getSession = () => { try{ const s = JSON.parse(localStorage.getItem(SESSION_KEY)||'null'); return s && s.token && s.user ? s : null; }catch(e){ return null; } };
  const setSession = s => localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  const clearLocal = () => { [SESSION_KEY,'poco.authed',STATE_KEY].forEach(k=>localStorage.removeItem(k)); };

  // ── 연습용 저장소(localhost + 설정 없음). 서버 함수와 같은 모양의 답을 돌려준다
  const sha = async t => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)))).map(b=>b.toString(16).padStart(2,'0')).join('');
  const mdb = () => { try{ return JSON.parse(localStorage.getItem(MOCK_KEY)||'null') || {users:{},sessions:{}}; }catch(e){ return {users:{},sessions:{}}; } };
  const mput = d => localStorage.setItem(MOCK_KEY, JSON.stringify(d));
  async function mockRpc(fn, p){
    const d = mdb(); const name = (p.p_username||'').trim(), key = name.toLowerCase();
    const uid = () => d.sessions[p.p_token];
    const newTok = k => { const t = Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b=>b.toString(16).padStart(2,'0')).join(''); d.sessions[t] = k; return t; };
    switch(fn){
      case 'poco_username_available': return !NAME_RE.test(name) ? {ok:false,error:'invalid_username'} : d.users[key] ? {ok:false,error:'taken'} : {ok:true};
      case 'poco_signup': {
        if(!NAME_RE.test(name)) return {ok:false,error:'invalid_username'};
        if(!p.p_password || [...p.p_password].length<6) return {ok:false,error:'weak_password'};
        if(d.users[key]) return {ok:false,error:'taken'};
        d.users[key] = {username:name, pw:await sha(key+'|'+p.p_password), state:null}; const token = newTok(key); mput(d); return {ok:true,username:name,token}; }
      case 'poco_login': { const u = d.users[key];
        if(!u || u.pw !== await sha(key+'|'+(p.p_password||''))) return {ok:false,error:'bad_credentials'};
        const token = newTok(key); mput(d); return {ok:true,username:u.username,token}; }
      case 'poco_load': { const u = d.users[uid()]; return u ? {ok:true,username:u.username,state:u.state} : {ok:false,error:'no_session'}; }
      case 'poco_save': { const u = d.users[uid()]; if(!u) return {ok:false,error:'no_session'}; u.state = p.p_state; mput(d); return {ok:true}; }
      case 'poco_logout': delete d.sessions[p.p_token]; mput(d); return {ok:true};
      case 'poco_delete_account': { const k = uid(); if(!k) return {ok:false,error:'no_session'}; delete d.users[k]; Object.keys(d.sessions).forEach(t=>{ if(d.sessions[t]===k) delete d.sessions[t]; }); mput(d); return {ok:true}; }
    }
    return {ok:false,error:'network'};
  }

  async function rpc(fn, params, opt){
    if(mock) return mockRpc(fn, params);
    if(!configured) return {ok:false,error:'not_configured'};
    try{
      const h = {'Content-Type':'application/json', apikey:CFG.key};
      if(CFG.key.startsWith('eyJ')) h.Authorization = 'Bearer '+CFG.key; // 예전 anon 키(JWT)일 때만
      const r = await fetch(CFG.url.replace(/\/+$/,'')+'/rest/v1/rpc/'+fn, {method:'POST', headers:h, body:JSON.stringify(params), keepalive:!!(opt&&opt.keepalive)});
      if(!r.ok) return {ok:false,error:'network',status:r.status};
      const j = await r.json(); return j && typeof j==='object' ? j : {ok:false,error:'network'};
    }catch(e){ return {ok:false,error:'network'}; }
  }

  // ── 기록 저장: 바뀐 내용만, 1초 모아서 한 번
  let timer = null, pending = null, lastSent = null, saving = Promise.resolve();
  const send = (json, opt) => { const s = getSession(); if(!s) return Promise.resolve({ok:false,error:'no_session'});
    lastSent = json;
    return rpc('poco_save', {p_token:s.token, p_state:JSON.parse(json)}, opt).then(r=>{
      if(!r.ok && lastSent===json) lastSent = null; // 실패하면 다음 변경 때 다시 보냄
      if(!r.ok && r.error==='no_session'){ clearLocal(); location.reload(); }
      return r; }); };
  const flush = opt => { clearTimeout(timer); timer = null; if(pending==null) return saving; const j = pending; pending = null; saving = send(j, opt); return saving; };
  function save(obj){ if(!getSession()) return; let json; try{ json = JSON.stringify(obj); }catch(e){ return; }
    if(json===lastSent || json===pending) return; pending = json; clearTimeout(timer); timer = setTimeout(()=>flush(), 1000); }
  addEventListener('pagehide', ()=>flush({keepalive:true}));
  document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState==='hidden') flush({keepalive:true}); });

  async function enter(fn, username, password){
    const r = await rpc(fn, {p_username:username.trim(), p_password:password});
    if(!r.ok) return r;
    setSession({token:r.token, user:r.username});
    const l = fn==='poco_login' ? await rpc('poco_load', {p_token:r.token}) : {ok:true,state:null};
    if(!l.ok){ clearLocal(); return l; }
    return {ok:true, username:r.username, state:l.state||null};
  }

  window.PocoAPI = {
    configured, mock, NAME_RE,
    user: () => { const s = getSession(); return s ? s.user : null; },
    errText: code => ERR[code] || ERR.network,
    available: username => rpc('poco_username_available', {p_username:username.trim()}),
    signup: (u,p) => enter('poco_signup', u, p),
    login: (u,p) => enter('poco_login', u, p),
    save, flush,
    // 로그인 직후: 이 계정의 기록을 브라우저에 깔고(서버에도 올리고) 새로 시작
    adopt: async state => { localStorage.setItem(STATE_KEY, JSON.stringify(state||{})); localStorage.setItem('poco.authed','1');
      if(state){ pending = JSON.stringify(state); await flush(); } },
    logout: async () => { await flush(); const s = getSession(); if(s) await rpc('poco_logout', {p_token:s.token}); clearLocal(); location.reload(); },
    deleteAccount: async () => { clearTimeout(timer); pending = null; const s = getSession(); const r = s ? await rpc('poco_delete_account', {p_token:s.token}) : {ok:true};
      if(!r.ok && r.error!=='no_session') return r; clearLocal(); localStorage.removeItem('poco.onboarded'); location.reload(); return {ok:true}; },
    // 앱을 그리기 전에 한 번: 로그인 상태면 서버 기록을 내려받아 브라우저 저장본을 맞춘다
    boot: async () => {
      const s = getSession();
      if(!s){ // 로그인 정보가 없으면 예전 시연용 로그인·기록 흔적을 지움
        const had = localStorage.getItem('poco.authed'); localStorage.removeItem('poco.authed');
        if(had || !localStorage.getItem('poco.v2')) localStorage.removeItem(STATE_KEY);
        localStorage.setItem('poco.v2','1'); return; }
      localStorage.setItem('poco.v2','1');
      const r = await rpc('poco_load', {p_token:s.token});
      if(r.ok){ localStorage.setItem('poco.authed','1'); if(r.state){ localStorage.setItem(STATE_KEY, JSON.stringify(r.state)); lastSent = null; } }
      else if(r.error==='no_session'){ clearLocal(); location.reload(); return new Promise(()=>{}); } // 만료: 로그아웃 상태로 새로 시작
      // 그 밖의 오류(네트워크)는 브라우저에 남은 기록으로 계속
    },
  };
})();
