// ───────── Tokens ─────────
const T = {
  bg:'#F3F3F3', surface:'#FFFFFF', line:'#DADADA', disabled:'#BFBFBF', band:'#E6E6E6',
  ink:'#2B2B2B', ink2:'#5E5E5E', caption:'#8A8A8A', num:'#A3A3A3',
  serif:"'Noto Serif KR', serif", sans:"'Noto Sans KR', sans-serif",
  lh:38, bodyW:640, gutter:28, stripW:20, stripH:26, stripGap:8, swatch:44, swGap:6, swRowGap:10,
};
// Geometry (frame px, 1440×900). Body text x is fixed on screens 7·10·13·14·15.
const G = { bodyLeft:140, textX:200, textR:840, popX:856, clipTop:72, pad:88 };

// ───────── BCP-37 (근사값 — 연구자 제공 sRGB로 교체) ─────────
const HUES = [['R','빨강'],['O','주황'],['Y','노랑'],['H','연두'],['G','초록'],['C','청록'],['B','파랑'],['P','보라']];
const LEVELS = [['S','saturated'],['L','light'],['M','muted'],['D','dark']];
const HEX = {
  S:['#D8322C','#EC8526','#F1D22E','#98C43C','#35A04A','#1FA3A6','#3868C0','#8646A6'],
  L:['#F1A69D','#F7C99A','#F8E79E','#CFE4A0','#A7D8AF','#9DD8D7','#AABFE7','#C9AFD9'],
  M:['#B6716A','#C39A6D','#C6B572','#9EAD72','#7C9B7F','#739D9C','#7B8BAD','#947E9E'],
  D:['#882221','#8D501D','#8A781C','#58701F','#225D31','#1B5C61','#203E77','#4D2664'],
};
const ACHRO = [{id:'NONE',hex:null},{id:'BK',hex:'#1E1E1E'},{id:'WH',hex:'#FFFFFF'},{id:'AD',hex:'#5A5A5A'},{id:'AM',hex:'#8C8C8C'},{id:'AL',hex:'#C4C4C4'}];
const CHROMA = LEVELS.map(([l])=>HUES.map(([h],i)=>({id:l+h,hex:HEX[l][i]})));
const BCP = {}; ACHRO.forEach(c=>BCP[c.id]=c); CHROMA.flat().forEach(c=>BCP[c.id]=c);
const BCP_IDS = Object.keys(BCP).filter(k=>k!=='NONE'); // 37
// 팔레트 배치(연구자 제공 이미지 기준): 상단 색 없음·검정·흰색, 6×6 격자
// 좌 3열 = 선명(위 3줄)·어두운(아래 3줄), 우 3열 = 밝은(위)·탁한(아래). 회색은 격자 안 2·5열. AM은 두 칸에 반복.
const PAL_TOP = ['NONE','BK','WH'];
const PAL_GRID = [
  'SR','SO','SY','LR','LO','LY',
  'SP','AM','SH','LP','AL','LH',
  'SB','SC','SG','LB','LC','LG',
  'DR','DO','DY','MR','MO','MY',
  'DP','AD','DH','MP','AM','MH',
  'DB','DC','DG','MB','MC','MG'];
const PAL_W = 6*44+5*6;
function PaletteGrid({render,sw=T.swatch,gap=T.swGap,rowGap=T.swRowGap}){
  return <div style={{display:'grid',gridTemplateColumns:`repeat(6,${sw}px)`,columnGap:gap,rowGap}}>
    {PAL_TOP.map((id,k)=><div key={'t'+k} style={{gridColumn:k+2}}>{render(id,'t'+k)}</div>)}
    <div style={{gridColumn:'1 / -1',height:16-rowGap}}></div>
    {PAL_GRID.map((id,k)=><div key={'g'+k}>{render(id,'g'+k)}</div>)}
  </div>;
}
const hexOf = id => id && BCP[id] ? BCP[id].hex : null;

// ───────── Seeded RNG ─────────
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const seeded = (poemId, readerId, line) => BCP_IDS[Math.floor(mulberry32(hashStr(`${poemId}|${readerId}|${line}`))()*37)];

