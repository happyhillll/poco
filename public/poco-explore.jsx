// Poco 하위 화면 01 내 컬러 바코드 · 02 나란히 보기 · 03 작품 공간(F3·F6) · 05 색으로 찾기 · 06 비슷한 색 조합
// 제목을 누르면 다시 읽기(본문 + 내 색, 행을 눌러 바코드 수정)로 이동
const PhTitle = ({w, sub}) => <div><div style={{display:'flex',alignItems:'baseline',gap:14}}><div className="pk-hit ph-ttl" title="본문과 내 색 보기 · 바코드 고치기" onClick={()=>window.__pocoGo&&window.__pocoGo('re',{pk:w.key})} style={{font:`700 28px ${T.serif}`,color:T.ink,whiteSpace:'nowrap',textDecoration:'underline',textDecorationColor:'transparent',textUnderlineOffset:6,transition:'text-decoration-color .12s'}}><style>{`.ph-ttl:hover{text-decoration-color:${T.ink2}!important}`}</style>「{w.title}」</div><div style={{font:`400 14px ${T.sans}`,color:T.ink2,whiteSpace:'nowrap'}}>{workLabel(w)}</div></div>
  {sub && <div style={{font:`400 15px ${T.sans}`,color:T.ink2,marginTop:10}}>{sub}</div>}</div>;
const rowFit = (w, avail, max=44) => { const g=w.st.filter((s,i)=>i>0&&s!==w.st[i-1]).length; return {rh:Math.max(32,Math.min(max,Math.floor((avail-g*12)/w.lines.length))),sg:12}; };

// ───────── 01 내 컬러 바코드 (F1) ─────────
function PhBar({a, go}){
  const k=a.pk, w=WORKS[k], mine=a.tags[k]; const {rh,sg}=rowFit(w,600);
  const dur=w.lines.length*70;
  return <PFrame><TopNav go={go} active="lib"/>
    <div style={{position:'absolute',left:104,top:104}}><PhTitle w={w} sub={`내 컬러 바코드 · ${w.lines.length}행 · ${a.when[k]||TODAY}`}/></div>
    <div style={{position:'absolute',left:88,top:214,width:820}}>
      {w.lines.map((t,i)=><div key={i} style={{height:rh,marginTop:i>0&&w.st[i]!==w.st[i-1]?sg:0,display:'flex',alignItems:'center',gap:16,padding:'0 16px'}}>
        <div style={{width:w.txtW+40,flex:'none',font:`400 ${rh<40?17:18}px ${T.serif}`,letterSpacing:'.02em',color:T.ink,whiteSpace:'nowrap'}}>{t}</div>
        <Sq c={mine[i]} w={26} title={pcLabel(mine[i])} style={{animation:`pkIn .2s ${i*70}ms both`}}/></div>)}
    </div>
    <div style={{position:'absolute',left:1000,top:214,display:'flex',gap:28}}>
      <div><VBar colors={mine} st={w.st} w={96} h={Math.round(rh*.62)} sg={6} anim={dur}/></div>
      <div style={{display:'flex',flexDirection:'column',justifyContent:'flex-end',gap:6,font:`400 13px/1.6 ${T.sans}`,color:T.ink2,animation:`pkIn .3s ${dur+100}ms both`}}>
        <div style={{color:T.caption}}>나의 서재에 담겼어요</div></div>
    </div>
    <div style={{position:'absolute',right:48,bottom:36,display:'flex',gap:12,alignItems:'center'}}>
      <PBtn kind="text" onClick={()=>go('poem',{pk:a.pk})}>시 상세 보기</PBtn>
      <PBtn onClick={()=>go('cmp',{cr:0})}>다른 바코드 보기</PBtn></div>
  </PFrame>;
}

