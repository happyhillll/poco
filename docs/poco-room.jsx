// 시 한 편 = 한 화면. 상세 본문 + 옆 서랍(행별 색 분포 · 색 변화 기록) + 제자리 비교 + 완료 모달
const nowHM = () => { const d=new Date(); return `${TODAY} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`; };
const PH_DRAWER_W = 440;
const phSub = t => <div style={{font:`700 14px ${T.sans}`,color:T.ink,marginTop:28,marginBottom:12,whiteSpace:'nowrap'}}>{t}</div>;

// 옆 서랍: 행을 누를 때만 열림. 그 행의 독자 색 분포 + 내 색 바꾸기 + 이유 + 색 변화 기록
function PhLineDrawer({a, up, k, i}){
  const w=WORKS[k], n=w.lines.length, mine=a.tags[k], first=(a.first||{})[k]||mine, NM=namesOf(w);
  const [pal,setPal]=React.useState(false); React.useEffect(()=>{ setPal(false); },[i]);
  const cs=lineColors(a,k,i), names=[ME,...NM];
  // 많이 고른 색부터: 색별 묶음(색 · 사람 수 · 고른 사람), 내 색이 든 묶음 표시
  const grp=(()=>{ const g=new Map(); cs.forEach((c,j)=>{ if(!c||c==='SKIP') return; g.set(c,[...(g.get(c)||[]),names[j]]); }); return [...g.entries()].sort((x,y)=>y[1].length-x[1].length||PC_ORDER.indexOf(x[0])-PC_ORDER.indexOf(y[0])); })();
  const tot=grp.reduce((s,[,v])=>s+v.length,0)||1;
  const edits=((a.edits||{})[k]||[]).filter(e=>e.i===i);
  const pick=c=>{ if(c===mine[i]) return setPal(false); up(s=>{ const t=s.tags[k].slice(); const from=t[i]; t[i]=c; return {tags:{...s.tags,[k]:t},edits:{...(s.edits||{}),[k]:[...((s.edits||{})[k]||[]),{i,from,to:c,when:nowHM()}]}}; }); setPal(false); };
  const step=d=>up({drawer:Math.max(0,Math.min(n-1,i+d))});
  const nb=(d,l)=><div className="pk-hit" onClick={()=>step(d)} style={{width:44,height:44,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:6,border:`1px solid ${T.line}`,font:`400 18px ${T.sans}`,color:(d<0?i===0:i===n-1)?T.disabled:T.ink}}>{l}</div>;
  return <div style={{position:'absolute',top:72,right:0,bottom:0,width:PH_DRAWER_W,boxSizing:'border-box',background:T.surface,borderLeft:`1px solid ${T.line}`,padding:'20px 32px 40px',overflowY:'auto',animation:'phDrw .24s cubic-bezier(.2,.7,.2,1) both',boxShadow:'-8px 0 24px rgba(0,0,0,.06)',zIndex:4}}>
    <style>{`@keyframes phDrw{from{transform:translateX(100%)}to{transform:none}}`}</style>
    <div style={{display:'flex',alignItems:'center',gap:8}}>
      <span style={{font:`500 13px ${T.sans}`,color:T.caption,whiteSpace:'nowrap'}}>{i+1} / {n}행</span><div style={{flex:1}}></div>
      {nb(-1,'‹')}{nb(1,'›')}
      <div className="pk-hit" onClick={()=>up({drawer:null})} title="닫기" style={{width:44,height:44,display:'flex',alignItems:'center',justifyContent:'center',font:`400 22px ${T.sans}`,color:T.ink2}}>×</div></div>
    <div style={{font:`400 21px/1.6 ${T.serif}`,color:T.ink,letterSpacing:'.02em',marginTop:14,wordBreak:'keep-all'}}>{w.lines[i]}</div>
    {phSub('내 색')}
    <div style={{display:'flex',alignItems:'center',gap:12}}><Sq c={mine[i]} w={32} title={pcLabel(mine[i])}/><span style={{font:`400 15px ${T.sans}`,color:T.ink}}>{pcLabel(mine[i])||'고르지 않음'}</span></div>
    <div style={{marginTop:10}}><PhReason key={'dr'+i} a={a} up={up} k={k} i={i} onColor={()=>setPal(p=>!p)} pal={pal}/></div>
    {pal && <div style={{marginTop:12,animation:'pkIn .12s both'}}><Palette sel={mine[i]} onPick={pick} sw={40} gap={5} rowGap={8} cg={10}/></div>}
    {phSub('이 행에서 독자들이 고른 색')}
    <PhStack cs={cs} names={names} w={PH_DRAWER_W-64} h={24} byCount/>
    <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:16}}>{grp.map(([c,v])=>{ const me=v.includes(ME); return <div key={c} style={{display:'grid',gridTemplateColumns:'20px 1fr auto',columnGap:10,alignItems:'center'}}>
      <Sq c={c} w={20} r={2} title={pcLabel(c)}/>
      <div style={{minWidth:0}}>
        <div style={{display:'flex',alignItems:'baseline',gap:8}}><span style={{font:`${me?700:500} 14px ${T.sans}`,color:T.ink,whiteSpace:'nowrap'}}>{pcName(c)}</span>{me && <span style={{font:`500 11px ${T.sans}`,color:T.ink,border:`1px solid ${T.ink}`,borderRadius:3,padding:'0 5px',whiteSpace:'nowrap'}}>내 색</span>}</div>
        <div style={{height:6,background:T.line,borderRadius:3,marginTop:5}}><div style={{width:`${v.length/tot*100}%`,height:6,borderRadius:3,background:PC[c]&&PC[c][1]?PC[c][1]:T.disabled}}></div></div>
        <div style={{font:`400 12px ${T.sans}`,color:T.caption,marginTop:4}}>{v.map(x=>x===ME?'나':x).join(' · ')}</div></div>
      <span style={{font:`500 13px ${T.sans}`,color:T.ink2,whiteSpace:'nowrap',alignSelf:'start'}}>{v.length}명</span></div>; })}</div>
    {(()=>{ const sk=cs.filter(c=>c==='SKIP').length; return sk?<div style={{font:`400 12px ${T.sans}`,color:T.caption,marginTop:10}}>건너뛴 사람 {sk}명</div>:null; })()}
    {phSub('색 변화 기록')}
    {first[i]===mine[i] && !edits.length ? <div style={{font:`400 13px ${T.sans}`,color:T.caption}}>이 행은 처음 고른 색 그대로예요.</div>
      : <div style={{display:'flex',flexDirection:'column',gap:8}}>
        <div style={{display:'flex',alignItems:'center',gap:10,font:`400 13px ${T.sans}`,color:T.ink2}}><Sq c={first[i]} w={18} r={2}/>처음 <span style={{color:T.caption}}>→</span><Sq c={mine[i]} w={18} r={2}/>지금</div>
        {edits.map((e,j)=><div key={j} style={{font:`400 12px ${T.sans}`,color:T.caption}}>{e.when} · {pcName(e.from)||'—'} → {pcName(e.to)}</div>)}</div>}
    <div style={{display:'flex',gap:24,marginTop:20,alignItems:'flex-end'}}>
      {[['처음',first],['지금',mine]].map(([l,c])=><div key={l} style={{display:'flex',flexDirection:'column',gap:6,alignItems:'center'}}><VBar colors={c} st={w.st} w={28} h={Math.max(5,Math.floor(150/n))} sg={2} hl={i}/><span style={{font:`400 12px ${T.sans}`,color:T.caption,whiteSpace:'nowrap'}}>{l}</span></div>)}</div>
  </div>;
}