// ───────── Poem ─────────
const POEM = { id:'baekseok-natasha', title:'나와 나타샤와 흰 당나귀', poet:'백석', year:1938, stanzas:[3,7,6,3] };
const N = POEM.stanzas.reduce((a,b)=>a+b,0);
const STANZA_OF = []; POEM.stanzas.forEach((c,s)=>{for(let k=0;k<c;k++)STANZA_OF.push(s);});
const lineTop = i => G.pad + (i + STANZA_OF[i]) * T.lh;
const POEM_LINES = ['가난한 내가','아름다운 나타샤를 사랑해서','오늘밤은 푹푹 눈이 나린다',
  '나타샤를 사랑은 하고','눈은 푹푹 날리고','나는 혼자 쓸쓸히 앉어 소주를 마신다','소주를 마시며 생각한다','나타샤와 나는','눈이 푹푹 쌓이는 밤 흰 당나귀 타고','산골로 가자 출출이 우는 깊은 산골로 가 마가리에 살자',
  '눈은 푹푹 나리고','나는 나타샤를 생각하고','나타샤가 아니 올 리 없다','언제 벌써 내 속에 고조곤히 와 이야기한다','산골로 가는 것은 세상한테 지는 것이 아니다','세상 같은 건 더러워 버리는 것이다',
  '눈은 푹푹 나리고','아름다운 나타샤는 나를 사랑하고','어데서 흰 당나귀도 오늘밤이 좋아서 응앙응앙 울을 것이다'];
const PH = '가난한 내가';
const lineText = i => POEM_LINES[i];
const READERS = 'ABCDEFGHIJ'.split('');
const readerColors = r => Array.from({length:N},(_,i)=>seeded(POEM.id,r,i));
const MY_V1 = Array.from({length:N},(_,i)=> i===5||i===12 ? 'NONE' : seeded(POEM.id,'me-v1',i));
const CHANGED = [2,7,11,16];
const MY_V2 = MY_V1.map((c,i)=> CHANGED.includes(i) ? seeded(POEM.id,'me-v2',i) : c);

