// Poco 데이터. 파일럿 태깅값은 study-cpd.jsx에서 옮긴 뒤 새 팔레트 코드로 변환. 닉네임·반응·'나' 데이터는 시연용(신규).
// 팔레트: BCP-37 (연구자 제공 이미지에서 추출). 행 S 선명·L 연한·M 탁한·D 진한 × 열 R O Y H G C B P, 무채색 BK A1 A2 A3 WH. T1 = 색 없음
// 이전 6×6 좌표 데이터는 가장 가까운 색으로 옮김(회색 3단은 명도 순)
const PC = {
  T1:['색 없음',null],BK:['검정','#070705'],A1:['진회색','#7B7776'],A2:['회색','#BAB6B7'],A3:['연회색','#E2E2E2'],WH:['흰색','#FFFFFF'],
  SR:['빨강','#E32251'],SO:['주황','#EE8D02'],SY:['노랑','#F6D901'],SH:['연두','#C1D500'],SG:['초록','#76D181'],SC:['청록','#79D1DB'],SB:['파랑','#5497CC'],SP:['보라','#A845B1'],
  LR:['연한 빨강','#F094BD'],LO:['연한 주황','#FECEAA'],LY:['연한 노랑','#FCF09E'],LH:['연한 연두','#EEEE94'],LG:['연한 초록','#D1F1CA'],LC:['연한 청록','#BCE4E6'],LB:['연한 파랑','#B8D4EC'],LP:['연한 보라','#CAA4DF'],
  MR:['탁한 빨강','#D2798B'],MO:['탁한 주황','#D19974'],MY:['탁한 노랑','#D9C36D'],MH:['탁한 연두','#C8C64F'],MG:['탁한 초록','#99D978'],MC:['탁한 청록','#A0DDE0'],MB:['탁한 파랑','#88A3D0'],MP:['탁한 보라','#AF74B4'],
  DR:['진한 빨강','#A21D3C'],DO:['진한 주황','#9C5720'],DY:['진한 노랑','#A08420'],DH:['진한 연두','#869832'],DG:['진한 초록','#289844'],DC:['진한 청록','#2E9C9D'],DB:['진한 파랑','#417EB4'],DP:['진한 보라','#8020A5'],
};
// 배치는 이전과 같음: 무채색 줄(색 없음·검정·흰색) + 6×6 격자. 이전 좌표 자리에 대응하는 BCP-37 색을 넣음(A2는 이전처럼 두 자리)
const PC_TOP = ['T1','BK','WH'];
const PC_GRID = ['SR','SO','SY','LR','LO','LY', 'SP','A2','SH','LP','A3','LH', 'SB','SC','SG','LB','LC','LG', 'DR','DO','DY','MR','MO','MY', 'DP','A1','DH','MP','A2','MH', 'DB','DC','DG','MB','MC','MG'];
const PC_ORDER = [...new Set([...PC_TOP,...PC_GRID]),'SKIP'];
const pcName = c => c==='SKIP' ? '건너뜀' : c && PC[c] ? PC[c][0] : '';
const pcLabel = c => c==='SKIP' ? '건너뜀' : c && PC[c] ? `${c} · ${PC[c][0]}` : '';

const NICK = ['남형석','조은','김려원','김한결','이은수']; // 시연 독자(실명 5인)
const ME = window.PocoAPI ? (PocoAPI.user()||'나') : '김민지'; // 앱: 로그인한 아이디. 캔버스(시연 프레임): 시연용 이름
const ME_INI = ME==='김민지' ? '민지' : [...ME].slice(0,2).join(''); // 프로필 동그라미 글자
const TODAY = '10월 19일';

