// 온보딩(onboarding.jsx OnbFlow)을 Poco에 연결: 공용 팔레트 색 → Poco 팔레트(PC), 바탕 → 종이, 로고 → POCO. 이 페이지 안에서만 적용.
window.NOTES_A = window.NOTES_A || {};
const POCO_ONB_MAP = {NONE:'T1',AD:'A1',AM:'A2',AL:'A3'};
Object.keys(BCP).forEach(id=>{ const k = POCO_ONB_MAP[id] || id; if(PC[k]) BCP[id].hex = PC[k][1]; });
T.bg = 'transparent';
MX_ONB.RG = 0; // 한 열 = 한 바코드: 세로 칸 사이 틈 없음
window.Logo = () => <Wordmark/>;
// 온보딩은 처음 들어온 사람에게만: 마치면 localStorage 'poco.onboarded' 저장 → 다음부터 홈으로 시작 (주소에 #onb 를 붙이면 다시 볼 수 있음)
// step: 0 첫 행 · 1 쌓이는 행 · 2 바코드 · 3 다른 독자 (캔버스 프레임 초기 상태)
const POCO_ONB_INIT = [{revealed:1,active:0},{colors:['LB','LO',undefined,undefined],revealed:3,active:2},{colors:['LB','LO','SR','LR'],revealed:4,active:null,phase:'barcode'},{colors:['LB','LO','SR','LR'],revealed:4,active:null,phase:'explore'}];
function PocoOnb({a, go}){
  // 마지막 CTA → 처음 온 사람은 회원가입으로. 방금 만든 바코드를 들고 가서 '저장하려면 가입' 맥락을 잇는다
  const enter = cs => { localStorage.setItem('poco.onboarded','1'); a.authed ? go('home') : go('login',{mode:'signup',next:'home',onbBar:(cs||[]).map(c=>POCO_ONB_MAP[c]||c)}); };
  // 이미 계정이 있는 사람은 온보딩 어느 단계에서든 바로 로그인 (상단바 우측, 일반 웹 관습)
  const topLink = !a.authed && <div style={{display:'flex',alignItems:'center',gap:8,font:`400 14px ${T.sans}`,color:T.caption}}>이미 계정이 있으신가요?
    <span className="pk-hit" onClick={()=>go('login',{mode:'login',next:'home'})} style={{height:44,padding:'0 4px',display:'inline-flex',alignItems:'center',font:`700 14px ${T.sans}`,color:T.ink}}>로그인</span></div>;
  // OnbFlow is a fixed 1440×900 layout: center it when the window makes the frame wider
  return <PFrame><div style={{display:'flex',justifyContent:'center'}}><OnbFlow init={POCO_ONB_INIT[a.step||0]} onEnter={enter} topLink={topLink} ctaLabel={a.authed?'입장하고 시작하기':'회원가입'} noLink/></div></PFrame>;
}
Object.assign(window,{PocoOnb});