// ───────── Icons ─────────
const Heart = ({filled,size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill={filled?T.ink:'none'} stroke={T.ink} strokeWidth="1.6" strokeLinejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>;
const Pencil = ({size=14,color=T.num}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.3"><path d="M3 13l1-3 7-7 2 2-7 7-3 1z"/></svg>;

// ───────── Primitives ─────────
function Swatch({id, size=T.swatch, selected, hover, disabled, style}){
  const c = BCP[id]; const none = !c || c.hex===null;
  return <div style={{width:size,height:size,borderRadius:4,flex:'none',boxSizing:'border-box',
    background: none ? 'transparent' : c.hex,
    border: none ? `1.5px dashed ${T.disabled}` : (id==='WH' ? `1px solid ${T.line}` : '1px solid rgba(0,0,0,.06)'),
    outline: selected ? `2px solid ${T.ink}` : hover ? `2px solid ${T.disabled}` : 'none', outlineOffset:2,
    opacity: disabled ? .35 : 1, ...style}}></div>;
}
function PalettePopover({selected, hover, style}){
  return <div style={{position:'absolute',width:PAL_W+40,boxSizing:'border-box',background:T.surface,border:`1px solid ${T.line}`,borderRadius:8,padding:'20px 20px 14px',boxShadow:'0 6px 20px rgba(0,0,0,.08)',...style}}>
    <PaletteGrid render={id=><Swatch id={id} selected={selected===id} hover={hover===id}/>}/>
    <div style={{font:`400 12px ${T.sans}`,color:T.caption,marginTop:12}}>BCP-37 (Palmer et al. 2025)</div>
  </div>;
}
// 고정 팔레트(온보딩과 같은 배치): 화면 오른쪽 고정, 카드 없음, 54px 스와치, 출처 → 질문 순
const FP_SW = 54;
function FixedPalette({selected, hover, style}){
  return <div style={{position:'absolute',left:930,top:190,width:6*FP_SW+5*8,...style}}>
    <PaletteGrid render={id=><Swatch id={id} size={FP_SW} selected={selected===id} hover={hover===id}/>} sw={FP_SW} gap={8} rowGap={12}/>
    <div style={{font:`400 12px ${T.sans}`,color:T.caption,marginTop:12}}>BCP-37 (Palmer et al. 2025)</div>
    <div style={{font:`500 20px ${T.sans}`,color:T.ink,textAlign:'center',marginTop:32}}>어떤 색이 떠오르나요?</div>
  </div>;
}
function Strip({id, h=T.stripH, w=T.stripW}){
  if(id===undefined) return <div style={{width:w,height:h}}></div>;
  if(id==='NONE') return <div style={{width:w,height:h,boxSizing:'border-box',border:`1.5px dashed ${T.disabled}`,borderRadius:3}}></div>;
  return <div style={{width:w,height:h,background:hexOf(id),borderRadius:3,boxShadow:id==='WH'?`inset 0 0 0 1px ${T.line}`:'none'}}></div>;
}
function Btn({kind='primary', children, style, dim}){
  const k = {
    primary:{background:T.ink,color:'#fff',border:`1px solid ${T.ink}`},
    low:{background:'transparent',color:T.caption,border:`1px solid ${T.line}`},
    secondary:{background:T.surface,color:T.ink,border:`1px solid ${T.line}`},
    text:{background:'transparent',color:T.ink2,border:'1px solid transparent',padding:'0 8px'},
  }[kind];
  return <div style={{height:44,padding:'0 22px',display:'inline-flex',alignItems:'center',gap:8,borderRadius:6,font:`500 15px ${T.sans}`,boxSizing:'border-box',whiteSpace:'nowrap',...k,opacity:dim?.5:1,...style}}>{children}</div>;
}
function Kbd({children}){return <span style={{font:`500 11px ${T.sans}`,border:`1px solid ${T.line}`,borderRadius:3,padding:'1px 5px',color:T.caption,background:T.surface}}>{children}</span>;}
function LikeButton({liked, count, disabled, size=32, vertical}){
  return <div style={{display:'inline-flex',flexDirection:vertical?'column':'row',alignItems:'center',gap:vertical?0:4,opacity:disabled?.4:1}}>
    <div style={{width:size,height:size,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:6}}><Heart filled={liked} size={16}/></div>
    {count!=null && <span style={{font:`400 12px ${T.sans}`,color:T.ink2,minWidth:10}}>{count}</span>}
  </div>;
}
function ProgressDots({n=4, at=0}){
  return <div style={{display:'flex',gap:8}}>{Array.from({length:n},(_,i)=><div key={i} style={{width:i===at?20:6,height:6,borderRadius:3,background:i===at?T.ink:T.disabled}}></div>)}</div>;
}

// ───────── Barcode ─────────
function Barcode({colors, cellH=20, w=32, hl=null, changed=[], outline=true, style, dimRest}){
  const gap = Math.max(2, Math.round(cellH*.2));
  let s=-1;
  return <div style={{display:'flex',flexDirection:'column',width:w,...style}}>
    {colors.map((c,i)=>{ const brk = STANZA_OF[i]!==s && i>0; s=STANZA_OF[i];
      const isHl = hl===i || changed.includes(i);
      return <div key={i} style={{marginTop:brk?gap:0,height:cellH,boxSizing:'border-box',position:'relative',
        background: c && c!=='NONE' ? hexOf(c) : 'transparent',
        border: c==='NONE' ? `1px dashed ${T.disabled}` : c===undefined ? `1px dotted ${T.line}` : c==='WH' ? `1px solid ${T.line}` : 'none',
        opacity: dimRest && hl!=null && hl!==i ? .45 : 1,
        outline: isHl ? `2px solid ${T.ink}` : 'none', outlineOffset: 1, zIndex: isHl?1:0}}></div>;})}
  </div>;
}
function BarcodeCol({colors, label, cellH=20, w=32, hl, changed, likes, liked, likeOff, dimRest, labelBold}){
  return <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8,width:Math.max(w,36)}}>
    <Barcode colors={colors} cellH={cellH} w={w} hl={hl} changed={changed} dimRest={dimRest}/>
    <div style={{font:`${labelBold?700:400} 11px ${T.sans}`,color:labelBold?T.ink:T.ink2,whiteSpace:'nowrap'}}>{label}</div>
    {likes!==undefined && <LikeButton liked={liked} count={likes} disabled={likeOff} vertical/>}
  </div>;
}

// ───────── Poem body ─────────
// 색 칸은 행 오른쪽, 모든 행 같은 x(본문 최장 행 뒤)에 정사각형으로 정렬
const PB_TXT = 590, PB_SQ = 30, PB_W = 4+T.stripW+T.stripGap+PB_TXT+PB_SQ+16;
// st(i) → 'pending'|'current'|'done'; colors[i] → id | 'NONE' | undefined
function PoemBody({colors=[], st=()=> 'done', numbers, band=null, offset=0, popover, palette, memo, memoMarks=[], changed=[], instruction, lines, stanzas}){
  const rows=[]; let s=-1; const L = lines || POEM_LINES; const SO = stanzas || STANZA_OF;
  L.forEach((txt,i)=>{
    if(SO[i]!==s && i>0) rows.push(<div key={'g'+i} style={{height:T.lh}}></div>); s=SO[i];
    const state = st(i); const cur = band===i || state==='current';
    rows.push(<div key={i} style={{height:T.lh,display:'flex',alignItems:'center',position:'relative'}}>
      {cur && <div style={{position:'absolute',left:T.gutter,top:0,bottom:0,width:PB_W,background:T.band,borderRadius:3}}></div>}
      {changed.includes(i) && <div style={{position:'absolute',left:T.gutter,top:2,bottom:2,width:PB_W,border:`1.5px solid ${T.ink}`,borderRadius:3,boxSizing:'border-box'}}></div>}
      <div style={{width:T.gutter,textAlign:'right',font:`400 12px ${T.sans}`,color:T.num,position:'relative'}}>{numbers?i+1:''}</div>
      <div style={{width:4+T.stripW+T.stripGap}}></div>
      <div style={{width:PB_TXT,flex:'none',font:`400 20px/1.9 ${T.serif}`,letterSpacing:'.02em',color:T.ink,opacity:state==='pending'?.35:1,position:'relative',whiteSpace:'nowrap'}}>{txt}</div>
      <div style={{position:'relative'}}><Strip id={colors[i]} w={PB_SQ} h={PB_SQ}/></div>
      {memoMarks.includes(i) && <div style={{position:'absolute',left:G.textX-G.bodyLeft+PB_TXT+PB_SQ+14,top:12}}><Pencil/></div>}
    </div>);
    if(memo && memo.line===i) rows.push(<div key={'m'+i} style={{paddingLeft:G.textX-G.bodyLeft,paddingBottom:10}}><LineMemoInput {...memo}/></div>);
  });
  return <div style={{position:'absolute',left:0,top:G.clipTop,width:1440,height:900-G.clipTop,overflow:'hidden'}}>
    <div style={{position:'absolute',left:0,top:-offset,width:1440}}>
      {instruction && <div style={{position:'absolute',left:G.textX,top:36,font:`400 15px ${T.sans}`,color:T.ink2,whiteSpace:'nowrap'}}>{instruction}</div>}
      <div style={{position:'absolute',left:G.bodyLeft,top:G.pad}}>{rows}</div>
      {popover && <PalettePopover selected={popover.selected} hover={popover.hover} style={{left:G.popX,top:Math.max(20,lineTop(popover.line)-10)}}/>}
    </div>
    {palette && <FixedPalette selected={palette.selected} hover={palette.hover} style={{top:190-G.clipTop}}/>}
  </div>;
}
function LineMemoInput({text='', state='empty', w=T.bodyW}){
  const len=[...text].length; const left=60-len;
  return <div style={{width:w,background:T.surface,border:`1px solid ${state==='typing'||state==='near'?T.ink2:T.line}`,borderRadius:6,padding:'10px 14px',boxSizing:'border-box',display:'flex',alignItems:'center',gap:12,marginTop:2}}>
    <div style={{flex:1,font:`400 14px ${T.sans}`,color:text?T.ink:T.disabled}}>{text||'이 행에 대한 짧은 메모'}{state==='typing'||state==='near'?<span style={{borderLeft:`1.5px solid ${T.ink}`,marginLeft:1}}></span>:null}</div>
    <div style={{font:`400 12px ${T.sans}`,color:state==='near'?T.ink:T.caption,fontWeight:state==='near'?500:400}}>{state==='saved'?'저장됨':left}</div>
  </div>;
}

// ───────── Chrome ─────────
// Metonym 마크: 한 행 = 한 색 띠. 세 띠(명도 3단)가 바코드이자 M의 윤곽
function LogoMark({size=24}){const u=size/24;return <svg width={size} height={size} viewBox="0 0 24 24" style={{display:'block',flex:'none'}} aria-hidden="true">
  <rect x="2" y="2" width="5" height="20" fill={T.ink}/><rect x="9.5" y="8" width="5" height="14" fill={T.ink2}/><rect x="17" y="2" width="5" height="20" fill={T.ink}/></svg>;}
function Logo(){return <div style={{display:'flex',alignItems:'center',gap:10}} aria-label="Metonym">
  <LogoMark/>
  <div style={{font:`700 19px ${T.serif}`,letterSpacing:'.01em',color:T.ink,whiteSpace:'nowrap'}}>Metonym</div></div>;}
function TopBar({title, right}){
  return <div style={{position:'absolute',left:0,top:0,right:0,height:G.clipTop,display:'flex',alignItems:'center',padding:'0 48px',gap:28,borderBottom:`1px solid ${T.line}`,boxSizing:'border-box',background:T.bg,zIndex:2}}>
    <Logo/>{title && <div style={{font:`700 16px ${T.sans}`,color:T.ink,whiteSpace:'nowrap'}}>{title}</div>}
    <div style={{flex:1}}></div><div style={{whiteSpace:'nowrap',flex:'none'}}>{right}</div>
  </div>;
}
function Progress({done, total=N}){
  return <div style={{display:'flex',alignItems:'center',gap:10}}>
    <div style={{width:120,height:4,background:T.line,borderRadius:2}}><div style={{width:`${done/total*100}%`,height:4,background:T.ink2,borderRadius:2}}></div></div>
    <div style={{font:`400 13px ${T.sans}`,color:T.ink2,whiteSpace:'nowrap'}}>{done} / {total}</div>
  </div>;
}
const BottomRight = ({children, style}) => <div style={{position:'absolute',right:48,bottom:36,display:'flex',gap:12,alignItems:'center',zIndex:3,...style}}>{children}</div>;
const Screen = ({children, style}) => <div style={{position:'relative',width:1440,height:900,background:T.bg,overflow:'hidden',fontFamily:T.sans,color:T.ink,...style}}>{children}</div>;

// ───────── Annotation (①~⑤) ─────────
function Annot({n}){
  const lab = t => <div style={{font:`700 12px ${T.sans}`,color:T.ink,margin:'0 0 6px'}}>{t}</div>;
  const p = {font:`400 13px/1.6 ${T.sans}`,color:T.ink2,margin:'0 0 16px'};
  return <div style={{width:1440,boxSizing:'border-box',padding:'28px 48px',background:'#FFFFFF',borderTop:`1px solid ${T.line}`,display:'grid',gridTemplateColumns:'330px 330px 1fr',gap:36,fontFamily:T.sans}}>
    <div>
      {lab('① 화면 목적')}<p style={p}>{n.purpose}</p>
      {lab('② 컴포넌트')}<p style={{...p,fontFamily:'ui-monospace, Menlo, monospace',fontSize:12}}>{n.comps.join(' · ')}</p>
      {lab('③ 지시문 문안 전문')}<div style={{...p}}>{n.copy.map((c,i)=><div key={i} style={{marginBottom:4}}>「{c}」</div>)}</div>
    </div>
    <div>
      {lab('④ 상태 변형')}<div style={p}>{n.states.map((s,i)=><div key={i} style={{display:'flex',gap:8,marginBottom:4}}><span style={{color:T.caption,flex:'none'}}>–</span><span>{s}</span></div>)}</div>
      {lab('demoMode off')}<p style={p}>{n.demoOff}</p>
    </div>
    <div>
      {lab('⑤ 적용 법칙')}
      <table style={{borderCollapse:'collapse',width:'100%',font:`400 12.5px/1.5 ${T.sans}`,color:T.ink2}}>
        <thead><tr>{['요소','법칙','이유'].map(h=><th key={h} style={{textAlign:'left',fontWeight:500,color:T.ink,borderBottom:`1px solid ${T.ink}`,padding:'4px 8px 4px 0'}}>{h}</th>)}</tr></thead>
        <tbody>{n.laws.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j} style={{borderBottom:`1px solid ${T.line}`,padding:'5px 10px 5px 0',verticalAlign:'top',width:j===0?'28%':j===1?'22%':'auto',color:j===1?T.ink:T.ink2}}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  </div>;
}

Object.assign(window,{T,G,HUES,LEVELS,HEX,ACHRO,CHROMA,BCP,BCP_IDS,hexOf,PAL_TOP,PAL_GRID,PAL_W,PaletteGrid,seeded,hashStr,mulberry32,POEM,N,STANZA_OF,lineTop,PH,POEM_LINES,lineText,READERS,readerColors,MY_V1,MY_V2,CHANGED,
  Heart,Pencil,Swatch,PalettePopover,FixedPalette,FP_SW,Strip,Btn,Kbd,LikeButton,ProgressDots,Barcode,BarcodeCol,PoemBody,LineMemoInput,Logo,LogoMark,TopBar,Progress,BottomRight,Screen,Annot});
