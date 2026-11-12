// 마이페이지 — 프로필 + 나의 서재(책등)가 첫인상. 바코드가 쌓일수록 열리는 기능: 색 띠(시 순서·색 순서), 색 취향, 다시 읽기 기록, 읽은 날, 반응, 계정
const HUE_FAM = [['R','빨강'],['O','주황'],['Y','노랑'],['H','연두'],['G','초록'],['C','청록'],['B','파랑'],['P','보라'],['N','무채색']];
const famOf = c => !c||c==='T1'||c==='SKIP' ? null : /^[SLMD][ROYHGCBP]$/.test(c) ? c[1] : 'N';
const famHex = f => f==='N' ? PC.A2[1] : PC['S'+f][1];
const famIdx = c => { const f=famOf(c); if(!f) return 99; const hue=HUE_FAM.findIndex(([x])=>x===f); const tone={S:0,L:1,M:2,D:3}[c[0]]??4; return hue*10+tone; };
// 로그아웃: 앱은 서버 세션을 끝내고 이 브라우저의 기록 사본을 지운 뒤 새로 시작. 캔버스(시연)는 화면만 전환
const pocoLogout = (up,go) => { if(window.PocoAPI) return PocoAPI.logout(); localStorage.removeItem('poco.authed'); up({authed:false}); go('login',{mode:'login'}); };
function PhMe({a, up, go}){
  const done = WORK_KEYS.filter(k=>a.tags[k]); const reading = WORK_KEYS.filter(k=>workState(a,k)==='reading');
  const all = done.flatMap(k=>a.tags[k]).filter(c=>c&&PC[c]&&PC[c][1]);
  const cnt = {}; all.forEach(c=>{ const f=famOf(c); if(f) cnt[f]=(cnt[f]||0)+1; });
  const max = Math.max(1,...Object.values(cnt)); const top = HUE_FAM.filter(([f])=>cnt[f]).sort((x,y)=>cnt[y[0]]-cnt[x[0]]).slice(0,2);
  const myReacts = Object.entries(a.reacts||{}).flatMap(([pk,o])=>Object.entries(o).flatMap(([i,L])=>L.filter(r=>r.n===ME).map(r=>({...r,pk,i:+i}))));
  const fav = a.fav||[];
  const following=a.following||[], followers=a.followers||[]; const [fTab,setFTab]=React.useState(null); // null=닫힘 | 'ing' | 'er'
  const allPeople=[...new Set([...following,...followers])];
  const [order,setOrder] = React.useState('poem'); // 색 띠: 시 순서 / 색 순서
  const [confirm,setConfirm] = React.useState(false);
  const [toast,setToast] = React.useState(null); const say = t => { setToast(t); setTimeout(()=>setToast(null),1600); };
  const logout = () => pocoLogout(up,go);
  const byDay = {}; done.forEach(k=>{ const m=/(\d+)일/.exec(a.when[k]||TODAY); if(m) (byDay[+m[1]]=byDay[+m[1]]||[]).push(k); });
  const first = new Date(2026,9,1).getDay(), days = 31;
  const hist = done.map(k=>({k,h:(a.hist&&a.hist[k])||[]})).filter(x=>x.h.length);
  const strip = order==='poem' ? all : all.slice().sort((x,y)=>famIdx(x)-famIdx(y));
  const Sec = ({t, n, sub, link, onLink, children}) => <div style={{padding:'36px 0',borderTop:`1px solid ${T.line}`}}>
    <div style={{display:'flex',alignItems:'baseline',gap:10}}><span style={{font:`700 20px ${T.sans}`,color:T.ink,whiteSpace:'nowrap'}}>{t}</span>{n!=null&&<span style={{font:`400 16px ${T.sans}`,color:T.caption}}>{n}</span>}<div style={{flex:1}}></div>
      {link && <span className="pk-link" onClick={onLink} style={{font:`400 14px ${T.sans}`,whiteSpace:'nowrap'}}>{link}</span>}</div>
    {sub && <div style={{font:`400 14px/1.6 ${T.sans}`,color:T.ink2,marginTop:6}}>{sub}</div>}
    <div style={{marginTop:20}}>{children}</div></div>;
  // 숫자 4개: 같은 폭 칸에 라벨 위·숫자 아래로 정렬(게슈탈트 근접·정렬), 칸 사이 세로선으로 묶음 구분
  const stat = (v,l,i) => <div key={l} style={{display:'flex',flexDirection:'column',gap:4,padding:'0 28px 0 0',marginRight:28,borderRight:i<3?`1px solid ${T.line}`:'none',minWidth:84}}><span style={{font:`400 13px ${T.sans}`,color:T.ink2,whiteSpace:'nowrap'}}>{l}</span><span style={{font:`700 26px/1.1 ${T.sans}`,color:T.ink,fontVariantNumeric:'tabular-nums'}}>{v}</span></div>;
  return <PFrame><TopNav go={go} active="me"/>
    <style>{`.me-s{scrollbar-width:none}.me-s::-webkit-scrollbar{display:none}`}</style>
    <div className="me-s" style={{position:'absolute',left:0,right:0,top:72,bottom:0,overflowY:'auto'}}>
     <div style={{maxWidth:1040,margin:'0 auto',padding:'40px 48px 96px'}}>
      {/* 프로필 */}
      <div style={{display:'flex',alignItems:'center',gap:32}}>
        <div style={{width:112,height:112,borderRadius:'50%',background:T.ink,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',font:`500 36px ${T.sans}`,flex:'none',whiteSpace:'nowrap'}}>{ME_INI}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{font:`700 32px ${T.sans}`,color:T.ink}}>{ME}</div>
          <div style={{font:`400 14px ${T.sans}`,color:T.ink2,marginTop:6}}>{TODAY} 기준 · 10월에 {Object.keys(byDay).length}일 읽었어요</div>
          <div style={{display:'flex',alignItems:'flex-end',gap:28,marginTop:22}}>
            {[['er',followers.length,'팔로워'],['ing',following.length,'팔로잉']].map(([t,v,l])=><div key={t} className="pk-hit" onClick={()=>setFTab(fTab===t?null:t)} style={{display:'flex',alignItems:'baseline',gap:8,height:44}}>
              <span style={{font:`700 24px ${T.sans}`,color:T.ink,textDecoration:fTab===t?'underline':'none',textUnderlineOffset:6}}>{v}</span><span style={{font:`500 15px ${T.sans}`,color:T.ink}}>{l}</span></div>)}
            <div style={{width:1,height:20,background:T.line,alignSelf:'center'}}></div>
            {[[done.length,'다 읽은 시'],[myReacts.length,'남긴 반응']].map(([v,l])=><div key={l} style={{display:'flex',alignItems:'baseline',gap:6,height:44}}>
              <span style={{font:`700 17px ${T.sans}`,color:T.ink2}}>{v}</span><span style={{font:`400 14px ${T.sans}`,color:T.caption}}>{l}</span></div>)}</div></div>
        <div style={{display:'flex',gap:10}}>
          <PBtn kind="secondary" h={44} onClick={()=>say('프로필 수정 (시연)')}>프로필 수정</PBtn>
          <PBtn kind="secondary" h={44} onClick={()=>say('프로필 링크를 복사했어요 (시연)')}>프로필 공유</PBtn></div>
      </div>
      {fTab && <div style={{marginTop:28,padding:'20px 24px',background:T.surface,border:`1px solid ${T.line}`,borderRadius:8}}>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <div style={{display:'flex',border:`1px solid ${T.line}`,borderRadius:6,overflow:'hidden'}}>{[['er',`팔로워 ${followers.length}`],['ing',`팔로잉 ${following.length}`]].map(([m,l])=><div key={m} className="pk-hit" onClick={()=>setFTab(m)} style={{height:40,padding:'0 16px',display:'flex',alignItems:'center',font:`${fTab===m?700:400} 14px ${T.sans}`,background:fTab===m?T.band:T.surface,color:fTab===m?T.ink:T.ink2}}>{l}</div>)}</div>
          <span style={{font:`400 13px ${T.sans}`,color:T.caption}}>팔로잉한 독자는 시 상세에서 ‘친구의 색’으로 보여요.</span>
          <div style={{flex:1}}></div><span className="pk-link" onClick={()=>setFTab(null)} style={{font:`400 14px ${T.sans}`,height:44,display:'inline-flex',alignItems:'center'}}>닫기</span></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',columnGap:32,marginTop:8}}>
          {(fTab==='er'?followers:following).map(nm=>{ const on=following.includes(nm); const mutual=following.includes(nm)&&followers.includes(nm);
            return <div key={nm} style={{display:'flex',alignItems:'center',gap:12,height:60,borderBottom:`1px solid ${T.line}`}}>
              <div className="pk-hit" onClick={()=>go('user',{who:nm})} style={{display:'flex',alignItems:'center',gap:12,flex:1,minWidth:0,height:44}}><PhPic nm={nm} s={36}/><div style={{flex:1,minWidth:0}}><div style={{font:`700 14px ${T.sans}`,color:T.ink}}>{nm}</div><div style={{font:`400 12px ${T.sans}`,color:T.caption}}>{mutual?'맞팔로우':fTab==='er'?'나를 팔로우':'팔로잉'} · 함께 읽은 시 {WORK_KEYS.filter(k=>a.tags[k]&&namesOf(WORKS[k]).includes(nm)).length}편</div></div></div>
              <PBtn kind={on?'secondary':'primary'} h={36} onClick={()=>up(s=>({following:on?(s.following||[]).filter(x=>x!==nm):[...(s.following||[]),nm]}))} style={{padding:'0 14px',font:`500 13px ${T.sans}`}}>{on?'팔로잉':'팔로우'}</PBtn></div>; })}
        </div></div>}
      {/* 나의 서재 — 첫인상 */}
      <Sec t="나의 서재" n={done.length} link="서재 전체 보기" onLink={()=>go('lib')}>
        <div style={{display:'flex',alignItems:'flex-end',gap:40}}>
          <PhShelf a={a} ks={libKeys(a)} go={go} w={56} h={290} gap={8}/>
          {reading.length>0 && <div style={{paddingBottom:14}}>
            <div style={{font:`500 13px ${T.sans}`,color:T.ink2,marginBottom:10}}>읽는 중</div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>{reading.map(k=><div key={k} className="pk-hit" onClick={()=>go('read',{pk:k,readInit:contInit(a,k)})} style={{display:'flex',alignItems:'center',gap:14,minHeight:44}}>
              <HBar colors={contInit(a,k)} st={WORKS[k].st} w={200} h={18} empty/><div><div style={{font:`500 15px ${T.serif}`,color:T.ink,whiteSpace:'nowrap'}}>{WORKS[k].title}</div><div style={{font:`400 12px ${T.sans}`,color:T.caption,marginTop:2,whiteSpace:'nowrap'}}>{progOf(a,k)} / {WORKS[k].lines.length}행 · 이어 읽기</div></div></div>)}</div></div>}
        </div>
      </Sec>
      {/* 나의 색 띠: 모든 바코드를 한 줄로. 시 순서 ↔ 색 순서 */}
      <Sec t="나의 색 띠" n={`${all.length}행`}>
        <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:14}}>
          <div style={{display:'flex',border:`1px solid ${T.line}`,borderRadius:6,overflow:'hidden'}}>{[['poem','시 순서'],['hue','색 순서']].map(([m,l])=><div key={m} className="pk-hit" onClick={()=>setOrder(m)} style={{height:40,padding:'0 16px',display:'flex',alignItems:'center',font:`${order===m?700:400} 14px ${T.sans}`,background:order===m?T.band:T.surface,color:order===m?T.ink:T.ink2}}>{l}</div>)}</div>
          {order==='poem' && <span style={{font:`400 13px ${T.sans}`,color:T.caption}}>시 사이는 틈으로 나눴어요</span>}</div>
        {order==='poem'
          ? <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>{done.map(k=><div key={k} title={WORKS[k].title} className="pk-hit" onClick={()=>go('poem',{pk:k})} style={{display:'flex'}}>{a.tags[k].map((c,i)=><div key={i} style={{width:Math.max(6,Math.floor(900/Math.max(1,all.length))),height:36,background:c&&PC[c]&&PC[c][1]?PC[c][1]:'transparent'}}></div>)}</div>)}</div>
          : <div style={{display:'flex'}}>{strip.map((c,i)=><div key={i} title={pcLabel(c)} style={{width:Math.max(6,Math.floor(940/Math.max(1,all.length))),height:36,background:PC[c][1]}}></div>)}</div>}
        {top.length>0 && <div style={{display:'flex',alignItems:'center',gap:12,marginTop:18}}>
          <span style={{font:`500 17px ${T.sans}`,color:T.ink}}>‘{top.map(t=>t[1]).join('’과 ‘')}’을 자주 고르는 독자</span>
          <div style={{display:'flex',gap:4}}>{top.map(([f])=><div key={f} style={{width:22,height:22,borderRadius:3,background:famHex(f)}}></div>)}</div></div>}
      </Sec>
      {/* 색 취향 분석 */}
      <Sec t="색 취향 분석">
        <div style={{display:'flex',alignItems:'flex-end',gap:14,height:170}}>
          {HUE_FAM.map(([f,l])=>{ const v=cnt[f]||0; return <div key={f} title={`${l} · ${v}행`} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-end',height:'100%',gap:8}}>
            <span style={{font:`${v===max?700:400} 13px ${T.sans}`,color:v===max?T.ink:T.caption}}>{v||''}</span>
            <div style={{width:'100%',height:Math.max(4,v/max*120),background:famHex(f),borderRadius:'4px 4px 0 0',boxShadow:f==='N'?`inset 0 0 0 1px ${T.line}`:'none',opacity:v?1:.35}}></div>
            <span style={{font:`400 12px ${T.sans}`,color:T.ink2,whiteSpace:'nowrap'}}>{l}</span></div>; })}
        </div>
      </Sec>
      {/* 다시 읽기 기록: 처음 ↔ 지금 */}
      <Sec t="다시 읽기 기록" n={hist.length}>
        {hist.length ? <div style={{display:'flex',flexDirection:'column',gap:18}}>{hist.map(({k,h})=>{ const w=WORKS[k], f=(a.first&&a.first[k])||a.tags[k], ch=h.map(x=>x.line);
          return <div key={k} className="pk-hit pk-row" onClick={()=>go('re',{pk:k})} style={{display:'flex',alignItems:'center',gap:24,padding:'14px 16px',borderRadius:6,border:`1px solid ${T.line}`,background:T.surface}}>
            <div style={{width:200,flex:'none'}}><div style={{font:`500 17px ${T.serif}`,color:T.ink,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{w.title}</div><div style={{font:`400 12px ${T.sans}`,color:T.caption,marginTop:3}}>{w.poet} · 고친 행 {new Set(h.map(x=>x.line)).size}</div></div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}><span style={{width:30,font:`400 11px ${T.sans}`,color:T.caption}}>처음</span><HBar colors={f} st={w.st} w={300} h={14}/></div>
              <div style={{display:'flex',alignItems:'center',gap:10}}><span style={{width:30,font:`400 11px ${T.sans}`,color:T.caption}}>지금</span><HBar colors={a.tags[k]} st={w.st} w={300} h={14} changed={ch}/></div></div>
            <div style={{flex:1,minWidth:0,font:`400 13px/1.7 ${T.sans}`,color:T.ink2}}>{h.slice(-2).map((x,j)=><div key={j} style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{x.line+1}행 <Sq c={x.from} w={12} r={2} style={{display:'inline-block',verticalAlign:'middle'}}/> → <Sq c={x.to} w={12} r={2} style={{display:'inline-block',verticalAlign:'middle'}}/> {pcName(x.to)} · {x.kind} · {x.when}</div>)}</div>
            <span style={{font:`400 22px ${T.sans}`,color:T.caption}}>›</span></div>; })}</div>
          : <div style={{font:`400 14px ${T.sans}`,color:T.ink2}}>아직 다시 읽은 시가 없어요.</div>}
        {done.filter(k=>!hist.find(x=>x.k===k)).length>0 && <div style={{display:'flex',alignItems:'center',gap:10,marginTop:16,flexWrap:'wrap',font:`400 13px ${T.sans}`,color:T.caption}}>다시 읽어 볼 시
          {done.filter(k=>!hist.find(x=>x.k===k)).slice(0,4).map(k=><span key={k} className="pk-link" onClick={()=>go('re',{pk:k})} style={{font:`400 13px ${T.sans}`,height:36,display:'inline-flex',alignItems:'center'}}>{WORKS[k].title}</span>)}</div>}
      </Sec>
      {/* 10월 읽은 날 */}
      <Sec t="10월 읽은 날" n={`${Object.keys(byDay).length}일`}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',rowGap:10,textAlign:'center'}}>
          {['일','월','화','수','목','금','토'].map(d=><div key={d} style={{font:`400 13px ${T.sans}`,color:T.caption}}>{d}</div>)}
          {Array.from({length:first}).map((_,i)=><div key={'e'+i}></div>)}
          {Array.from({length:days},(_,i)=>i+1).map(d=>{ const ks=byDay[d]||[]; return <div key={d} className={ks.length?'pk-hit':''} onClick={ks.length?()=>go('poem',{pk:ks[0]}):undefined} title={ks.map(k=>WORKS[k].title).join(', ')} style={{height:64,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
            <span style={{font:`${d===19?700:400} 13px ${T.sans}`,color:d===19?T.ink:T.ink2}}>{d}</span>
            <div style={{display:'flex',gap:3}}>{ks.map(k=><div key={k} style={{width:12,height:34,borderRadius:2,overflow:'hidden',display:'flex',flexDirection:'column'}}>{a.tags[k].map((c,j)=><div key={j} style={{flex:1,background:c&&PC[c]&&PC[c][1]?PC[c][1]:'#ECE9E1'}}></div>)}</div>)}</div></div>; })}
        </div>
      </Sec>
      {/* 내가 남긴 반응 */}
      <Sec t="내가 남긴 반응" n={myReacts.length} sub="행 단위 대화에 남긴 글. 누르면 그 행으로 가요.">
        {myReacts.length ? <div style={{display:'flex',flexDirection:'column'}}>{myReacts.map(r=><div key={r.pk+'-'+r.id} className="pk-hit pk-row" onClick={()=>go('poem',{pk:r.pk,bub:{i:r.i,r:-1}})} style={{display:'flex',alignItems:'flex-start',gap:16,padding:'14px 8px',borderBottom:`1px solid ${T.line}`,borderRadius:4}}>
            <Sq c={r.c} w={28} r={3} style={{marginTop:2}}/>
            <div style={{flex:1,minWidth:0}}><div style={{font:`400 15px/1.6 ${T.sans}`,color:T.ink}}>{r.t}</div>
              <div style={{font:`400 12px ${T.sans}`,color:T.caption,marginTop:4,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>「{WORKS[r.pk].title}」 {r.i+1}행 · “{WORKS[r.pk].lines[r.i]}”</div></div></div>)}</div>
          : <div style={{font:`400 14px ${T.sans}`,color:T.ink2}}>아직 남긴 반응이 없어요. 작품 공간에서 행을 누르면 반응을 남길 수 있어요.</div>}
      </Sec>
      {/* 찜한 시 */}
      {fav.length>0 && <Sec t="찜한 시" n={fav.length}>
        <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>{fav.map(k=><div key={k} className="pk-hit pk-card" onClick={()=>go('poem',{pk:k})} style={{width:220,height:84,boxSizing:'border-box',background:T.surface,border:`1px solid ${T.line}`,borderRadius:6,padding:'0 20px',display:'flex',flexDirection:'column',justifyContent:'center',gap:4}}>
          <div style={{font:`400 18px ${T.serif}`,color:T.ink,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{WORKS[k].title}</div><div style={{font:`700 13px ${T.sans}`,color:T.ink2}}>{WORKS[k].poet}</div></div>)}</div>
      </Sec>}
      {/* 계정 */}
      <Sec t="계정">
        <div style={{display:'flex',alignItems:'center',gap:28,flexWrap:'wrap'}}>
          <span className="pk-link" onClick={logout} style={{font:`400 14px ${T.sans}`,height:44,display:'inline-flex',alignItems:'center'}}>로그아웃</span>
          {!confirm ? <span className="pk-link" onClick={()=>setConfirm(true)} style={{font:`400 14px ${T.sans}`,color:T.caption,height:44,display:'inline-flex',alignItems:'center'}}>계정 삭제</span>
            : <div style={{display:'flex',alignItems:'center',gap:14,font:`400 14px ${T.sans}`,color:T.ink}}>바코드 {done.length}개와 반응 {myReacts.length}개가 함께 지워져요. 되돌릴 수 없어요.
                <PBtn kind="secondary" h={40} onClick={()=>setConfirm(false)}>취소</PBtn>
                <PBtn h={40} onClick={()=>{ if(window.PocoAPI){ PocoAPI.deleteAccount().then(r=>{ if(r&&!r.ok) say(PocoAPI.errText(r.error)); }); return; } localStorage.removeItem('poco.authed'); localStorage.removeItem('poco.onboarded'); say('계정을 삭제했어요 (시연)'); setTimeout(()=>{ up({authed:false}); go('onb',{step:0}); },900); }}>삭제</PBtn></div>}
        </div>
      </Sec>
     </div>
    </div>
    <Toast text={toast}/>
  </PFrame>;
}
Object.assign(window,{PhMe});

// ───────── 친구 프로필: 상단바의 ‹ 로 돌아감. 이 친구의 서재(그 친구가 고른 색 책등) + 나와 함께 읽은 시
function PhUser({a, up, go}){
  const nm=a.who; const following=a.following||[], followers=a.followers||[]; const on=following.includes(nm);
  const ks=WORK_KEYS.filter(k=>namesOf(WORKS[k]).includes(nm));
  const tags={}; ks.forEach(k=>{ const r=namesOf(WORKS[k]).indexOf(nm); tags[k]=WORKS[k].data.map(row=>row[r]); });
  const aa={...a,tags,fresh:null,when:{}};
  const together=ks.filter(k=>a.tags[k]);
  const seed=mulberry32(hashStr('user|'+nm)); const nFer=3+Math.floor(seed()*9), nIng=2+Math.floor(seed()*7);
  const [toast,setToast]=React.useState(null); const say=t=>{ setToast(t); setTimeout(()=>setToast(null),1600); };
  const toggle=()=>{ up(s=>({following:on?(s.following||[]).filter(x=>x!==nm):[...(s.following||[]),nm]})); say(on?`${nm} 님을 팔로우 취소했어요`:`${nm} 님을 팔로우했어요`); };
  const Sec=({t,n,sub,children})=><div style={{padding:'36px 0',borderTop:`1px solid ${T.line}`}}>
    <div style={{display:'flex',alignItems:'baseline',gap:10}}><span style={{font:`700 20px ${T.sans}`,color:T.ink}}>{t}</span>{n!=null&&<span style={{font:`400 16px ${T.sans}`,color:T.caption}}>{n}</span>}</div>
    {sub&&<div style={{font:`400 14px ${T.sans}`,color:T.ink2,marginTop:6}}>{sub}</div>}<div style={{marginTop:20}}>{children}</div></div>;
  return <PFrame><TopNav go={go} active="user"/>
    <style>{`.me-s{scrollbar-width:none}.me-s::-webkit-scrollbar{display:none}`}</style>
    <div className="me-s" style={{position:'absolute',left:0,right:0,top:72,bottom:0,overflowY:'auto'}}>
     <div style={{maxWidth:1040,margin:'0 auto',padding:'40px 48px 96px'}}>
      <div style={{display:'flex',alignItems:'center',gap:32}}>
        <PhPic nm={nm} s={112}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'center',gap:14}}><div style={{font:`700 32px ${T.sans}`,color:T.ink}}>{nm}</div>{followers.includes(nm) && <span style={{font:`500 12px ${T.sans}`,color:T.ink2,border:`1px solid ${T.line}`,borderRadius:3,padding:'2px 8px'}}>나를 팔로우</span>}</div>
          <div style={{display:'flex',alignItems:'flex-end',gap:28,marginTop:18}}>
            {[[nFer,'팔로워'],[nIng,'팔로잉']].map(([v,l])=><div key={l} style={{display:'flex',alignItems:'baseline',gap:8,height:44}}><span style={{font:`700 24px ${T.sans}`,color:T.ink}}>{v}</span><span style={{font:`500 15px ${T.sans}`,color:T.ink}}>{l}</span></div>)}
            <div style={{width:1,height:20,background:T.line,alignSelf:'center'}}></div>
            {[[ks.length,'다 읽은 시'],[together.length,'나와 함께 읽은 시']].map(([v,l])=><div key={l} style={{display:'flex',alignItems:'baseline',gap:6,height:44}}><span style={{font:`700 17px ${T.sans}`,color:T.ink2}}>{v}</span><span style={{font:`400 14px ${T.sans}`,color:T.caption}}>{l}</span></div>)}</div></div>
        <PBtn kind={on?'secondary':'primary'} h={44} onClick={toggle}>{on?'팔로잉':'팔로우'}</PBtn>
      </div>
      <Sec t={`${nm} 님의 서재`} n={ks.length} sub="이 친구가 다 읽은 시의 바코드예요. 누르면 그 시로 가요.">
        <div style={{display:'inline-flex',flexDirection:'column'}}>
          <div style={{display:'flex',alignItems:'flex-end',gap:6,padding:'0 16px'}}>{ks.map(k=><div key={k} onClick={()=>go('poem',{pk:k})}><PhSpine a={aa} k={k} go={()=>go('poem',{pk:k})} w={Math.min(56,Math.floor((944-32-(ks.length-1)*6)/ks.length))} h={290}/></div>)}</div>
          <div style={{height:10,background:'#D9D2C2',borderRadius:2,boxShadow:'0 2px 0 rgba(0,0,0,.08)'}}></div></div>
      </Sec>
      {together.length>0 && <Sec t="나와 함께 읽은 시" n={together.length} sub="위가 내 바코드, 아래가 이 친구의 바코드예요.">
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px 40px'}}>{together.map(k=>{ const W=WORKS[k]; const same=tags[k].filter((c,i)=>c===a.tags[k][i]).length;
          return <div key={k} className="pk-hit" onClick={()=>go('poem',{pk:k})} style={{display:'flex',flexDirection:'column',gap:8}}>
            <div style={{display:'flex',alignItems:'baseline',gap:8}}><span style={{font:`500 16px ${T.serif}`,color:T.ink}}>{W.title}</span><span style={{font:`400 12px ${T.sans}`,color:T.caption}}>{W.poet} · 같은 색 {same}행</span></div>
            <HBar colors={a.tags[k]} st={W.st} w={420} h={16}/><HBar colors={tags[k]} st={W.st} w={420} h={16}/></div>; })}</div>
      </Sec>}
     </div>
    </div>
    <Toast text={toast}/>
  </PFrame>;
}
Object.assign(window,{PhUser});

// ───────── 도움말: 질문을 누르면 답이 펼쳐짐(한 번에 하나) ─────────
const HELP_QA=[
  ['색은 어떻게 고르나요?','시를 한 행씩 읽으며 떠오르는 색을 팔레트(BCP-37, 37색)에서 하나 고릅니다. 같은 색을 반복해도, 색 없음이나 건너뜀을 골라도 괜찮아요. 정답은 없습니다.'],
  ['컬러 바코드가 뭔가요?','한 시의 행마다 고른 색을 위에서 아래로 이어 붙인 띠예요. 시 상세·나의 서재·프로필 어디서나 같은 바코드를 봅니다.'],
  ['다른 사람의 색은 언제 보이나요?','내가 그 시를 끝까지 읽고 색을 다 고른 뒤에만 열립니다. 먼저 보면 따라 고르게 되니까요.'],
  ['친구와 전체 독자는 어떻게 다른가요?','친구는 내가 팔로우한 독자입니다. 시 상세에서 ‘친구의 색’은 친구 한 명 한 명의 칸을, ‘전체 독자’는 그 시를 읽은 모든 사람의 색 분포를 띠로 보여줘요.'],
  ['이유와 말풍선은 어떻게 쓰나요?','행이나 내 색 칸을 누르면 오른쪽에 말풍선이 열려 그 색을 고른 이유를 남길 수 있어요. 친구 칸을 누르면 친구의 이유를 보고 답글을 달거나, 아직 없으면 ‘궁금해요’를 보낼 수 있습니다.'],
  ['색으로 찾기 · 구절로 찾기','색으로 찾기는 색 하나로 그 색이 쓰인 행을, 구절로 찾기는 단어·어구·문장(띄어쓰기 무시)으로 시 제목·시인·행을 찾습니다. 상단 검색창도 구절로 찾기로 이어져요.'],
  ['다시 읽으면 바코드는 어떻게 되나요?','시 상세의 ‘또 읽기’로 처음부터 다시 고를 수 있고, 바뀐 행은 프로필의 다시 읽기 기록에 처음 색과 나란히 남습니다.'],
];
function PhHelp({a, up, go}){
  const [open,setOpen]=React.useState(0);
  return <PFrame><TopNav go={go} active="help"/>
    <div style={{position:'absolute',left:0,right:0,top:72,bottom:0,overflowY:'auto'}}>
     <div style={{maxWidth:760,margin:'0 auto',padding:'48px 48px 96px'}}>
      <div style={{font:`700 30px ${T.serif}`,color:T.ink}}>도움말</div>
      <div style={{marginTop:32,borderTop:`1px solid ${T.line}`}}>
        {HELP_QA.map(([q,ans],i)=><div key={i} style={{borderBottom:`1px solid ${T.line}`}}>
          <div className="pk-hit" onClick={()=>setOpen(open===i?null:i)} style={{display:'flex',alignItems:'center',gap:12,minHeight:56,padding:'6px 4px'}}>
            <span style={{flex:1,font:`${open===i?700:500} 16px ${T.sans}`,color:T.ink}}>{q}</span>
            <span style={{font:`400 20px ${T.sans}`,color:T.caption,transform:open===i?'rotate(45deg)':'none',transition:'transform .15s'}}>+</span></div>
          {open===i && <div style={{font:`400 15px/1.7 ${T.sans}`,color:T.ink2,padding:'0 4px 18px',animation:'pkIn .12s both'}}>{ans}</div>}
        </div>)}
      </div>
      <div style={{marginTop:32,font:`400 13px ${T.sans}`,color:T.caption}}>더 궁금한 점은 설정의 ‘의견 보내기’로 알려 주세요.</div>
     </div>
    </div>
  </PFrame>;
}
// ───────── 설정: 알림 · 공개 범위 · 계정 ─────────
// 행별 색 기록 CSV: 시 키·제목·시인·행 번호·행·색 코드·색 이름·HEX(sRGB)·상태(done/reading)·날짜. UTF-8 BOM(엑셀 한글)
function pocoExportCSV(a){
  const q=v=>{ const t=v==null?'':String(v); return /[",\n]/.test(t)?'"'+t.replace(/"/g,'""')+'"':t; };
  const rows=[['poem_key','title','poet','line_no','line_text','color_code','color_name','hex_srgb','status','date']];
  WORK_KEYS.forEach(k=>{ const w=WORKS[k], done=!!a.tags[k], cs=done?a.tags[k]:(a.prog||{})[k]; if(!cs||!cs.some(c=>c!==undefined&&c!==null)) return;
    w.lines.forEach((t,i)=>{ const c=cs[i]; if(c===undefined||c===null) return; rows.push([k,w.title,w.poet,i+1,t,c,pcName(c),c&&PC[c]&&PC[c][1]||'',done?'done':'reading',done?((a.when||{})[k]||''):'']); }); });
  const csv='\uFEFF'+rows.map(r=>r.map(q).join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})); const el=document.createElement('a'); el.href=url; el.download='poco_line_colors.csv'; document.body.appendChild(el); el.click(); el.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function PhSettings({a, up, go}){
  const s=a.settings||{notifWhy:true,notifReply:true,notifFollow:true,scope:'all',font:'기본'};
  const set=patch=>up(st=>({settings:{...(st.settings||s),...patch}}));
  const [toast,setToast]=React.useState(null); const say=t=>{ setToast(t); setTimeout(()=>setToast(null),1600); };
  const Row=({t,sub,right})=><div style={{display:'flex',alignItems:'center',gap:20,minHeight:64,padding:'8px 4px',borderBottom:`1px solid ${T.line}`}}>
    <div style={{flex:1,minWidth:0}}><div style={{font:`500 15px ${T.sans}`,color:T.ink}}>{t}</div>{sub&&<div style={{font:`400 13px ${T.sans}`,color:T.caption,marginTop:3}}>{sub}</div>}</div>{right}</div>;
  const Toggle=({on,onChange})=><div className="pk-hit" onClick={()=>onChange(!on)} role="switch" aria-checked={on} style={{width:46,height:28,borderRadius:14,background:on?T.ink:T.line,position:'relative',transition:'background .15s',flex:'none'}}>
    <div style={{position:'absolute',top:3,left:on?21:3,width:22,height:22,borderRadius:11,background:'#fff',boxShadow:'0 1px 2px rgba(0,0,0,.2)',transition:'left .15s'}}></div></div>;
  const Seg=({cur,items,onPick})=><div style={{display:'flex',border:`1px solid ${T.line}`,borderRadius:6,overflow:'hidden',flex:'none'}}>{items.map(([m,l])=><div key={m} className="pk-hit" onClick={()=>onPick(m)} style={{height:40,padding:'0 16px',display:'flex',alignItems:'center',font:`${cur===m?700:400} 14px ${T.sans}`,background:cur===m?T.band:T.surface,color:cur===m?T.ink:T.ink2,whiteSpace:'nowrap'}}>{l}</div>)}</div>;
  const H=({t})=><div style={{font:`700 18px ${T.sans}`,color:T.ink,margin:'36px 0 6px'}}>{t}</div>;
  return <PFrame><TopNav go={go} active="settings"/>
    <div style={{position:'absolute',left:0,right:0,top:72,bottom:0,overflowY:'auto'}}>
     <div style={{maxWidth:760,margin:'0 auto',padding:'48px 48px 96px'}}>
      <div style={{font:`700 30px ${T.serif}`,color:T.ink}}>설정</div>
      <H t="알림"/>
      <Row t="친구가 내 색에 ‘궁금해요’를 눌렀을 때" right={<Toggle on={s.notifWhy} onChange={v=>set({notifWhy:v})}/>}/>
      <Row t="내 이유에 답글이 달렸을 때" right={<Toggle on={s.notifReply} onChange={v=>set({notifReply:v})}/>}/>
      <Row t="누군가 나를 팔로우했을 때" right={<Toggle on={s.notifFollow} onChange={v=>set({notifFollow:v})}/>}/>
      <H t="공개 범위"/>
      <Row t="내 색과 바코드를 볼 수 있는 사람" sub="‘친구만’으로 하면 전체 독자 분포에는 익명으로만 포함돼요." right={<Seg cur={s.scope} items={[['all','모든 독자'],['friends','친구만']]} onPick={v=>set({scope:v})}/>}/>
      <Row t="내가 남긴 이유 공개" sub="끄면 친구에게도 ‘아직 남기지 않았어요’로 보여요." right={<Toggle on={s.showWhy!==false} onChange={v=>set({showWhy:v})}/>}/>
      <H t="읽기"/>
      <Row t="본문 글자 크기" right={<Seg cur={s.font||'기본'} items={[['작게','작게'],['기본','기본'],['크게','크게']]} onPick={v=>set({font:v})}/>}/>
      <H t="내 기록"/>
      <Row t="행별 색 기록 내보내기 (CSV)" sub="다 읽은 시와 읽는 중인 시의 행마다 고른 색 코드·HEX(sRGB)를 한 파일로 받아요." right={<PBtn kind="secondary" h={40} onClick={()=>{ pocoExportCSV(a); say('CSV 파일을 내려받았어요'); }}>내보내기</PBtn>}/>
      <H t="계정"/>
      <Row t={ME} sub={window.PocoAPI?"아이디로 로그인 중":"night@poco.kr"} right={<PBtn kind="secondary" h={40} onClick={()=>go('me')}>프로필 보기</PBtn>}/>
      <Row t="의견 보내기" sub="불편한 점이나 바라는 점을 알려 주세요." right={<PBtn kind="secondary" h={40} onClick={()=>say('의견 창은 시연에서 열리지 않아요')}>쓰기</PBtn>}/>
      <Row t="로그아웃" right={<span className="pk-link" onClick={()=>pocoLogout(up,go)} style={{font:`400 14px ${T.sans}`,height:44,display:'inline-flex',alignItems:'center'}}>로그아웃</span>}/>
      <Row t="계정 삭제" sub="바코드와 반응이 모두 지워지고 되돌릴 수 없어요." right={<span className="pk-link" onClick={()=>go('me')} style={{font:`400 14px ${T.sans}`,color:T.caption,height:44,display:'inline-flex',alignItems:'center'}}>프로필에서 진행</span>}/>
     </div>
    </div>
    <Toast text={toast}/>
  </PFrame>;
}
Object.assign(window,{PhHelp,PhSettings,HELP_QA});
