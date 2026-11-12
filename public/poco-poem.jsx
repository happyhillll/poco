// 시 상세(작품 페이지) — 왓챠피디아 영화 상세 구조를 시에 맞게 옮김
// 영화: 포스터·제목·연도 / 별점(내 평가) / 재감상 / 보고싶어요·코멘트 / 내가 좋아할 이유 / 기본정보 / 출연·제작 / 본 친구 / 별점 분포 / 코멘트 / 컬렉션
// 시:   표지·제목·시인·연도 / 내 바코드(내 기록) / 다시 읽기 / 찜·바코드 모음·행별 색 / 이 시를 읽어 볼 이유 / 기본정보 / 시인 / 함께 읽은 독자 / 색 분포 / 행 반응 / 비슷한 색의 시
// 다 읽기 전에는 다른 독자의 색(독자 줄·색 분포·반응 색)을 숨긴다.
const POEM_INFO = {
  cpd:'1939년 『문장』에 발표된 시. 6연 12행.',
  jil:'1989년 시집 『입 속의 검은 잎』에 실린 시. 14행.',
  sar:'봄과 여름의 비유로 사랑을 약속하는 14행의 시.',
};
const PhSec = ({t, n, right, children, style}) => <div style={{padding:'36px 0',borderTop:`1px solid ${T.line}`,...style}}>
  <div style={{display:'flex',alignItems:'baseline',gap:10,marginBottom:20}}><span style={{font:`700 20px ${T.sans}`,color:T.ink,whiteSpace:'nowrap'}}>{t}</span>{n!=null && <span style={{font:`400 17px ${T.sans}`,color:T.caption}}>{n}</span>}<div style={{flex:1}}></div>{right}</div>
  {children}</div>;
const phAv = (nm, s=56, me) => <div style={{width:s,height:s,borderRadius:'50%',flex:'none',background:me?T.ink:'#E3DED2',color:me?'#fff':T.ink2,display:'flex',alignItems:'center',justifyContent:'center',font:`500 ${Math.round(s*.32)}px ${T.sans}`}}>{nm===ME?ME_INI:nm.slice(-2)}</div>;

