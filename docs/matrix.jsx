// ReaderMatrix: 행 × 독자 바코드 행렬 + 오른쪽 설명 패널. 온보딩 03과 본 비교 13·14가 같은 컴포넌트를 쓴다.
const mxRGB = id => { const h=hexOf(id); if(!h||id==='NONE') return null; const n=parseInt(h.slice(1),16); return [n>>16,(n>>8)&255,n&255]; };
const barcodeDist = (a,b) => a.reduce((s,id,i)=>{ const p=mxRGB(id), q=mxRGB(b[i]); return s + (!p||!q ? 442 : Math.hypot(p[0]-q[0],p[1]-q[1],p[2]-q[2])); },0);
const PEOPLE = [['김민지','학생'],['이수동','시인'],['남형석','학생'],['Joyce','해외 독자'],['김려원','학생'],['신형철','평론가'],['조은','학생'],['김찬영','교사'],['김한결','학생']];

function MxCell({id, w, h}){
  const none = id==='NONE';
  return <div style={{width:w,height:h,boxSizing:'border-box',background:none||!id?'transparent':hexOf(id),
    border:none?`1.5px dashed ${T.disabled}`:!id?`1px dotted ${T.disabled}`:id==='WH'?`1px solid ${T.line}`:'none'}}></div>;
}
const MX_ONB = {X0:66, MT:238, ROW:64, RG:6, SG:0, CW:36, CG:22, POEMW:380, GAP:56, font:18};
const MX_MAIN = {X0:66, MT:196, ROW:24, RG:4, SG:14, CW:30, CG:20, POEMW:470, GAP:40, font:16};