// 제자리 비교: 함께 읽은 독자를 누르면 그 아래에서 바로 나란히 보기 + 가장 다른 행의 이유
function PhInlineCmp({a, up, k, r}){
  const w=WORKS[k], mine=a.tags[k], NM=namesOf(w), other=w.data.map(row=>row[r]), n=w.lines.length, CW=(944-80)/n;
  const same=mine.map((c,i)=>c&&c===other[i]?i:-1).filter(i=>i>=0);
  const farI=mine.reduce((b,c,i)=>{ const o=other[i]; if(!c||!o||c==='T1'||o==='T1'||c==='SKIP'||o==='SKIP') return b; const d=comboDist([c],[o]); return d>b.d?{i,d}:b; },{i:-1,d:-1}).i;
  const row=(nm,cs,me)=><div style={{display:'flex',alignItems:'center'}}><span style={{width:80,font:`${me?700:500} 13px ${T.sans}`,color:T.ink,whiteSpace:'nowrap'}}>{nm}</span>
    {cs.map((c,i)=><div key={i} className="pk-hit" onClick={()=>up({drawer:i})} title={`${i+1}행 · ${pcLabel(c)||'비움'}`} style={{width:CW,height:40,background:c&&PC[c]&&PC[c][1]?PC[c][1]:'transparent',outline:a.drawer===i?`2px solid ${T.ink}`:'none',outlineOffset:-2}}></div>)}</div>;
  return <div style={{marginTop:28,paddingTop:24,borderTop:`1px dashed ${T.line}`,animation:'pkIn .15s both'}}>
    <div style={{display:'flex',alignItems:'center',gap:12}}><span style={{font:`700 16px ${T.sans}`,color:T.ink,whiteSpace:'nowrap'}}>나와 {NM[r]} 님</span>
      <span style={{font:`400 13px ${T.sans}`,color:T.caption,whiteSpace:'nowrap'}}>같은 색 <b style={{color:'#1E6B3A'}}>{same.length}</b>행 · 칸을 누르면 그 행이 옆에 열려요</span><div style={{flex:1}}></div>
      <div className="pk-hit" onClick={()=>up({cmpR:null})} title="닫기" style={{width:44,height:44,display:'flex',alignItems:'center',justifyContent:'center',font:`400 22px ${T.sans}`,color:T.ink2}}>×</div></div>
    <div style={{marginTop:10,display:'flex',flexDirection:'column',gap:4}}>
      {row(ME,mine,true)}{row(NM[r],other)}
      <div style={{display:'flex',paddingLeft:80,height:18}}>{mine.map((_,i)=><div key={i} style={{width:CW,display:'flex',justifyContent:'center',alignItems:'center'}}>
        {same.includes(i) ? <span style={{width:6,height:6,borderRadius:3,background:T.ink}}></span> : i===farI ? <span style={{font:`500 10px ${T.sans}`,color:T.ink,whiteSpace:'nowrap'}}>▲</span> : null}</div>)}</div>
      <div style={{font:`400 12px ${T.sans}`,color:T.caption,paddingLeft:80}}>● 같은 색 · ▲ 가장 다른 행{farI>=0?` (${farI+1}번째 행)`:''}</div>
    </div>
    {farI>=0 && <div style={{maxWidth:560}}><PhWhy a={a} up={up} k={k} i={farI} r={r} nm={NM[r]} mine={mine[farI]} other={other[farI]} line={w.lines[farI]}/></div>}
  </div>;
}