// ───────── 02 바코드 나란히 보기 (F2) — 세로: 행마다 한 줄, 나 | 다른 독자 두 세로 바코드를 같은 행 높이에 맞춤
function PhCmp({a, up, go}){
  const k=a.pk, w=WORKS[k], mine=a.tags[k], r=a.cr||0, other=w.data.map(row=>row[r]);
  const NM=namesOf(w); const step=d=>up({cr:(r+d+NM.length)%NM.length});
  const n=w.lines.length, gaps=w.st.filter((s,i)=>i>0&&s!==w.st[i-1]).length, SG=8;
  const RH=Math.min(44,Math.floor((900-250-40-gaps*SG)/n)), Y0=250, CX=700, CW=96, CG=14;
  const ys=[]; let y=Y0; w.st.forEach((s,i)=>{ if(i>0&&s!==w.st[i-1]) y+=SG; ys.push(y); y+=RH; });
  const same=mine.map((c,i)=>c===other[i]?i:-1).filter(i=>i>=0);
  const [hv,setHv]=React.useState(null);
  // 가장 먼 행: 두 색 거리 최대(빈칸 제외)
  const farI=mine.reduce((b,c,i)=>{ const o=other[i]; if(!c||!o||c==='T1'||o==='T1') return b; const d=comboDist([c],[o]); return d>b.d?{i,d}:b; },{i:-1,d:-1}).i;
  const cell=c=>({position:'absolute',width:CW,height:RH,background:c&&PC[c]&&PC[c][1]?PC[c][1]:'transparent'});
  return <PFrame><TopNav go={go} active="lib"/>
    <div className="pk-hit pk-link" onClick={()=>go('poem',{pk:a.pk})} style={{position:'absolute',left:96,top:84,height:44,display:'flex',alignItems:'center',gap:6,font:`400 14px ${T.sans}`,textDecoration:'none'}}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3L5 8l5 5"></path></svg>이 시의 바코드 모음</div>
    <div style={{position:'absolute',left:104,top:136}}><PhTitle w={w}/></div>
    {[[ME,' (나)',0],[NM[r],'',1]].map(([nm,sx,j])=><div key={j} style={{position:'absolute',left:CX+j*(CW+CG),top:Y0-74,width:CW,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
      <PhPic nm={nm} s={36} me={!j}/><div style={{font:`${j?500:700} 14px ${T.sans}`,color:T.ink,whiteSpace:'nowrap'}}>{nm}{sx}</div></div>)}
    {w.lines.map((t,i)=><div key={i} onMouseEnter={()=>setHv(i)} onMouseLeave={()=>setHv(null)} style={{position:'absolute',left:88,top:ys[i],width:CX+2*CW+CG-88,height:RH,opacity:hv!=null&&hv!==i?.78:1,transition:'opacity .1s'}}>
      <div style={{position:'absolute',left:0,width:28,top:0,height:RH,display:'flex',alignItems:'center',justifyContent:'flex-end',font:`400 11px ${T.sans}`,color:T.num}}>{i+1}</div>
      <div style={{position:'absolute',left:44,top:0,height:RH,display:'flex',alignItems:'center',font:`400 ${RH<40?16:17}px ${T.serif}`,color:T.ink,letterSpacing:'.02em',whiteSpace:'nowrap'}}>{t}</div>
      <div style={{...cell(mine[i]),left:CX-88,top:0}}></div>
      <div style={{...cell(other[i]),left:CX-88+CW+CG,top:0}}></div>
    </div>)}
    {farI>=0 && <div style={{position:'absolute',left:CX-4,top:ys[farI]-3,width:2*CW+CG+8,height:RH+6,border:`1.5px dashed ${T.ink}`,boxSizing:'border-box',pointerEvents:'none'}}><span style={{position:'absolute',right:-78,top:'50%',transform:'translateY(-50%)',font:`500 11px ${T.sans}`,color:T.ink,whiteSpace:'nowrap'}}>가장 다른 행</span></div>}
    {same.map(i=><div key={i} style={{position:'absolute',left:CX-4,top:ys[i]-3,width:2*CW+CG+8,height:RH+6,border:`1.5px solid ${T.ink}`,boxSizing:'border-box',pointerEvents:'none'}}></div>)}
    <div style={{position:'absolute',left:1000,top:Y0-30,width:380,bottom:24,overflowY:'auto'}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <PBtn kind="secondary" h={44} onClick={()=>step(-1)} style={{padding:0,width:44}}>‹</PBtn>
        <div style={{font:`400 14px ${T.sans}`,color:T.ink2,flex:1,textAlign:'center',whiteSpace:'nowrap'}}>다른 독자 {r+1} / {NM.length}</div>
        <PBtn kind="secondary" h={44} onClick={()=>step(1)} style={{padding:0,width:44}}>›</PBtn></div>
      <div style={{font:`400 14px ${T.sans}`,color:T.ink2,marginTop:18}}>{same.length ? <>같은 색을 고른 행 <b style={{color:PC.DG[1],fontWeight:700}}>{same.length}</b>개</> : '같은 색을 고른 행이 없어요'}</div>
      {same.length>0 && <div style={{marginTop:16,display:'flex',flexDirection:'column',gap:10}}>
        {same.map(i=><div key={i} onMouseEnter={()=>setHv(i)} style={{display:'flex',alignItems:'center',gap:12,minHeight:36}}>
          <Sq c={mine[i]} w={20}/><span style={{font:`400 12px ${T.sans}`,color:T.caption,width:30,flex:'none'}}>{i+1}행</span>
          <span style={{font:`400 16px/1.5 ${T.serif}`,color:T.ink,letterSpacing:'.02em',wordBreak:'keep-all'}}>{w.lines[i]}</span></div>)}</div>}
      {farI>=0 && <PhWhy a={a} up={up} k={k} i={farI} r={r} nm={NM[r]} mine={mine[farI]} other={other[farI]} line={w.lines[farI]}/>}
    </div>
  </PFrame>;
}

// 프로필 사진: 사진이 있으면 사진, 없으면 이름 두 글자
const PH_PICS = {};
const PhPic = ({nm, s=36, me}) => PH_PICS[nm] ? <img src={PH_PICS[nm]} alt={nm} style={{width:s,height:s,borderRadius:'50%',objectFit:'cover',flex:'none'}}/>
  : <div style={{width:s,height:s,borderRadius:'50%',flex:'none',background:me?T.ink:'#E3DED2',color:me?'#fff':T.ink2,display:'flex',alignItems:'center',justifyContent:'center',font:`500 ${Math.round(s*.34)}px ${T.sans}`}}>{nm.slice(-2)}</div>;
// 태깅한 이유: 가장 먼 행에 내 이유를 남기면 → 상대의 이유가 열리고 → 그 아래 대댓글
const WHY_SEED = ['이 행에서 소리가 먼저 들려서 그 색을 골랐어요.','단어보다 행 전체의 온도를 보고 골랐어요.','앞 행에서 이어지는 기분을 그대로 가져왔어요.','읽는 순간 떠오른 장면의 색이에요.','조금 반대로 읽어 보고 싶었어요.','이 말이 무겁게 느껴져서 어두운 쪽으로 갔어요.'];
function PhWhy({a, up, k, i, r, nm, mine, other, line}){
  const key=k+'|'+i+'|'+r; const W=(a.why||{})[key]||{}; const myAll=(a.why||{})[k+'|'+i+'|me']; 
  const [t,setT]=React.useState(''); const [rp,setRp]=React.useState('');
  const save=(patch)=>up(s=>({why:{...(s.why||{}),...patch}}));
  const theirs=WHY_SEED[Math.floor(mulberry32(hashStr(key))()*WHY_SEED.length)];
  const box={border:`1px solid ${T.line}`,borderRadius:6,background:T.surface,padding:'10px 12px'};
  const submitMine=()=>{ if(!t.trim()) return; save({[k+'|'+i+'|me']:{t:t.trim()}}); setT(''); };
  // Enter = 남기기, Shift+Enter = 줄바꿈 (한글 조합 중 Enter는 무시)
  const ta=(v,set,ph)=><textarea value={v} onChange={e=>set([...e.target.value].slice(0,REACT_MAX).join(''))} onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey&&!e.nativeEvent.isComposing){ e.preventDefault(); submitMine(); } }} placeholder={ph} rows={2} style={{width:'100%',boxSizing:'border-box',border:'none',outline:'none',resize:'none',background:'transparent',font:`400 14px/1.6 ${T.sans}`,color:T.ink}}></textarea>;
  return <div style={{marginTop:28,borderTop:`1px solid ${T.line}`,paddingTop:20}}>
    <div style={{font:`700 15px ${T.sans}`,color:T.ink}}>가장 다르게 고른 행 · {i+1}번째 행</div>
    <div style={{font:`400 17px/1.6 ${T.serif}`,color:T.ink,marginTop:6,letterSpacing:'.02em',wordBreak:'keep-all'}}>{line}</div>
    <div style={{display:'flex',gap:20,marginTop:10,font:`400 13px ${T.sans}`,color:T.ink2}}>
      {[[ME,mine],[nm,other]].map(([n,c])=><div key={n} style={{display:'flex',alignItems:'center',gap:8}}><Sq c={c} w={20}/>{n}</div>)}</div>
    <div style={{display:'flex',alignItems:'center',gap:10,marginTop:18}}><PhPic nm={ME} s={28} me/><span style={{font:`700 13px ${T.sans}`,color:T.ink}}>내가 이 색을 고른 이유</span></div>
    {myAll ? <div style={{font:`400 15px/1.6 ${T.sans}`,color:T.ink,margin:'8px 0 0 38px'}}>{myAll.t}</div>
      : <div style={{...box,marginTop:8}}>{ta(t,setT,'왜 이 색이었는지 짧게 남겨 보세요')}
          <div style={{display:'flex',alignItems:'center'}}><span style={{font:`400 12px ${T.caption}`,color:T.caption}}>{[...t].length} / {REACT_MAX}</span><div style={{flex:1}}></div>
            <PBtn h={44} disabled={!t.trim()} onClick={()=>{ save({[k+'|'+i+'|me']:{t:t.trim()}}); setT(''); }} style={{padding:'0 18px'}}>남기기</PBtn></div></div>}
    <div style={{display:'flex',alignItems:'center',gap:10,marginTop:20}}><PhPic nm={nm} s={28}/><span style={{font:`700 13px ${T.sans}`,color:T.ink}}>{nm} 님이 이 색을 고른 이유</span></div>
    {!myAll ? <div style={{position:'relative',margin:'8px 0 0 38px',borderRadius:6,overflow:'hidden'}}>
      <div aria-hidden="true" style={{filter:'blur(5px)',userSelect:'none',pointerEvents:'none',font:`400 15px/1.6 ${T.sans}`,color:T.ink,padding:'4px 0 30px'}}>{theirs}<div style={{height:8}}></div>{theirs}</div>
      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:6,background:'rgba(239,235,225,.35)'}}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>
        <span style={{font:`500 13px ${T.sans}`,color:T.ink}}>내 이유를 남기면 열려요</span></div></div> : <div style={{marginLeft:38,animation:'pkIn .15s both'}}>
      <div style={{font:`400 15px/1.6 ${T.sans}`,color:T.ink,marginTop:8}}>{theirs}</div>
      {(W.thread||[]).map((m,j)=><div key={j} style={{display:'flex',gap:8,marginTop:12,paddingLeft:12,borderLeft:`2px solid ${T.line}`}}><PhPic nm={m.n} s={22} me={m.n===ME}/><div><span style={{font:`700 12px ${T.sans}`,color:T.ink}}>{m.n}</span><div style={{font:`400 14px/1.5 ${T.sans}`,color:T.ink}}>{m.t}</div></div></div>)}
      <div style={{...box,marginTop:12,display:'flex',alignItems:'center',gap:8,padding:'4px 6px 4px 12px'}}>
        <input value={rp} onChange={e=>setRp([...e.target.value].slice(0,REACT_MAX).join(''))} onKeyDown={e=>{ if(e.key==='Enter'&&!e.nativeEvent.isComposing&&rp.trim()){ save({[key]:{...W,thread:[...(W.thread||[]),{n:ME,t:rp.trim()}]}}); setRp(''); } }} placeholder="답글 달기" style={{flex:1,minWidth:0,border:'none',outline:'none',background:'transparent',font:`400 14px ${T.sans}`,color:T.ink,height:36}}/>
        <PBtn kind="text" h={44} disabled={!rp.trim()} onClick={()=>{ save({[key]:{...W,thread:[...(W.thread||[]),{n:ME,t:rp.trim()}]}}); setRp(''); }}>답글</PBtn></div>
    </div>}
  </div>;
}

