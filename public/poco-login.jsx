// 로그인·회원가입: 아이디 + 비밀번호(아래 PhLogin). 오류는 버튼 위 제자리 한 줄. SOCIAL·SocBtn은 예전 소셜 버튼(지금은 화면에서 쓰지 않음)
// 소셜 버튼만 각 서비스 표시 규정 색(카카오 노랑·Apple 검정·LINE 초록)을 쓴다 — 회색조 규칙의 유일한 예외(주석 ⑤ 충돌 기록)
const SOCIAL = {
  kakao:{l:'카카오',bg:'#FEE500',c:'rgba(0,0,0,.85)',b:'#FEE500'},
  apple:{l:'Apple',bg:'#000',c:'#fff',b:'#000'},
  google:{l:'Google',bg:'#F2F2F2',c:T.ink,b:'#F2F2F2'},
  x:{l:'X',bg:T.surface,c:T.ink,b:T.line},
  line:{l:'LINE',bg:'#06C755',c:'#fff',b:'#06C755'},
  email:{l:'이메일',bg:T.surface,c:T.ink,b:T.line},
};
function SocBtn({k, verb, onClick, label}){
  const s = SOCIAL[k] || {bg:T.surface,c:T.ink,b:T.line};
  const ic = SOCIAL[k] ? <img src={window.__resources['r_login_'+k]} alt="" style={{width:34,height:34,display:'block'}}/> : null;
  return <div className="pk-hit pk-btn" onClick={onClick} style={{position:'relative',height:56,borderRadius:6,background:s.bg,color:s.c,border:`1px solid ${s.b}`,boxSizing:'border-box',display:'flex',alignItems:'center',justifyContent:'center',font:`500 16px ${T.sans}`}}>
    {ic && <div style={{position:'absolute',left:16,top:'50%',transform:'translateY(-50%)',display:'flex'}}>{ic}</div>}
    {label || `${s.l}${k==='line'?'으로':'로'} ${verb}`}</div>;
}
function PhField({label, hint, type='text', value, onChange, placeholder, bad, onEnter, ac, note, onBlur}){
  return <label style={{display:'flex',flexDirection:'column',gap:8}}>
    <span style={{font:`500 13px ${T.sans}`,color:T.ink2}}>{label}{hint && <span style={{fontWeight:400,color:T.caption}}> · {hint}</span>}</span>
    <input className="pk-in" type={type} value={value} placeholder={placeholder} autoComplete={ac} autoCapitalize="off" spellCheck={false} onBlur={onBlur} onChange={e=>onChange(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.nativeEvent.isComposing&&onEnter&&onEnter()}
      style={{height:52,padding:'0 16px',border:`1px solid ${bad?T.ink:T.line}`,borderRadius:6,background:T.surface,font:`400 16px ${T.sans}`,color:T.ink,outline:'none',boxSizing:'border-box',width:'100%'}}/>
    {note!==undefined && <span style={{minHeight:18,font:`400 12px ${T.sans}`,color:T.caption,marginTop:-2}}>{note}</span>}
  </label>;
}
// 아이디 + 비밀번호만으로 가입·로그인(이메일·소셜 계정 없음 = 익명). 아이디는 서버에서 중복 검사
// mode: login · signup (예전 signup-more·signup-email·login-email 주소도 같은 화면으로)
const POCO_RESERVED = () => [...new Set([...NICK,...PILOT_R,...Object.values(WORKS).flatMap(w=>namesOf(w)),'나'])]; // 시연 독자 이름과 겹치면 화면에서 구분이 안 되므로 막음
function PhLogin({a, up, go}){
  const mode = a.mode||'login', signup = mode.startsWith('signup');
  const bar = a.onbBar&&a.onbBar.length ? a.onbBar : null;
  const API = window.PocoAPI; // 캔버스(시연 프레임)에는 없음 → 버튼만 동작
  const [f,setF] = React.useState(()=>({id:'',pw:'',pw2:'',...(a.loginFill||{})}));
  const [err,setErr] = React.useState(a.loginErr||null);
  const [busy,setBusy] = React.useState(false);
  const [avail,setAvail] = React.useState(null); // 가입 아이디 확인: null | {id, ok, msg}
  const set = k => v => { setF(s=>({...s,[k]:v})); setErr(null); };
  const id = f.id.trim();
  const localIdErr = v => !/^[A-Za-z0-9_가-힣]{2,16}$/.test(v) ? '아이디는 한글·영문·숫자·밑줄(_) 2~16자로 정해 주세요.' : POCO_RESERVED().includes(v) ? '이미 쓰고 있는 아이디예요. 다른 아이디를 골라 주세요.' : null;
  // 가입: 입력을 멈추면 0.4초 뒤 중복 확인
  React.useEffect(()=>{ if(!signup||!API) return; setAvail(null); if(!id) return;
    const le = localIdErr(id); if(le){ setAvail({id,ok:false,msg:le}); return; }
    let live = true; const t = setTimeout(()=>API.available(id).then(r=>{ if(live) setAvail(r.ok?{id,ok:true,msg:'쓸 수 있는 아이디예요.'}:{id,ok:false,msg:API.errText(r.error),soft:r.error!=='taken'&&r.error!=='invalid_username'}); }),400);
    return ()=>{ live=false; clearTimeout(t); }; },[id,signup]);
  // 온보딩 바코드(「사랑가」 11~14행)를 오늘의 시 진행으로 이어 저장
  const withBar = st => { const s={...(st||{})}; if(!bar||!WORKS.sar||(s.tags||{}).sar) return st;
    const n=WORKS.sar.lines.length, off=n-bar.length, old=((s.prog||{}).sar)||[]; const p=Array.from({length:n},(_,i)=>old[i]==null?undefined:old[i]);
    bar.forEach((c,j)=>{ if(p[off+j]===undefined) p[off+j]=c; }); s.prog={...(s.prog||{}),sar:p}; return s; };
  const demoDone = () => { localStorage.setItem('poco.authed','1'); localStorage.setItem('poco.onboarded','1');
    up(s=>({authed:true,...(withBar(s)===s?{}:{prog:withBar(s).prog})})); go(a.next||'home',{authed:true,next:null,onbBar:null}); };
  const submit = async () => {
    if(busy) return;
    if(!id||!f.pw||(signup&&!f.pw2)) return setErr(signup?'아이디와 비밀번호를 모두 입력해 주세요.':'아이디와 비밀번호를 입력해 주세요.');
    if(signup){ const le=localIdErr(id); if(le) return setErr(le);
      if([...f.pw].length<6) return setErr('비밀번호는 6자 이상으로 입력해 주세요.');
      if(f.pw!==f.pw2) return setErr('비밀번호가 서로 달라요. 다시 확인해 주세요.'); }
    if(!API) return demoDone();
    setBusy(true);
    const r = await (signup ? API.signup(id,f.pw) : API.login(id,f.pw));
    if(!r.ok){ setBusy(false); return setErr(API.errText(r.error)); }
    // 이 계정의 기록으로 새로 시작(이름·서재가 계정 것으로 바뀌도록 화면을 다시 불러옴)
    localStorage.setItem('poco.onboarded','1');
    await API.adopt(withBar(r.state));
    sessionStorage.setItem('poco.next', a.next&&a.next!=='login'?a.next:'home');
    location.reload();
  };
  const to = m => { setErr(null); go('login',{mode:m,next:a.next,onbBar:a.onbBar}); }; // 뒤로가기로 이전 단계에 돌아올 수 있게 화면 이동으로 기록
  const title = signup ? <React.Fragment>새로운 감각의 자극!<br/>POCO에 오신 것을 환영해요.</React.Fragment> : '로그인';
  const sub = bar ? `${signup?'가입하면':'로그인하면'} 방금 만든 바코드가 나의 색 서재에 담겨요.` : a.next && a.next!=='home' && !signup ? '로그인하면 보려던 화면으로 바로 이어져요.' : signup ? '아이디와 비밀번호만 정하면 돼요. 이름이나 이메일은 받지 않아요.' : null;
  const idNote = !signup ? undefined : avail&&avail.id===id ? <span style={{color:avail.ok?T.ink2:T.ink,fontWeight:avail.ok?400:500}}>{avail.msg}</span> : '다른 독자에게 보이는 이름이에요. 한글·영문·숫자 2~16자';
  const swap = <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:8,marginTop:20,font:`400 14px ${T.sans}`,color:T.caption}}>
    {signup?'이미 계정이 있으신가요?':'아직 회원이 아니신가요?'}
    <span className="pk-hit" onClick={()=>to(signup?'login':'signup')} style={{height:44,display:'inline-flex',alignItems:'center',font:`700 14px ${T.sans}`,color:T.ink}}>{signup?'로그인':'회원가입'}</span></div>;
  return <PFrame><TopNav go={go} active={signup?'signup':'login'}/>
    <style>{`.pk-in::placeholder{color:${T.disabled}}.pk-in:focus{border-color:${T.ink}!important}`}</style>
    <div style={{position:'absolute',left:'50%',top:signup?(bar?84:112):132,width:400,transform:'translateX(-50%)',display:'flex',flexDirection:'column'}}>
      {bar && <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:14,marginBottom:24}}>
        <div style={{display:'flex'}}>{bar.map((c,i)=><Sq key={i} c={c} w={24} h={40} r={0}/>)}</div>
        <div style={{font:`400 13px/1.5 ${T.sans}`,color:T.caption}}>온보딩에서 만든 바코드 · {bar.length}행</div></div>}
      <div style={{font:`700 30px/1.45 ${T.serif}`,color:T.ink,textAlign:'center',textWrap:'balance'}}>{title}</div>
      {sub && <div style={{font:`400 15px/1.6 ${T.sans}`,color:T.ink2,marginTop:8,textAlign:'center'}}>{sub}</div>}
      <div style={{display:'flex',flexDirection:'column',gap:signup?14:20,marginTop:32}}>
        <PhField label="아이디" value={f.id} onChange={set('id')} placeholder={signup?'예: 밤산책':''} bad={err&&(!id||(signup&&avail&&avail.id===id&&!avail.ok&&!avail.soft))} onEnter={submit} ac="username" note={idNote}/>
        <PhField label="비밀번호" type="password" value={f.pw} onChange={set('pw')} placeholder={signup?'6자 이상':''} bad={err&&!f.pw} onEnter={submit} ac={signup?'new-password':'current-password'}/>
        {signup && <PhField label="비밀번호 확인" type="password" value={f.pw2} onChange={set('pw2')} placeholder="한 번 더 입력" bad={err&&(!f.pw2||f.pw!==f.pw2)} onEnter={submit} ac="new-password"/>}
      </div>
      <div role="alert" style={{minHeight:24,marginTop:12,font:`400 13px ${T.sans}`,color:T.ink,display:'flex',alignItems:'center'}}>{err}</div>
      <PBtn onClick={submit} disabled={busy} style={{width:'100%',marginTop:4}}>{busy?'잠시만요…':signup?'가입하기':'로그인'}</PBtn>
      {signup && <div style={{font:`400 12px/1.6 ${T.sans}`,color:T.caption,marginTop:12,textAlign:'center'}}>이메일을 받지 않아서 비밀번호를 잊으면 되찾을 수 없어요. 꼭 기억해 두세요.</div>}
      {swap}
    </div>
  </PFrame>;
}
Object.assign(window,{PhLogin});