// 다 읽은 순간: 컬러 카드를 모달로 잠깐 → 확인하면 같은 자리의 상세(잠금 풀림)
function PhDoneModal({a, up, k}){
  const w=WORKS[k], mine=a.tags[k], n=w.lines.length, h=Math.max(8,Math.min(20,Math.floor(300/n))), dur=n*60;
  return <div style={{position:'absolute',inset:0,background:'rgba(43,43,43,.32)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:8,animation:'pkIn .18s both'}}>
    <div style={{width:520,boxSizing:'border-box',background:T.surface,borderRadius:10,padding:'40px 44px 32px',display:'flex',flexDirection:'column',alignItems:'center',boxShadow:'0 12px 40px rgba(0,0,0,.18)'}}>
      <div style={{font:`500 13px ${T.sans}`,color:T.caption}}>다 읽었어요</div>
      <div style={{font:`700 28px ${T.serif}`,color:T.ink,marginTop:8}}>{w.title}</div>
      <div style={{font:`400 13px ${T.sans}`,color:T.caption,marginTop:6}}>{nowHM()} · {w.poet}</div>
      <div style={{display:'flex',gap:18,alignItems:'flex-end',marginTop:28}}>
        <VBar colors={mine} st={w.st} w={72} h={h} sg={4} anim={dur}/>
        {a.rep[k] && <Sq c={a.rep[k]} w={72} h={36} r={0} title={`시 전체 대표색 · ${pcLabel(a.rep[k])}`} style={{animation:`pkIn .3s ${dur}ms both`}}/>}</div>
      <div style={{font:`400 15px ${T.sans}`,color:T.ink2,marginTop:24,textAlign:'center',animation:`pkIn .3s ${dur+100}ms both`}}>같은 시를 읽은 독자는 <b style={{color:T.ink}}>{w.readers||namesOf(w).length}</b>명이에요.<br/>이제 다른 독자의 색이 열려요.</div>
      <PBtn onClick={()=>up({justDone:false,pv:'all',bub:null,cmpR:null})} style={{marginTop:28,width:'100%'}}>다른 독자의 색 보기</PBtn>
    </div></div>;
}
Object.assign(window,{PhLineDrawer,PhInlineCmp,PhDoneModal,PH_DRAWER_W,nowHM});