function ReaderMatrix({lines, stanzaOf, me, readers, geo=MX_ONB, init=null, memosFor, likes}){
  const [hover,setHover] = React.useState(null);
  const [pin,setPin] = React.useState(init);
  const [liked,setLiked] = React.useState({});
  const {X0,MT,ROW,RG,SG,CW,CG,POEMW,GAP,font} = geo;
  const sel = hover || pin;
  const SO = stanzaOf || lines.map(()=>0);
  const rowY = i => MT + i*(ROW+RG) + SO[i]*SG;
  const lastB = rowY(lines.length-1)+ROW;
  const dists = readers.map(x=>barcodeDist(me,x.colors));
  const nearId = readers[dists.indexOf(Math.min(...dists))].id, farId = readers[dists.indexOf(Math.max(...dists))].id;
  const tagOf = id => id===nearId ? '가장 비슷' : id===farId ? '가장 다름' : null;
  const cols = [{id:'me',label:'나',colors:me}, ...readers.map(r=>({id:r.id,label:r.name,role:r.role,colors:r.colors}))];
  const NR = readers.length;
  const colX = k => X0+POEMW+GAP + (k===0 ? 0 : CW+24+(k-1)*(CW+CG));
  const matW = colX(NR)+CW - X0;
  const PX = colX(NR)+CW+48, PW = 1440-PX-40;
  const rowOn = i => !sel || sel.row===undefined || sel.row===i;
  const colOn = k => !sel || sel.col===undefined || k===0 || sel.col===cols[k].id;
  const toggle = h => setPin(p => p && JSON.stringify(p)===JSON.stringify(h) ? null : h);

  let panel;
  if(sel && sel.row!==undefined){
    const i = sel.row; const cnt = {};
    cols.forEach(c=>{ const k=c.colors[i]; (cnt[k]=cnt[k]||[]).push(c.label); });
    const list = Object.entries(cnt).sort((a,b)=>b[1].length-a[1].length);
    const same = cnt[me[i]].length-1;
    const memos = memosFor ? memosFor(i) : null;
    panel = <>
      <div style={{font:`500 13px ${T.sans}`,color:T.caption,marginBottom:8}}>{i+1}행</div>
      <div style={{font:`700 18px/1.6 ${T.serif}`,color:T.ink,marginBottom:22,wordBreak:'keep-all'}}>{lines[i]}</div>
      <div style={{display:'flex',height:14,borderRadius:2,overflow:'hidden',marginBottom:18,boxShadow:`inset 0 0 0 1px ${T.line}`}}>
        {list.map(([k,v])=><div key={k} style={{flex:v.length,background:k==='NONE'?'transparent':hexOf(k)}}></div>)}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {list.slice(0,5).map(([k,v])=><div key={k} style={{display:'flex',alignItems:'center',gap:12,font:`400 14px ${T.sans}`,color:T.ink}}>
          <Swatch id={k} size={24}/><span style={{width:34,flex:'none',fontWeight:500}}>{v.length}명</span>
          <span style={{flex:1,minWidth:0,color:T.ink2,font:`400 13px ${T.sans}`,wordBreak:'keep-all'}}>{v.join(' · ')}</span></div>)}
        {list.length>5 && <div style={{font:`400 13px ${T.sans}`,color:T.caption}}>그 밖의 색 {list.length-5}개</div>}
      </div>
      <div style={{font:`400 14px ${T.sans}`,color:T.ink2,marginTop:22,paddingTop:14,borderTop:`1px solid ${T.line}`}}>나와 같은 색을 고른 독자 {same}명</div>
      {memos && <div style={{marginTop:22}}>
        <div style={{font:`500 13px ${T.sans}`,color:T.caption,marginBottom:10}}>이 행의 메모</div>
        {memos.length ? <div style={{display:'flex',flexDirection:'column',gap:8}}>{memos.map((m,j)=>
          <div key={j} style={{border:`1px solid ${T.line}`,borderRadius:6,padding:'10px 6px 4px 12px',background:T.surface}}>
            <div style={{font:`400 14px/1.6 ${T.sans}`,color:T.ink}}>{m.text}</div>
            <div style={{display:'flex',alignItems:'center'}}><span style={{font:`400 12px ${T.sans}`,color:T.caption}}>{m.name}</span><div style={{flex:1}}></div><LikeButton liked={m.liked} count={m.likes}/></div>
          </div>)}</div>
        : <div style={{font:`400 13px/1.7 ${T.sans}`,color:T.ink2}}>아직 메모가 없습니다.</div>}
      </div>}
    </>;
  } else if(sel && sel.col!==undefined){
    const r = cols.find(c=>c.id===sel.col); const sameRows = me.map((c,i)=>c===r.colors[i]?i+1:null).filter(Boolean);
    const many = lines.length > 8; const SW = many?14:28, PAD = many?2:5, RH = many?2:6;
    const lk = likes && likes[r.id]; const on = liked[r.id] ?? (lk && lk.liked);
    panel = <>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:tagOf(r.id)?2:many?8:18,minHeight:lk?44:0}}>
        <span style={{font:`500 13px ${T.sans}`,color:T.caption}}>나와 {r.label}</span>
        {lk && <div onClick={()=>setLiked(s=>({...s,[r.id]:!on}))} title="이 바코드가 좋아요" style={{cursor:'pointer',marginRight:-10}}><LikeButton liked={on} count={lk.count + (on&&!lk.liked?1:0) - (!on&&lk.liked?1:0)} size={44}/></div>}
      </div>
      {tagOf(r.id) && <div style={{font:`700 16px ${T.sans}`,color:T.ink,marginBottom:many?10:18}}>{r.id===nearId?'나와 가장 비슷하게 읽은 독자':'나와 가장 다르게 읽은 독자'}</div>}
      <div style={{display:'flex',flexDirection:'column',gap:RH,font:`400 12px ${T.sans}`,color:T.ink2}}>
        {!many && <div style={{display:'flex',alignItems:'center',gap:10,paddingLeft:28+12+PAD+1.5,fontSize:11}}><span style={{width:SW,textAlign:'center'}}>나</span><span style={{width:SW,textAlign:'center',whiteSpace:'nowrap'}}>{r.label}</span></div>}
        {lines.map((_,i)=>{ const same = me[i]===r.colors[i];
          return <div key={i} style={{display:'flex',alignItems:'center',gap:12,marginTop:i>0&&SO[i]!==SO[i-1]?6:0}}>
            <span style={{width:28,color:T.num,fontSize:many?11:12}}>{i+1}행</span>
            <div style={{display:'flex',gap:10,padding:PAD,borderRadius:many?4:6,border:`1.5px solid ${same?T.ink:'transparent'}`,transition:'border-color .15s'}}>
              <Swatch id={me[i]} size={SW}/><Swatch id={r.colors[i]} size={SW}/></div>
          </div>; })}
      </div>
      <div style={{font:`400 14px ${T.sans}`,color:T.ink2,marginTop:many?12:18,paddingTop:many?10:14,borderTop:`1px solid ${T.line}`}}>{sameRows.length ? `같은 색을 고른 행: ${sameRows.join(', ')}행` : '같은 색을 고른 행이 없습니다'}</div>

    </>;
  } else panel = null;

  return <div style={{position:'absolute',inset:0}} onMouseLeave={()=>setHover(null)}>
    {sel && sel.row!==undefined && <div style={{position:'absolute',left:X0-14,top:rowY(sel.row)-3,width:matW+28,height:ROW+6,background:T.band,borderRadius:4}}></div>}
    {lines.map((txt,i)=><div key={i} onMouseEnter={()=>setHover({row:i})} onClick={()=>toggle({row:i})}
      style={{position:'absolute',left:X0,top:rowY(i),width:POEMW,height:ROW,display:'flex',alignItems:'center',gap:14,cursor:'pointer',opacity:rowOn(i)?1:.4,transition:'opacity .15s'}}>
      <span style={{font:`400 12px ${T.sans}`,color:T.num,width:16,textAlign:'right',flex:'none'}}>{i+1}</span>
      <span style={{font:`700 ${font}px ${T.serif}`,letterSpacing:'.02em',color:T.ink,whiteSpace:'nowrap'}}>{txt}</span></div>)}
    {cols.map((c,k)=><React.Fragment key={c.id}>
      {c.colors.map((id,i)=>{ const on = rowOn(i)&&colOn(k); const focus = sel && ((sel.row===i && sel.col===undefined) || sel.col===c.id);
        return <div key={i} onMouseEnter={()=>setHover({row:i})} onClick={()=>toggle({row:i})} style={{position:'absolute',left:colX(k),top:rowY(i),cursor:'pointer',opacity:on?1:.3,transition:'opacity .15s',
          outline:focus&&k===0?`2px solid ${T.ink}`:'none',outlineOffset:2}}><MxCell id={id} w={CW} h={ROW}/></div>; })}
      <div onMouseEnter={()=>k>0&&setHover({col:c.id})} onClick={()=>k>0&&toggle({col:c.id})}
        style={{position:'absolute',left:colX(k)-(CG-4)/2,top:lastB+6,width:CW+CG-4,height:k===0?32:46,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2,whiteSpace:'nowrap',borderRadius:4,cursor:k>0?'pointer':'default',
        font:`${k===0?700:400} 13px ${T.sans}`,color:k===0||colOn(k)?T.ink:T.caption,background:sel&&sel.col===c.id?T.band:'transparent'}}><span>{c.label}</span>{c.role && <span style={{font:`400 11px ${T.sans}`,color:T.caption}}>{c.role}</span>}</div>
      {tagOf(c.id) && (()=>{ const on = sel && sel.col===c.id; return <>
        <div style={{position:'absolute',left:colX(k)-6,top:MT-6,width:CW+12,height:lastB-MT+12,boxSizing:'border-box',borderRadius:6,pointerEvents:'none',
          border:`1.5px solid ${on?T.ink:'transparent'}`,transition:'border-color .15s'}}></div>
        <div onMouseEnter={()=>setHover({col:c.id})} onClick={()=>toggle({col:c.id})} style={{position:'absolute',left:colX(k)-14,width:CW+28,top:lastB+56,textAlign:'center',whiteSpace:'nowrap',cursor:'pointer',
          font:`${on?700:400} 11px ${T.sans}`,color:on?T.ink:T.disabled,opacity:on?1:.55,transition:'opacity .15s, color .15s'}}>{tagOf(c.id)}</div></>; })()}
    </React.Fragment>)}
    <div style={{position:'absolute',left:PX,top:MT,width:PW}}>{panel}</div>
  </div>;
}
Object.assign(window,{barcodeDist,PEOPLE,MxCell,MX_ONB,MX_MAIN,ReaderMatrix});
