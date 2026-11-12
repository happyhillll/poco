// 온보딩: 이수동 「사랑가」 4행을 직접 태깅 → 바코드 → 다른 독자 탐색
const ONB = { id:'lee-sudong-saranga', title:'사랑가', poet:'이수동',
  lines:['세상이 다 겨울이어도','우리 사랑은 늘 봄처럼 따뜻하고','간혹, 여름처럼 뜨거울 겁니다.','그대, 사랑합니다.'] };
// 시뮬레이션 독자: 행별 후보 풀(중복 = 가중치)에서 시드 추출
const ONB_POOL = [
  ['AL','WH','LB','MB','AM','LC','DB','AL','LB','MC'],
  ['LY','LO','LH','SY','LR','LO','LG','LY','SO','MY'],
  ['SR','SO','DR','SR','SO','SY','SR','MO','DR','SO'],
  ['SR','LR','LP','MR','SP','DR','LR','SR','LR','SP'],
];
const ONB_NAMES = [['김민지','학생'],['이수동','시인'],['남형석','학생'],['Joyce','해외 독자'],['김려원','학생'],['신형철','평론가'],['조은','학생'],['김찬영','교사'],['김한결','학생']];
const ONB_ME = ['LB','LO','SR','LR'];
// 바코드 거리 = 행별 RGB 유클리드 거리 합(NONE은 최대값)
const onbRGB = id => { const h=hexOf(id); if(!h||id==='NONE') return null; const n=parseInt(h.slice(1),16); return [n>>16,(n>>8)&255,n&255]; };
const onbDist = (a,b) => a.reduce((s,id,i)=>{ const p=onbRGB(id), q=onbRGB(b[i]); return s + (!p||!q ? 442 : Math.hypot(p[0]-q[0],p[1]-q[1],p[2]-q[2])); },0);
// 고정 배치: 김찬영(H) = 가장 비슷, 이수동(B) = 가장 다름. 나머지는 시드 추출 후 두 사람 사이에 들도록 재추출
const ONB_FIXED = { H:['LB','LO','SR','SP'], B:['SY','DB','DG','DB'] };
const ONB_READERS = (()=>{ const ids='ABCDEFGHI'.split(''); const dH=onbDist(ONB_ME,ONB_FIXED.H), dB=onbDist(ONB_ME,ONB_FIXED.B);
  return ids.map((r,n)=>{ let colors=ONB_FIXED[r];
    for(let salt=0; !colors; salt++){ const c=ONB.lines.map((_,i)=>{const p=ONB_POOL[i];return p[Math.floor(mulberry32(hashStr(`${ONB.id}|${r}|${i}|${salt}`))()*p.length)];});
      const d=onbDist(ONB_ME,c); if(d>dH+60 && d<dB-60) colors=c; }
    return {id:r,name:ONB_NAMES[n][0],role:ONB_NAMES[n][1],colors}; }); })();

const onbCss = `@keyframes onbIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes onbFade{from{opacity:0}to{opacity:1}}
@keyframes onbPaint{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes onbCell{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:none}}`;

function OnbCell({id, w, h, style}){
  const none = id==='NONE';
  return <div style={{width:w,height:h,boxSizing:'border-box',background:none||!id?'transparent':hexOf(id),
    border:none?`1.5px dashed ${T.disabled}`:!id?`1px dotted ${T.disabled}`:id==='WH'?`1px solid ${T.line}`:'none',...style}}></div>;
}
const ONB_SW = 46;
function OnbPalette({sel, onPick, hint, label, off}){
  const [hv,setHv] = React.useState(null);
  const sw = (id,k) => <div onMouseEnter={()=>setHv(k)} onMouseLeave={()=>setHv(null)} onClick={()=>!off&&onPick(id)} style={{cursor:off?'default':'pointer'}}>
    <Swatch id={id} size={ONB_SW} selected={sel===id} hover={!off&&hv===k}/></div>;
  return <div style={{position:'absolute',left:930,top:190,width:PAL_COLS*ONB_SW+(PAL_COLS-1)*8,animation:'onbFade .4s ease-out'}}>
        <PaletteGrid render={sw} sw={ONB_SW} gap={8} rowGap={12}/>
    <div style={{font:`400 12px ${T.sans}`,color:T.caption,marginTop:12}}>BCP-37 (Palmer et al. 2025)</div>
    <div style={{font:`500 20px ${T.sans}`,color:T.ink,textAlign:'center',marginTop:32}}>어떤 색이 떠오르나요?</div>
  </div>;
}

