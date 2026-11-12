// Poco UI 조각. 토큰은 shared.jsx T(유지). [신규] 표시는 이번에 새로 만든 요소.
// 배경: 종이 질감(사용자 제공 이미지, 평균 #EEEBDF)
const PAPER = "#EFEBE1 url("+window.__resources['r_poco_2dpaper']+") 0 0/960px 960px repeat";
const pocoCss = `
#stage *{scrollbar-width:none}
#stage *::-webkit-scrollbar{display:none}

.pk-hit{cursor:pointer;user-select:none}
.pk-row{transition:background .1s,opacity .12s}
.pk-row:hover{background:${T.band}}
.pk-chip{transition:transform .08s}
.pk-chip:hover{transform:scale(1.06)}
.pk-btn{transition:background .1s,border-color .1s}
.pk-btn:hover{filter:brightness(1.08)}
.pk-link{color:${T.ink2};text-decoration:underline;text-underline-offset:3px;cursor:pointer}
.pk-link:hover{color:${T.ink}}
.pk-back:hover{background:${T.band}}
@keyframes pkReveal{from{clip-path:inset(0 0 100% 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes pkIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes pkFill{from{transform:scale(.6);opacity:.4}to{transform:none;opacity:1}}
`;
const PocoStyle = () => <style>{pocoCss}</style>;

// 로고: 사용자 제공 POCO 가로형(ink). size = 높이 기준값(이전 글자 크기와 같은 시각 비중). 어두운 바탕은 reverse
const Wordmark = ({size=22, reverse}) => <img src={reverse?window.__resources['r_poco_2dlogo_2dreverse']:window.__resources['r_poco_2dlogo_2dink']} alt="POCO" style={{height:Math.round(size*1.25),width:'auto',display:'block',flex:'none'}}/>;

// 색 칸. c: 좌표 | 'SKIP' | undefined(아직)
function Sq({c, w=30, h, r=3, style, title, onClick, cls}){
  h = h||w; let b;
  if(c==null || (c!=='SKIP' && !PC[c])) b={border:`1.5px dotted ${T.disabled}`}; // 아직(undefined·null)이나 모르는 코드는 빈 칸
  else if(c==='SKIP') b={border:`1.5px dotted ${T.caption}`};
  else if(c==='T1') b={border:`1.5px dashed ${T.caption}`};
  else if(c==='WH') b={background:'#fff',boxShadow:`inset 0 0 0 1px ${T.disabled}`};
  else b={background:PC[c][1],boxShadow:'inset 0 0 0 1px rgba(0,0,0,.1)'};
  return <div title={title!==undefined?title:pcLabel(c)} onClick={onClick} className={cls} style={{width:w,height:h,borderRadius:r,boxSizing:'border-box',flex:'none',display:'flex',alignItems:'center',justifyContent:'center',...b,...style}}>
    {c==='SKIP' && w>=20 ? <span style={{font:`400 ${Math.min(14,w/2)}px ${T.sans}`,color:T.caption}}>–</span> : null}</div>;
}

// 팔레트: 맨 위 '색 없음' + 8열 격자(유채색 4줄 + 무채색 1줄). 호버 = 확대만, 이름 표시 없음
function Palette({sel, onPick, sw=44, gap=6, cg=14, rowGap, onHover}){
  const rg = rowGap==null ? gap : rowGap;
  const cell = (c,k) => <div key={k} className="pk-hit pk-chip" onClick={()=>onPick&&onPick(c)} onMouseEnter={()=>onHover&&onHover(c)} onMouseLeave={()=>onHover&&onHover(null)}
    style={{outline:sel===c?`2px solid ${T.ink}`:'none',outlineOffset:2,borderRadius:4}}><Sq c={c} w={sw} r={4} title=""/></div>;
  return <div style={{display:'flex',flexDirection:'column'}}>
    <div style={{display:'flex',gap}}>{PC_TOP.map((c,k)=>cell(c,'t'+k))}</div>
    <div style={{height:cg+rg}}></div>
    <div style={{display:'grid',gridTemplateColumns:`repeat(${PC_COLS},${sw}px)`,columnGap:gap,rowGap:rg}}>{PC_GRID.map((c,k)=>cell(c,'g'+k))}</div>
  </div>;
}
const paletteW = (sw=44,gap=6) => PC_COLS*sw+(PC_COLS-1)*gap;

