// Poco 읽기·태깅(03), 다시 읽기(07), 모바일 03. 태깅 규칙: 행당 1색 · 색 없음(T1) · 건너뜀(SKIP) · 이전 행 수정 · 되돌리기 · 수정 기록 보존
function useTagging(n, init, kind){
  const firstEmpty = init ? init.findIndex(x=>x===undefined) : 0;
  const [tags,setTags] = React.useState(()=> init ? init.slice() : Array(n).fill(undefined));
  const [cur,setCurS] = React.useState(kind==='다시 읽기' ? null : (firstEmpty<0?null:firstEmpty));
  const [hist,setHist] = React.useState([]);
  const [stack,setStack] = React.useState([]);
  const [flash,setFlash] = React.useState(null);
  const tmr = React.useRef();
  const nextOf = (t,from) => { for(let k=1;k<=n;k++){ const j=(from+k)%n; if(t[j]===undefined) return j; } return null; };
  const setCur = i => { clearTimeout(tmr.current); setCurS(i); };
  const set = c => { if(cur==null) return; const i=cur, prev=tags[i]; const t=tags.slice(); t[i]=c; setTags(t);
    const ch = prev!==undefined && prev!==c;
    if(ch) setHist(H=>[...H,{line:i,from:prev,to:c,kind,when:TODAY}]);
    setStack(S=>[...S,{i,prev,ch}]); setFlash(i);
    clearTimeout(tmr.current); tmr.current = setTimeout(()=>{ setFlash(null); setCurS(kind==='다시 읽기'?null:nextOf(t,i)); },260); };
  const undo = () => { if(!stack.length) return; const L=stack[stack.length-1]; setStack(stack.slice(0,-1));
    setTags(x=>{ const t=x.slice(); t[L.i]=L.prev; return t; }); if(L.ch) setHist(H=>H.slice(0,-1)); setCur(L.i); };
  return {tags,cur,setCur,hist,set,undo,canUndo:stack.length>0,flash,done:tags.every(x=>x!==undefined),count:tags.filter(x=>x!==undefined).length};
}

function PoemRows({w, tags, cur, onRow, under, side, prev, flash, numW=40, fs=20, rowH=52, sg=20, txtW, nums=true}){
  const out=[];
  w.lines.forEach((t,i)=>{
    const isCur = cur===i; const op = cur==null || isCur ? 1 : tags[i]!==undefined ? .45 : .3;
    const changed = prev && prev[i]!==tags[i];
    out.push(<div key={i} data-i={i} className="pk-hit pk-row" onClick={()=>onRow(i)} style={{minHeight:rowH,marginTop:i>0&&w.st[i]!==w.st[i-1]?sg:0,display:'flex',alignItems:'center',gap:16,paddingLeft:nums?0:16,borderRadius:4,background:isCur?T.band:undefined,opacity:op,paddingRight:12}}>
      {nums && <div style={{width:numW,textAlign:'right',font:`400 12px ${T.sans}`,color:T.num,flex:'none'}}>{i+1}</div>}
      <div style={{width:txtW||w.txtW,flex:'none',font:`400 ${fs}px/1.6 ${T.serif}`,letterSpacing:'.02em',color:T.ink,whiteSpace:'nowrap'}}>{t}</div>
      {prev && <div style={{display:'flex',alignItems:'center',gap:8,width:52,flex:'none'}}>{changed ? <><Sq c={prev[i]} w={20} style={{opacity:.75}}/><span style={{font:`400 13px ${T.sans}`,color:T.caption}}>→</span></> : null}</div>}
      <Sq c={tags[i]} w={30} style={{animation:flash===i?'pkFill .14s both':'none'}}/>
      {isCur && side ? <div onClick={e=>e.stopPropagation()} style={{marginLeft:20,cursor:'default'}}>{side}</div> : null}
    </div>);
    if(isCur && under) out.push(<div key={'p'+i}>{under}</div>);
  });
  return <div>{out}</div>;
}