function OnbFlow({init={}, onEnter, frame=true, noLink, ctaLabel, topLink}){
  const [colors,setColors] = React.useState(init.colors || [undefined,undefined,undefined,undefined]);
  const [revealed,setRevealed] = React.useState(init.revealed || 1);
  const [active,setActive] = React.useState(init.active===undefined ? 0 : init.active);
  const [phase,setPhase] = React.useState(init.phase || 'tag');
  const [hover,setHover] = React.useState(null);           // {row} | {col}
  const [pin,setPin] = React.useState(init.pin || null);
  const tRef = React.useRef([]);
  React.useEffect(()=>()=>tRef.current.forEach(clearTimeout),[]);
  const later = (fn,ms) => tRef.current.push(setTimeout(fn,ms));
  const done = colors.filter(Boolean).length;

  const pick = id => {
    const next = colors.slice(); next[active] = id; setColors(next);
    const frontier = revealed-1;
    if(next.every(Boolean)){ setActive(null); later(()=>setPhase('barcode'),400); return; }
    if(active===frontier){ setActive(null); later(()=>{ setRevealed(r=>r+1); setActive(frontier+1); },380); }
    else setActive(next[frontier] ? null : frontier);
  };
  const retag = () => { setPhase('tag'); setRevealed(4); setActive(0); };

  const link = <span onClick={()=>onEnter&&onEnter()} style={{font:`400 13px ${T.sans}`,color:T.ink2,textDecoration:'underline',textUnderlineOffset:3,cursor:'pointer'}}>이미 입장 코드가 있어요</span>;
  const right = <div style={{display:'flex',alignItems:'center',gap:28}}>{phase==='tag' && <Progress done={done} total={4}/>}{topLink || (!noLink && link)}</div>;

  // ── 태깅·바코드 단계: 왼쪽 = 큰 본문(가운데 정렬, 아래로 쌓임), 오른쪽 = 팔레트 → 바코드
  const tagOrBar = phase!=='explore';
  const PITCH = 96, AREA_C = 440;
  const blockH = 40 + revealed*PITCH;
  const poemBlock = tagOrBar && <div style={{position:'absolute',left:AREA_C-380,width:760,top:G.clipTop+(900-G.clipTop-blockH)/2,transition:'top .55s cubic-bezier(.2,.7,.2,1)',display:'flex',flexDirection:'column',alignItems:'center'}}>
    <div style={{font:`400 15px ${T.sans}`,color:T.caption,letterSpacing:'.1em',height:40}}>{phase==='tag' ? `${Math.min(revealed,4)} / 4` : `${ONB.poet} · ${ONB.title}`}</div>
    {ONB.lines.slice(0,revealed).map((txt,i)=>{ const cur = phase==='tag' && active===i; const can = phase==='tag' && colors[i];
      return <div key={i} onClick={()=>can&&setActive(i)} title={can?'다시 고르기':''} style={{height:PITCH,display:'flex',alignItems:'center',justifyContent:'center',cursor:can?'pointer':'default',animation:'onbIn .5s ease-out'}}>
        <div style={{position:'relative',font:`700 34px/1.5 ${T.serif}`,letterSpacing:'.03em',whiteSpace:'nowrap',color:cur||phase!=='tag'?T.ink:T.ink2,transition:'color .2s'}}>
          {txt}
          <div style={{position:'absolute',left:0,right:0,bottom:-10,height:6}}>
            {colors[i] ? <div key={colors[i]} style={{height:'100%',transformOrigin:'left',animation:'onbPaint .35s cubic-bezier(.3,.7,.2,1) both',boxSizing:'border-box',
              background:colors[i]==='NONE'?'transparent':hexOf(colors[i]),border:colors[i]==='NONE'?`1.5px dashed ${T.disabled}`:colors[i]==='WH'?`1px solid ${T.line}`:'none'}}></div>
              : <div style={{height:0,borderTop:`1.5px dotted ${cur?T.disabled:T.line}`,marginTop:2}}></div>}
          </div>
        </div>
      </div>; })}
  </div>;
  const palette = phase==='tag' && <OnbPalette sel={active!=null?colors[active]:null} onPick={pick} off={active==null}/>;

  // 바코드 모임: 행 옆에 네모가 차례로 뜬 뒤(0–0.5s) 오른쪽 바코드 자리로 모임(0.75–1.3s)
  const BX = 840, BY = G.clipTop+(900-G.clipTop-224)/2, SQX = 740, SQ = 56;
  const lineCY = i => G.clipTop+(900-G.clipTop-blockH)/2 + 40 + i*PITCH + PITCH/2;
  const D = 1.4;
  const gatherCss = colors.map((_,i)=>{ const dx=SQX-BX, dy=lineCY(i)-SQ/2-(BY+i*56), s=`translate(${dx}px,${dy}px) scaleX(${SQ/88})`;
    const a=(i*.12/D*100).toFixed(1), b=((i*.12+.22)/D*100).toFixed(1), g=((.75+i*.04)/D*100).toFixed(1);
    return `@keyframes onbGather${i}{0%,${a}%{opacity:0;transform:${s} scale(.6)}${b}%{opacity:1;transform:${s}}${g}%{opacity:1;transform:${s}}100%{opacity:1;transform:none}}`; }).join('');
  const barcode = phase==='barcode' && <div style={{position:'absolute',left:BX,top:BY,display:'flex',gap:40,alignItems:'flex-start'}}>
    <style>{gatherCss}</style>
    <div style={{position:'relative',width:88,height:224,flex:'none'}}>
      {colors.map((c,i)=><OnbCell key={i} id={c} w={88} h={56} style={{position:'absolute',left:0,top:i*56,transformOrigin:'0 0',opacity:0,animation:`onbGather${i} ${D}s cubic-bezier(.55,0,.25,1) forwards`}}/>)}
    </div>
    <div style={{width:300,opacity:0,animation:'onbFade .5s ease-out 1.3s forwards'}}>
      <H1 style={{marginBottom:14}}>나의 컬러 바코드</H1>
      <div style={{font:`400 15px/1.7 ${T.sans}`,color:T.ink2,marginBottom:28}}>이수동의 <span style={{font:`700 16px ${T.serif}`,color:T.ink}}>&lt;사랑가&gt;</span>에 대해서<br/>나는 이렇게 느끼고 있어요.<br/>다른 사람들은 어떻게 느끼고 있을까요?</div>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <div onClick={()=>setPhase('explore')} style={{cursor:'pointer'}}><Btn style={{height:56,padding:'0 28px',fontSize:16}}>보러가기</Btn></div>
        <div onClick={retag} style={{cursor:'pointer'}}><Btn kind="text">색 다시 고르기</Btn></div>
      </div>
    </div>
  </div>;

  // ── 탐색 단계: ReaderMatrix(matrix.jsx) — 13·14 본 비교와 같은 컴포넌트
  const explore = phase==='explore' && <div style={{position:'absolute',inset:0,animation:'onbFade .45s ease-out'}}>
    <div style={{position:'absolute',left:MX_ONB.X0,top:120}}>
      <H1 style={{marginBottom:10}}>같은 시, 다른 독자 {ONB_READERS.length}명</H1>
      <div style={{font:`400 15px ${T.sans}`,color:T.ink2}}>한 열이 한 사람의 바코드입니다. 행과 독자를 가리켜 보세요.</div>
    </div>
    <ReaderMatrix lines={ONB.lines} me={colors} readers={ONB_READERS} geo={MX_ONB} init={pin}/>
    <BottomRight><div onClick={()=>onEnter&&onEnter(colors)} style={{cursor:'pointer'}}><Btn style={{height:56,padding:'0 28px',fontSize:16}}>{ctaLabel||'입장하고 시작하기'}</Btn></div></BottomRight>
  </div>;

  return <Screen><style>{onbCss}</style><TopBar right={right}/>{poemBlock}{palette}{barcode}{explore}</Screen>;
}