// 세로 바코드 (행 순서 = 위→아래, 연 사이 틈) [유지: Barcode 구조]
function VBar({colors, st, w=40, h=18, sg=5, hl=null, changed=[], dim, anim}){
  // 칸 사이 테두리 없음. 색 없음·건너뜀·아직 = 빈칸(투명)
  return <div style={{display:'flex',flexDirection:'column',width:w,animation:anim?`pkReveal ${anim}ms steps(${colors.length}) both`:'none'}}>
    {colors.map((c,i)=>{ const on = hl===i || changed.includes(i); const hex = c && PC[c] ? PC[c][1] : null;
      return <div key={i} title={`${i+1}행`} style={{width:w,height:h,flex:'none',background:hex||'transparent',boxShadow:c==='WH'?'inset 0 0 0 1px rgba(0,0,0,.12)':'none',marginTop:i>0&&st[i]!==st[i-1]?sg:0,opacity:dim&&hl!=null&&hl!==i?.3:1,
        outline:on?`2px solid ${T.ink}`:'none',outlineOffset:1,position:'relative',zIndex:on?1:0,transition:'opacity .12s'}}></div>; })}
  </div>;
}

// 버튼 (Btn 규격 유지, 클릭 가능하게 변형)
function PBtn({kind='primary', onClick, children, h=56, disabled, style}){
  const k = {
    primary:{background:T.ink,color:'#fff',border:`1px solid ${T.ink}`},
    low:{background:'transparent',color:T.caption,border:`1px solid ${T.line}`},
    secondary:{background:T.surface,color:T.ink,border:`1px solid ${T.line}`},
    text:{background:'transparent',color:T.ink2,border:'1px solid transparent',padding:'0 10px'},
  }[disabled&&kind==='primary'?'low':kind];
  return <div className={disabled?'':'pk-hit pk-btn'} onClick={disabled?undefined:onClick} style={{height:h,minWidth:44,padding:'0 26px',display:'inline-flex',alignItems:'center',justifyContent:'center',gap:8,borderRadius:6,
    font:`500 ${h>=56?17:15}px ${T.sans}`,boxSizing:'border-box',whiteSpace:'nowrap',...k,cursor:disabled?'default':'pointer',...style}}>{children}</div>;
}