function TagPanel({tg, indent=56, sw=44, gap=6, compact}){
  const [hv,setHv] = React.useState(null); const c = hv || tg.tags[tg.cur];
  return <div style={{display:'flex',flexDirection:compact?'column':'row',gap:compact?14:28,padding:`14px 0 24px ${indent}px`,animation:'pkIn .14s both'}}>
    <Palette sel={tg.tags[tg.cur]} onPick={tg.set} onHover={setHv} sw={sw} gap={gap}/>
    <div style={{display:'flex',flexDirection:compact?'row':'column',flexWrap:'wrap',gap:compact?8:12,width:compact?'auto':150,alignItems:compact?'center':'stretch'}}>
            <PBtn kind="secondary" h={44} onClick={()=>tg.set('SKIP')}>건너뛰기</PBtn>
      {tg.canUndo && <PBtn kind="text" h={44} onClick={tg.undo}>되돌리기</PBtn>}
    </div></div>;
}

function useFollow(sc, cur){
  React.useEffect(()=>{ const box=sc.current; if(cur==null||!box) return; const el=box.querySelector(`[data-i="${cur}"]`); if(!el) return;
    const top=el.offsetTop; if(top<box.scrollTop+40||top>box.scrollTop+box.clientHeight-440) box.scrollTo({top:Math.max(0,top-160),behavior:'smooth'}); },[cur]);
}