// ───────── 03 작품 공간: 바코드 모음(F3) · 행별 색 분포(F6) ─────────
function PhSpace({a, up, go}){
  const k=a.pk, w=WORKS[k], mine=a.tags[k], tab=a.tab||'bar';
  const [dr,setDr]=React.useState(null); // 오른쪽 반쪽 패널: {pk,i}
  const tabs = <div style={{display:'flex',gap:28,borderBottom:`1px solid ${T.line}`}}>
    {[['bar','바코드 모음'],['dist','행별 색 분포']].map(([t,l])=><div key={t} className="pk-hit" onClick={()=>mine&&up({tab:t})} style={{height:44,display:'flex',alignItems:'center',marginBottom:-1,font:`${tab===t?700:400} 15px ${T.sans}`,color:!mine?T.disabled:tab===t?T.ink:T.ink2,borderBottom:`2px solid ${tab===t&&mine?T.ink:'transparent'}`}}>{l}</div>)}</div>;
  const workTabs = <div style={{display:'flex',gap:20,font:`400 13px ${T.sans}`}}>{WORK_KEYS.map(x=><span key={x} className="pk-hit" onClick={()=>up({pk:x})} style={{height:44,display:'inline-flex',alignItems:'center',color:x===k?T.ink:T.caption,fontWeight:x===k?700:400}}>{WORKS[x].title}</span>)}</div>;
  return <PFrame><TopNav go={go} active="list"/>
    <div style={{position:'absolute',left:104,top:112,right:104}}>
      <PhTitle w={w}/><div style={{marginTop:18}}>{tabs}</div></div>
    {!mine ? <>
      <div style={{position:'absolute',left:104,top:270,width:760}}>
        {w.lines.map((t,i)=><div key={i} style={{height:40,display:'flex',alignItems:'center',marginTop:i>0&&w.st[i]!==w.st[i-1]?10:0,font:`400 17px ${T.serif}`,color:T.ink,letterSpacing:'.02em',whiteSpace:'nowrap'}}>{t}</div>)}</div>
      <div style={{position:'absolute',left:960,top:282,width:400}}>
        <div style={{font:`500 20px/1.6 ${T.sans}`,color:T.ink}}>다른 독자의 색은<br/>내가 이 시를 다 읽은 뒤에 열려요.</div>
        <div style={{font:`400 14px ${T.sans}`,color:T.ink2,marginTop:10}}>읽은 독자 {w.rep.length}명</div>
        <div style={{marginTop:28}}><PBtn onClick={()=>go('read',{readInit:contInit(a,k)})}>{progOf(a,k)?'이어 읽기':'읽고 색 고르기'}</PBtn></div></div>
    </> : tab==='bar' ? <PhBarTab a={a} k={k} go={go}/> : <div style={{position:'absolute',left:88,top:262,right:88}}>
      <div style={{display:'flex',alignItems:'center',height:28,font:`400 13px ${T.sans}`,color:T.caption,padding:'0 16px'}}><div style={{width:w.txtW+60}}></div>이 행에서 독자들이 고른 색 · 독자 {w.rep.length+1}명 · 칸에 올리면 색 이름과 고른 사람이 보여요</div>
      {w.lines.map((t,i)=>{ const rh=w.lines.length>12?38:42; return <div key={i} className="pk-hit pk-row" onClick={()=>setDr(dr&&dr.pk===k&&dr.i===i?null:{pk:k,i})} title="이 행과 비슷한 색 조합 찾기" style={{background:dr&&dr.pk===k&&dr.i===i?T.band:undefined,height:rh,marginTop:i>0&&w.st[i]!==w.st[i-1]?10:0,display:'flex',alignItems:'center',padding:'0 16px',borderRadius:4}}>
        <div style={{width:w.txtW+60,flex:'none',font:`400 17px ${T.serif}`,color:T.ink,letterSpacing:'.02em',whiteSpace:'nowrap'}}>{t}</div>
        <PhStack cs={lineColors(a,k,i)} names={lineNamesOf(k)} w={560} h={22}/>
        </div>; })}
    </div>}
    <PhSimDrawer a={a} at={dr} onPick={setDr} onClose={()=>setDr(null)}/>
  </PFrame>;
}