// 화면 안 전환(작품/작가, 색 1개/비슷한 조합): 메뉴를 늘리지 않고 같은 자리에서 바꿈
function PhSeg({items, cur, style}){
  return <div style={{position:'absolute',display:'flex',border:`1px solid ${T.line}`,borderRadius:6,overflow:'hidden',zIndex:3,background:T.surface,...style}}>
    {items.map(([k,l,fn])=><div key={k} className="pk-hit" onClick={()=>cur!==k&&fn()} style={{height:44,padding:'0 18px',display:'flex',alignItems:'center',whiteSpace:'nowrap',font:`${cur===k?700:400} 14px ${T.sans}`,background:cur===k?T.band:'transparent',color:cur===k?T.ink:T.ink2}}>{l}</div>)}</div>;
}
// 상단 내비: 진입점 4개(홈·작품·나의 서재·색으로 찾기). 좌측 내비 대신 상단 — 메뉴가 4개뿐이고 F2·F6의 가로 비교에 폭이 필요
const NAV_ITEMS = [['home','홈'],['list','시'],['poets','시인'],['find','색으로 찾기'],['text','구절로 찾기']]; // 나의 서재는 프로필(마이페이지) 안으로
// 로그인 상태: PocoApp이 제공. 로그아웃이면 우측에 로그인(텍스트)·회원가입(외곽선) — 일반 웹 관습(제이콥)
const PocoAuth = React.createContext(true);
// 통합 검색: 시 제목·시인·구절을 한 칸에서. 입력 후 Enter → 구절로 찾기 화면에 검색어를 넘김
function NavSearch({go, active}){
  const [q,setQ]=React.useState('');
  const submit=()=>{ const t=q.trim(); if(t) go&&go('text',{tq:t}); };
  return <label style={{display:'flex',alignItems:'center',gap:10,height:44,width:active==='text'?0:240,overflow:'hidden',padding:active==='text'?0:'0 16px',boxSizing:'border-box',background:T.surface,border:`1px solid ${T.line}`,borderRadius:22,marginRight:16,opacity:active==='text'?0:1,transition:'width .2s'}}>
    <svg width="18" height="18" viewBox="0 0 22 22" fill="none" stroke={T.ink2} strokeWidth="1.8" style={{flex:'none'}}><circle cx="9.5" cy="9.5" r="7"></circle><path d="M14.6 14.6L20 20"></path></svg>
    <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') submit(); }} placeholder="시·시인·구절 검색" style={{flex:1,minWidth:0,border:'none',outline:'none',background:'transparent',font:`400 14px ${T.sans}`,color:T.ink}}/>
  </label>;
}
function TopNav({go, right, active:act0}){
  const authed = React.useContext(PocoAuth);
  const active={lib:'me'}[act0]||act0;
  return <div style={{position:'absolute',left:0,top:0,right:0,height:72,display:'flex',alignItems:'center',padding:'0 48px',gap:32,borderBottom:`1px solid ${T.line}`,boxSizing:'border-box',background:'transparent',zIndex:5}}>
    {active!=='home' && <div className="pk-hit pk-back" onClick={()=>go&&go('__back')} title="뒤로" aria-label="뒤로" style={{width:44,height:44,marginLeft:-14,marginRight:-20,borderRadius:22,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke={T.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13.5 4.5L7 11l6.5 6.5"></path></svg></div>}
    <div className="pk-hit" onClick={()=>go&&go('home')} style={{height:44,display:'flex',alignItems:'center',marginRight:8}}><Wordmark/></div>
    {NAV_ITEMS.map(([k,l])=><div key={k} className="pk-hit" onClick={()=>go&&go(k)} style={{height:44,display:'flex',alignItems:'center',font:`${active===k?700:400} 15px ${T.sans}`,color:active===k?T.ink:T.ink2,borderBottom:`2px solid ${active===k?T.ink:'transparent'}`,boxSizing:'border-box'}}>{l}</div>)}
    <div style={{flex:1}}></div>{right}
    {authed && <NavSearch go={go} active={active}/>}
    {!authed && <div style={{display:'flex',alignItems:'center',gap:12}}>
      <div className="pk-hit" onClick={()=>go&&go('login',{mode:'login'})} style={{height:44,padding:'0 12px',display:'flex',alignItems:'center',font:`${active==='login'?700:400} 15px ${T.sans}`,color:active==='login'?T.ink:T.ink2}}>로그인</div>
      <div className="pk-hit pk-btn" onClick={()=>go&&go('login',{mode:'signup'})} style={{height:44,padding:'0 18px',display:'flex',alignItems:'center',border:`1px solid ${active==='signup'?T.ink:T.line}`,borderRadius:6,background:T.surface,font:`500 15px ${T.sans}`,color:T.ink,boxSizing:'border-box'}}>회원가입</div></div>}
    {authed && <div className="pk-hit" onClick={()=>go&&go('me')} title="마이페이지" style={{display:'flex',alignItems:'center',gap:10,height:44,font:`${active==='me'?700:500} 14px ${T.sans}`,color:active==='me'?T.ink:T.ink2}}>
      <div style={{width:28,height:28,borderRadius:'50%',background:T.band,display:'flex',alignItems:'center',justifyContent:'center',font:`500 12px ${T.sans}`,color:T.ink2}}>{ME==='김민지'?'민':ME_INI}</div>{ME}</div>}
    {authed && [['help','도움말',<><circle cx="12" cy="12" r="9"></circle><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7"></path><path d="M12 17h.01"></path></>],['settings','설정',<><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"></path></>]].map(([k,l,ic])=>
      <div key={k} className="pk-hit" onClick={()=>go&&go(k)} title={l} aria-label={l} style={{width:44,height:44,marginLeft:-12,borderRadius:22,display:'flex',alignItems:'center',justifyContent:'center',color:active===k?T.ink:T.ink2,background:active===k?T.band:'transparent'}}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{ic}</svg></div>)}
  </div>;
}
// --pw/--ph: set by index.html so the app fills the browser window; the canvas leaves them unset (1440×900).
const PFrame = ({children, style}) => <div style={{position:'relative',width:'var(--pw,1440px)',height:'var(--ph,900px)',background:PAPER,overflow:'hidden',fontFamily:T.sans,color:T.ink,...style}}><PocoStyle/>{children}</div>;
const Toast = ({text}) => text ? <div style={{position:'absolute',left:'50%',bottom:40,transform:'translateX(-50%)',background:T.ink,color:'#fff',font:`400 14px ${T.sans}`,padding:'12px 20px',borderRadius:6,zIndex:20,animation:'pkIn .15s both'}}>{text}</div> : null;

Object.assign(window,{PocoAuth,PhSeg,PAPER,PocoStyle,Wordmark,Sq,Palette,paletteW,VBar,PBtn,NavSearch,TopNav,PFrame,Toast});
