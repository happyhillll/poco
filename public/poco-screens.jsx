// Poco 01 온보딩 · 02 작품 목록 · 04 완료 · 05 작품 페이지 · 06 행 단위 대화 · 앱 상태
// ───────── 01 온보딩 (3단계) ─────────
function Dots({at}){ return <div style={{display:'flex',gap:8}}>{[0,1,2].map(i=><div key={i} style={{width:i===at?20:6,height:6,borderRadius:3,background:i===at?T.ink:T.disabled}}></div>)}</div>; }
function Onboarding({a, up, go}){
  const st = a.step||0; const [pick,setPick] = React.useState(null); const [hv,setHv] = React.useState(null);
  const col = {position:'absolute',left:440,top:180,width:600};
  return <PFrame>
    {st===0 && <div style={col}>
      <Dots at={0}/>
      <div style={{marginTop:72}}><Wordmark size={72}/></div>
      <div style={{font:`400 20px/1.7 ${T.sans}`,color:T.ink2,marginTop:28}}>POem + COlor. 시를 한 행씩 읽고, 떠오르는 색을 고릅니다.</div>
    </div>}
    {st===1 && <>
      <div style={{position:'absolute',left:104,top:180,width:820}}>
        <Dots at={1}/>
        <div style={{font:`700 34px/1.4 ${T.serif}`,color:T.ink,marginTop:40}}>한 행만 해 볼까요?</div>
        <div style={{font:`400 16px ${T.sans}`,color:T.ink2,marginTop:10}}>이 행을 읽고 떠오르는 색을 하나 누르세요.</div>
        <div style={{display:'flex',alignItems:'center',gap:20,marginTop:48,padding:'12px 16px',background:T.band,borderRadius:4}}>
          <div style={{flex:1,font:`400 24px ${T.serif}`,color:T.ink,letterSpacing:'.02em',whiteSpace:'nowrap'}}>창밖으로 비가 그치고</div><Sq c={pick||undefined} w={36} style={{animation:pick?'pkFill .14s both':'none'}}/></div>
        <div style={{height:44,marginTop:24,font:`400 14px/1.7 ${T.sans}`,color:T.ink2}}>{pick && <div style={{animation:'pkIn .15s both'}}>다시 누르면 바꿀 수 있어요. 바꾼 색도 기록으로 남아요.</div>}</div>
      </div>
      <div style={{position:'absolute',left:1040,top:180,width:paletteW(),display:'flex',flexDirection:'column',alignItems:'center'}}>
        <Palette sel={pick} onPick={setPick} onHover={setHv}/>
        <div style={{font:`700 20px ${T.sans}`,color:T.ink,marginTop:40}}>어떤 색이 떠오르나요?</div>
      </div>
    </>}
    {st===2 && <div style={col}>
      <Dots at={2}/>
      <div style={{font:`700 34px/1.4 ${T.serif}`,color:T.ink,marginTop:40}}>색에는 정답이 없어요</div>
      <div style={{font:`400 17px/1.8 ${T.sans}`,color:T.ink2,marginTop:16}}>내 색을 끝까지 고르면, 같은 시를 읽은 독자들의 색이 열립니다.</div>
      <div style={{display:'flex',gap:6,marginTop:48}}>{['LB','LO','WH','DB','LB'].map((c,i)=><Sq key={i} c={c} w={36} h={120} r={0}/>)}</div>
      <div style={{font:`400 13px ${T.sans}`,color:T.caption,marginTop:12}}>예시 · 같은 행을 읽은 다섯 명의 색</div>
    </div>}
    <div style={{position:'absolute',right:48,bottom:36,display:'flex',gap:12}}>
      {st>0 && <PBtn kind="text" onClick={()=>up({step:st-1})}>이전</PBtn>}
      {st===0 && <PBtn onClick={()=>up({step:1})}>시작하기</PBtn>}
      {st===1 && <PBtn disabled={!pick} onClick={()=>up({step:2})}>다음</PBtn>}
      {st===2 && <PBtn onClick={()=>go('list')}>시 고르기</PBtn>}
    </div>
  </PFrame>;
}

// ───────── 02 작품 목록 ─────────
// 색 분포: 많이 고른 순, 비율만큼 폭 (색 없음·건너뜀 제외)
const distOf = cs => { const m={}; cs.forEach(c=>{ if(c&&c!=='T1'&&c!=='SKIP') m[c]=(m[c]||0)+1; }); const t=Object.values(m).reduce((x,y)=>x+y,0)||1;
  return Object.entries(m).sort((x,y)=>y[1]-x[1]||PC_ORDER.indexOf(x[0])-PC_ORDER.indexOf(y[0])).map(([c,n])=>[c,n/t]); };