// 오른쪽에서 반쯤 열리는 패널: 고른 행 + 비슷한 색 조합으로 태깅된 다른 시의 행
function PhSimDrawer({a, at, onPick, onClose}){
  const open=!!at; const [last,setLast]=React.useState(at); React.useEffect(()=>{ if(at) setLast(at); },[at]);
  const cur=at||last; const W=cur&&WORKS[cur.pk];
  const res=[]; if(cur){ const base=lineColors(a,cur.pk,cur.i);
    WORK_KEYS.filter(k=>a.tags[k]&&k!==cur.pk).forEach(k=>WORKS[k].lines.forEach((t,i)=>res.push({k,i,t,d:comboDist(base,lineColors(a,k,i))}))); res.sort((x,y)=>x.d-y.d); }
  const chips = cs => <div style={{display:'flex',gap:4,flex:'none'}}>{cs.filter(c=>c&&PC[c]&&PC[c][1]).map((c,j)=><div key={j} style={{width:22,height:22,background:PC[c][1],boxShadow:c==='WH'?`inset 0 0 0 1px ${T.line}`:'none'}}></div>)}</div>;
  return <>
    <div onClick={onClose} style={{position:'absolute',left:0,right:0,top:72,bottom:0,background:'rgba(43,43,43,.12)',opacity:open?1:0,pointerEvents:open?'auto':'none',transition:'opacity .2s',zIndex:8}}></div>
    <div style={{position:'absolute',top:72,bottom:0,right:0,width:640,background:'#ECE8DD',boxShadow:'-8px 0 24px rgba(0,0,0,.10)',transform:open?'none':'translateX(100%)',transition:'transform .28s cubic-bezier(.2,.7,.2,1)',zIndex:9,display:'flex',flexDirection:'column'}}>
      <div className="pk-hit" onClick={onClose} title="닫기" style={{position:'absolute',left:8,top:'50%',marginTop:-28,width:44,height:56,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <svg width="18" height="30" viewBox="0 0 18 30" fill="none" stroke={T.caption} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 3L3 15l10 12"></path></svg></div>
      {cur && <div style={{padding:'40px 56px 32px 80px',display:'flex',flexDirection:'column',height:'100%',boxSizing:'border-box'}}>
        <div style={{font:`400 13px ${T.sans}`,color:T.caption}}>「{W.title}」 {cur.i+1}행</div>
        <div style={{marginTop:14}}>{chips(lineColors(a,cur.pk,cur.i))}</div>
        <div style={{font:`400 24px/1.5 ${T.serif}`,color:T.ink,letterSpacing:'.02em',marginTop:12,paddingBottom:16,borderBottom:`2px solid ${T.ink}`,wordBreak:'keep-all'}}>{W.lines[cur.i]}</div>
        <div style={{font:`700 14px ${T.sans}`,color:T.ink2,margin:'24px 0 14px'}}>비슷한 색 조합으로 태깅된 구절</div>
        <div style={{flex:1,overflow:'auto',display:'flex',flexDirection:'column',gap:14,paddingBottom:8}}>
          {res.slice(0,6).map(({k,i,t})=><div key={k+i} className="pk-hit" onClick={()=>onPick({pk:k,i})} style={{minHeight:72,flex:'none',boxSizing:'border-box',background:T.surface,borderRadius:36,boxShadow:'0 2px 6px rgba(0,0,0,.08)',padding:'12px 28px',display:'flex',alignItems:'center',gap:18,animation:'pkIn .16s both'}}>
            <div style={{flex:1,minWidth:0}}><div style={{font:`400 17px/1.5 ${T.serif}`,color:T.ink,letterSpacing:'.02em',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{t}</div>
              <div style={{font:`400 12px ${T.sans}`,color:T.caption,marginTop:2}}>「{WORKS[k].title}」 {WORKS[k].poet}</div></div>
            {chips(lineColors(a,k,i))}</div>)}
          {!res.length && <div style={{font:`400 14px ${T.sans}`,color:T.ink2}}>다른 시를 다 읽으면 여기서 함께 찾아져요.</div>}
        </div>
      </div>}
    </div></>;
}

// 바코드 모음 탭: 나와 가장 비슷한 / 가장 다른 독자 + 이 시를 읽은 독자 줄(아바타·이름·작은 바코드)
const phAvatar = (nm, s=64, me) => <div style={{width:s,height:s,borderRadius:'50%',flex:'none',background:me?T.ink:'#E3DED2',color:me?'#fff':T.ink2,display:'flex',alignItems:'center',justifyContent:'center',font:`500 ${Math.round(s*.34)}px ${T.sans}`}}>{nm.slice(-2)}</div>;
// 시 전체에서 가장 많이 쓰인 색 1개. mineOnly=true면 내 색만 센다. 동률이면 팔레트 순서(순위 느낌 없음)
function topColorOf(w, mine, mineOnly){
  const cnt={}; const add=c=>{ if(c&&PC[c]&&PC[c][1]) cnt[c]=(cnt[c]||0)+1; };
  (mine||[]).forEach(add); if(!mineOnly) w.data.forEach(row=>row.forEach(add));
  let best=null; [...PC_TOP,...PC_GRID].forEach(c=>{ if(cnt[c]&&(best==null||cnt[c]>cnt[best])) best=c; });
  return {c:best,n:best?cnt[best]:0};
}
function PhBarTab({a, k, go}){
  const w=WORKS[k], mine=a.tags[k], NM=namesOf(w);
  const rs=NM.map((nm,r)=>{ const cs=w.data.map(row=>row[r]); const d=cs.reduce((s,c,i)=>s+(c&&mine[i]?comboDist([c],[mine[i]]):60),0); return {nm,r,cs,d,same:cs.filter((c,i)=>c===mine[i]).length}; });
  // 비슷함: 같은 색을 고른 행 수가 많을수록 비슷 → 같으면 행별 색 거리 합이 작을수록 비슷
  const sorted=rs.slice().sort((x,y)=>y.same-x.same||x.d-y.d); const near=sorted[0], far=sorted[sorted.length-1];
  const card=(t,o)=><div className="pk-hit pk-card" onClick={()=>go('cmp',{cr:o.r})} style={{flex:1,minWidth:0,boxSizing:'border-box',border:`1px solid ${T.line}`,borderRadius:8,padding:'22px 26px',display:'flex',gap:22,alignItems:'center'}}>
    {phAvatar(o.nm,64)}
    <div style={{flex:1,minWidth:0}}>
      <div style={{font:`500 13px ${T.sans}`,color:T.ink2}}>{t}</div>
      <div style={{display:'flex',alignItems:'baseline',gap:10,marginTop:4}}><span style={{font:`700 19px ${T.sans}`,color:T.ink,whiteSpace:'nowrap'}}>{o.nm}</span><span style={{font:`400 13px ${T.sans}`,color:T.caption,whiteSpace:'nowrap'}}>같은 색 {o.same}행</span></div>
      <div style={{display:'flex',flexDirection:'column',gap:4,marginTop:12}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}><span style={{width:34,font:`400 11px ${T.sans}`,color:T.caption}}>나</span><HBar colors={mine} st={w.st} w={300} h={14}/></div>
        <div style={{display:'flex',alignItems:'center',gap:10}}><span style={{width:34,font:`400 11px ${T.sans}`,color:T.caption,whiteSpace:'nowrap',overflow:'hidden'}}>{o.nm}</span><HBar colors={o.cs} st={w.st} w={300} h={14}/></div></div>
    </div>
    <span style={{font:`400 22px ${T.sans}`,color:T.caption}}>›</span></div>;
  return <div style={{position:'absolute',left:104,top:268,right:104}}>
    <div style={{display:'flex',gap:24}}>{card('나와 가장 비슷하게 읽은 독자',near)}{card('나와 가장 다르게 읽은 독자',far)}</div>
    {/* 독자 N명의 바코드를 모두 깔지 않고, 시 전체에서 가장 많이 쓰인 색 하나로 요약(어지러움 방지 · 선택적 주의). 개별 비교는 위 카드 → 나란히 보기 */}
    {(()=>{ const top=topColorOf(w,mine); return <div style={{display:'flex',alignItems:'center',gap:28,marginTop:44,padding:'26px 30px',border:`1px solid ${T.line}`,borderRadius:8}}>
      <Sq c={top.c} w={88} r={4}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{font:`500 13px ${T.sans}`,color:T.ink2}}>이 시에서 가장 많이 고른 색</div>
        <div style={{display:'flex',alignItems:'baseline',gap:10,marginTop:4}}><span style={{font:`700 22px ${T.sans}`,color:T.ink}}>{pcLabel(top.c)}</span><span style={{font:`400 13px ${T.sans}`,color:T.caption}}>독자 {NM.length+1}명 · {w.lines.length}행 중 {top.n}번</span></div>
        <div style={{font:`400 13px/1.6 ${T.sans}`,color:T.ink2,marginTop:8}}>독자마다 고른 색은 다릅니다. 한 사람씩 비교하려면 위의 독자를 눌러 나란히 보세요.</div>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:10}}><span style={{font:`400 12px ${T.sans}`,color:T.caption}}>내가 가장 많이 고른 색</span><Sq c={topColorOf(w,mine,true).c} w={40} r={3}/></div>
    </div>; })()}
  </div>;
}

// ───────── 05 색으로 시 구절 찾기 (F5) ─────────
// 왼쪽: 팔레트 + 고른 색의 통계(전체·나 횟수, 이 색이 많이 나온 시, 함께 고른 색, 가까운 색) / 오른쪽: 결과(나·다른 독자, 시별 묶기, 정렬)
function PhFind({a, up, go}){
  const c=a.fc===undefined?'SR':a.fc||null, mode=a.fm||'mine', sort=a.fs||'poem', grp=a.fg!==false;
  const res=[], co={}, perPoem={}; let mineN=0, allN=0;
  if(c) WORK_KEYS.forEach(k=>{ const w=WORKS[k], mine=a.tags[k]||a.prog[k]||[], isDone=!!a.tags[k];
    w.lines.forEach((t,i)=>{ const who=[]; const cols=isDone?[mine[i],...w.data[i]]:[mine[i]];
      if(mine[i]===c){ mineN++; if(mode==='mine') who.push(ME); }
      if(isDone) w.data[i].forEach((x,r)=>{ if(x===c){ allN++; if(mode==='all') who.push(namesOf(w)[r]); } });
      const hit=cols.filter(x=>x===c).length;
      if(hit){ perPoem[k]=(perPoem[k]||0)+hit; cols.forEach(x=>{ if(x&&x!==c) co[x]=(co[x]||0)+1; }); }
      if(who.length) res.push({k,i,t,who,n:who.length}); }); });
  if(sort==='count') res.sort((x,y)=>y.n-x.n);
  const groups=[]; res.forEach(r=>{ const g=groups[groups.length-1]; if(grp && g && g.k===r.k) g.rows.push(r); else groups.push({k:r.k,rows:[r]}); });
  const topPoems=Object.entries(perPoem).sort((x,y)=>y[1]-x[1]).slice(0,3), maxPoem=topPoems[0]?topPoems[0][1]:1;
  const coTop=Object.entries(co).sort((x,y)=>y[1]-x[1]).slice(0,5).map(x=>x[0]);
  const row = c && PC_GRID.indexOf(c)>=0 ? Math.floor(PC_GRID.indexOf(c)/6) : -1;
  const near = row>=0 ? [...new Set(PC_GRID.slice(row*6,row*6+6))].filter(x=>x!==c) : ['BK','A1','A2','A3','WH'].filter(x=>x!==c);
  const chips = xs => <div style={{display:'flex',gap:8,marginTop:8}}>{xs.map(x=><div key={x} className="pk-hit pk-chip" onClick={()=>up({fc:x})}><Sq c={x} w={36} r={4} title={pcLabel(x)}/></div>)}</div>;
  const lbl = t => <div style={{font:`500 12px ${T.sans}`,color:T.caption,marginTop:18}}>{t}</div>;
  const openRow = r => go('poem',{pk:r.k});
  return <PFrame><TopNav go={go} active="find" />
    <div style={{position:'absolute',left:121,top:121,width:340}}>
      <div style={{display:'flex',alignItems:'baseline'}}><div style={{font:`700 30px ${T.serif}`,color:T.ink}}>색으로 찾기</div><div style={{flex:1}}></div>
        <span className="pk-link" onClick={()=>up({fc:PC_GRID[Math.floor(Math.random()*PC_GRID.length)]})} style={{font:`400 13px ${T.sans}`,height:44,display:'inline-flex',alignItems:'center'}}>아무 색이나</span></div>
      <div style={{font:`400 15px ${T.sans}`,color:T.ink2,marginTop:10}}></div>
      <div style={{marginTop:64}}><Palette sel={c} onPick={x=>up({fc:x})}/></div>
      {c && <div style={{marginTop:24,paddingTop:18,borderTop:`1px solid ${T.line}`,animation:'pkIn .12s both'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}><Sq c={c} w={40} r={4}/>
          <div><div style={{font:`700 18px ${T.sans}`,color:T.ink}}>{pcLabel(c)}</div>
            <div style={{font:`400 12px ${T.sans}`,color:T.caption,marginTop:2}}>다른 독자 {allN}번 · 나 {mineN}번</div></div></div>
        {topPoems.length>0 && <>{lbl('이 색이 많이 나온 시')}
          {topPoems.map(([k,n])=><div key={k} className="pk-hit" onClick={()=>go('poem',{pk:k})} style={{display:'flex',alignItems:'center',gap:10,height:30}}>
            <div style={{width:120,font:`400 13px ${T.serif}`,color:T.ink,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{WORKS[k].title}</div>
            <div style={{flex:1,height:8,background:T.band,borderRadius:2}}><div style={{width:`${n/maxPoem*100}%`,height:'100%',background:(PC[c]&&PC[c][1])||T.ink,borderRadius:2}}></div></div>
            <div style={{width:28,textAlign:'right',font:`400 12px ${T.sans}`,color:T.ink2}}>{n}</div></div>)}</>}
      </div>}
    </div>
    <div style={{position:'absolute',left:520,top:104,right:104,bottom:40,display:'flex',flexDirection:'column'}}>
      <div style={{display:'flex',alignItems:'center',gap:16}}>
        <div style={{display:'flex',border:`1px solid ${T.line}`,borderRadius:6,overflow:'hidden'}}>
          {[['mine','나'],['all','전체']].map(([m,l])=><div key={m} className="pk-hit" onClick={()=>up({fm:m})} style={{height:44,padding:'0 20px',display:'flex',alignItems:'center',font:`${mode===m?700:400} 14px ${T.sans}`,background:mode===m?T.band:T.surface,color:mode===m?T.ink:T.ink2}}>{l}</div>)}</div>
        <div className="pk-hit" onClick={()=>up({fg:!grp})} style={{height:44,padding:'0 14px',display:'flex',alignItems:'center',gap:8,font:`400 14px ${T.sans}`,color:grp?T.ink:T.ink2,border:`1px solid ${grp?T.ink:T.line}`,borderRadius:6}}>
          <span style={{width:14,height:14,border:`1.5px solid ${grp?T.ink:T.caption}`,borderRadius:3,background:grp?T.ink:'transparent',display:'inline-block'}}></span>시별로 묶기</div>
        {mode==='all' && <div style={{display:'flex',gap:14,font:`400 14px ${T.sans}`}}>{[['poem','시 순서'],['count','많이 고른 순']].map(([m,l])=><span key={m} className="pk-hit" onClick={()=>up({fs:m})} style={{height:44,display:'inline-flex',alignItems:'center',color:sort===m?T.ink:T.caption,fontWeight:sort===m?700:400}}>{l}</span>)}</div>}
        <div style={{flex:1}}></div>
        <div style={{font:`400 14px ${T.sans}`,color:T.ink2}}>{c ? `이 색으로 고른 행 ${res.length}개${grp&&groups.length?` · 시 ${groups.length}편`:''}` : ''}</div></div>
      <div style={{flex:1,overflow:'auto',marginTop:18,borderTop:`1px solid ${T.line}`}}>
        {!c && <div style={{padding:'24px 0'}}>
          <div style={{font:`400 15px ${T.sans}`,color:T.ink2}}>왼쪽에서 색을 고르면 바로 결과가 나와요.</div>
          <div style={{font:`400 13px/1.7 ${T.sans}`,color:T.caption,marginTop:10}}>그 색으로 읽힌 행, 그 색이 많이 나온 시, 같은 행에서 함께 고른 색까지 한 번에 볼 수 있어요.</div></div>}
        {c && res.length===0 && <div style={{padding:'24px 0'}}>
          <div style={{font:`400 15px ${T.sans}`,color:T.ink}}>이 색으로 고른 행이 아직 없어요.</div>
          <div style={{font:`400 14px ${T.sans}`,color:T.ink2,marginTop:8}}>{mode==='mine'?'‘다른 독자’로 바꾸거나, ':''}다른 색으로 찾아보세요.</div></div>}
        {groups.map(g=><div key={g.k+g.rows[0].i} >
          {grp && <div className="pk-hit" onClick={()=>go('poem',{pk:g.k})} style={{display:'flex',alignItems:'baseline',gap:10,height:40,padding:'0 12px',marginTop:16,background:T.band,borderRadius:4}}>
            <span style={{font:`700 15px ${T.serif}`,color:T.ink,whiteSpace:'nowrap'}}>{WORKS[g.k].title}</span>
            <span style={{font:`400 12px ${T.sans}`,color:T.ink2}}>{[WORKS[g.k].poet,WORKS[g.k].year].filter(Boolean).join(' · ')}</span>
            <span style={{flex:1}}></span>
            <span style={{font:`400 12px ${T.sans}`,color:T.caption}}><b style={{color:T.ink,fontWeight:700}}>{g.rows.length}행</b> / {WORKS[g.k].lines.length}행{a.tags[g.k]?'':' · 읽는 중'}</span>
          </div>}
          <div style={{minWidth:0}}>{g.rows.map((r,ri)=><div key={r.k+r.i} className="pk-hit pk-row" onClick={()=>openRow(r)} style={{display:'flex',alignItems:'center',gap:18,minHeight:68,padding:'10px 12px',borderBottom:`1px solid ${T.line}`,animation:'pkIn .12s both'}}>
            <Sq c={c} w={40} r={4}/>
            <div style={{flex:1,minWidth:0}}><div style={{font:`400 18px/1.5 ${T.serif}`,color:T.ink,letterSpacing:'.02em'}}>{r.t}</div>
              <div style={{font:`400 12px ${T.sans}`,color:T.caption,marginTop:2}}>「{WORKS[r.k].title}」 {WORKS[r.k].poet}</div></div>
            {a.tags[r.k] && <PhStack cs={lineColors(a,r.k,r.i)} names={lineNamesOf(r.k)} w={120} h={10}/>}
            {mode==='all' && <div style={{font:`700 13px ${T.sans}`,color:T.ink,width:48,textAlign:'right',flex:'none'}}>{r.n}명</div>}
          </div>)}</div>
        </div>)}
      </div>
    </div>
  </PFrame>;
}

// ───────── 06 비슷한 색 조합 구절 찾기 (F7) ─────────
function PhSim({a, up, go}){
  const done = WORK_KEYS.filter(k=>a.tags[k]); const sl=a.sl&&a.tags[a.sl.pk]?a.sl:{pk:done[0],i:0};
  // 다 읽은 시가 아직 없으면(새 계정) 안내만
  if(!done.length) return <PFrame><TopNav go={go} active="find" />
    <div style={{position:'absolute',left:104,top:104,width:600}}>
      <div style={{font:`700 30px ${T.serif}`,color:T.ink}}>비슷한 색 조합 찾기</div>
      <div style={{font:`400 15px/1.6 ${T.sans}`,color:T.ink2,marginTop:10}}>시를 한 편 끝까지 읽고 나면, 그 시의 행과 비슷한 색 조합으로 읽힌 다른 시의 행을 찾을 수 있어요.</div>
      <PBtn onClick={()=>go('list')} style={{marginTop:28}}>시 고르러 가기</PBtn></div></PFrame>;
  const w=WORKS[sl.pk], base=lineColors(a,sl.pk,sl.i);
  const res=[]; done.filter(k=>k!==sl.pk).forEach(k=>WORKS[k].lines.forEach((t,i)=>res.push({k,i,t,d:comboDist(base,lineColors(a,k,i))})));
  res.sort((x,y)=>x.d-y.d);
  return <PFrame><TopNav go={go} active="find" />
    <div style={{position:'absolute',left:104,top:104,width:600}}>
      <div style={{font:`700 30px ${T.serif}`,color:T.ink}}>비슷한 색 조합 찾기</div>
      <div style={{font:`400 15px ${T.sans}`,color:T.ink2,marginTop:10}}>행 하나를 고르면, 독자들이 비슷한 색 조합으로 읽은 다른 시의 행이 나와요.</div>
      <div style={{display:'flex',gap:20,marginTop:22,font:`400 13px ${T.sans}`}}>{done.map(k=><span key={k} className="pk-hit" onClick={()=>up({sl:{pk:k,i:0}})} style={{height:44,display:'inline-flex',alignItems:'center',color:k===sl.pk?T.ink:T.caption,fontWeight:k===sl.pk?700:400}}>{WORKS[k].title}</span>)}</div>
      <div style={{marginTop:6}}>
        {w.lines.map((t,i)=><div key={i} className="pk-hit pk-row" onClick={()=>up({sl:{pk:sl.pk,i}})} style={{height:w.lines.length>12?34:38,display:'flex',alignItems:'center',gap:14,padding:'0 12px',borderRadius:4,background:i===sl.i?T.band:undefined,opacity:i===sl.i?1:.6,marginTop:i>0&&w.st[i]!==w.st[i-1]?8:0}}>
          <div style={{width:20,flex:'none',textAlign:'right',font:`400 11px ${T.sans}`,color:T.num}}>{i+1}</div>
          <div style={{font:`400 16px ${T.serif}`,color:T.ink,letterSpacing:'.02em',whiteSpace:'nowrap',flex:1}}>{t}</div>
          <PhStack cs={lineColors(a,sl.pk,i)} names={lineNamesOf(sl.pk)} w={150} h={12}/></div>)}
      </div>
    </div>
    <div style={{position:'absolute',left:780,top:104,right:104,bottom:40,display:'flex',flexDirection:'column'}}>
      <div style={{font:`500 13px ${T.sans}`,color:T.caption}}>고른 행 · 「{w.title}」 {sl.i+1}행</div>
      <div style={{font:`400 21px/1.6 ${T.serif}`,color:T.ink,marginTop:6,letterSpacing:'.02em'}}>{w.lines[sl.i]}</div>
      <div style={{marginTop:12}}><PhStack cs={base} names={lineNamesOf(sl.pk)} w={556} h={24}/></div>
      <div style={{font:`700 15px ${T.sans}`,color:T.ink,marginTop:32}}>비슷한 색 조합으로 읽힌 행</div>
      <div style={{flex:1,overflow:'auto',marginTop:10,borderTop:`1px solid ${T.line}`}}>
        {res.length===0 && <div style={{font:`400 14px ${T.sans}`,color:T.ink2,padding:'20px 0'}}>다른 시를 다 읽으면 여기서 함께 찾아져요.</div>}
        {res.slice(0,6).map(({k,i,t})=><div key={k+i} className="pk-hit pk-row" onClick={()=>up({sl:{pk:k,i}})} style={{padding:'12px 10px',borderBottom:`1px solid ${T.line}`,animation:'pkIn .12s both'}}>
          <div style={{font:`400 17px/1.5 ${T.serif}`,color:T.ink,letterSpacing:'.02em'}}>{t}</div>
          <div style={{display:'flex',alignItems:'center',gap:14,marginTop:8}}><PhStack cs={lineColors(a,k,i)} names={lineNamesOf(k)} w={300} h={14}/><span style={{font:`400 12px ${T.sans}`,color:T.caption}}>「{WORKS[k].title}」 {i+1}행</span></div></div>)}
      </div>
      <div style={{font:`400 12px ${T.sans}`,color:T.caption,marginTop:10}}>{WORK_KEYS.filter(k=>!a.tags[k]).map(k=>`「${WORKS[k].title}」`).join(' ')}은 다 읽은 뒤 함께 찾아져요.</div>
    </div>
  </PFrame>;
}

// ───────── 07 구절로 찾기: 단어·어구·문장으로 시의 행 검색 ─────────
function PhText({a, up, go}){
  const q=(a.tq||'').trim(), scope=a.ts||'all', grp=a.tg!==false;
  const terms=q.split(/\s+/).filter(Boolean);
  const norm=s=>s.replace(/\s+/g,'');
  const res=[]; if(terms.length) WORK_KEYS.forEach(k=>{ const w=WORKS[k]; if(scope==='mine'&&!a.tags[k]) return;
    w.lines.forEach((t,i)=>{ const nt=norm(t); if(terms.every(x=>nt.includes(norm(x)))) res.push({k,i,t}); }); });
  const groups=[]; res.forEach(r=>{ const g=groups[groups.length-1]; if(grp&&g&&g.k===r.k) g.rows.push(r); else groups.push({k:r.k,rows:[r]}); });
  const poems=new Set(res.map(r=>r.k)).size;
  const hits=terms.length?WORK_KEYS.filter(k=>{ const w=WORKS[k]; const s=norm(w.title+w.poet); return terms.every(x=>s.includes(norm(x))); }):[];
  // 검색어 강조(공백 무시 매칭이라 원문에서 실제 위치를 찾아 표시)
  const mark=t=>{ let parts=[{s:t,h:false}]; terms.forEach(x=>{ const nx=norm(x); if(!nx) return; parts=parts.flatMap(p=>{ if(p.h) return [p]; const out=[]; let s=p.s;
      while(s){ let found=-1,len=0; for(let st=0;st<s.length&&found<0;st++){ let j=st,m=0; while(j<s.length&&m<nx.length){ if(s[j]===' '){j++;continue;} if(s[j]!==nx[m]) break; j++;m++; } if(m===nx.length){found=st;len=j-st;} }
        if(found<0){ out.push({s,h:false}); break; } if(found>0) out.push({s:s.slice(0,found),h:false}); out.push({s:s.slice(found,found+len),h:true}); s=s.slice(found+len); }
      return out; }); });
    return parts.map((p,i)=>p.h?<mark key={i} style={{background:'transparent',color:T.ink,boxShadow:`inset 0 -10px 0 ${T.band}`,fontWeight:700}}>{p.s}</mark>:<span key={i}>{p.s}</span>); };
  const sugg=['사랑','눈','바다','밤','어머니','꽃','저녁','시간'];
  const openRow=r=>go('poem',{pk:r.k});
  return <PFrame><TopNav go={go} active="text"/>
    <style>{`.pt-in::placeholder{color:${T.disabled}}`}</style>
    <div style={{position:'absolute',left:121,top:121,width:340}}>
      <div style={{font:`700 30px ${T.serif}`,color:T.ink}}>구절로 찾기</div>
      <div style={{font:`400 15px/1.6 ${T.sans}`,color:T.ink2,marginTop:10}}>시 제목, 시인, 구절 속 단어·어구·문장 어느 것이든 좋아요. 띄어쓰기는 달라도 찾아져요.</div>
      <label style={{display:'flex',alignItems:'center',gap:12,height:56,marginTop:28,padding:'0 20px',boxSizing:'border-box',background:T.surface,borderRadius:28,boxShadow:'0 1px 2px rgba(0,0,0,.05)',border:`1px solid ${T.line}`}}>
        <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke={T.ink} strokeWidth="1.8"><circle cx="9.5" cy="9.5" r="7"></circle><path d="M14.6 14.6L20 20"></path></svg>
        <input className="pt-in" autoFocus value={a.tq||''} onChange={e=>up({tq:e.target.value})} placeholder="예: 눈이 푹푹" style={{flex:1,minWidth:0,border:'none',outline:'none',background:'transparent',font:`400 16px ${T.sans}`,color:T.ink}}/>
        {q && <span className="pk-hit" onClick={()=>up({tq:''})} style={{font:`400 18px ${T.sans}`,color:T.caption,padding:'0 4px'}}>×</span>}</label>
      <div style={{font:`500 12px ${T.sans}`,color:T.caption,marginTop:28}}>자주 찾는 말</div>
      <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:10}}>{sugg.map(s=><span key={s} className="pk-hit" onClick={()=>up({tq:s})} style={{height:36,padding:'0 14px',display:'inline-flex',alignItems:'center',borderRadius:18,border:`1px solid ${q===s?T.ink:T.line}`,background:q===s?T.band:T.surface,font:`400 14px ${T.sans}`,color:T.ink}}>{s}</span>)}</div>
      
    </div>
    <div style={{position:'absolute',left:520,top:104,right:104,bottom:40,display:'flex',flexDirection:'column'}}>
      <div style={{display:'flex',alignItems:'center',gap:16}}>
        <div style={{display:'flex',border:`1px solid ${T.line}`,borderRadius:6,overflow:'hidden'}}>
          {[['all','모든 시'],['mine','내가 읽은 시']].map(([m,l])=><div key={m} className="pk-hit" onClick={()=>up({ts:m})} style={{height:44,padding:'0 20px',display:'flex',alignItems:'center',font:`${scope===m?700:400} 14px ${T.sans}`,background:scope===m?T.band:T.surface,color:scope===m?T.ink:T.ink2,whiteSpace:'nowrap'}}>{l}</div>)}</div>
        <div className="pk-hit" onClick={()=>up({tg:!grp})} style={{height:44,padding:'0 14px',display:'flex',alignItems:'center',gap:8,font:`400 14px ${T.sans}`,color:grp?T.ink:T.ink2,border:`1px solid ${grp?T.ink:T.line}`,borderRadius:6,whiteSpace:'nowrap'}}>
          <span style={{width:14,height:14,border:`1.5px solid ${grp?T.ink:T.caption}`,borderRadius:3,background:grp?T.ink:'transparent',display:'inline-block'}}></span>시별로 묶기</div>
        <div style={{flex:1}}></div>
        <div style={{font:`400 14px ${T.sans}`,color:T.ink2,whiteSpace:'nowrap'}}>{q?`행 ${res.length}개${grp&&poems?` · 시 ${poems}편`:''}`:''}</div></div>
      <div style={{flex:1,overflow:'auto',marginTop:18,borderTop:`1px solid ${T.line}`}}>
        {!q && <div style={{padding:'24px 0'}}><div style={{font:`400 15px ${T.sans}`,color:T.ink2}}>왼쪽에 찾을 말을 적으면 바로 결과가 나와요.</div></div>}
        {hits.length>0 && <div style={{padding:'18px 0 6px'}}>
          <div style={{font:`500 12px ${T.sans}`,color:T.caption,marginBottom:10}}>제목·시인이 맞는 시 {hits.length}편</div>
          <div style={{display:'flex',gap:16,overflowX:'auto',paddingBottom:6}}>{hits.map(k=><div key={k} className="pk-hit" onClick={()=>go('poem',{pk:k})} style={{flex:'none',display:'flex',alignItems:'center',gap:12,height:56,padding:'0 16px 0 12px',background:T.surface,border:`1px solid ${T.line}`,borderRadius:8}}>
            <Sq c={(a.rep||{})[k]||WORKS[k].rep[0]} w={28} r={4}/><div><div style={{font:`500 15px ${T.serif}`,color:T.ink,whiteSpace:'nowrap'}}>{WORKS[k].title}</div><div style={{font:`400 12px ${T.sans}`,color:T.caption}}>{WORKS[k].poet}{a.tags[k]?'':progOf(a,k)>0?' · 읽는 중':' · 읽기 전'}</div></div></div>)}</div></div>}
        {q && res.length===0 && hits.length===0 && <div style={{padding:'24px 0'}}>
          <div style={{font:`400 15px ${T.sans}`,color:T.ink}}>「{q}」{(()=>{ const c=q.charCodeAt(q.length-1)-0xAC00; return (c>=0&&c<11172&&c%28)?'이':'가'; })()} 들어간 행이 없어요.</div>
          <div style={{font:`400 14px ${T.sans}`,color:T.ink2,marginTop:8}}>{scope==='mine'?'‘모든 시’로 범위를 넓히거나, ':''}더 짧은 말로 찾아보세요.</div></div>}
        {groups.map(g=><div key={g.k+g.rows[0].i} >
          {grp && <div className="pk-hit" onClick={()=>go('poem',{pk:g.k})} style={{display:'flex',alignItems:'baseline',gap:10,height:40,padding:'0 12px',marginTop:16,background:T.band,borderRadius:4}}>
            <span style={{font:`700 15px ${T.serif}`,color:T.ink,whiteSpace:'nowrap'}}>{WORKS[g.k].title}</span>
            <span style={{font:`400 12px ${T.sans}`,color:T.ink2}}>{[WORKS[g.k].poet,WORKS[g.k].year].filter(Boolean).join(' · ')}</span>
            <span style={{flex:1}}></span>
            <span style={{font:`400 12px ${T.sans}`,color:T.caption}}><b style={{color:T.ink,fontWeight:700}}>{g.rows.length}행</b> / {WORKS[g.k].lines.length}행{a.tags[g.k]?'':progOf(a,g.k)>0?' · 읽는 중':' · 읽기 전'}</span>
          </div>}
          <div style={{minWidth:0}}>{g.rows.map((r,ri)=><div key={r.k+r.i} className="pk-hit pk-row" onClick={()=>openRow(r)} style={{display:'flex',alignItems:'center',gap:18,minHeight:68,padding:'10px 12px',borderBottom:`1px solid ${T.line}`,animation:'pkIn .12s both'}}>
            {(()=>{ const mc=a.tags[r.k]?a.tags[r.k][r.i]:(a.prog[r.k]||[])[r.i]; return mc!==undefined; })() ? (()=>{ const mc=a.tags[r.k]?a.tags[r.k][r.i]:(a.prog[r.k]||[])[r.i]; return <Sq c={mc} w={40} r={4} title={`내 색 · ${pcLabel(mc)}`}/>; })() : <div title="아직 읽지 않은 시" style={{width:40,height:40,boxSizing:'border-box',border:`1.5px dashed ${T.disabled}`,borderRadius:4,flex:'none'}}></div>}
            <div style={{flex:1,minWidth:0}}><div style={{font:`400 18px/1.5 ${T.serif}`,color:T.ink,letterSpacing:'.02em'}}>{mark(r.t)}</div>
              <div style={{font:`400 12px ${T.sans}`,color:T.caption,marginTop:2}}>「{WORKS[r.k].title}」 {WORKS[r.k].poet}</div></div>
            {a.tags[r.k] ? <PhStack cs={lineColors(a,r.k,r.i)} names={lineNamesOf(r.k)} w={140} h={12}/> : <span style={{width:140}}></span>}
          </div>)}</div>
        </div>)}
      </div>
    </div>
  </PFrame>;
}
Object.assign(window,{topColorOf,PhPic,PhWhy,WHY_SEED,PH_PICS,PhSimDrawer,PhBar,PhCmp,PhSpace,PhFind,PhSim,PhText});