// [시연] 가상 작품(poco-home.jsx) 독자 태깅값 시드 생성. 백석·정호승 등 저작권 보호 작품은 시연에서 제외
const genData = (key,n,pool) => Array.from({length:n},(_,i)=>NICK.map((_,r)=>pool[Math.floor(mulberry32(hashStr(key+'|'+r+'|'+i))()*pool.length)]));
const WORKS = {
  cpd:{key:'cpd',title:'청포도',poet:'이육사',year:1939,txtW:390,
    lines:['내 고장 칠월은','청포도가 익어 가는 시절','이 마을 전설이 주저리주저리 열리고','먼 데 하늘이 꿈꾸려 알알이 들어와 박혀','하늘 밑 푸른 바다가 가슴을 열고','흰 돛단배가 곱게 밀려서 오면','내가 바라는 손님은 고달픈 몸으로','청포(靑袍)를 입고 찾아온다고 했으니','내 그를 맞아 이 포도를 따 먹으면','두 손은 함뿍 적셔도 좋으련','아이야 우리 식탁엔 은쟁반에','하이얀 모시 수건을 마련해 두렴'],
    st:[0,0,1,1,2,2,3,3,4,4,5,5],
    data:[['MY','SB','LP','MY','SC'],['LH','SH','LH','LG','DH'],['MO','SR','DO','DO','T1'],
      ['LC','SB','LC','DB','MH'],['SB','LB','LB','SB','LB'],['WH','MO','LC','LB','WH'],
      ['A2','MY','DO','LR','A1'],['LG','SC','LB','SB','SC'],['SO','SP','SG','LR','LC'],
      ['SC','LC','LG','MR','LR'],['A3','MR','LO','LO','A3'],['WH','MY','WH','LO','WH']],
    rep:['SH','LR','LP','SY','SH']},
  jil:{key:'jil',title:'질투는 나의 힘',poet:'기형도',year:1989,txtW:470,demoOnly:true,
    lines:['아주 오랜 세월이 흐른 뒤에','힘없는 책갈피는 이 종이를 떨어뜨리리','그때 내 마음은 너무나 많은 공장을 세웠으니','어리석게도 그토록 기록할 것이 많았구나','구름 밑을 천천히 쏘다니는 개처럼','지칠 줄 모르고 공중에서 머뭇거렸구나','나 가진 것 탄식밖에 없어','저녁 거리마다 물끄러미 청춘을 세워두고','살아온 날들을 신기하게 세어보았으니','그 누구도 나를 두려워하지 않았으니','내 희망의 내용은 질투뿐이었구나','그리하여 나는 우선 여기에 짧은 글을 남겨둔다','나의 생은 미친 듯이 사랑을 찾아 헤매었으나','단 한번도 스스로를 사랑하지 않았노라.'],
    st:Array(14).fill(0),
    data:[['BK','DO','A1','DY','MO'],['MY','MO','DH','MO','A2'],['A2','A2','A1','DP','DB'],
      ['A1','A2','DO','A1','A1'],['LB','A2','DY','MP','MO'],['A3','A2','A2','A2','BK'],
      ['DR','A1','DC','A2','DO'],['DB','DP','DR','DB','LY'],['DO','DP','DH','DB','LH'],
      ['A1','A1','A1','T1','SO'],['SP','A1','DP','LP','SR'],['MY','A1','A1','SY','BK'],
      ['SO','A1','DP','LR','SR'],['WH','BK','BK','BK','BK']],
    rep:['A1','A1','BK','DC','DR']},
};
const WORK_KEYS = ['cpd','jil'];

// '나' 시연 데이터 (캔버스 프레임 초기 상태용)
const MY = {
  cpd:{tags:['LY','LG','MO','LC','SB','WH','MP','SC','LR','LC','A3','WH'],rep:'SG',
    first:['LY','LG','MO','LC','SB','WH','MP','SC','LR','SC','A3','WH'],
    hist:[{line:2,from:'SR',to:'MO',kind:'읽는 중 고침',when:'10월 12일'},{line:9,from:'SC',to:'LC',kind:'다시 읽기',when:'10월 19일'}]},
  jil:{tags:['MB','MO','A1','A1','A2','A3','DR','DB','DP','A1','SR','MY','SR','BK'],rep:'A1',hist:[]},
};