function PhPoem({a, up, go}){
  // 단순화 원칙: 힉(진입 행동 1개) · 선택적 주의(처음엔 내 색만, 독자 색은 펼쳐서) · 제이콥(표지·제목·CTA·본문·관련 작품의 익숙한 순서) · 밀러(섹션 4개 이내)
  const k=a.pk, w=WORKS[k], mine=a.tags[k], done=!!mine, NM=namesOf(w), n=w.lines.length;
  const scR=React.useRef(), bdR=React.useRef();
  const jump=r=>{ const b=scR.current, e=r.current; if(b&&e) b.scrollTo({top:Math.max(0,e.offsetTop-24),behavior:'smooth'}); };
  const stanzas=new Set(w.st).size, p=progOf(a,k), fav=(a.fav||[]).includes(k);
  const toggleFav=()=>up(s=>({fav:fav?(s.fav||[]).filter(x=>x!==k):[...(s.fav||[]),k]}));
  const read=()=>go('read',{pk:k,readInit:contInit(a,k)});
  const all=done?[...mine,...w.data.flat()]:[];
  const others=WORK_KEYS.filter(x=>x!==k&&WORKS[x].poet===w.poet);
  const R=(a.reacts||{})[k]||{}; const reacts=Object.entries(R).flatMap(([i,L])=>L.map(x=>({...x,i:+i})));
  React.useEffect(()=>{ if(!a.toast) return; const t=setTimeout(()=>up({toast:null}),1800); return ()=>clearTimeout(t); },[a.toast]);
  const sim=WORK_KEYS.filter(x=>x!==k).map(x=>({x,d:done&&a.tags[x]?comboDist(all,[...a.tags[x],...WORKS[x].data.flat()]):999})).sort((p,q)=>p.d-q.d).slice(0,4).map(o=>o.x);
  const favBtn=<PBtn kind="secondary" onClick={toggleFav} title={fav?'찜 취소':'찜하기'} style={{gap:6}}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill={fav?'currentColor':'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M6 3h12v18l-6-4-6 4z"></path></svg>{fav?'찜함':'찜하기'}</PBtn>;
  return <PFrame><TopNav go={go} active="list"/>
    <style>{`.pp-s{scrollbar-width:none}.pp-s::-webkit-scrollbar{display:none}.pp-th>div:last-child{border-bottom:none!important}`}</style>
    <div ref={scR} className="pp-s" style={{position:'absolute',left:0,right:0,top:72,bottom:0,overflowY:'auto'}}>
     <div style={{maxWidth:1040,margin:'0 auto',padding:'40px 48px 80px'}}>
      {/* 1. 표지 · 제목 · 행동 1개 */}
      <div style={{display:'flex',gap:40,alignItems:'flex-end'}}>
        <WorkCover width={180} w={w} tags={mine} mine={done} fav={fav} onOpen={()=>{}}/>
        <div style={{paddingBottom:6,flex:'none',maxWidth:560}}>
          {k===TODAY_PK && <span style={{display:'table',font:`500 12px ${T.sans}`,color:T.ink,border:`1px solid ${T.ink}`,borderRadius:3,padding:'2px 8px',marginBottom:12,whiteSpace:'nowrap'}}>오늘의 시</span>}
          <div style={{font:`700 ${w.title.length>8?Math.max(24,Math.floor(320/w.title.length*1.1)):40}px/1.25 ${T.serif}`,letterSpacing:w.title.length>8?'-0.02em':0,whiteSpace:'nowrap',color:T.ink}}>{w.title}</div>
          <div style={{font:`400 16px ${T.sans}`,color:T.ink2,marginTop:10}}>{[w.poet,w.year,`${n}행`,stanzas>1?`${stanzas}연`:null,`읽은 독자 ${w.readers||NM.length}명`].filter(Boolean).join(' · ')}</div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginTop:24}}>
            {done ? <PBtn onClick={()=>go('read',{pk:k,readInit:Array(n).fill(undefined)})}>또 읽기</PBtn>
                  : <PBtn onClick={read}>{p?`이어 읽기 · ${p}/${n}행`:'읽고 색 고르기'}</PBtn>}
            {favBtn}</div>
        </div>
      </div>
      {/* 2. 본문 + 내 바코드 (다 읽은 뒤) */}
      {done ? <div ref={bdR}><PhBody a={a} up={up} go={go} k={k}/></div>
        : <div style={{marginTop:40,padding:'28px 32px',background:T.band,borderRadius:8,display:'flex',alignItems:'center',gap:20}}>
            <svg width="22" height="24" viewBox="0 0 14 16" fill="none" stroke={T.ink} strokeWidth="1.4"><rect x="1.5" y="7" width="11" height="8" rx="1.5"></rect><path d="M4 7V4.5a3 3 0 016 0V7"></path></svg>
            <div style={{font:`400 15px/1.6 ${T.sans}`,color:T.ink2}}>본문을 한 행씩 읽으며 색을 고르면, 내 컬러 바코드와 독자 {NM.length}명의 색이 여기에 열려요.</div></div>}
      {/* 3. 시인 (기본정보를 합침) */}
      <PhSec t="시인">
        <div className="pk-hit pk-row" onClick={()=>go('poets',{poet:w.poet})} style={{display:'flex',alignItems:'center',gap:18,padding:'6px 4px',borderRadius:6}}>
          {poetPhoto(w.poet,64,32)}<div style={{flex:1,minWidth:0}}><div style={{font:`500 17px ${T.sans}`,color:T.ink}}>{w.poet}</div><div style={{font:`400 14px/1.6 ${T.sans}`,color:T.ink2,marginTop:4}}>{POEM_INFO[k]||`${w.year?w.year+'년 발표 · ':''}${n}행${stanzas>1?' '+stanzas+'연':''}.`} Poco에 있는 시 {others.length+1}편</div></div>
          <span style={{font:`400 22px ${T.sans}`,color:T.caption}}>›</span></div>
      </PhSec>
      {/* 4. 반응 (처음 3개만, 더 보기) */}
      {done && <PhFriendCmp a={a} up={up} k={k}/>}
      {done && <PhPoemTalk a={a} up={up} k={k} reacts={reacts}/>}
      {/* 5. 관련 작품 */}
      <PhSec t={done?'비슷한 색으로 읽힌 시':'다른 시'}>
        <div style={{display:'flex',gap:20}}>{sim.map(x=><WorkCover key={x} fav={(a.fav||[]).includes(x)} width={164} w={WORKS[x]} tags={a.tags[x]} mine={!!a.tags[x]} onOpen={()=>go('poem',{pk:x})}/>)}</div>
      </PhSec>
     </div>
    </div>
    {done && a.justDone && <PhDoneModal a={a} up={up} k={k}/>}
    <Toast text={a.toast}/>
  </PFrame>;
}
// 본문: 기본은 [행 | 내 색]만 (선택적 주의). '독자 n명의 색' 토글을 켜면 독자 열이 열리고, 가장 비슷/다른 독자 칩으로 한 명과 비교.
// 오른쪽: 내 컬러 바코드 · 대표색 (이 화면의 핵심 산출물, 폰 레스토프)
function PhBody({a, up, go, k}){
  const w=WORKS[k], mine=a.tags[k], NM0=namesOf(w), n=w.lines.length;
  const following=a.following||[]; const FR=NM0.map((nm,r)=>({nm,r})).filter(o=>following.includes(o.nm)); // 친구 = 내가 팔로우하는 독자
  const view=a.pv||'me'; const showR=view==='friends'&&FR.length>0, showAll=view==='all';
  const one=view==='me'&&a.cmpR!=null&&NM0[a.cmpR]?{nm:NM0[a.cmpR],r:a.cmpR}:null; // 내 색 탭에서 친구 한 명만 골라 보기
  const [hv,setHv]=React.useState(null); // {i, who, c}
  React.useEffect(()=>{ if(!a.bub) return; const h=e=>{ if(e.key==='Escape' && !(e.target&&/^(INPUT|TEXTAREA)$/.test(e.target.tagName)&&e.target.value.trim())) up({bub:null}); }; /* 쓰던 글이 있으면 Esc로 닫지 않음(빈 입력칸이면 닫힘) */ window.addEventListener('keydown',h); return ()=>window.removeEventListener('keydown',h); },[a.bub]);
  const bub=a.bub||null; // 말풍선: {i, r}  r=-1 → 내 이유, r>=0 → 그 친구의 이유 + 답글
  const WHY=a.why||{}; const cntOf=i=>{ let c=0; if(WHY[k+'|'+i+'|me']) c++; FR.forEach(({r})=>{ const W=WHY[k+'|'+i+'|'+r]; if(seedWhy(k,i,r)) c++; if(W&&W.thread) c+=W.thread.length; }); return c; };
  const ok=c=>c&&c!=='T1'&&c!=='SKIP'&&PC[c];
  // 전체 독자 분포(시연): 그 행에 실제로 고른 색 + 같은 색상 계열(밝기만 다른 색)이 주로 나오게 시드로 나눔 → 막대마다 비슷한 색끼리 모임
  const N=w.readers||40;
  const allDist=React.useMemo(()=>w.lines.map((_,i)=>{ const base=[mine[i],...w.data[i]].filter(ok);
    const fam=c=>PC_GRID.filter(x=>x!==c&&x[1]===c[1]&&x[0]!=='A'); const kin=base.flatMap(c=>c[0]==='A'||c==='BK'||c==='WH'?['A1','A2','A3']:fam(c));
    const pool=[...base,...base,...base,...base,...kin,...kin,'A2','A3']; const cnt={}; const rnd=mulberry32(hashStr(k+'|all2|'+i));
    for(let v=0;v<N;v++){ const c=pool[Math.floor(rnd()*pool.length)]; cnt[c]=(cnt[c]||0)+1; } return Object.entries(cnt).sort((x,y)=>y[1]-x[1]); }),[k]);
  // 본문 열 폭: 컨테이너 1040 + 오른쪽으로 140 확장 − 간격 40 − 오른쪽 열 320. 긴 행은 글자 크기를 줄여 한 줄에 맞춤(제목과 같은 방식)
  // 본문 글자는 읽기 화면과 같은 20px 고정. 폭이 모자라면 글자를 줄이지 않고 본문 영역을 양옆으로 넓힌다(왼쪽 -100, 오른쪽 -140)
  const RIGHTW=340, fs=20; // 오른쪽 열(말풍선/바코드)은 본문 바로 옆에 붙음
  // 가장 긴 행의 실제 글자 폭을 캔버스로 재서 본문 열 폭을 정함(자간 .02em 포함) → 어떤 시든 행이 넘치지 않음
  const measure=()=>{ const cv=document.createElement('canvas').getContext('2d'); cv.font=`400 ${fs}px ${T.serif}`; return Math.ceil(Math.max(...w.lines.map(x=>cv.measureText(x).width+[...x].length*fs*0.02)))+2; };
  const [TW0,setTW]=React.useState(measure); const TW=TW0; // 행은 접지 않음: 가장 긴 행 폭만큼 본문 열이 넓어지고, 색 칸·말풍선·바코드 열은 그만큼 오른쪽으로 밀림
  React.useEffect(()=>{ setTW(measure()); if(document.fonts&&document.fonts.ready) document.fonts.ready.then(()=>setTW(measure())); },[k]);
  const SQ=36;
  const rowRefs=React.useRef([]); React.useEffect(()=>{ if(!a.bub) return; const t=setTimeout(()=>{ const el=rowRefs.current[a.bub.i]; if(el) el.scrollIntoView({block:'center',behavior:'smooth'}); },60); return ()=>clearTimeout(t); },[]); // 다른 화면에서 말풍선을 연 채로 들어오면 그 행으로
  // 친구·전체 탭에서 본문 열이 넓어 오른쪽 말풍선 열(RIGHTW)이 화면 밖으로 나가면: 오른쪽 열을 접고 말풍선을 그 행 바로 아래(행 오른쪽 끝 정렬)에 띄움
  const leftR=React.useRef(); const [under,setUnder]=React.useState(false);
  React.useLayoutEffect(()=>{ const el=leftR.current; if(!el) return; let box=el.parentElement; while(box&&!/(auto|scroll)/.test(getComputedStyle(box).overflowY)) box=box.parentElement;
    const r=el.getBoundingClientRect(), sc=r.width/(el.offsetWidth||1), lim=box?box.getBoundingClientRect().right:window.innerWidth;
    const need=(showR||showAll) && r.right+(24+RIGHTW+24)*sc>lim; if(need!==under) setUnder(need); });
  const [,tick]=React.useState(0); React.useEffect(()=>{ const h=()=>tick(x=>x+1); window.addEventListener('resize',h); return ()=>window.removeEventListener('resize',h); },[]); /* 창 크기가 바뀌면 다시 재서 말풍선 배치 갱신 */ React.useEffect(()=>{ tick(x=>x+1); },[bub&&bub.i,bub&&bub.r,TW,view]);
  const rowTop=i=>{ const el=rowRefs.current[i]; if(el) return el.offsetTop; let y=(showR||showAll)?40:0; for(let j=0;j<=i;j++){ if(j>0&&w.st[j]!==w.st[j-1]) y+=20; if(j<i) y+=52; } return y; };
  const seg=(key,l,on,fn,ic)=><div key={key} className="pk-hit" onClick={fn} style={{height:36,padding:'0 14px',display:'inline-flex',alignItems:'center',gap:8,font:`${on?700:400} 13px ${T.sans}`,background:on?T.band:T.surface,color:on?T.ink:T.ink2,whiteSpace:'nowrap'}}>{ic}{l}</div>;
  const switcher=<div style={{display:'flex',border:`1px solid ${T.line}`,borderRadius:18,overflow:'hidden'}}>
    {seg('me','내 색',view==='me',()=>up({pv:'me',cmpR:null}))}
    {seg('fr',`친구 ${FR.length}명의 색`,view==='friends',()=>up({pv:'friends',cmpR:null}))}
    {seg('all',`전체 독자 ${N}명`,view==='all',()=>up({pv:'all',cmpR:null}),<span style={{display:'inline-flex',gap:1}}>{['SY','SO','SB','A1'].map(c=><span key={c} style={{width:5,height:12,background:PC[c][1]}}></span>)}</span>)}</div>;
  const bar=(i,segs)=><div style={{display:'flex',marginLeft:12,width:260,flex:'none',height:SQ,borderRadius:3,overflow:'hidden',gap:segs.length<=6?2:0}} onMouseLeave={()=>setHv(null)}>
    {segs.map((s,j)=><div key={j} onMouseEnter={()=>setHv({i,...s})} title={`${s.who} · ${pcLabel(s.c)||'비움'}`} style={{width:`${s.p*100}%`,background:ok(s.c)?PC[s.c][1]:'transparent',border:ok(s.c)?'none':`1px dashed ${T.disabled}`,boxSizing:'border-box',outline:hv&&hv.i===i&&hv.who===s.who?`2px solid ${T.ink}`:'none',outlineOffset:-2,opacity:hv&&hv.i===i&&hv.who!==s.who?.45:1,transition:'opacity .1s'}}></div>)}</div>;
  const hint=i=>hv&&hv.i===i && <span style={{position:'relative',width:0,marginLeft:-16,flex:'none',alignSelf:'stretch'}}><span style={{position:'absolute',left:-244,bottom:'calc(100% - 4px)',font:`500 12px ${T.sans}`,color:'#fff',background:T.ink,borderRadius:4,padding:'3px 8px',whiteSpace:'nowrap',pointerEvents:'none',zIndex:3}}>{hv.who} · {pcName(hv.c)||'비움'}</span></span>; /* 막대 위에 겹쳐 띄움: 행 폭이 바뀌지 않게 */
  return <PhSec t="본문과 내 색" style={{marginTop:36}} right={switcher}>
    {view==='friends' && FR.length===0 && <div style={{margin:'0 0 16px',padding:'14px 18px',background:T.band,borderRadius:6,font:`400 14px ${T.sans}`,color:T.ink2}}>이 시를 읽은 독자 중 팔로우하는 친구가 아직 없어요. 전체 독자의 색을 보거나, 아래 독자의 프로필에서 팔로우해 보세요.
      {go && <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:12}}>{namesOf(WORKS[k]).filter(n=>n!==ME).map(n=><span key={n} className="pk-hit" onClick={()=>go('user',{who:n})} style={{display:'inline-flex',alignItems:'center',gap:8,height:36,padding:'0 12px 0 4px',background:T.surface,border:`1px solid ${T.line}`,borderRadius:18,font:`500 13px ${T.sans}`,color:T.ink}}><PhPic nm={n} s={28}/>{n}</span>)}</div>}</div>}
    <div style={{display:'flex',gap:24,alignItems:'flex-start',marginRight:-180}}>
      <div ref={leftR} style={{flex:'none',position:'relative'}}>
       <div style={{width:'max-content',position:'relative'}}>
        {one && <div style={{display:'flex',alignItems:'flex-end',gap:16,padding:'0 12px',height:40}}>
          <span style={{width:20}}></span><span style={{width:TW,flex:'none'}}></span>
          <div style={{width:SQ,display:'flex',justifyContent:'center'}}><span style={{font:`700 11px ${T.sans}`,color:T.ink,whiteSpace:'nowrap'}}>{one.nm===ME?ME_INI:one.nm.slice(-2)}</span></div></div>}
        {(showR||showAll) && <div style={{display:'flex',alignItems:'flex-end',gap:16,padding:'0 12px',height:40}}>
          <span style={{width:20}}></span><span style={{width:TW,flex:'none'}}></span>
          <div style={{width:SQ,display:'flex',justifyContent:'center'}}><span style={{font:`700 11px ${T.sans}`,color:T.ink}}>나</span></div>
          </div>}
        {w.lines.map((t,i)=><React.Fragment key={i}><div className="pk-hit pk-row" onClick={()=>up({bub:bub&&bub.i===i&&bub.r===-1?null:{i,r:-1}})} title="누르면 이 색을 고른 이유를 남길 수 있어요" ref={el=>{ rowRefs.current[i]=el; }} style={{display:'flex',alignItems:'center',gap:16,minHeight:52,padding:'4px 12px',boxSizing:'border-box',borderRadius:4,marginTop:i>0&&w.st[i]!==w.st[i-1]?20:0,background:bub&&bub.i===i?T.band:undefined}}>
            <span style={{width:20,flex:'none',textAlign:'right',font:`400 11px ${T.sans}`,color:T.num}}>{i+1}</span>
            <span style={{width:TW,minWidth:TW,maxWidth:TW,flex:'none',font:`400 ${fs}px/1.5 ${T.serif}`,color:T.ink,letterSpacing:'.02em',whiteSpace:'nowrap'}}>{t}</span>
            {one ? <Sq key={'o'+one.r} c={w.data[i][one.r]} w={SQ} title={`${one.nm} · ${pcLabel(w.data[i][one.r])||'비움'}`} style={{animation:'pkIn .12s both'}}/> : <Sq c={mine[i]} w={SQ} title={`나 · ${pcLabel(mine[i])}`}/>}
            {showR && <div style={{display:'flex',gap:4,marginLeft:12}} onMouseLeave={()=>setHv(null)}>{FR.map(({nm,r})=><div key={r} onMouseEnter={()=>setHv({i,who:nm,c:w.data[i][r]})} onClick={e=>{ e.stopPropagation(); up({bub:bub&&bub.i===i&&bub.r===r?null:{i,r}}); }} style={{position:'relative',width:SQ,height:SQ,flex:'none',outline:hv&&hv.i===i&&hv.who===nm?`2px solid ${T.ink}`:'none',outlineOffset:2,borderRadius:3,opacity:hv&&hv.i===i&&hv.who!==nm?.45:1,transition:'opacity .1s'}}><Sq c={w.data[i][r]} w={SQ} title=""/>{hv&&hv.i===i&&hv.who===nm && <span style={{position:'absolute',left:'50%',bottom:'calc(100% + 6px)',transform:'translateX(-50%)',background:T.ink,color:'#fff',font:`500 12px ${T.sans}`,padding:'4px 8px',borderRadius:4,whiteSpace:'nowrap',pointerEvents:'none',zIndex:3}}>{nm}</span>}{seedWhy(k,i,r) && <span style={{position:'absolute',right:-3,top:-3,width:9,height:9,borderRadius:'50%',background:T.ink,border:`1.5px solid ${PAPER}`}}></span>}</div>)}</div>}
            {showAll && bar(i,allDist[i].map(([c,cnt])=>({who:`${cnt}명`,c,p:cnt/N})))}
            {showAll && hint(i)}
            {cntOf(i)>0 && <span className="pk-hit" onClick={e=>{ e.stopPropagation(); up({bub:bub&&bub.i===i&&bub.r==='all'?null:{i,r:'all'}}); }} title="이 행에 남긴 이유와 답글 보기" style={{display:'inline-flex',alignItems:'center',gap:4,height:32,padding:'0 8px',marginLeft:4,borderRadius:16,font:`${bub&&bub.i===i&&bub.r==='all'?700:400} 12px ${T.sans}`,color:bub&&bub.i===i&&bub.r==='all'?T.ink:T.caption,background:bub&&bub.i===i&&bub.r==='all'?T.surface:'transparent',whiteSpace:'nowrap'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M4 5h16v11H9l-5 4z"></path></svg>{cntOf(i)}</span>}
          </div>
          </React.Fragment>)}
        {bub && under && <div style={{position:'absolute',right:0,width:RIGHTW,top:rowTop(bub.i)+56,zIndex:4}}>
          <PhBubble key={bub.i+'|'+bub.r} a={a} up={up} k={k} i={bub.i} r={bub.r} friends={FR} nm={bub.r==='all'?'':bub.r>=0?NM0[bub.r]:ME} c={bub.r==='all'?null:bub.r>=0?w.data[bub.i][bub.r]:mine[bub.i]} top={0} below/></div>}
       </div>
      </div>
      {/* 오른쪽 열은 항상 같은 폭(320) → 말풍선이 열려도 왼쪽 행 폭이 변하지 않음 */}
      <div style={{width:under?0:RIGHTW,flex:'none',position:'relative',alignSelf:'stretch'}}>
      {bub && !under && <>
        <PhBubble key={bub.i+'|'+bub.r} a={a} up={up} k={k} i={bub.i} r={bub.r} friends={FR} nm={bub.r==='all'?'':bub.r>=0?NM0[bub.r]:ME} c={bub.r==='all'?null:bub.r>=0?w.data[bub.i][bub.r]:mine[bub.i]} top={rowTop(bub.i)}/>
      </>}
      {!bub && !showAll && !showR && <div style={{width:170,position:'sticky',top:24}}>
        <div style={{font:`700 13px ${T.sans}`,color:T.ink,marginBottom:10}}>{one?`${one.nm} 님의 컬러 바코드`:'내 컬러 바코드'}</div>
        <div style={{display:'flex',gap:10,alignItems:'flex-start'}}>
          <VBar key={one?one.r:'me'} colors={one?w.data.map(row=>row[one.r]):mine} st={w.st} w={90} h={Math.max(12,Math.min(24,Math.floor(340/n)))} sg={6}/>
          {one && <div style={{display:'flex',flexDirection:'column',gap:4}}><span style={{font:`400 11px ${T.sans}`,color:T.caption}}>내 것과 같은 행</span><span style={{font:`700 16px ${T.sans}`,color:T.ink}}>{w.data.filter((row,i)=>row[one.r]===mine[i]).length}</span></div>}</div>
        {FR.length>0 && <div style={{marginTop:28}}>
          <div style={{font:`500 12px ${T.sans}`,color:T.caption,marginBottom:8}}>누구의 색을 볼까요</div>
          <div style={{display:'flex',flexDirection:'column',gap:2}}>
            {[{nm:ME,r:null},...FR].map(({nm,r})=>{ const on=r===null?!one:(one&&one.r===r); return <div key={String(r)} className="pk-hit" onClick={()=>up({cmpR:r})} style={{display:'flex',alignItems:'center',gap:10,height:40,padding:'0 8px',marginLeft:-8,borderRadius:6,background:on?T.band:'transparent'}}>
              <PhPic nm={nm} s={26} me={r===null}/><span style={{font:`${on?700:400} 14px ${T.sans}`,color:T.ink}}>{r===null?`${nm}(나)`:nm}</span></div>; })}</div></div>}
      </div>}
      </div>
    </div>
  </PhSec>;
}
// 친구가 그 행에 이유를 남겼는지(시연 시드: 약 1/3 행)
const hasWhy=(k,i,r)=>mulberry32(hashStr(k+'|'+i+'|'+r+'|has'))()<0.16;
// 친구가 그 행에 남긴 이유(시연): 그 행에 행 반응(REACTS0)이 있으면 반응 글과 같은 내용을 쓰고(한 사람 한 글), 없으면 시드 문장
const seedWhy=(k,i,r)=>{ const nm=namesOf(WORKS[k])[r]; const L=(REACTS0[k]||{})[i]; if(L){ const x=L.find(y=>y.n===nm); return x?x.t:null; } return hasWhy(k,i,r)?WHY_SEED[Math.floor(mulberry32(hashStr(k+'|'+i+'|'+r))()*WHY_SEED.length)]:null; };
// 말풍선: 행 아래, 누른 칸 위치에서 시작. 내 칸 → 내 이유 쓰기/고치기. 친구 칸 → 친구의 이유 + 답글 목록 + 답글 쓰기
function PhBubble({a, up, k, i, r, nm, c, top, friends=[], below}){
  if(r==='all') return <PhRowThread a={a} up={up} k={k} i={i} top={top} friends={friends} below={below}/>;
  const me=r<0, key=me?k+'|'+i+'|me':k+'|'+i+'|'+r, W=(a.why||{})[key]||{};
  const [t,setT]=React.useState(me?(W.t||''):''); const [edit,setEdit]=React.useState(!W.t);
  const save=patch=>up(s=>({why:{...(s.why||{}),...patch}}));
  const theirs=!me?seedWhy(k,i,r):null;
  const th=W.thread||[];
  // 답글을 남기면 그 친구에게 알림(시연: 상태에 쌓고 토스트로 확인)
  const notify=txt=>up(s=>({notifs:[...(s.notifs||[]),{to:nm,from:ME,pk:k,i,t:txt,when:TODAY}],toast:`${nm} 님에게 알림을 보냈어요`}));
  const input=(ph,onSend,canEmpty)=><div style={{display:'flex',alignItems:'center',gap:6,border:`1px solid ${t?T.ink2:T.line}`,borderRadius:6,background:T.surface,padding:'0 4px 0 12px'}}>
    <input autoFocus value={t} onChange={e=>setT([...e.target.value].slice(0,REACT_MAX).join(''))} onKeyDown={e=>{ if(e.key==='Enter'&&!e.nativeEvent.isComposing&&(t.trim()||canEmpty)){ e.preventDefault(); onSend(); } }} placeholder={ph} style={{flex:1,minWidth:0,height:44,border:'none',outline:'none',background:'transparent',font:`400 14px ${T.sans}`,color:T.ink}}/>
    <span style={{font:`400 11px ${T.sans}`,color:T.caption}}>{[...t].length}/{REACT_MAX}</span><PBtn kind="text" h={44} disabled={!t.trim()&&!canEmpty} onClick={onSend}>남기기</PBtn></div>;
  return <div onClick={e=>e.stopPropagation()} style={{position:'absolute',left:0,right:0,top,background:T.surface,border:`1px solid ${T.line}`,borderRadius:10,padding:'14px 16px',boxShadow:'0 6px 18px rgba(0,0,0,.06)',animation:'pkIn .12s both'}}>
    <div style={below?{position:'absolute',right:28,top:-7,width:12,height:12,background:T.surface,borderLeft:`1px solid ${T.line}`,borderTop:`1px solid ${T.line}`,transform:'rotate(45deg)'}:{position:'absolute',left:-7,top:16,width:12,height:12,background:T.surface,borderLeft:`1px solid ${T.line}`,borderBottom:`1px solid ${T.line}`,transform:'rotate(45deg)'}}></div>
    <div style={{display:'flex',alignItems:'center',gap:10}}><PhPic nm={nm} s={28} me={me}/><span style={{font:`700 14px ${T.sans}`,color:T.ink,whiteSpace:'nowrap'}}>{nm}</span>{!me && <span style={{font:`400 12px ${T.sans}`,color:T.caption,whiteSpace:'nowrap'}}>이 색을 고른 이유</span>}
      <div style={{flex:1}}></div><span className="pk-hit" onClick={()=>up({bub:null})} style={{font:`400 18px ${T.sans}`,color:T.caption,padding:'0 4px'}}>×</span></div>
    {me ? (edit ? <div style={{marginTop:12}}>{input('왜 이 색이었는지 짧게 남겨 보세요',()=>{ const v=t.trim(); up(s=>withMyWhy(s,k,i,v)); setEdit(!v); },!!W.t)}</div>
        : <div style={{marginTop:10,display:'flex',alignItems:'flex-start',gap:12}}><div style={{flex:1,font:`400 15px/1.6 ${T.sans}`,color:T.ink}}>{W.t}</div><span className="pk-link" onClick={()=>setEdit(true)} style={{font:`400 13px ${T.sans}`,whiteSpace:'nowrap',height:32,display:'inline-flex',alignItems:'center'}}>고치기</span></div>)
      : <>
        <div style={{marginTop:10,font:`400 15px/1.6 ${T.sans}`,color:theirs?T.ink:T.caption}}>{theirs||'아직 이 색을 고른 이유를 남기지 않았어요.'}</div>
        {!theirs && (()=>{ const cur=(a.curious||{})[key]||[]; const on=cur.includes(ME); const n=cur.length+(hasWhy(k,i,r+'|c')?1:0);
          return <div className="pk-hit" onClick={()=>{ up(s=>{ const L=((s.curious||{})[key]||[]); const next=on?L.filter(x=>x!==ME):[...L,ME]; return {curious:{...(s.curious||{}),[key]:next},...(on?{}:{notifs:[...(s.notifs||[]),{to:nm,from:ME,pk:k,i,t:'궁금해요',when:TODAY}],toast:`${nm} 님에게 알림을 보냈어요`})}; }); }}
            style={{marginTop:12,height:40,padding:'0 14px',display:'inline-flex',alignItems:'center',gap:8,borderRadius:20,border:`1px solid ${on?T.ink:T.line}`,background:on?T.ink:T.surface,color:on?'#fff':T.ink,font:`500 13px ${T.sans}`}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"></circle><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7"></path><path d="M12 17h.01"></path></svg>궁금해요{n>0?` ${n}`:''}</div>; })()}
        {th.length>0 && <div style={{marginTop:12,paddingLeft:12,borderLeft:`2px solid ${T.line}`,display:'flex',flexDirection:'column',gap:10}}>
          {th.map((m,j)=><div key={j} style={{display:'flex',gap:8,alignItems:'flex-start'}}><PhPic nm={m.n} s={22} me={m.n===ME}/><div><span style={{font:`700 12px ${T.sans}`,color:T.ink}}>{m.n}</span><div style={{font:`400 14px/1.5 ${T.sans}`,color:T.ink}}>{m.t}</div></div></div>)}</div>}
        <div style={{marginTop:12}}>{input(theirs?'답글 달기':'한마디 남기기',()=>{ const v=t.trim(); save({[key]:{...W,thread:[...th,{n:ME,t:v}]}}); notify(v); setT(''); })}</div>
      </>}
  </div>;
}
// 친구 비교 카드 2장: 가장 비슷하게 읽은 친구(같은 색 행 수 최다) · 가장 다르게 읽은 친구(팔레트 색 거리 합 최대) + 그 친구와 가장 멀었던 행
function PhFriendCmp({a, up, k}){
  const w=WORKS[k], mine=a.tags[k], NM=namesOf(w), following=a.following||[];
  const ok=c=>c&&c!=='T1'&&c!=='SKIP'&&PC[c];
  const FR=NM.map((nm,r)=>({nm,r})).filter(o=>following.includes(o.nm)); if(FR.length<1) return null;
  const rs=FR.map(({nm,r})=>{ const cs=w.data.map(row=>row[r]); let same=0,d=0,far={i:-1,d:-1};
    cs.forEach((c,i)=>{ if(c===mine[i]) same++; if(ok(c)&&ok(mine[i])){ const dd=comboDist([c],[mine[i]]); d+=dd; if(dd>far.d) far={i,d:dd}; } }); return {nm,r,same,d,far}; });
  const near=rs.slice().sort((x,y)=>y.same-x.same||x.d-y.d)[0];
  const farR=rs.slice().sort((x,y)=>y.d-x.d)[0];
  const card=(label,o,body)=><div key={label} className="pk-hit pk-card" onClick={()=>up({pv:'friends',bub:o.far&&label.includes('다르')?{i:o.far.i,r:o.r}:null})} style={{flex:1,minWidth:0,boxSizing:'border-box',border:`1px solid ${T.line}`,borderRadius:8,padding:'16px 20px',display:'flex',alignItems:'center',gap:16,background:T.surface}}>
    <PhPic nm={o.nm} s={52}/>
    <div style={{flex:1,minWidth:0}}>
      <div style={{font:`400 12px ${T.sans}`,color:T.ink2,whiteSpace:'nowrap'}}>{label}</div>
      <div style={{font:`700 17px ${T.sans}`,color:T.ink,marginTop:2}}>{o.nm}</div>
      <div style={{display:'flex',alignItems:'center',gap:8,marginTop:6,font:`400 13px ${T.sans}`,color:T.ink2,minWidth:0}}>{body}</div></div>
    <span style={{font:`400 20px ${T.sans}`,color:T.caption}}>›</span></div>;
  return <div style={{display:'flex',gap:16,marginTop:36}}>
    {card('나와 가장 비슷하게 읽은 친구',near,<span>일치하는 행 : <b style={{color:T.ink}}>{near.same}개</b></span>)}
    {farR && farR.far.i>=0 && FR.length>1 && card('나와 가장 다르게 읽은 친구',farR,<>
      <span style={{whiteSpace:'nowrap'}}>가장 다르게 고른 행 :</span>
      <span style={{font:`400 14px ${T.serif}`,color:T.ink,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{w.lines[farR.far.i]}</span>
      <span style={{display:'inline-flex',gap:3,flex:'none'}}><Sq c={mine[farR.far.i]} w={16} r={2}/><Sq c={w.data[farR.far.i][farR.r]} w={16} r={2}/></span></>)}
  </div>;
}
// 반응 섹션: [행 반응 | 후기] 탭 × [친구 | 전체] 필터. 후기 = 시 전체에 대한 한마디, 내 입력칸 포함
const REVIEW_SEED=['읽고 나니 색 하나가 오래 남았어요.','처음엔 밝게 읽었는데 끝에서 톤이 가라앉았어요.','같은 행을 친구와 다르게 읽은 게 재미있었어요.','소리 내어 읽으니 색이 더 또렷해졌어요.','두 번째 읽을 때 색을 세 군데 바꿨어요.'];
function PhPoemTalk({a, up, k, reacts}){
  const w=WORKS[k], NM=namesOf(w), following=a.following||[];
  const tab='line'; const [who,setWho]=React.useState('all'); const [more,setMore]=React.useState(false); const [t,setT]=React.useState('');
  const seeded=React.useMemo(()=>NM.filter((_,r)=>mulberry32(hashStr(k+'|rv|'+r))()<0.5).map((n,j)=>({id:'s'+j,n,t:REVIEW_SEED[Math.floor(mulberry32(hashStr(k+'|rvt|'+n))()*REVIEW_SEED.length)],when:'10월 1'+(j+2)+'일'})),[k]);
  const reviews=[...((a.reviews||{})[k]||[]),...seeded];
  const isFriend=n=>n===ME||following.includes(n);
  const list=(tab==='line'?reacts:reviews).filter(x=>who==='all'||isFriend(x.n));
  const shown=more?list:list.slice(0,3);
  const send=()=>{ const v=t.trim(); if(!v) return; up(s=>({reviews:{...(s.reviews||{}),[k]:[{id:'me'+Date.now(),n:ME,t:v,when:TODAY},...((s.reviews||{})[k]||[])]}})); setT(''); };
  const segs=(cur,set,items)=><div style={{display:'flex',border:`1px solid ${T.line}`,borderRadius:6,overflow:'hidden'}}>{items.map(([m,l])=><div key={m} className="pk-hit" onClick={()=>{ set(m); setMore(false); }} style={{height:40,padding:'0 16px',display:'flex',alignItems:'center',font:`${cur===m?700:400} 14px ${T.sans}`,background:cur===m?T.band:T.surface,color:cur===m?T.ink:T.ink2,whiteSpace:'nowrap'}}>{l}</div>)}</div>;
  return <PhSec t="반응" n={list.length} right={segs(who,setWho,[['friends','친구'],['all','전체']])}>
    {list.length===0 && <div style={{font:`400 15px ${T.sans}`,color:T.ink2,padding:'16px 0'}}>{who==='friends'?'친구가 남긴 '+(tab==='line'?'행 반응':'후기')+'이 아직 없어요.':'아직 '+(tab==='line'?'행 반응':'후기')+'가 없어요.'}</div>}
    <div style={{display:'flex',flexDirection:'column'}}>{shown.map(x=><div key={x.id} style={{padding:'18px 0',borderBottom:`1px solid ${T.line}`}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>{phAv(x.n,40,x.n===ME)}<span style={{font:`700 15px ${T.sans}`,color:T.ink}}>{x.n}</span>
        {following.includes(x.n) && <span style={{font:`500 11px ${T.sans}`,color:T.ink2,border:`1px solid ${T.line}`,borderRadius:3,padding:'1px 6px'}}>친구</span>}
        {tab==='line' ? <><Sq c={x.c} w={18} r={2}/><span style={{font:`400 13px ${T.sans}`,color:T.caption}}>{x.i+1}행</span></> : <span style={{font:`400 13px ${T.sans}`,color:T.caption}}>{x.when}</span>}</div>
      {tab==='line' && <div style={{font:`400 15px ${T.serif}`,color:T.ink2,margin:'12px 0 6px',letterSpacing:'.02em'}}>“{w.lines[x.i]}”</div>}
      <div style={{font:`400 16px/1.6 ${T.sans}`,color:T.ink,marginTop:tab==='line'?0:10}}>{x.t}</div>
      <PhReactActs a={a} up={up} id={x.id}/></div>)}</div>
    {list.length>3 && <span className="pk-link" onClick={()=>setMore(m=>!m)} style={{display:'inline-flex',alignItems:'center',height:44,marginTop:6,font:`400 14px ${T.sans}`}}>{more?'접기':`${list.length-3}개 더 보기`}</span>}
  </PhSec>;
}
// 행 끝 말풍선 숫자를 누르면: 이 행에서 친구들이 고른 색 + 이유 + 답글을 한 번에. 각 항목의 '답글'로 그 친구 말풍선으로 이동
function PhRowThread({a, up, k, i, top, friends, below}){
  const w=WORKS[k], WHY=a.why||{}, mineW=WHY[k+'|'+i+'|me'];
  const items=friends.filter(({r})=>seedWhy(k,i,r)||((WHY[k+'|'+i+'|'+r]||{}).thread||[]).length);
  return <div onClick={e=>e.stopPropagation()} style={{position:'absolute',left:0,right:0,top,background:T.surface,border:`1px solid ${T.line}`,borderRadius:10,padding:'8px 16px',boxShadow:'0 6px 18px rgba(0,0,0,.06)',animation:'pkIn .12s both'}}>
    <div style={below?{position:'absolute',right:28,top:-7,width:12,height:12,background:T.surface,borderLeft:`1px solid ${T.line}`,borderTop:`1px solid ${T.line}`,transform:'rotate(45deg)'}:{position:'absolute',left:-7,top:16,width:12,height:12,background:T.surface,borderLeft:`1px solid ${T.line}`,borderBottom:`1px solid ${T.line}`,transform:'rotate(45deg)'}}></div>
    <span className="pk-hit" onClick={()=>up({bub:null})} style={{position:'absolute',right:10,top:8,font:`400 18px ${T.sans}`,color:T.caption,padding:'0 6px',lineHeight:'24px'}}>×</span>
    <div className="pp-th" style={{display:'flex',flexDirection:'column',marginTop:-4,paddingRight:24}}>
      {mineW && <div style={{padding:'12px 0',borderBottom:`1px solid ${T.line}`}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}><PhPic nm={ME} s={26} me/><span style={{font:`700 13px ${T.sans}`,color:T.ink}}>{ME}</span><Sq c={a.tags[k][i]} w={18} r={3}/><span style={{font:`400 12px ${T.sans}`,color:T.caption}}>{pcName(a.tags[k][i])}</span></div>
        <div style={{font:`400 14px/1.6 ${T.sans}`,color:T.ink,margin:'6px 0 0 36px'}}>{mineW.t}</div></div>}
      {items.map(({nm,r})=>{ const key=k+'|'+i+'|'+r, W=WHY[key]||{}, th=W.thread||[], theirs=seedWhy(k,i,r);
        return <div key={r} style={{padding:'12px 0',borderBottom:`1px solid ${T.line}`}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}><PhPic nm={nm} s={26}/><span style={{font:`700 13px ${T.sans}`,color:T.ink}}>{nm}</span><Sq c={w.data[i][r]} w={18} r={3}/><span style={{font:`400 12px ${T.sans}`,color:T.caption}}>{pcName(w.data[i][r])||'비움'}</span>
            <div style={{flex:1}}></div><span className="pk-link" onClick={()=>up({bub:{i,r}})} style={{font:`400 12px ${T.sans}`,height:32,display:'inline-flex',alignItems:'center'}}>답글{th.length?` ${th.length}`:''}</span></div>
          <div style={{font:`400 14px/1.6 ${T.sans}`,color:theirs?T.ink:T.caption,margin:'6px 0 0 36px'}}>{theirs||'아직 이 색을 고른 이유를 남기지 않았어요.'}</div>
          {th.length>0 && <div style={{margin:'8px 0 0 36px',paddingLeft:10,borderLeft:`2px solid ${T.line}`,display:'flex',flexDirection:'column',gap:6}}>{th.map((m,j)=><div key={j} style={{font:`400 13px/1.5 ${T.sans}`,color:T.ink}}><b style={{fontWeight:700}}>{m.n}</b> {m.t}</div>)}</div>}
        </div>; })}
      {items.length===0 && !mineW && <div style={{font:`400 13px ${T.sans}`,color:T.caption,padding:'12px 0'}}>아직 이 행에 남긴 이유가 없어요.</div>}
    </div>
  </div>;
}
// 행 반응 아래: 좋아요(내가 눌렀는지만, 숫자 경쟁 없이 개수만 작게) + 답글
function PhReactActs({a, up, id}){
  const L=(a.likes||{})[id], th=(a.rthread||{})[id]||[]; const [open,setOpen]=React.useState(false); const [t,setT]=React.useState('');
  const send=()=>{ const v=t.trim(); if(!v) return; up(s=>({rthread:{...(s.rthread||{}),[id]:[...((s.rthread||{})[id]||[]),{n:ME,t:v}]}})); setT(''); };
  return <div style={{marginTop:8}}>
    <div style={{display:'flex',alignItems:'center',gap:4,marginLeft:-10}}>
      <div className="pk-hit" onClick={()=>up(s=>({likes:{...(s.likes||{}),[id]:!L}}))} title="좋아요" style={{height:44,display:'flex',alignItems:'center',gap:6,padding:'0 10px',color:L?T.ink:T.ink2,font:`${L?700:400} 13px ${T.sans}`}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill={L?'currentColor':'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"></path></svg>좋아요</div>
      <div className="pk-hit" onClick={()=>setOpen(o=>!o)} style={{height:44,display:'flex',alignItems:'center',gap:6,padding:'0 10px',color:T.ink2,font:`400 13px ${T.sans}`}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M4 5h16v11H9l-5 4z"></path></svg>답글{th.length?` ${th.length}`:''}</div></div>
    {(open||th.length>0) && <div style={{marginLeft:16,paddingLeft:14,borderLeft:`2px solid ${T.line}`}}>
      {th.map((m,j)=><div key={j} style={{display:'flex',gap:10,alignItems:'flex-start',padding:'6px 0'}}>{phAv(m.n,26,m.n===ME)}<div><span style={{font:`700 12px ${T.sans}`,color:T.ink}}>{m.n}</span><div style={{font:`400 14px/1.5 ${T.sans}`,color:T.ink}}>{m.t}</div></div></div>)}
      {open && <div style={{display:'flex',alignItems:'center',gap:6,border:`1px solid ${t?T.ink2:T.line}`,borderRadius:6,background:T.surface,padding:'0 4px 0 12px',marginTop:6,maxWidth:560}}>
        <input autoFocus value={t} onChange={e=>setT([...e.target.value].slice(0,REACT_MAX).join(''))} onKeyDown={e=>{ if(e.key==='Enter'&&!e.nativeEvent.isComposing){ e.preventDefault(); send(); } }} placeholder="답글 달기" style={{flex:1,minWidth:0,height:44,border:'none',outline:'none',background:'transparent',font:`400 14px ${T.sans}`,color:T.ink}}/>
        <PBtn kind="text" h={44} disabled={!t.trim()} onClick={send}>남기기</PBtn></div>}
    </div>}
  </div>;
}
Object.assign(window,{PhBody,PhBubble,PhRowThread,PhFriendCmp,hasWhy,seedWhy,PhPoemTalk,PhReactActs,PhPoem,POEM_INFO});