const OnbS1a = <OnbFlow init={{revealed:1,active:0}}/>;
const OnbS1b = <OnbFlow init={{colors:['LB','LO',undefined,undefined],revealed:3,active:2}}/>;
const OnbS2 = <OnbFlow init={{colors:ONB_ME,revealed:4,active:null,phase:'barcode'}}/>;
const OnbS3r = <OnbFlow init={{colors:ONB_ME,revealed:4,active:null,phase:'explore',pin:{row:2}}}/>;
const OnbS3c = <OnbFlow init={{colors:ONB_ME,revealed:4,active:null,phase:'explore',pin:{col:'C'}}}/>;

Object.assign(NOTES_A, {
 s1:{purpose:'설명 화면 없이 짧은 시 한 편(4행)을 직접 태깅하며 규칙을 몸으로 익힌다. 왼쪽에 큰 본문, 오른쪽에 고정 팔레트. 색이 칠해지면 다음 행이 아래로 쌓인다.',
  comps:['OnbPoemLine(34px 가운데 정렬)','PaintUnderline','PalettePanel(고정, 카드 없음)','Progress'],
  copy:['{n} / 4','어떤 색이 떠오르나요?','BCP-37','이미 입장 코드가 있어요'],
  states:['첫 진입: 왼쪽 영역 중앙에 1행만 등장(500ms, opacity + translateY 10px), 오른쪽 팔레트 고정','색 선택 → 행 아래 6px 색 띠가 왼쪽부터 칠해짐(scaleX 0→1, 350ms) → 380ms 뒤 다음 행이 아래에 쌓이고 본문 묶음이 세로 중앙을 유지하며 위로 이동(550ms)','현재 행 #2B2B2B, 지난 행 #5E5E5E, 미선택 행 밑은 점선','지난 행 클릭 → 그 행이 현재 행이 되어 재선택(띠 다시 칠해짐), 이후 최전선 행으로 복귀','행 사이 전환 중(380ms) 팔레트 입력 잠금','4행 모두 처리 → 400ms 뒤 2로 자동 전환, 팔레트 자리에 바코드(버튼 없음)','"이미 입장 코드가 있어요" → 4 입장(기존 코드 탭)','온보딩 결과는 로컬 상태, 입장 시 practice 버전으로 함께 저장'],
  demoOff:'차이 없음(태깅은 본인 입력).',
  laws:[['행이 하나씩 쌓임','밀러','한 번에 한 행만 처리'],['본문 좌 · 팔레트 우 고정, 구분선 없음','스캐닝','읽기 → 선택 순서가 좌 → 우'],['색 띠가 행 바로 아래','게슈탈트(근접성)','색과 행의 대응'],['팔레트 위치 고정','피츠','매 행 같은 곳을 누름'],['설명 화면 대신 실제 태깅','힉 · 온보딩','조작으로 모델 형성'],['시 블록 화면 중앙','스캐닝','단일 초점, 주변 요소 최소'],['현재 행만 진한 글자, 지난 행 한 단계 연하게','선택적 주의','주의는 현재 행 한 곳에'],['팔레트 구조 7과 동일','제이콥','본 태깅에서 그대로 재인'],['선택 즉시 반영·다음 행 ≤300ms','도허티','흐름 끊김 없음']]},
 s2:{purpose:'고른 네 색이 행 순서대로 모여 바코드가 되는 장면을 보여 준다.',
  comps:['OnbPoemBlock','Barcode(대형)','Btn'],
  copy:['나의 컬러 바코드','이수동의 <사랑가>(명조 볼드)에 대해서 / 나는 이렇게 느끼고 있어요. / 다른 사람들은 어떻게 느끼고 있을까요?','보러가기','색 다시 고르기'],
  states:['진입: 본문은 왼쪽에 그대로, 팔레트가 사라진 자리에 각 행 오른쪽에 색 네모가 120ms 간격으로 뜬 뒤(첫 반응 0ms), 0.75s부터 오른쪽 바코드 자리로 모이며 한 줄 바코드가 됨(1.3s 완료), 이어서 설명·버튼 등장','"색 다시 고르기" → 1로 복귀(4행 모두 보임, 1행에 팔레트)','이 장면 이전에는 다른 독자 정보 노출 없음(태깅 편향 방지)'],
  demoOff:'예시 독자 9명: 학생 5(김민지·남형석·김려원·조은·김한결), 시인 이수동, 평론가 신형철, 해외 독자 Joyce, 교사. 열 순서는 역할이 섞이도록 고정. 예시 데이터는 김찬영 = 가장 비슷, 이수동 = 가장 다름이 되도록 배치(나머지는 두 거리 사이로 재추출). 차이 없음.',
  laws:[['"보러가기" 높이 56','피츠의 법칙','주요 CTA 56'],['바코드 단독 대형 제시','피크엔드','연습의 정점을 결과로'],['칸 순차 등장','게슈탈트(연속성)','행 순서 = 바코드 순서'],['주 행동 1 + 보조 1','힉','즉시 결정'],['바코드만 유채색 대면적','폰 레스토프','강조 하나']]},
 s3:{purpose:'내 바코드를 예시 독자 9명과 한 행렬로 놓고, 행·독자 단위로 스스로 탐색한다.',
  comps:['ReaderMatrix','Barcode(열)','LineDistribution','ReaderCompare','Btn'],
  copy:['같은 시, 다른 독자 9명','한 열이 한 사람의 바코드입니다. 행과 독자를 가리켜 보세요.','행을 가리키면 그 행에 모인 색이, 독자 이름을 가리키면 그 독자와 내 색이 나란히 보입니다. 누르면 고정됩니다.','{n}행','{n}명','나와 같은 색을 고른 독자 {k}명','독자 {X}와 나','같은 색을 고른 행: {n}행 / 같은 색을 고른 행이 없습니다','입장하고 시작하기'],
  states:['기본: 전체 표시 + 안내 문구','행 호버/클릭: 행 띠 배경, 다른 행 opacity .3, 패널 = 색 분포 막대 + 상위 5색(인원·독자) + 나와 같은 수','가장 비슷/다름: 바코드 거리(행별 RGB 거리 합)로 자동 산출. 기본 #BFBFBF 11px opacity .55 → 호버 시 잉크 700 + 열 1.5px 박스 + 패널 제목 "나와 가장 비슷하게/다르게 읽은 독자"','독자 이름 호버/클릭: 나·선택 독자 열 외 opacity .3, 패널 = 행별 나/독자 스와치 대조','클릭 = 고정, 같은 대상 재클릭 = 해제','예시 독자 색은 행별 가중 후보 풀에서 시드 추출(겨울 → 무채·청색, 여름 → 고채도 적·주)'],
  demoOff:'온보딩은 항상 예시 독자 사용(학급 데이터 없음).',
  laws:[['"입장하고 시작하기" 우하단·높이 56','피츠의 법칙','온보딩 종결 CTA 56'],['"입장하고 시작하기" 우하단','제이콥의 법칙 · 멘탈 모델','주 행동 우하, 전 화면 동일 위치'],['가장 비슷/다름 표시: 기본은 옅게, 해당 독자 호버 시 진한 글자 + 열 박스','선택적 주의','필요할 때만 드러냄'],['가장 비슷/다름 열 박스 = 3-2의 일치 박스와 같은 규격','게슈탈트 · 유사성·근접성·연속성','같은 역할은 같은 규격'],['패널이 선택한 행·독자 하나만 설명','선택적 주의','비교 초점 하나'],['같은 색 행은 두 스와치를 잉크 1.5px 박스로 묶음("같음" 글자 제거)','게슈탈트 · 유사성·근접성·연속성','말 대신 묶음으로 일치를 인지'],['일치 표시는 회색조 테두리만','컬러 이론','유채색은 팔레트·바코드에만'],['행 = 가로 한 줄 정렬','게슈탈트(유사성)','같은 행의 색을 한눈에 비교'],['"나" 열 간격 24 > 독자 간 12','게슈탈트(근접성)','나와 타인 구분'],['행/열 호버 시 나머지 흐림','게슈탈트(공동운명) · 선택적 주의','선택 집합 인지'],['패널 우측','스캐닝','보조 정보 위치'],['상위 5색만 목록','밀러','7개 이하'],['호버 즉시 반응','도허티 임계','≤100ms'],['입장 버튼 우하','구텐베르크','종결 행동']]},
});
Object.assign(window,{ONB,ONB_READERS,ONB_ME,OnbFlow,OnbS1a,OnbS1b,OnbS2,OnbS3r,OnbS3c});
