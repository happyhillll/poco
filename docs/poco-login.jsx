// [신규] 로그인·회원가입. 소셜 계정 버튼(입력 0) → 이메일은 한 단계 더(입력 2~3). 오류는 버튼 위 제자리 한 줄
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
function PhField({label, hint, type='text', value, onChange, placeholder, bad, onEnter}){
  return <label style={{display:'flex',flexDirection:'column',gap:8}}>
    <span style={{font:`500 13px ${T.sans}`,color:T.ink2}}>{label}{hint && <span style={{fontWeight:400,color:T.caption}}> · {hint}</span>}</span>
    <input className="pk-in" type={type} value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)} onKeyDown={e=>e.key==='Enter'&&onEnter&&onEnter()}
      style={{height:52,padding:'0 16px',border:`1px solid ${bad?T.ink:T.line}`,borderRadius:6,background:T.surface,font:`400 16px ${T.sans}`,color:T.ink,outline:'none',boxSizing:'border-box',width:'100%'}}/>
  </label>;
}
// mode: login · login-email · signup · signup-more · signup-email
function PhLogin({a, up, go}){
  const mode = a.mode||'login', signup = mode.startsWith('signup'), email = mode.endsWith('email');
  const bar = a.onbBar&&a.onbBar.length ? a.onbBar : null;
  const [f,setF] = React.useState(()=>({nick:'',email:'',pw:'',...(a.loginFill||{})}));
  const [err,setErr] = React.useState(a.loginErr||null);
  const set = k => v => { setF(s=>({...s,[k]:v})); setErr(null); };
  const done = () => { localStorage.setItem('poco.authed','1'); localStorage.setItem('poco.onboarded','1'); up({authed:true}); go(a.next||'home',{authed:true}); };
  const submit = () => {
    const miss = signup ? (!f.nick||!f.email||!f.pw) : (!f.email||!f.pw);
    if(miss) return setErr(signup?'닉네임·이메일·비밀번호를 모두 입력해 주세요.':'이메일과 비밀번호를 입력해 주세요.');
    done();
  };
  const to = m => { setErr(null); up({mode:m}); };
  const verb = signup?'회원가입':'로그인';
  const title = email ? `이메일로 ${verb}` : signup ? <React.Fragment>새로운 감각의 자극!<br/>POCO에 오신 것을 환영해요.</React.Fragment> : '로그인';
  const sub = bar ? `${signup?'가입하면':'로그인하면'} 방금 만든 바코드가 나의 색 서재에 담겨요.` : null;
  const swap = <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:8,marginTop:20,font:`400 14px ${T.sans}`,color:T.caption}}>
    {signup?'이미 계정이 있으신가요?':'아직 회원이 아니신가요?'}
    <span className="pk-hit" onClick={()=>to(signup?'login':'signup')} style={{height:44,display:'inline-flex',alignItems:'center',font:`700 14px ${T.sans}`,color:T.ink}}>{signup?'로그인':'회원가입'}</span></div>;
  const back = <div style={{display:'flex',justifyContent:'center',marginTop:8}}>
    <span className="pk-link" onClick={()=>to(signup?'signup-more':'login')} style={{height:44,display:'inline-flex',alignItems:'center',font:`400 14px ${T.sans}`}}>다른 방법으로 {verb}</span></div>;
  return <PFrame><TopNav go={go} active={signup?'signup':'login'}/>
    <style>{`.pk-in::placeholder{color:${T.disabled}}.pk-in:focus{border-color:${T.ink}!important}`}</style>
    <div style={{position:'absolute',left:'50%',top:signup&&!email?120:132,width:400,transform:'translateX(-50%)',display:'flex',flexDirection:'column'}}>
      {bar && <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:14,marginBottom:24}}>
        <div style={{display:'flex'}}>{bar.map((c,i)=><Sq key={i} c={c} w={24} h={40} r={0}/>)}</div>
        <div style={{font:`400 13px/1.5 ${T.sans}`,color:T.caption}}>온보딩에서 만든 바코드 · {bar.length}행</div></div>}
      <div style={{font:`700 30px/1.45 ${T.serif}`,color:T.ink,textAlign:'center',textWrap:'balance'}}>{title}</div>
      {sub && <div style={{font:`400 15px/1.6 ${T.sans}`,color:T.ink2,marginTop:8,textAlign:'center'}}>{sub}</div>}
      {!email && <div style={{display:'flex',flexDirection:'column',gap:12,marginTop:40}}>
        <SocBtn k="kakao" verb={verb} onClick={done}/>
        <SocBtn k="apple" verb={verb} onClick={done}/>
        {(mode==='login'||mode==='signup-more') && <React.Fragment>
          <SocBtn k="google" verb={verb} onClick={done}/>
          <SocBtn k="x" verb={verb} onClick={done}/>
          <SocBtn k="line" verb={verb} onClick={done}/>
          <SocBtn k="email" verb={verb} onClick={()=>to(signup?'signup-email':'login-email')}/>
        </React.Fragment>}
        {mode==='signup' && <SocBtn k="more" label="다른 방법으로 회원가입" onClick={()=>to('signup-more')}/>}
      </div>}
      {email && <React.Fragment>
        <div style={{display:'flex',flexDirection:'column',gap:20,marginTop:36}}>
          {signup && <PhField label="닉네임" hint="다른 독자에게 보이는 이름" value={f.nick} onChange={set('nick')} placeholder="예: 밤산책" bad={err&&!f.nick} onEnter={submit}/>}
          <PhField label="이메일" type="email" value={f.email} onChange={set('email')} placeholder="name@example.com" bad={err&&!f.email} onEnter={submit}/>
          <PhField label="비밀번호" type="password" value={f.pw} onChange={set('pw')} placeholder={signup?'8자 이상':''} bad={err&&!f.pw} onEnter={submit}/>
        </div>
        <div style={{height:24,marginTop:12,font:`400 13px ${T.sans}`,color:T.ink,display:'flex',alignItems:'center'}}>{err}</div>
        <PBtn onClick={submit} style={{width:'100%',marginTop:4}}>{signup?'가입하기':'로그인'}</PBtn>
        {back}
      </React.Fragment>}
      {swap}
    </div>
  </PFrame>;
}
Object.assign(window,{PhLogin});