// 행 단위 반응 (0-index 행). 작성자 색은 실제 파일럿 값과 일치
const REACTS0 = {
  cpd:{4:[{id:1,n:'모과',c:'SB',t:'가슴을 연다는 말에서 넓은 파랑이 먼저 왔어요.'},{id:2,n:'종이배',c:'LB',t:'저는 탁 트인 느낌이라 더 밝은 쪽으로 골랐어요.'}],
    5:[{id:3,n:'모과',c:'WH',t:'돛이 희니까 그냥 흰색.'},{id:4,n:'종이배',c:'MO',t:'저녁 햇빛을 받은 돛을 떠올렸어요.'}],
    11:[{id:5,n:'새벽세시',c:'WH',t:'모시 수건의 하얀 결.'},{id:6,n:'여름비',c:'LO',t:'손님을 기다리는 마음이 따뜻해서 살구색.'}]},
  jil:{7:[{id:7,n:'느린산책',c:'LY',t:'저녁 거리의 가로등 빛.'},{id:8,n:'모과',c:'DB',t:'저는 해가 진 뒤의 파란 시간이었어요.'}],
    10:[{id:9,n:'느린산책',c:'SR',t:'질투가 뜨거워서 빨강.'},{id:10,n:'새벽세시',c:'DP',t:'속으로 삭인 질투라 어두운 보라로.'}],
    13:[{id:11,n:'모과',c:'WH',t:'다 비워진 느낌이라 오히려 흰색이었어요.'},{id:12,n:'종이배',c:'BK',t:'마지막 행은 불이 꺼진 것 같았어요.'}]},
};
const REACT_MAX = 60;
// 내 '이유'(행 말풍선·다시 읽기)와 행 반응 목록을 한 번에 갱신: 같은 글이 시 상세 '반응'과 프로필 '내가 남긴 반응'에도 보이게
const withMyWhy = (s,k,i,v) => { const key=k+'|'+i+'|me'; const W={...(s.why||{})}; if(v) W[key]={...(W[key]||{}),t:v}; else delete W[key];
  const R={...(s.reacts||{})}; const row={...(R[k]||{})}; const L=(row[i]||[]).filter(x=>x.n!==ME);
  if(v){ const c=((s.tags||{})[k]||((s.prog||{})[k])||[])[i]; L.push({id:'me-'+k+'-'+i,n:ME,c,t:v}); }
  if(L.length) row[i]=L; else delete row[i]; R[k]=row; return {why:W,reacts:R}; };

// UX 법칙 키워드 (CLAUDE.md 표기 그대로)
const PL = {gs:'게슈탈트 · 유사성·근접성·연속성',sc:'스캐닝 (Nielsen, 1997)',co:'컬러 이론',dh:'도허티 임계',ja:'제이콥의 법칙 · 멘탈 모델',fi:'피츠의 법칙',mi:'밀러의 법칙',po:'포스텔의 법칙',pe:'피크엔드 법칙',vr:'폰 레스토프 효과',sa:'선택적 주의',ae:'심미적 사용성',hi:'힉의 법칙 · 온보딩'};

// 파일럿 실명: 「청포도」·「질투는 나의 힘」 열 순서 = 남형석·김한결·김려원·조은·김민지. 김민지(5열) = 나
const PILOT_R = ['남형석','김한결','김려원','조은','김민지'];
['cpd','jil'].forEach(k=>{ const w=WORKS[k]; w.pilotMe=w.data.map(row=>row[4]); w.data=w.data.map(row=>row.slice(0,4)); w.rep=w.rep.slice(0,4); w.names=PILOT_R.slice(0,4); });
MY.cpd.tags=WORKS.cpd.pilotMe.slice(); MY.cpd.first=WORKS.cpd.pilotMe.slice(); MY.jil.tags=WORKS.jil.pilotMe.slice();
(()=>{ const m={'모과':'남형석','종이배':'김한결','새벽세시':'김려원','여름비':'조은','느린산책':'김민지'}; ['cpd','jil'].forEach(k=>Object.values(REACTS0[k]).forEach(L=>L.forEach(r=>{ if(m[r.n]) r.n=m[r.n]; }))); })();
const namesOf = w => w.names || NICK;
Object.assign(window,{withMyWhy,PILOT_R,namesOf,PC,PC_TOP,PC_GRID,PC_ORDER,pcName,pcLabel,NICK,ME,ME_INI,TODAY,WORKS,WORK_KEYS,MY,REACTS0,REACT_MAX,PL});