// ───────── 03 읽기·태깅 ─────────
// 통독 단계와 태깅 단계를 분리한 컴포넌트로(훅 순서 고정)
function Read(p){ const [savor,setSavor]=React.useState(true); return savor ? <Savor {...p} onDone={()=>setSavor(false)}/> : <ReadTag {...p}/>; }
function Savor({a, go, onDone}){
  const w = WORKS[a.pk]; const n = w.lines.length;
  // 통독: 색을 고르기 전에 시 전체를 한 번 읽는다. 4초 뒤 '색 태깅하기' 활성(서두르지 않게, 막지는 않게)
  const [ready,setReady] = React.useState(false);
  React.useEffect(()=>{ const t=setTimeout(()=>setReady(true),4000); return ()=>clearTimeout(t); },[]);
  // 태깅 화면과 같은 자리(본문 위치 고정) — 버튼을 누르면 팔레트만 그 자리에 나타남
  const TXW=Math.max(...w.lines.map(t=>[...t].length))*21+8, GX=Math.max(40,Math.round((1440-(TXW+146+paletteW(48,6)))/2)), PAL_X=GX+TXW+90+56; // 본문+팔레트 묶음을 가로 가운데로
  const gaps=w.st.filter((s,i)=>i>0&&s!==w.st[i-1]).length; const sg=n>14?14:24; const rowH=Math.max(32,Math.min(52,Math.floor((900-208-36-gaps*sg)/n))); const fs=rowH<44?18:20;
  return <PFrame><TopNav go={go}/>
    <div style={{position:'absolute',left:GX,top:96,width:TXW+90}}>
      <div style={{display:'flex',alignItems:'baseline',gap:10,paddingLeft:16,marginBottom:28}}>
        <span style={{font:`700 15px ${T.sans}`,color:T.ink,whiteSpace:'nowrap'}}>먼저 충분히 몰입하여 끝까지 읽어 보세요.</span>
        <span style={{font:`400 13px ${T.sans}`,color:T.ink2,whiteSpace:'nowrap'}}></span></div>
      <div style={{display:'flex',alignItems:'baseline',gap:14,paddingLeft:16}}>
        <div style={{font:`700 22px ${T.serif}`,color:T.ink,whiteSpace:'nowrap'}}>「{w.title}」</div>
        <div style={{font:`400 14px ${T.sans}`,color:T.ink2,whiteSpace:'nowrap'}}>{workLabel(w)}</div></div>
      <div style={{height:24}}></div>
      {w.lines.map((t,i)=><div key={i} style={{height:rowH,marginTop:i>0&&w.st[i]!==w.st[i-1]?sg:0,display:'flex',alignItems:'center',padding:'0 16px',font:`400 ${fs}px ${T.serif}`,letterSpacing:'.02em',color:T.ink,whiteSpace:'nowrap',animation:`pkIn .5s ${i*90}ms both`}}>{t}</div>)}
    </div>
    <div style={{position:'absolute',right:48,bottom:36}}><PBtn disabled={!ready} onClick={onDone}>색 태깅하기</PBtn></div>
    </PFrame>;
}
function ReadTag({a, up, go}){
  const w = WORKS[a.pk]; const n = w.lines.length;
  const tg = useTagging(n, a.readInit, '읽는 중 고침');
  const [phase,setPhase] = React.useState('lines');
  const [rep,setRep] = React.useState(null); const [hv,setHv] = React.useState(null);
  const onRow = i => { setPhase('lines'); tg.setCur(tg.cur===i?null:i); };
  const finish = () => up(s=>({tags:{...s.tags,[a.pk]:tg.tags},rep:{...s.rep,[a.pk]:rep},first:{...s.first,[a.pk]:(s.first||{})[a.pk]||tg.tags},rereads:s.tags[a.pk]?{...(s.rereads||{}),[a.pk]:[...((s.rereads||{})[a.pk]||[]),{tags:s.tags[a.pk],when:nowHM()}]}:s.rereads,hist:{...s.hist,[a.pk]:tg.hist},when:{...s.when,[a.pk]:TODAY},fresh:a.pk,prog:{...s.prog,[a.pk]:undefined},readInit:null,scr:'poem',justDone:true,drawer:null,cmpR:null}));
  const rc = hv||rep;
  // 시 본문 폭 = 가장 긴 행에 맞춤 → 색 칸이 행 바로 뒤, 팔레트도 그 옆으로
  const TXW=Math.max(...w.lines.map(t=>[...t].length))*21+8, GX=Math.max(40,Math.round((1440-(TXW+146+paletteW(48,6)))/2)), PAL_X=GX+TXW+90+56; // 본문+팔레트 묶음을 가로 가운데로
  // 마지막 행까지 고르면 '행을 눌러 고르세요' 단계 없이 바로 완료 화면으로
  React.useEffect(()=>{ if(phase==='lines' && tg.done && tg.cur==null && tg.flash==null){ const t=setTimeout(finish,350); return ()=>clearTimeout(t); } },[tg.done,tg.cur,tg.flash,phase]);
  const goSave = (scr,ex) => { up(s=>({prog:{...s.prog,[a.pk]:tg.tags}})); go(scr,ex); };
  return <PFrame><TopNav go={goSave}/>
    {/* 스크롤 없음: 시 전체가 한 화면. 행 높이는 행 수에 맞춰 44~52px */}
    {(()=>{ const gaps=w.st.filter((s,i)=>i>0&&s!==w.st[i-1]).length; const sg=n>14?14:24; const rowH=Math.max(32,Math.min(52,Math.floor((900-208-36-gaps*sg)/n))); const fs=rowH<44?18:20;
      return <div style={{position:'absolute',left:GX,top:104,width:TXW+90}}>
        <div style={{display:'flex',alignItems:'baseline',gap:14,paddingLeft:16}}>
          <div style={{font:`700 22px ${T.serif}`,color:T.ink,whiteSpace:'nowrap'}}>「{w.title}」</div>
          <div style={{font:`400 14px ${T.sans}`,color:T.ink2,whiteSpace:'nowrap'}}>{workLabel(w)}</div></div>
        <div style={{height:24}}></div>
        <PoemRows w={w} tags={tg.tags} cur={phase==='lines'?tg.cur:null} onRow={onRow} flash={tg.flash} nums={false} rowH={rowH} sg={sg} fs={fs} txtW={TXW}/>
      </div>; })()}
    <div style={{position:'absolute',left:phase==='lines'?PAL_X:1040,top:phase==='lines'?127:112,width:phase==='lines'?paletteW(48,6):352}}>
      {phase==='lines' ? <div style={{display:'flex',flexDirection:'column',alignItems:'center',width:paletteW(48,6)}}>
        <div style={{opacity:tg.cur==null?.35:1,pointerEvents:tg.cur==null?'none':'auto',transition:'opacity .12s'}}><Palette sel={tg.tags[tg.cur]} onPick={tg.set} onHover={setHv} sw={48} gap={6} rowGap={10} cg={14}/></div>
        <div style={{whiteSpace:'nowrap',alignSelf:'flex-start',font:`400 12px ${T.sans}`,color:T.caption,marginTop:12}}>BCP-37 (Palmer et al. 2025)</div>
        <div style={{font:`700 20px ${T.sans}`,color:T.ink,marginTop:40}}>어떤 색이 떠오르나요?</div>
        {tg.cur!=null && <div style={{display:'flex',gap:8,marginTop:20}}>
          <PBtn kind="secondary" h={44} onClick={()=>tg.set('SKIP')}>건너뛰기</PBtn>
          {tg.canUndo && <PBtn kind="text" h={44} onClick={tg.undo}>되돌리기</PBtn>}</div>}
      </div> : <>
        <div style={{font:`500 18px ${T.sans}`,color:T.ink,marginBottom:18}}>시 전체를 한 색으로 고른다면?</div>
        <div style={{display:'flex',gap:20,alignItems:'flex-start',marginBottom:24}}>
          <VBar colors={tg.tags} st={w.st} w={40} h={14} sg={4}/>
          <div><Sq c={rep||undefined} w={96} r={4}/><div style={{font:`500 14px/1.5 ${T.sans}`,color:T.ink,marginTop:10,minHeight:42}}>{rc?<>{pcName(rc)}<br/><span style={{color:T.caption,fontWeight:400,fontSize:12}}>{rc}</span></>:<span style={{color:T.caption,fontWeight:400}}>대표색</span>}</div></div>
        </div>
        <Palette sel={rep} onPick={setRep} onHover={setHv}/>
      </>}
    </div>
    {phase==='lines' && <div title={`내 바코드 · ${tg.count} / ${n}행`} style={{position:'absolute',right:48,top:112,display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
      <VBar colors={tg.tags} st={w.st} w={12} h={6} sg={2} hl={tg.cur}/>
      <div style={{font:`400 11px ${T.sans}`,color:T.caption,whiteSpace:'nowrap'}}>{tg.count}/{n}</div></div>}
    <div style={{position:'absolute',right:48,bottom:36,display:'flex',gap:12,alignItems:'center'}}>
      {phase==='lines'
        ? <PBtn disabled={!tg.done} onClick={finish}>완료</PBtn>
        : <><PBtn kind="text" onClick={()=>{ setPhase('lines'); }}>행 색 고치기</PBtn><PBtn disabled={!rep} onClick={finish}>완료</PBtn></>}
    </div>
  </PFrame>;
}

// 이유 한 줄(선택): 고른 행 바로 아래, 입력 1칸 · Enter로 저장 · 다시 누르면 고치기. 바코드 나란히 보기의 '내가 이 색을 고른 이유'와 같은 기록
function PhReason({a, up, k, i, onColor, pal}){
  const key=k+'|'+i+'|me'; const saved=((a.why||{})[key]||{}).t||'';
  const [t,setT]=React.useState(saved); const [ed,setEd]=React.useState(!saved);
  const save=()=>{ const v=t.trim(); up(s=>{ const W={...(s.why||{})}; if(v) W[key]={t:v}; else delete W[key]; return {why:W}; }); setEd(!v); };
  const colorBtn = onColor && <PBtn kind="text" h={44} onClick={onColor} style={{padding:'0 6px'}}>{pal?'닫기':'색 바꾸기'}</PBtn>;
  return <div style={{display:'flex',alignItems:'center',gap:8,animation:'pkIn .14s both'}}>
    {ed ? <div style={{display:'flex',alignItems:'center',gap:8,width:250,border:`1px solid ${t?T.ink2:T.line}`,borderRadius:6,background:T.surface,padding:'0 6px 0 14px'}}>
        <input autoFocus={!!saved} value={t} onChange={e=>setT([...e.target.value].slice(0,REACT_MAX).join(''))} onKeyDown={e=>{ if(e.key==='Enter'&&!e.nativeEvent.isComposing){ e.preventDefault(); save(); } }}
          placeholder="이 색을 고른 이유 (선택)" style={{flex:1,minWidth:0,height:44,border:'none',outline:'none',background:'transparent',font:`400 14px ${T.sans}`,color:T.ink}}/>
        <span style={{font:`400 12px ${T.sans}`,color:T.caption,whiteSpace:'nowrap'}}>{[...t].length} / {REACT_MAX}</span>
        <PBtn kind="text" h={44} disabled={!t.trim()&&!saved} onClick={save}>남기기</PBtn></div>
      : <div className="pk-hit" onClick={()=>setEd(true)} title="눌러서 고치기" style={{display:'flex',alignItems:'center',gap:10,minHeight:44,width:250}}>
        <span style={{font:`500 12px ${T.sans}`,color:T.caption,whiteSpace:'nowrap'}}>내 이유</span>
        <span style={{font:`400 14px/1.5 ${T.sans}`,color:T.ink}}>{saved}</span></div>}
    {colorBtn}
  </div>;
}

// ───────── 07 다시 읽기·색 변화 기록 ─────────
function Reread({a, up, go}){
  const w = WORKS[a.pk]; const base = a.tags[a.pk]; const first = a.first[a.pk] || base;
  const tg = useTagging(w.lines.length, base, '다시 읽기');
  // 행을 누르면 이유 칸만 열림. 팔레트는 '색 바꾸기'를 누를 때만
  const [pal,setPal]=React.useState(false); React.useEffect(()=>{ setPal(false); },[tg.cur]);
  const sc = React.useRef(); useFollow(sc, tg.cur);
  const all = [...(a.hist[a.pk]||[]), ...tg.hist];
  const changed = tg.tags.map((c,i)=>c!==first[i]?i:-1).filter(i=>i>=0);
  const finish = () => up(s=>({tags:{...s.tags,[a.pk]:tg.tags},hist:{...s.hist,[a.pk]:all},scr:'work',convo:null}));
  return <PFrame><TopNav go={go}/>
    <div ref={sc} style={{position:'absolute',left:0,top:72,width:1180,bottom:0,overflowY:'auto',overflowX:'hidden'}}>
      <div style={{padding:'44px 0 200px 104px'}}>
        <div style={{font:`500 14px ${T.sans}`,color:T.caption,marginBottom:6}}>다시 읽기</div>
        <div style={{font:`700 32px/1.3 ${T.serif}`,color:T.ink}}>「{w.title}」</div>
        <div style={{font:`400 15px ${T.sans}`,color:T.ink2,margin:'28px 0 18px 56px'}}>바꾸고 싶은 행을 눌러 다시 고르세요. 이전 색은 기록에 남아요.</div>
        <PoemRows w={w} tags={tg.tags} cur={tg.cur} prev={first} onRow={i=>tg.setCur(tg.cur===i?null:i)} flash={tg.flash} side={tg.cur!=null ? <PhReason key={'r'+tg.cur} a={a} up={up} k={a.pk} i={tg.cur} onColor={()=>setPal(p=>!p)} pal={pal}/> : null} under={tg.cur!=null && pal ? <TagPanel key={tg.cur} tg={tg}/> : null}/>
      </div>
    </div>
    <div style={{position:'absolute',left:1196,top:112,width:212,bottom:120,display:'flex',flexDirection:'column',fontSize:12}}>
      <div style={{font:`700 15px ${T.sans}`,color:T.ink}}>색 변화 기록</div>
      <div style={{display:'flex',gap:18,marginTop:14}}>
        {[['처음',first,[]],['지금',tg.tags,changed]].map(([l,c,ch])=><div key={l} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
          <VBar colors={c} st={w.st} w={30} h={11} sg={3} changed={ch}/><div style={{font:`500 12px ${T.sans}`,color:T.ink2,whiteSpace:'nowrap'}}>{l}</div></div>)}
      </div>
      <div style={{font:`500 13px ${T.sans}`,color:T.ink2,margin:'24px 0 6px'}}>고친 기록 {all.length}</div>
      <div style={{flex:1,overflow:'auto',borderTop:`1px solid ${T.line}`}}>
        {all.length===0 && <div style={{font:`400 13px ${T.sans}`,color:T.caption,padding:'14px 0'}}>아직 고친 행이 없어요.</div>}
        {all.slice().reverse().map((h,k)=><div key={k} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 0',borderBottom:`1px solid ${T.line}`,animation:k===0&&tg.hist.length?'pkIn .15s both':'none'}}>
          <div style={{width:34,flex:'none',font:`500 13px ${T.sans}`,color:T.ink,whiteSpace:'nowrap'}}>{h.line+1}행</div>
          <Sq c={h.from} w={22}/><span style={{font:`400 13px ${T.sans}`,color:T.caption}}>→</span><Sq c={h.to} w={22}/>
          <div style={{marginLeft:6}}><div style={{font:`400 12px ${T.sans}`,color:T.caption,whiteSpace:'nowrap'}}>{h.kind} · {h.when}</div></div>
        </div>)}
      </div>
    </div>
    <div style={{position:'absolute',right:48,bottom:36}}><PBtn onClick={finish}>다시 읽기 마치기</PBtn></div>
  </PFrame>;
}

// ───────── 03m 모바일 읽기·태깅 (390×844) ─────────
function MobileRead({pk='cpd', init}){
  const w = WORKS[pk]; const n = w.lines.length;
  const tg = useTagging(n, init, '읽는 중 고침');
  const [rep,setRep] = React.useState(null); const [phase,setPhase] = React.useState('lines');
  const sc = React.useRef(); useFollow(sc, tg.cur);
  return <div style={{position:'relative',width:390,height:844,background:PAPER,overflow:'hidden',fontFamily:T.sans,color:T.ink}}><PocoStyle/>
    <div style={{position:'absolute',left:0,right:0,top:0,height:56,display:'flex',alignItems:'center',padding:'0 20px',borderBottom:`1px solid ${T.line}`,background:'transparent',zIndex:2}}>
      <Wordmark size={19}/><div style={{flex:1}}></div><div style={{font:`400 13px ${T.sans}`,color:T.ink2}}>{tg.count} / {n}행</div></div>
    <div ref={sc} style={{position:'absolute',left:0,right:0,top:56,bottom:96,overflow:'auto'}}>
      {phase==='lines' ? <div style={{padding:'24px 16px 120px'}}>
        <div style={{font:`700 24px/1.3 ${T.serif}`,paddingLeft:8}}>「{w.title}」</div>
        <div style={{font:`400 13px ${T.sans}`,color:T.ink2,margin:'6px 0 16px 8px'}}>{w.poet} · 행마다 떠오르는 색을 하나 고르세요.</div>
        {w.lines.map((t,i)=>{ const isCur=tg.cur===i; const op=tg.cur==null||isCur?1:tg.tags[i]!==undefined?.45:.3; return <React.Fragment key={i}>
          <div data-i={i} className="pk-hit" onClick={()=>tg.setCur(isCur?null:i)} style={{minHeight:48,marginTop:i>0&&w.st[i]!==w.st[i-1]?14:0,display:'flex',alignItems:'center',gap:10,padding:'6px 8px',borderRadius:4,background:isCur?T.band:undefined,opacity:op}}>
            <div style={{width:18,textAlign:'right',font:`400 11px ${T.sans}`,color:T.num,flex:'none'}}>{i+1}</div>
            <div style={{flex:1,font:`400 16px/1.6 ${T.serif}`,color:T.ink,wordBreak:'keep-all'}}>{t}</div>
            <Sq c={tg.tags[i]} w={28} style={{animation:tg.flash===i?'pkFill .14s both':'none'}}/></div>
          {isCur && <TagPanel key={'p'+i} tg={tg} indent={8} compact/>}
        </React.Fragment>; })}
      </div> : <div style={{padding:'24px 24px'}}>
        <div style={{font:`500 17px ${T.sans}`,marginBottom:16}}>시 전체를 한 색으로 고른다면?</div>
        <div style={{display:'flex',gap:14,alignItems:'center',marginBottom:20}}><Sq c={rep||undefined} w={56} r={4}/></div>
        <Palette sel={rep} onPick={setRep}/>
      </div>}
    </div>
    <div style={{position:'absolute',left:16,right:16,bottom:24}}>
      {phase==='lines' ? <PBtn disabled={!tg.done} style={{width:'100%'}}>완료</PBtn>
        : <PBtn disabled={!rep} onClick={()=>setPhase('lines')} style={{width:'100%'}}>{rep?'완료':'대표색을 골라 주세요'}</PBtn>}
    </div>
  </div>;
}
Object.assign(window,{PhReason,useTagging,PoemRows,TagPanel,Read,Reread,MobileRead});