const DistBar = ({d, h=12}) => <div style={{display:'flex',width:'100%',height:h}}>{d.map(([c,p])=><Sq key={c} c={c} w={`${p*100}%`} h={h} r={0} title="" style={{boxShadow:'none',flex:'none'}}/>)}</div>;
// [신규] 시 표지(책 비율 1:1.52). 위 46% = 그림 자리: 다 읽은 시는 독자 6명이 칠한 색 그림(세로줄 = 독자, 가로 = 행), 아닌 시는 첫 두 행.
// 제목 아래 띠 = 내 컬러 바코드. 다 읽기 전에는 회색(다른 독자 색 비공개)
function WorkCover({w, mine, tags:my, onOpen, width=200, rank, trend, fav}){
  const H = Math.round(width*1.52), IH = Math.round(H*.46), pad = Math.round(width*.1);
  const open = !!mine; const cols = open ? [my,...namesOf(w).map((_,r)=>w.data.map(row=>row[r]))] : [];
  const all = open ? [...my, ...w.data.flat()] : []; const reps = open ? [...w.rep, mine] : [];
  const no = String(WORK_KEYS.indexOf(w.key)+1).padStart(2,'0');
  // 제목 한 줄: 글자 수에 맞춰 글씨 크기·자간을 줄임(한글 1자 ≈ 1em). 내부 폭 = width - 2pad
  const inner = width-2*pad, tl = [...w.title.replace(/\s/g,'')].length + (w.title.split(' ').length-1)*0.45;
  const tfs = Math.max(Math.round(width*.07), Math.min(Math.round(width*.11), Math.floor(inner/(tl*.97))));
  const tls = tfs < width*.085 ? '-.05em' : tfs < width*.1 ? '-.02em' : '.01em';
  return <div style={{width,display:'flex',flexDirection:'column'}}>
  <div className="pk-hit pk-cover" onClick={onOpen} style={{width,height:H,boxSizing:'border-box',background:T.surface,borderRadius:2,display:'flex',flexDirection:'column',overflow:'hidden',boxShadow:'0 1px 2px rgba(0,0,0,.08),0 8px 22px rgba(0,0,0,.07)'}}>
    <div style={{height:IH,flex:'none',display:'flex',alignItems:'flex-end',background:open?(PC[topColorOf(w,my).c]||[])[1]||T.band:T.band,position:'relative'}}>
      {null}
      {!open && <div style={{position:'absolute',left:0,right:0,top:0,bottom:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <span style={{font:`500 ${Math.max(11,Math.round(width*.055))}px ${T.sans}`,color:T.caption,border:`1px solid ${T.disabled}`,borderRadius:999,padding:'4px 12px',whiteSpace:'nowrap'}}>NEW</span></div>}
      {fav && <div title="내가 찜한 시" style={{position:'absolute',right:Math.round(width*.06),top:0,width:Math.round(width*.1),height:Math.round(width*.13),display:'flex',alignItems:'flex-start',justifyContent:'center'}}>
        <svg width="100%" height="100%" viewBox="0 0 20 26" fill={T.ink} stroke={T.ink} strokeWidth="1.5" strokeLinejoin="round"><path d="M2 1h16v24l-8-6-8 6z"></path></svg></div>}
      {rank && <div style={{position:'absolute',left:0,top:0,height:40,padding:'0 12px',display:'flex',alignItems:'center',gap:8,background:'rgba(0,0,0,.72)',borderRadius:'2px 0 4px 0'}}>
        <span style={{font:`700 20px ${T.sans}`,color:'#fff'}}>{rank}</span>
        {trend==='up' && <svg width="14" height="12" viewBox="0 0 14 12"><path d="M7 1l6 10H1z" fill="#FF2D55"></path></svg>}
        {trend==='down' && <svg width="14" height="12" viewBox="0 0 14 12"><path d="M7 11L1 1h12z" fill="#2EA8FF"></path></svg>}
        {trend==='same' && <svg width="14" height="12" viewBox="0 0 14 12"><rect x="2" y="5" width="10" height="2" fill="#fff"></rect></svg>}
      </div>}
    </div>
    <div style={{flex:1,display:'flex',flexDirection:'column',padding:`${Math.round(pad*.8)}px ${pad}px ${Math.round(pad*.7)}px`}}>
      <div style={{font:`400 ${tfs}px/1.25 ${T.serif}`,color:T.ink,letterSpacing:tls,margin:`${Math.round(pad*.9)}px 0 ${Math.round(pad*.5)}px`,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}} title={w.title}>{w.title}</div>
      <div style={{display:'flex',alignItems:'baseline',justifyContent:'flex-end',gap:6,marginTop:Math.round(pad*.6)}}><span style={{font:`700 ${Math.round(width*.065)}px ${T.sans}`,color:T.ink,whiteSpace:'nowrap'}}>{w.poet}</span><span style={{font:`400 ${Math.max(10,Math.round(width*.05))}px ${T.sans}`,color:T.caption}}>{w.year}</span></div>
      {open ? <div style={{display:'flex',justifyContent:'flex-end',marginTop:Math.round(pad*.6)}}><HBar colors={my} st={w.st} w={Math.round(width*.8*.78)} h={Math.round(width*.06)}/></div> : null}
    </div>
  </div>
  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',font:`400 ${Math.max(11,Math.round(width*.055))}px ${T.sans}`,color:T.caption,whiteSpace:'nowrap',marginTop:Math.round(pad*.5)}}>
    <span>조회수 {(w.views||(w.readers||0)*7+13).toLocaleString()}</span>
    <span style={{display:'inline-flex',alignItems:'center',gap:4}}><svg width={Math.max(11,Math.round(width*.055))} height={Math.max(11,Math.round(width*.055))} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.7 4.5 7.3 4.5c2 0 3.5 1.1 4.7 2.6 1.2-1.5 2.7-2.6 4.7-2.6 3.6 0 5.9 3.5 4.6 6.8C19.5 15.9 12 20.5 12 20.5z"></path></svg>{w.likes||Math.round((w.readers||0)*.6)}</span>
  </div>
  </div>;
}
// 작품 목록: 기본순 / 참여 많은 순. 참여 많은 순에서만 순위 숫자와 참여 인원 표시(요청에 따라 순위 금지 원칙의 예외 — 색이 아닌 참여 인원 기준)
const readersOf = w => w.readers || w.rep.length;
function List({a, go}){
  const [q,setQ] = React.useState(''); const [sort,setSort] = React.useState('pop');
  const k = q.trim(); let keys = WORK_KEYS.filter(id=>!k || WORKS[id].title.includes(k) || WORKS[id].poet.includes(k));
  const POP = WORK_KEYS.slice().sort((x,y)=>readersOf(WORKS[y])-readersOf(WORKS[x])); // 참여 인원(독자 수) 많은 순
  if(sort==='pop') keys = keys.slice().sort((x,y)=>POP.indexOf(x)-POP.indexOf(y));
  const open = id => go('poem',{pk:id});
  return <PFrame><TopNav go={go} active="list"/>
    <style>{`.pk-cover{transition:transform .12s,box-shadow .12s}.pk-cover:hover{transform:translateY(-10px)}.pk-search::placeholder{color:${T.disabled}}.pk-ls{scrollbar-width:none}.pk-ls::-webkit-scrollbar{display:none}`}</style>
    <div className="pk-ls" style={{position:'absolute',left:0,right:0,top:72,bottom:0,overflowY:'auto'}}>
    <div style={{padding:'40px 140px 64px'}}>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
        <div style={{font:`400 32px/1.4 ${T.serif}`,color:T.ink}}>어떤 시를 읽을까요?</div>
        <label style={{marginTop:28,width:'100%',height:64,boxSizing:'border-box',background:T.surface,borderRadius:32,display:'flex',alignItems:'center',gap:14,padding:'0 28px',boxShadow:'0 1px 2px rgba(0,0,0,.05)',cursor:'text'}}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke={T.ink} strokeWidth="1.8"><circle cx="9.5" cy="9.5" r="7"></circle><path d="M14.6 14.6L20 20"></path></svg>
          <input className="pk-search" value={q} onChange={e=>setQ(e.target.value)} placeholder="시 제목이나 시인을 검색해 보세요." style={{flex:1,border:'none',outline:'none',background:'transparent',font:`400 18px ${T.sans}`,color:T.ink}}/>
          {q && <div className="pk-hit" onClick={()=>setQ('')} style={{height:44,display:'flex',alignItems:'center',font:`400 14px ${T.sans}`,color:T.caption}}>지우기</div>}
        </label>
      </div>
      <div style={{display:'flex',justifyContent:'flex-end',marginTop:20}}>
        <div style={{display:'flex',border:`1px solid ${T.line}`,borderRadius:6,overflow:'hidden'}}>
          {[['pop','참여 많은 순'],['base','기본순']].map(([m,l])=><div key={m} className="pk-hit" onClick={()=>setSort(m)} style={{height:44,padding:'0 18px',display:'flex',alignItems:'center',whiteSpace:'nowrap',font:`${sort===m?700:400} 14px ${T.sans}`,background:sort===m?T.band:T.surface,color:sort===m?T.ink:T.ink2}}>{l}</div>)}</div></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,200px)',justifyContent:'space-between',rowGap:32,marginTop:20}}>
        {keys.map((id,i)=><WorkCover key={id} fav={(a.fav||[]).includes(id)} w={WORKS[id]} tags={a.tags[id]} mine={!!a.tags[id]} rank={sort==='pop'?POP.indexOf(id)+1:undefined} trend={sort==='pop'?(BEST_TREND[BEST_KEYS.indexOf(id)]||'same'):undefined} onOpen={()=>open(id)}/>)}
        {!keys.length && <div style={{gridColumn:'1 / -1',font:`400 15px ${T.sans}`,color:T.ink2}}>「{k}」{josa(k,'과','와').slice(k.length)} 맞는 시가 없어요.</div>}
      </div>
    </div></div>
  </PFrame>;
}

// 컬러 카드 메타: 완료한 날짜·시각 + '내가 읽은 시인의 제목'(시인·제목 볼드)
function ColorCardMeta({w}){
  const [t] = React.useState(()=>{ const d=new Date(); return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`; });
  return <div>
    <div style={{font:`400 13px ${T.sans}`,color:T.caption}}>{TODAY} {t}</div>
    <div style={{font:`400 15px ${T.sans}`,color:T.ink2,marginTop:4}}>내가 읽은 <b style={{color:T.ink}}>{w.poet}</b>의 <b style={{color:T.ink}}>{w.title}</b></div></div>;
}
// ───────── 04 완료 ─────────
function ColorCard({w, tags, rep}){
  const cw = 336;
  return <div style={{width:400,boxSizing:'border-box',padding:32}}>
    <ColorCardMeta w={w}/>
    <div style={{display:'flex',marginTop:20}}>{tags.map((c,i)=><Sq key={i} c={c} w={cw/tags.length} h={28} r={0} style={{marginLeft:i>0&&w.st[i]!==w.st[i-1]?2:0}}/>)}</div>
  </div>;
}
function Done({a, go}){
  const w = WORKS[a.pk]; const tags = a.tags[a.pk]; const rep = a.rep[a.pk];
  const [toast,setToast] = React.useState(null);
  const save = () => { setToast('컬러 카드를 이미지로 저장했어요 (시연)'); setTimeout(()=>setToast(null),1800); };
  const dur = tags.length*70;
  return <PFrame><TopNav go={go}/>
    <div style={{position:'absolute',left:160,top:128}}>
      <div style={{font:`700 34px/1.4 ${T.serif}`,color:T.ink,whiteSpace:'nowrap'}}>{josa(`「${w.title}`,'」을','」를')} 끝까지 읽었어요</div>
      <div style={{font:`400 16px ${T.sans}`,color:T.ink2,marginTop:10}}>같은 시를 읽은 독자는 <b style={{color:PC.SR[1],fontWeight:700}}>{w.readers||w.rep.length}</b>명이에요.</div>
    </div>
    <div style={{position:'absolute',left:420,top:256,display:'flex',gap:20}}>
      <VBar colors={tags} st={w.st} w={120} h={w.lines.length>12?30:34} anim={dur}/>
      <div style={{display:'flex',flexDirection:'column',justifyContent:'flex-end',font:`400 13px/1.6 ${T.sans}`,color:T.caption,whiteSpace:'nowrap',animation:`pkIn .2s ${dur}ms both`}}><div>내 바코드</div><div>{`${w.lines.length}행`}</div></div>
    </div>
    <div style={{position:'absolute',left:760,right:0,top:72,bottom:120,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',animation:`pkIn .3s ${dur+80}ms both`}}>
      <ColorCard w={w} tags={tags} rep={rep}/>
      <div style={{marginTop:16}}><PBtn kind="secondary" h={44} onClick={save}>카드 저장</PBtn></div>
    </div>
    <div style={{position:'absolute',right:48,bottom:36,display:'flex',gap:12}}><PBtn kind="text" onClick={()=>go('home')}>홈으로</PBtn><PBtn onClick={()=>go('poem',{pk:a.pk})}>다른 독자의 색 보기</PBtn></div>
    <Toast text={toast}/>
  </PFrame>;
}

// ───────── 05 작품 페이지 ─────────
const josa = (w,a,b) => { const c=w.charCodeAt(w.length-1)-0xAC00; return w+((c>=0&&c%28)?a:b); };
const groupColors = cs => { const m=new Map(); cs.forEach(c=>m.set(c,(m.get(c)||[]).concat(c))); return [...m.entries()].sort((x,y)=>PC_ORDER.indexOf(x[0])-PC_ORDER.indexOf(y[0])).map(e=>e[1]); };
function Work({a, up, go}){
  const w = WORKS[a.pk]; const mine = a.tags[a.pk]; const open = !!mine;
  const [hc,setHc] = React.useState(null); const [hr,setHr] = React.useState(null);
  const R = (a.reacts[a.pk]||{});
  const tabs = <div style={{display:'flex',gap:28,borderBottom:`1px solid ${T.line}`,width:1440-160}}>
    {WORK_KEYS.map(k=><div key={k} className="pk-hit" onClick={()=>up({pk:k,convo:null})} style={{height:44,display:'flex',alignItems:'center',marginBottom:-1,font:`${k===a.pk?700:400} 15px ${T.sans}`,color:k===a.pk?T.ink:T.caption,borderBottom:`2px solid ${k===a.pk?T.ink:'transparent'}`}}>「{WORKS[k].title}」</div>)}</div>;
  const op = c => hc && c!==hc ? .2 : 1;
  const sqH = c => ({onMouseEnter:()=>setHc(c),onMouseLeave:()=>setHc(null)});
  return <PFrame><TopNav go={go}/>
    <div style={{position:'absolute',left:80,top:112}}>
      <div style={{display:'flex',alignItems:'baseline',gap:16}}>
        <div style={{font:`700 30px/1.3 ${T.serif}`,color:T.ink}}>「{w.title}」</div>
        <div style={{font:`400 15px ${T.sans}`,color:T.ink2}}>{workLabel(w)}</div></div>
      <div style={{font:`400 15px ${T.sans}`,color:T.ink2,marginTop:10}}>{open?`독자 ${w.rep.length+1}명이 읽었어요. 행을 누르면 그 행의 색과 반응이 열려요.`:`독자 ${w.rep.length}명이 읽었어요.`}</div>
    </div>
    {!open ? <>
      <div style={{position:'absolute',left:80,top:250,bottom:0,width:880,overflow:'auto'}}>
        {w.lines.map((t,i)=><div key={i} style={{height:44,display:'flex',alignItems:'center',gap:12,marginTop:i>0&&w.st[i]!==w.st[i-1]?14:0}}>
          <div style={{width:28,flex:'none',textAlign:'right',font:`400 12px ${T.sans}`,color:T.num}}>{i+1}</div>
          <div style={{font:`400 18px ${T.serif}`,color:T.ink,letterSpacing:'.02em'}}>{t}</div></div>)}
      </div>
      <div style={{position:'absolute',left:980,top:262,width:400}}>
        <div style={{font:`500 20px/1.6 ${T.sans}`,color:T.ink}}>다른 독자의 색은<br/>내 색을 고른 뒤에 열려요.</div>
        <div style={{font:`400 15px/1.7 ${T.sans}`,color:T.ink2,marginTop:12}}>먼저 내 감각으로 읽어 보세요.</div>
        <div style={{marginTop:32}}><PBtn onClick={()=>go('read')}>읽고 색 고르기</PBtn></div>
      </div>
    </> : <>
      <div style={{position:'absolute',left:64,top:244,bottom:0,width:924,overflowY:'auto',overflowX:'hidden'}}>
        <div style={{display:'flex',alignItems:'flex-end',height:28,gap:12,font:`400 12px ${T.sans}`,color:T.caption}}>
          <div style={{width:28}}></div><div style={{width:w.txtW}}></div><div style={{width:30,textAlign:'center'}}>나</div><div style={{width:17}}></div><div>다른 독자 {w.rep.length}명 · 같은 색끼리 붙여 보여요</div></div>
        <div style={{paddingBottom:120}}>
        {w.lines.map((t,i)=>{ const sel=a.convo===i; const nR=(R[i]||[]).length;
          return <div key={i} className="pk-hit pk-row" onClick={()=>up({convo:sel?null:i})} onMouseEnter={()=>setHr(i)} onMouseLeave={()=>setHr(null)}
            style={{height:48,display:'flex',alignItems:'center',gap:12,marginTop:i>0&&w.st[i]!==w.st[i-1]?14:0,borderRadius:4,background:sel?T.band:undefined,outline:sel?`1.5px solid ${T.ink}`:'none',outlineOffset:-1}}>
            <div style={{width:28,textAlign:'right',font:`400 12px ${T.sans}`,color:T.num,flex:'none'}}>{i+1}</div>
            <div style={{width:w.txtW,flex:'none',font:`400 18px ${T.serif}`,color:T.ink,letterSpacing:'.02em',whiteSpace:'nowrap'}}>{t}</div>
            <div {...sqH(mine[i])} style={{opacity:op(mine[i]),transition:'opacity .1s'}}><Sq c={mine[i]} w={30}/></div>
            <div style={{width:1,height:30,background:T.line,margin:'0 8px',flex:'none'}}></div>
            <div style={{display:'flex',gap:10}}>{groupColors(w.data[i]).map((g,k)=><div key={k} {...sqH(g[0])} style={{display:'flex',gap:3,opacity:op(g[0]),transition:'opacity .1s'}}>{g.map((c,j)=><Sq key={j} c={c} w={30}/>)}</div>)}</div>
            <div style={{flex:1}}></div>
            {nR>0 && <div style={{font:`400 12px ${T.sans}`,color:T.caption,paddingRight:12,whiteSpace:'nowrap'}}>반응 {nR}</div>}
          </div>; })}
        </div>
      </div>
      <div style={{position:'absolute',left:1004,top:244,width:388,bottom:24}}>
        {a.convo==null ? <>
          <div style={{font:`700 15px ${T.sans}`,color:T.ink,height:28,display:'flex',alignItems:'flex-end'}}>독자별 바코드</div>
          <div style={{display:'flex',gap:12,marginTop:16}}>
            {[[ME,mine],...namesOf(w).map((n,r)=>[n,w.data.map(row=>row[r])])].map(([n,cs],k)=><div key={n} style={{width:52,display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
              <VBar colors={cs} st={w.st} w={36} h={16} sg={4} hl={hr} dim/>
              <div style={{font:`${k===0?700:400} 12px ${T.sans}`,color:k===0?T.ink:T.ink2,whiteSpace:'nowrap'}}>{n}</div></div>)}
          </div>
          
          <div style={{marginTop:28,display:'flex',gap:12,alignItems:'center'}}><PBtn kind="secondary" h={44} onClick={()=>go('re')}>다시 읽기</PBtn>
            {(a.hist[a.pk]||[]).length>0 && <span style={{font:`400 13px ${T.sans}`,color:T.caption}}>고친 기록 {(a.hist[a.pk]||[]).length}</span>}</div>
        </> : <Convo a={a} up={up} w={w} i={a.convo} mine={mine}/>}
      </div>
    </>}
  </PFrame>;
}

// ───────── 06 행 단위 대화 ─────────
function Convo({a, up, w, i, mine}){
  const [txt,setTxt] = React.useState(''); const [rep,setRep] = React.useState({});
  React.useEffect(()=>{ setTxt(''); },[i]);
  const list = (a.reacts[a.pk]||{})[i]||[];
  const who = [[ME,mine[i]],...namesOf(w).map((n,r)=>[n,w.data[i][r]])];
  const post = () => { const t=txt.trim(); if(!t) return;
    up(s=>{ const R=JSON.parse(JSON.stringify(s.reacts)); R[s.pk]=R[s.pk]||{}; R[s.pk][i]=(R[s.pk][i]||[]).concat({id:Date.now(),n:ME,c:mine[i],t}); return {reacts:R}; }); setTxt(''); };
  const len = [...txt].length;
  return <div style={{display:'flex',flexDirection:'column',height:'100%',animation:'pkIn .14s both'}}>
    <div style={{display:'flex',alignItems:'center',height:28}}>
      <div style={{font:`500 13px ${T.sans}`,color:T.caption}}>{i+1}행</div><div style={{flex:1}}></div>
      <div className="pk-hit" onClick={()=>up({convo:null})} title="닫기" style={{width:44,height:44,display:'flex',alignItems:'center',justifyContent:'center',font:`400 22px ${T.sans}`,color:T.ink2,marginRight:-12}}>×</div></div>
    <div style={{font:`400 20px/1.6 ${T.serif}`,color:T.ink,marginTop:4,wordBreak:'keep-all'}}>{w.lines[i]}</div>
    <div style={{font:`700 13px ${T.sans}`,color:T.ink,margin:'20px 0 10px'}}>이 행의 색</div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',rowGap:8,columnGap:12}}>
      {who.map(([n,c],k)=><div key={n} style={{display:'flex',alignItems:'center',gap:10}}><Sq c={c} w={24}/>
        <span style={{font:`${k===0?700:500} 13px ${T.sans}`,color:T.ink}}>{n}</span></div>)}
    </div>
    <div style={{font:`700 13px ${T.sans}`,color:T.ink,margin:'22px 0 4px'}}>반응</div>
    <div style={{flex:1,overflow:'auto',borderTop:`1px solid ${T.line}`,minHeight:80}}>
      {list.length===0 && <div style={{font:`400 13px ${T.sans}`,color:T.caption,padding:'14px 0'}}>아직 반응이 없어요.</div>}
      {list.map(r=><div key={r.id} style={{padding:'8px 0 10px',borderBottom:`1px solid ${T.line}`,animation:r.n===ME?'pkIn .15s both':'none'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,height:28}}><Sq c={r.c} w={16} r={2}/><span style={{font:`500 13px ${T.sans}`,color:T.ink}}>{r.n}</span><div style={{flex:1}}></div>
          {r.n!==ME && !rep[r.id] && <span className="pk-link" onClick={()=>setRep(p=>({...p,[r.id]:1}))} style={{font:`400 12px ${T.sans}`,whiteSpace:'nowrap',flex:'none',display:'inline-flex',alignItems:'center',height:44,padding:'0 4px'}}>신고</span>}</div>
        <div style={{font:`400 15px/1.6 ${T.sans}`,color:rep[r.id]?T.caption:T.ink,wordBreak:'keep-all'}}>{rep[r.id]?'신고했어요. 검토 전까지 가려집니다.':r.t}</div>
      </div>)}
    </div>
    <div style={{marginTop:14,border:`1px solid ${len?T.ink2:T.line}`,borderRadius:6,background:T.surface,padding:'10px 12px'}}>
      <textarea value={txt} maxLength={REACT_MAX} onChange={e=>setTxt([...e.target.value].slice(0,REACT_MAX).join(''))} onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); post(); } }}
        placeholder="이 행에서 떠오른 것을 짧게" rows={2} style={{width:'100%',border:'none',outline:'none',resize:'none',font:`400 15px/1.6 ${T.sans}`,color:T.ink,background:'transparent',padding:0}}></textarea>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <span style={{font:`${len>=50?500:400} 12px ${T.sans}`,color:len>=50?T.ink:T.caption}}>{len} / {REACT_MAX}</span><div style={{flex:1}}></div>
        <PBtn h={44} disabled={!txt.trim()} onClick={post} style={{padding:'0 20px'}}>남기기</PBtn></div>
    </div>
    <div style={{font:`400 12px ${T.sans}`,color:T.caption,marginTop:8}}>색에 정답은 없어요. 다른 독자의 색을 평가하는 글은 가려질 수 있어요.</div>
  </div>;
}

// ───────── 앱 ─────────
// 저장: 화면 이동·말풍선 같은 일시 상태는 빼고 사용자 기록만 localStorage 'poco.state.v1'에 JSON으로
const POCO_KEY='poco.state.v1';
const POCO_TRANSIENT=['authed','scr','step','back','convo','toast','drawer','bub','cmpR','pv','justDone','readInit','mode','next','onbBar','loginFill','loginErr','fmode','pk','tab','cr','fc','fm','fs','fg','sl','poet'];
function pocoSave(a){ try{ const o={}; Object.keys(a).forEach(k=>{ if(!POCO_TRANSIENT.includes(k)) o[k]=a[k]; }); localStorage.setItem(POCO_KEY,JSON.stringify(o)); if(window.PocoAPI&&a.authed) PocoAPI.save(o); }catch(e){} }
// 앱(계정 로그인)의 시작 상태: 읽은 시 없는 빈 서재. 시연용 PH_INIT은 캔버스 프레임에서만 사용
const PH_BLANK={tags:{},rep:{},first:{},hist:{},prog:{},when:{},fresh:null,fav:[],following:[],followers:[]};
function pocoLoad(){ try{ const o=JSON.parse(localStorage.getItem(POCO_KEY)||'null'); if(!o||typeof o!=='object') return null; POCO_TRANSIENT.forEach(k=>delete o[k]); if(o.prog) Object.keys(o.prog).forEach(k=>{ o.prog[k]=Array.isArray(o.prog[k])?o.prog[k].map(x=>x===null?undefined:x):undefined; }); return o; }catch(e){ return null; } }
// 화면 하나에서 오류가 나도 앱 전체가 하얗게 멈추지 않게: 안내와 '홈으로'만 보여 줌
class PocoBoundary extends React.Component{
  constructor(p){ super(p); this.state={err:null}; }
  static getDerivedStateFromError(err){ return {err}; }
  componentDidCatch(e){ console.error('[poco] 화면 오류', e); }
  render(){ if(!this.state.err) return this.props.children;
    return <PFrame><div style={{position:'absolute',left:'50%',top:260,transform:'translateX(-50%)',textAlign:'center'}}>
      <div style={{font:`700 24px ${T.serif}`,color:T.ink}}>이 화면을 여는 중에 문제가 생겼어요.</div>
      <div style={{font:`400 15px ${T.sans}`,color:T.ink2,margin:'10px 0 28px'}}>기록은 그대로 있어요. 홈에서 다시 시작해 주세요.</div>
      <PBtn onClick={()=>this.props.go('home')}>홈으로</PBtn></div></PFrame>; }
}
function PocoApp({init}){
  // 로그인: 캔버스 프레임(init 있음)은 로그인 상태, 로그인 화면은 로그아웃. 프로토타입은 localStorage 'poco.authed'
  const authed0 = init&&init.authed!=null ? init.authed : init&&(init.scr==='login'||init.scr==='onb') ? false : init ? true : localStorage.getItem('poco.authed')==='1';
  const [a,setA] = React.useState(()=>{ const myWhy={}; Object.entries(REACTS0).forEach(([pk,o])=>Object.entries(o).forEach(([i,L])=>L.forEach(r=>{ if(r.n===ME) myWhy[pk+'|'+i+'|me']={t:r.t}; })));
    // 프로토타입(init 없음)에서는 내 기록(태깅·진행·찜·팔로우·반응 등)을 브라우저에 저장해 새로고침 뒤에도 이어짐
    const INIT0 = init ? PH_INIT : PH_BLANK; const base={...INIT0,why:myWhy,reacts:REACTS0}; const saved0 = init ? null : pocoLoad(); const saved = saved0 && {};
    if(saved) Object.keys(saved0).forEach(k=>{ const v=saved0[k], b=base[k]; if(b===undefined || (v!==null && typeof v===typeof b && Array.isArray(v)===Array.isArray(b))) saved[k]=v; }); // 형식이 다른 값은 버리고 기본값 사용
    const next0 = !init && authed0 ? sessionStorage.getItem('poco.next') : null; if(!init) sessionStorage.removeItem('poco.next'); // 로그인 직후 가려던 화면
    return {authed:authed0,scr:next0||(localStorage.getItem('poco.onboarded')?'home':'onb'),step:0,pk:'cpd',...JSON.parse(JSON.stringify(INIT0)),why:myWhy,convo:null,readInit:null,reacts:JSON.parse(JSON.stringify(REACTS0)),...(saved||{}),...(init||{})}; });
  React.useEffect(()=>{ if(!init) pocoSave(a); },[a]);
  const up = p => setA(s=>({...s,...(typeof p==='function'?p(s):p)}));
  // 뒤로가기: 화면 이동마다 직전 위치를 쌓고, '__back'이면 하나 꺼냄(없으면 홈)
  // 시 한 편에 딸린 화면은 모두 시 화면(poem) 안의 상태로: 페이지 이동 없이 서랍·제자리 비교·모달
  const AL={bar:()=>({}),space:e=>e.tab==='dist'?{drawer:0}:{},cmp:e=>({cmpR:e.cr==null?0:e.cr}),work:()=>({}),re:()=>({drawer:0}),done:()=>({justDone:true})};
  const go = (scr0, ex0={}) => { let scr=scr0, extra=ex0;
    if(!a.authed && !ex0.authed && !['login','onb','__back'].includes(scr0)) return go0('login',{mode:'login',next:scr0});
    if(AL[scr0]){ scr='poem'; extra={...ex0,...AL[scr0](ex0)}; }
    if(scr0==='sim'){ scr='find'; extra={...ex0,fmode:'sim'}; }
    if(scr==='poem') extra={drawer:null,bub:null,cmpR:null,pv:'me',justDone:false,...extra};
    if(scr==='find'&&!extra.fmode) extra={...extra,fmode:'color'};
    return go0(scr, extra); };
  const go0 = (scr, extra={}) => scr==='__back'
    ? up(s=>{ const B=(s.back||[]).slice(); const p=B.pop()||{scr:'home'}; return {...p,back:B,convo:null}; })
    : up(s=>({back:[...(s.back||[]),{scr:s.scr,mode:s.mode,next:s.next,pk:s.pk,tab:s.tab,cr:s.cr,fc:s.fc,fm:s.fm,sl:s.sl,poet:s.poet,readInit:s.scr==='read'?contInit(s,s.pk):s.readInit}].slice(-30),scr,convo:null,...extra}));
  const P = {a,up,go}; window.__pocoGo = go;
  const S = {onb:PocoOnb,home:PhHome,poem:PhPoem,me:PhMe,list:List,poets:PhPoets,read:Read,done:Done,work:Work,re:Reread,bar:PhBar,cmp:PhCmp,space:PhSpace,lib:PhLib,find:a.fmode==='sim'?PhSim:PhFind,sim:PhSim,text:PhText,user:PhUser,help:PhHelp,settings:PhSettings,login:PhLogin}[a.scr];
  const sk=a.scr+a.pk+(a.scr==='find'?a.fmode:'')+(a.scr==='login'?a.mode:'');
  return <PocoAuth.Provider value={!!a.authed}>{init ? <S key={sk} {...P}/> : <PocoBoundary key={sk} go={go}><S {...P}/></PocoBoundary>}</PocoAuth.Provider>;
}
Object.assign(window,{Onboarding,List,WorkCover,DistBar,distOf,ColorCard,Done,Work,Convo,PocoApp});
