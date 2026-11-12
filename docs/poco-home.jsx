// Poco 메인(00)과 나의 서재(04). 가상 작품 3편 + 시연 시작 상태 + 공용 조각(가로 바코드·분포 막대·유사도)
// ── 한강 시 3편(사용자 제공 원문 그대로). 독자 색은 실제 데이터가 아니라 시드로 만든 예시
const VW = {
  hk1:{key:'hk1',title:'어느 늦은 저녁 나는',poet:'한강',txtW:470,
    lines:['어느','늦은 저녁 나는','흰 공기에 담긴 밥에서','김이 피어 올라오는 것을 보고 있었다.','그때 알았다','무엇인가 영원히 지나가버렸다고','지금도 영원히','지나가버리고 있다고','밥을 먹어야지','나는 밥을 먹었다'],
    st:[0,0,0,0,0,0,0,0,0,1],
    data:genData('hk1',10,['WH','A3','LY','LO','A2','MY','A1','LB','MO']),rep:['WH','A3','LY','A2','MO']},
  hk2:{key:'hk2',title:'눈물이 찾아올 때 내 몸은 텅 빈 항아리가 되지',poet:'한강',txtW:560,
    lines:['거리 한가운데에서 얼굴을 가리고 울어보았지','믿을 수 없었어 아직 눈물이 남아 있었다니','눈물이 찾아올 때 내 몸은 텅 빈 항아리가 되지','선 채로 기다렸어 그득 차오르기를','모르겠어, 얼마나 많은 사람들이 나를 스쳐갔는지','거리 거리, 골목 골목으로 흘러갔는지','누군가 내 몸을 두드렸다면 놀랐을 거야','누군가 귀 기울였다면 놀랐을 거야','검은 물소리가 울렸을 테니까','깊은 물소리가 울렸을 테니까','둥글게','더 둥글게','파문이 번졌을 테니까','믿을 수 없었어 아직 눈물이 남아 있었다니','알 수 없었어 더는 아무것도 두렵지 않다니','거리 한가운데에서 혼자 걷고 있을 때였지','그렇게 영원히 죽었어 내 가슴에서 당신은','거리 한 가운데에서 혼자 걷고 있을 때였지','그렇게 다시 깨어났어 내 가슴에서 생명은'],
    st:[0,0,1,1,2,2,3,3,3,3,3,3,3,4,4,5,5,6,6],
    data:genData('hk2',19,['DB','MB','A1','BK','DC','MC','SB','A2','DP','MP','LB','WH']),rep:['DB','A1','MB','DC','BK']},
  hk3:{key:'hk3',title:'서랍에 저녁을 넣어 두었다',poet:'한강',txtW:520,
    lines:['하루가 끝나면 서랍에 저녁을 넣어 둔다','저녁이 식기 전에 나는 퇴근을 한다','저녁은 서랍 안에서 식어가고 있지만 나는 퇴근을 한다','하루의 무게를 내려놓고','서랍에 넣어 둔 저녁은 아직도 따뜻하다','나는 퇴근을 한다 저녁이 식기 전에','퇴근을 하면서 저녁을 꺼내어','따뜻한 한 끼를 먹는다 하루의 끝에서','퇴근을 하고 서랍에 넣어 둔 저녁을 꺼내면','하루의 무게가 가벼워진다 나는 퇴근을 한다','퇴근을 하면서 저녁을 꺼내어 따뜻한 한 끼를 먹는다','하루의 끝에서'],
    st:[0,0,1,1,2,2,3,3,4,4,5,5],
    data:genData('hk3',12,['LO','MO','DO','LY','MY','A2','A3','MR','LR','DB']),rep:['MO','LO','DO','A2','LY']},
  // 사용자 제공 이미지(필사 포함)에서 옮긴 시. 손글씨 판독이 어려운 글자는 원문과 다를 수 있음
  nt1:{key:'nt1',title:'네가 알 것만 같아',poet:'나태주',txtW:470,
    lines:['라일락꽃','시계풀꽃','꽃내음에 홀려','창문 열면','5월의 부신 햇살','싱그런 바람','왠지 나는 부끄러워라','내가 너를 생각하는 이 마음을','네가 알 것만 같아','혼자 서 있는 나를','네가 어디선 듯','숨어서 가만히 웃고 있을 것만 같아서…….'],
    st:Array(12).fill(0),data:genData('nt1',12,['LP','LH','LG','WH','LY','SY','LC','LR','MP','A3']),rep:['LP','LY','LG','LH','WH']},
  lj1:{key:'lj1',title:'우산과 어머니',poet:'이정록',txtW:500,
    lines:['우산과 어머니는 닮았다','둘은 비바람을 막아준다','못난 얼굴을 숨길 수 있다','하늘 무서운 줄 알고 살아라','올려다보지 말고 멀리 보아라','천둥 번개도 순간이고 장마도 멎는단다','우산과 어머니는 속이 깜깜하게 젖어 있다','햇빛이 들면 저 홀로 구석에서 잊힌다','그래도 언제나 신발장 가까이에서 기다린다','꺾여도 접고 꺾이나 다시 펼치거라','우산을 펼쳐 젖은 사람을 들이는 순간','너는 일주문 기둥이 된단다','언제 오셨나 젖은 어머니가','마른 우산을 또 넣는다','나는 어머니를 펼친다'],
    st:[0,0,0,0,0,0,1,1,1,1,1,1,1,1,1],data:genData('lj1',15,['A1','A2','DB','MB','SB','LB','DC','MC','A3','WH','MO']),rep:['A2','MB','DB','A1','LB']},
  yc1:{key:'yc1',title:'벚꽃의 꿈',poet:'유응교',txtW:500,
    lines:['가야 할 때를 알고 가는 일은','얼마나 아름답고 눈이 부신가','일시에 큰소리로 환하게 웃고','두 손 털고 일어서는 삶이 좋아라','끈적이며 모질도록 애착을 갖고','지저분한 추억들을 남기려는가','하늘 아래 봄볕 속에 꿈을 남기고','바람따라 떠나가는 삶이 좋더라.'],
    st:[0,0,1,1,2,2,3,3],data:genData('yc1',8,['LP','LR','WH','LH','SY','LY','LB','LC','A3']),rep:['LP','WH','LR','LY','LB']},
  ks1:{key:'ks1',title:'못 박힌 사람',poet:'김승희',txtW:520,
    lines:['못 박힌 사람은','못 박은 사람을 잊을 수가 없다.','네가 못 박았지','네가 못 박았다고','재의 수요일 지나고','아름다운 라일락 산수유, 라벤더 꽃 핀 봄날','아침에 떴던 해가 저녁에 지는 것을 바라보면','못 박힌 사람이 못 박은 사람이고','못 박은 사람이 못 박힌 사람이고','못 자국마다 어느 가슴에든 찬란한 꽃이 피어나고','있는데','못 박힌 사람이','못 박은 사람을 잊을 수가 없듯이','못 박은 사람도 못 박힌 사람을 잊을 수가 없다.','못 박힌 사람과 못 박은 사람만이 있는 곳이','에덴의 동쪽'],
    st:[0,0,0,0,1,1,1,1,1,1,1,2,2,2,2,2],data:genData('ks1',16,['DR','MR','SR','A1','BK','LP','SP','MP','DP','LY','SY','A2']),rep:['DR','A1','MR','SP','BK']},
  jh1:{key:'jh1',title:'윤동주의 서시',poet:'정호승',txtW:520,
    lines:['너의 어깨에 기대고 싶을 때','너의 어깨에 기대어 마음놓고 울어보고','싶을 때 너와 약속한 장소에 내가 먼저','도착해 창가에 앉았을 때','그 창가에 문득 햇살이 눈부실 때','윤동주의 서시를 읽는다','뒤늦게 너의 편지에 번져 있는 눈물을 보았을 때','눈물의 죽음을 이해하지 못하고 기어이 서울을','떠났을 때 새들이 톡톡 안개를 걷어내고','바다를 보여줄 때 장항에서 기차를 타고','가난한 윤동주의 서시를 읽는다','갈참나무 한 그루가 기차처럼 흔들린다','산다는 것은 사랑한다는 것인가','사랑한다는 것은 산다는 것인가'],
    st:[0,0,0,0,0,1,1,1,1,1,2,2,2,2],data:genData('jh1',14,['LY','SY','WH','A3','LB','MB','DB','A2','LC','MO','A1']),rep:['LY','A3','LB','WH','MB']},
  jh2:{key:'jh2',title:'종소리',poet:'정호승',txtW:500,
    lines:['사람은 죽을 때에','한번은 아름다운 종소리를 내고','죽는다는데 새들도 죽을 때에','푸른 하늘을 향해','한번은 맑고 아름다운 종소리를 내고','죽는다는데 나 죽을 때에','한번도 아름다운 종소리를 내지 못하고','눈길에 핏방울만 남기게 될까봐','두려워라 풀잎도 죽을 때에','아름다운 종소리를 남기고 죽는다는데'],
    st:Array(10).fill(0),data:genData('jh2',10,['SB','LB','MB','DB','WH','A1','A2','SR','DR','LG','SG']),rep:['SB','WH','A1','DB','SR']},
  // 사용자 제공 이미지에서 옮긴 시 7편(백석 2·윤동주·나태주 2·기형도·이정록). 독자 색은 시드 예시
  bs1:{key:'bs1',title:'나와 나타샤와 흰 당나귀',poet:'백석',txtW:560,
    lines:['가난한 내가','아름다운 나타샤를 사랑해서','오늘밤은 푹푹 눈이 나린다','나타샤를 사랑은 하고','눈은 푹푹 날리고','나는 혼자 쓸쓸히 앉어 소주를 마신다','소주를 마시며 생각한다','나타샤와 나는','눈이 푹푹 쌓이는 밤 흰 당나귀 타고','산골로 가자 출출이 우는 깊은 산골로 가 마가리에 살자','눈은 푹푹 나리고','나는 나타샤를 생각하고','나타샤가 아니 올 리 없다','언제 벌써 내 속에 고조곤히 와 이야기한다','산골로 가는 것은 세상한테 지는 것이 아니다','세상 같은 건 더러워 버리는 것이다','눈은 푹푹 나리고','아름다운 나타샤는 나를 사랑하고','어데서 흰 당나귀도 오늘밤이 좋아서 응앙응앙 울을 것이다'],
    st:[0,0,0,1,1,1,1,1,1,1,2,2,2,2,2,2,3,3,3],data:genData('bs1',19,['WH','A3','LB','MB','DB','A1','A2','LP','MY','BK','LC']),rep:['WH','A3','MB','DB','A1']},
  bs2:{key:'bs2',title:'바다',poet:'백석',txtW:520,
    lines:['바닷가에 왔드니','바다와 같이 당신이 생각만 나는구려','바다와 같이 당신을 사랑하고만 싶구려','구붓하고 모래톱을 오르면','당신이 앞선 것만 같구려','당신이 뒤선 것만 같구려','그리고 지중지중 물가를 거닐면','당신이 이야기를 하는 것만 같구려','당신이 이야기를 끊는 것만 같구려','바닷가는','개지꽃에 개지 아니 나오고','고기비눌에 하이얀 햇볕만 쇠리쇠리하야','어쩐지 쓸쓸만 하구려 섧기만 하구려'],
    st:[0,0,0,1,1,1,2,2,2,3,3,3,3],data:genData('bs2',13,['SB','LB','MB','DB','SC','LC','MC','A2','A3','WH','LY']),rep:['SB','LB','MB','A2','LC']},
  yd1:{key:'yd1',title:'편지',poet:'윤동주',txtW:420,
    lines:['누나!','이 겨울에도','눈이 가득히 왔습니다','흰 봉투에','눈을 한 줌 넣고','글씨도 쓰지 말고','우표도 붙이지 말고','말쑥하게 그대로','편지를 부칠까요?','누나 가신 나라엔','눈이 아니 온다기에'],
    st:[0,0,0,1,1,1,1,1,1,2,2],data:genData('yd1',11,['WH','A3','A2','LB','LC','MB','A1','BK','LY']),rep:['WH','A3','LB','A2','A1']},
  nt2:{key:'nt2',title:'행복',poet:'나태주',txtW:420,
    lines:['저녁 때','돌아갈 집이 있다는 것','힘들 때','마음속으로 생각할 사람 있다는 것','외로울 때','혼자서 부를 노래가 있다는 것.'],
    st:[0,0,1,1,2,2],data:genData('nt2',6,['LO','MO','LY','SY','LR','LP','WH','LG','LB','A3']),rep:['LO','LY','LR','LP','WH']},
  nt3:{key:'nt3',title:'틀렸다',poet:'나태주',txtW:560,
    lines:['돈 가지고 잘 살기는 틀렸다','명예나 권력, 미모가지고도 이제는 틀렸다','세상에는 돈 많은 사람이 얼마나 많고','명예나 권력, 미모가 다락 같이 높은 사람들이 얼마나 많은가!','요는 시간이다','누구나 공평하게 허락된 시간','그 시간을 어디에 어떻게 써 먹느냐가 열쇠다','그리고 선택이다','내 좋은 일, 내 기쁜 일, 내가 하고 싶은 일 고르고 골라','하루나 한 시간, 순간순간을 살아보라','어느새 나는 빛나는 사람이 되고 기쁜 사람이 되고','스스로 아름다운 사람이 될 것이다','틀린 것은 처음부터 틀린 일이 아니었다','틀린 것이 옳은 것이고 좋은 것이었다.'],
    st:Array(14).fill(0),data:genData('nt3',14,['A1','A2','MO','DO','SY','LY','SO','LO','SG','LG','WH','MY']),rep:['SY','A2','LY','SO','LG']},
  gh2:{key:'gh2',title:'대학시절',poet:'기형도',txtW:600,
    lines:['나무 의자 밑에는 버려진 책들이 가득하였다','은백양의 숲은 깊고 아름다웠지만','그곳에서는 나뭇잎조차 무기로 사용되었다','그 아름다운 숲에 이르면 청년들은 각오한 듯','눈을 감고 지나갔다, 돌층계 위에서','나는 플라톤을 읽었다, 그때마다 총성이 울렸다','목련 철이 오면 친구들은 감옥과 군대로 흩어졌고','시를 쓰던 후배는 자신이 기관원이라고 털어놓았다','존경하는 교수가 있었으나 그분은 원체 말이 없었다','몇 번의 겨울이 지나자 나는 외톨이가 되었다','그리고 졸업이었다, 대학을 떠나기가 두려웠다'],
    st:Array(11).fill(0),data:genData('gh2',11,['A1','A2','BK','DG','MG','A3','DR','MB','DB','WH','MY']),rep:['A1','MG','BK','A2','DB']},
  lj2:{key:'lj2',title:'의자',poet:'이정록',txtW:480,
    lines:['병원에 갈 채비를 하며','어머니께서','한 소식 던지신다','허리가 아프니까','세상이 다 의자로 보여야','꽃도 열매도, 그게 다','의자에 앉아 있는 것이여','주말엔','아버지 산소 좀 다녀와라','그래도 큰애 네가','아버지한테는 좋은 의자 아녔냐','이따가 침 맞고 와서는','참외밭에 지푸라기라도 깔고','호박에 똬리도 받쳐야겠다','그것들로 식군데 의자를 내줘야지','싸우지 말고 살아라','결혼하고 애 낳고 사는 게 별거냐','그늘 좋고 풍경 좋은 데다가','의자 몇 개 내놓는 거여'],
    st:[0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4],data:genData('lj2',19,['MO','LO','DO','MY','LY','SG','LG','MG','A2','A3','LR','SO']),rep:['MO','LY','MG','A2','LO']},
  // 사용자 제공 이미지에서 옮긴 시 2편. 「헌화」는 손글씨 필사라 판독이 어려운 글자는 원문과 다를 수 있음. 독자 색은 시드 예시
  br1:{key:'br1',title:'청춘의 기습',poet:'이병률',txtW:700,
    lines:['그런 적 있을 것입니다','버스에서 누군가 귤 하나를 막 깠을 때','이내 사방이 가득 채워지고 마는','누군가에게라도 벅찬 아침은 있을 것입니다','열자마자 쏟아져서 마치 바닥에 부어놓은 것처럼','마음이라 부를 수 없는 것들이','이해할 수 없는 것들은 이해할 수 없는 것들이어서 버릴 수 없습니다','무언가를 잃었다면 주머니를 가졌기 때문입니다','인생을 계산하는 밤은 고역이에요','인생의 심줄은 몇몇의 추운 새벽으로 단단해집니다','넘어야겠다는 마음은 있습니까','저절로 익어 떨어뜨려야겠다는 질문이 하나쯤은 있습니까','돌아볼 것이 있을 것입니다','자신을 부리로 쪼아서 거침없이 하늘에 내던진 새가 어쩌면 전생의 자신이었습니다','누구나 미래를 빌릴 수는 없지만','과거를 갚을 수는 있을 것입니다'],
    st:[0,0,0,1,1,1,2,3,3,3,4,4,5,5,6,6],data:genData('br1',16,['SO','LO','LY','MO','SY','LB','A2','DB','LP','WH','MY']),rep:['SO','LY','LO','LB','A2']},
  gy1:{key:'gy1',title:'헌화',poet:'고영재',txtW:460,
    lines:['꽃다발을 주는 것과 꽃 한 송이를 건네는 것은 다르다','헌화는 단 한 줄기로 모든 걸 말한다','그때 당신이 내 손을 꼭 잡았을 때','산 하나가 일어서고','강이 흐르고','하늘과 바다가 꽃구멍 속으로 밀려들어와','내 비강에서 향기로서 하나가 피었다','그러니 손을 모으고 눈을 감는 건','창처럼 꽃을 쥐고 서 있는 것은','온 힘을 다하여 말하는 최종결과일 뿐이다','찻잔에서 찻잎이 활짝 일어서듯','만났고','살았고','그게 그렇게 기뻤다','나를 줄 수 없어서 단 하나의 줄기를','당신 앞에 놓고 살아가는 것이다'],
    st:Array(16).fill(0),data:genData('gy1',16,['WH','LR','LP','A3','LG','SG','MP','LY','A2','DR']),rep:['WH','LR','LP','A3','LG']},
};
Object.assign(WORKS, VW);
// 오늘의 시(시연): 이수동 「사랑가」. 독자 4명 색은 실제 데이터가 아니라, 행 분위기별 후보 색에서 시드로 만든 예시
(()=>{ const P=[['WH','A3','LB','LC','MB'],['LR','SR','LP','MR','LO'],['LO','SO','LY','LR','WH'],['A2','MB','MP','LB','A3'],['LO','MO','LY','DO','LR'],['SR','DR','SO','MR','SP'],['SO','LO','MO','SY','LR'],
  ['SG','DG','MG','SH','DH'],['LG','SG','LH','SH','LY'],['A1','BK','DB','DP','SB'],['WH','LB','MB','A3','LC','DB'],['LY','LO','LH','SY','LR','LG'],['SR','SO','DR','SY','MO'],['SR','LR','LP','MR','SP','DR']];
  const N=PILOT_R.slice(0,4);
  WORKS.sar={key:'sar',title:'사랑가',poet:'이수동',art:window.__resources['r_today_2dsnowfield'],txtW:470,readers:37,names:N,
    lines:['이 눈밭, 괜찮습니다.','나의 그대를 향한 사랑으로','충분히 녹일 수 있습니다.','혹여, 그것이 벅차다면','우리 보금자리라도 나의,','그대로 인한 신열(身熱)로','따뜻하게 데우겠습니다.','그리고 그대 닮은 산세베리아도','피우겠습니다.','장담하건대,','세상이 다 겨울이어도','우리 사랑은 늘 봄처럼 따뜻하고','간혹, 여름처럼 뜨거울 겁니다.','그대, 사랑합니다.'],
    st:Array(14).fill(0), data:P.map((p,i)=>N.map((_,r)=>p[Math.floor(mulberry32(hashStr('sar|'+r+'|'+i))()*p.length)])) }; WORKS.sar.rep=WORKS.sar.data[13].slice(); })();
// [시연] 참여 인원(작품 목록 '참여 많은 순' 정렬용)
Object.entries({hk1:2013,hk2:2013,hk3:2013,nt1:2015,lj1:2023,yc1:2020,ks1:2008,jh1:1997,jh2:1999,bs1:1938,bs2:1936,yd1:1936,nt2:2015,nt3:2013,gh2:1989,lj2:1999,br1:2017}).forEach(([k,y])=>WORKS[k].year=y); // 연도는 시연용(한강 3편은 시집 2013)
Object.entries({cpd:142,jil:96,hk1:121,hk2:64,hk3:88,nt1:109,lj1:52,yc1:47,ks1:39,jh1:93,jh2:71,bs1:134,bs2:58,yd1:77,nt2:98,nt3:61,gh2:49,lj2:66,br1:45,gy1:33}).forEach(([k,n])=>WORKS[k].readers=n);
WORK_KEYS.splice(0, WORK_KEYS.length, 'sar','cpd','jil','hk1','hk3','hk2','nt1','jh1','jh2','lj1','yc1','ks1','bs1','bs2','yd1','nt2','nt3','gh2','lj2','br1','gy1');
// 실시간 베스트 순서(시연): 질투는 나의 힘 › 벚꽃의 꿈 › 네가 알 것만 같아 › 청포도 › 사랑가 › 어느 늦은 저녁 나는 › …  '시' 탭 참여 많은 순도 같은 순서
const BEST_KEYS = ['jil','yc1','nt1','cpd','sar','hk1','bs1','hk3','nt2','hk2','jh1','yd1','jh2','lj2','nt3','bs2','lj1','gh2','ks1','br1','gy1'];
const BEST_TREND = ['up','down','same','up','down','up','up','same','up','up','down','same','up','down','up','same','same','down','down','up','up']; // 시연용 임의 상승·하강
// 시인 랭킹: 시인별 읽은 독자 합계 순. 상승·하강은 시연용 임의
const POET_TREND = [{k:'same',n:0},{k:'same',n:0},{k:'up',n:1},{k:'down',n:1},{k:'new'},{k:'up',n:4},{k:'down',n:2},{k:'up',n:1},{k:'new'},{k:'down',n:1},{k:'same',n:0},{k:'up',n:2}];
const PHOTO_POETS = {'이수동':window.__resources['r_poet_2d_c774_c218_b3d9'],'기형도':window.__resources['r_poet_2d_ae30_d615_b3c4'],'백석':window.__resources['r_poet_2d_bc31_c11d'],'윤동주':window.__resources['r_poet_2d_c724_b3d9_c8fc'],'이육사':window.__resources['r_poet_2d_c774_c721_c0ac'],'한강':window.__resources['r_poet_2d_d55c_ac15'],'정호승':window.__resources['r_poet_2d_c815_d638_c2b9'],'나태주':window.__resources['r_poet_2d_b098_d0dc_c8fc'],'이정록':window.__resources['r_poet_2d_c774_c815_b85d'],'유응교':window.__resources['r_poet_2d_c720_c751_ad50'],'김승희':window.__resources['r_poet_2d_ae40_c2b9_d76c']};
// 랭킹 시연용 추가 시인(아직 수록작 없음): 백석·윤동주
const EXTRA_POETS = [];
function poetRank(){ const m={}; WORK_KEYS.forEach(k=>{ const w=WORKS[k]; m[w.poet]=m[w.poet]||{poet:w.poet,n:0,readers:0,works:[]}; m[w.poet].n++; m[w.poet].works.push(w.title); m[w.poet].readers+=w.readers||0; }); return [...Object.values(m),...EXTRA_POETS].sort((x,y)=>y.readers-x.readers); }
const myGen = (k,n,pool) => Array.from({length:n},(_,i)=>pool[Math.floor(mulberry32(hashStr(k+'|me|'+i))()*pool.length)]);
// 시연 시작 상태: 청포도 완료(오늘·새로 추가), 질투는 나의 힘 6/14 읽는 중, 한강 1편 완료, 2편 읽기 전(NEW)
const PH_INIT = {
  tags:{cpd:MY.cpd.tags, jil:MY.jil.tags, hk1:myGen('hk1',10,['WH','A3','LY','LO','A2','MO']), yc1:['SY','SY','SO','LO','DO','DR','SB','SC'], nt1:['SP','SY','LO','LB','SG','LC','DY','LR','SO','A1','A2','DG'],
  bs1:['LR','LR','LO','LC','WH','WH','LC','WH','LR','LR','SR','WH','A1','DO','DY','BK','WH','WH','LC'],
  bs2:['SB','MB','SR','LY','LB','LB','SC','LC','A2','MB','A2','WH','A1'],
  yd1:['LB','A2','WH','WH','WH','A3','A3','WH','LB','A1','BK'],
  nt2:['LO','MO','A2','LR','A1','LY'],
  nt3:['A1','A1','A2','A2','SY','SY','DO','SO','LY','SY','SY','LP','LG','SG'],
  gh2:['MO','MG','DG','MG','A1','DR','LP','A1','A2','A1','BK'],
  lj2:['A2','MO','LY','MR','SG','LG','LG','A2','DG','MO','MO','MY','LY','DO','MO','LR','LR','SG','MO']},
  rep:{cpd:MY.cpd.rep, hk1:'A3', yc1:'SY', nt1:'SG', bs1:'WH', bs2:'LB', yd1:'WH', nt2:'LO', nt3:'SY', gh2:'A1', lj2:'MO'}, first:{cpd:MY.cpd.first}, hist:{cpd:MY.cpd.hist,jil:[]},
  prog:{}, when:{cpd:'10월 19일', jil:'10월 17일', yc1:'10월 19일', nt1:'10월 19일', hk1:'10월 11일', bs1:'10월 16일', bs2:'10월 14일', yd1:'10월 13일', nt2:'10월 18일', nt3:'10월 10일', gh2:'10월 09일', lj2:'10월 15일'}, fresh:'cpd', fav:['hk2','hk3'],
  // 팔로우(시연): 내가 팔로우하는 독자 = 시 상세의 '친구'. 팔로워는 표시용
  following:['조은','김려원','김한결'], followers:['조은','김한결','남형석','이은수'],
};
const libKeys = a => Object.keys(a.tags).filter(k=>WORKS[k]).sort((x,y)=>(a.when[y]||'').localeCompare(a.when[x]||'')).sort((x,y)=>(y===a.fresh)-(x===a.fresh));
const progOf = (a,k) => a.tags[k] ? WORKS[k].lines.length : (a.prog[k]||[]).filter(c=>c!==undefined).length;
const workState = (a,k) => a.tags[k] ? 'done' : progOf(a,k)>0 ? 'reading' : 'new';
const contInit = (a,k) => { const n=WORKS[k].lines.length, p=a.prog[k]||[]; return Array.from({length:n},(_,i)=>p[i]); };
const workLabel = w => w.year ? `${w.poet} · ${w.year}` : w.poet;

// 가로 바코드 (행 순서 = 왼→오른쪽, 연 사이 2px)
function HBar({colors, st, w=160, h=20, empty, changed=[]}){
  const n=colors.length, gaps=st.filter((s,i)=>i>0&&s!==st[i-1]).length, cw=(w-gaps*2)/n;
  return <div style={{display:'flex',width:w,height:h}}>{colors.map((c,i)=><Sq key={i} c={c===undefined&&empty?undefined:c} w={cw} h={h} r={0} title={`${i+1}행 · ${pcLabel(c)||'아직'}`} style={{marginLeft:i>0&&st[i]!==st[i-1]?2:0,boxShadow:'none',outline:changed.includes(i)?`2px solid ${T.ink}`:'none',outlineOffset:1,position:'relative',zIndex:changed.includes(i)?1:0}}/>)}</div>;
}
// 분포 막대: 팔레트 순서로 붙임(빈도순 아님 · 1위 강조 없음). 칸에 올리면 색 이름 + 고른 사람
function PhStack({cs, names, w=480, h=22, byCount}){
  const m=new Map(); cs.forEach((c,k)=>{ if(c&&c!=='SKIP') m.set(c,(m.get(c)||[]).concat(names?names[k]:'')); });
  const t=[...m.values()].reduce((s,v)=>s+v.length,0)||1; const g=[...m.entries()].sort((x,y)=>(byCount?y[1].length-x[1].length:0)||PC_ORDER.indexOf(x[0])-PC_ORDER.indexOf(y[0]));
  return <div style={{display:'flex',width:w,height:h,borderRadius:2,overflow:'hidden',boxShadow:`inset 0 0 0 1px ${T.line}`}}>
    {g.map(([c,v])=><Sq key={c} c={c} w={w*v.length/t} h={h} r={0} title={`${pcLabel(c)} · ${v.length}명${names?' · '+v.join(', '):''}`} style={{boxShadow:'none'}}/>)}</div>;
}
// 색 조합 유사도: 두 색 묶음 사이의 평균 최근접 Lab 거리(작을수록 비슷). 화면에 수치는 쓰지 않음
const phLab = (()=>{ const memo={}; return c => { if(memo[c]) return memo[c]; const h=PC[c]&&PC[c][1]; if(!h) return null;
  let [r,g,b]=[1,3,5].map(i=>parseInt(h.substr(i,2),16)/255).map(v=>v>.04045?((v+.055)/1.055)**2.4:v/12.92);
  const f=t=>t>.008856?Math.cbrt(t):7.787*t+16/116; const X=f((r*.4124+g*.3576+b*.1805)/.95047),Y=f(r*.2126+g*.7152+b*.0722),Z=f((r*.0193+g*.1192+b*.9505)/1.08883);
  return memo[c]=[116*Y-16,500*(X-Y),200*(Y-Z)]; }; })();
const comboDist = (A,B) => { const a=A.map(phLab).filter(Boolean), b=B.map(phLab).filter(Boolean); if(!a.length||!b.length) return 999;
  const d=(p,q)=>Math.hypot(p[0]-q[0],p[1]-q[1],p[2]-q[2]); const one=(P,Q)=>P.reduce((s,p)=>s+Math.min(...Q.map(q=>d(p,q))),0)/P.length; return (one(a,b)+one(b,a))/2; };
// 한 행의 독자 색(나 포함). 다른 독자 색은 내가 그 시를 다 읽었을 때만
const lineColors = (a,k,i) => a.tags[k] ? [a.tags[k][i],...WORKS[k].data[i]] : [];
const lineNamesOf = k => [ME,...namesOf(WORKS[k])];

const SecHead = ({t, link, onLink, style}) => <div style={{display:'flex',alignItems:'baseline',gap:16,...style}}>
  <div style={{font:`700 17px ${T.sans}`,color:T.ink,whiteSpace:'nowrap'}}>{t}</div><div style={{flex:1}}></div>
  {link && <span className="pk-link" onClick={onLink} style={{font:`400 14px ${T.sans}`,height:44,display:'inline-flex',alignItems:'center',margin:'-14px 0'}}>{link}</span>}</div>;
const PH_CHIPS = ['SR','SO','SY','SH','SG','SC','SB','SP','A2'];

// ───────── 작품 카드 (상태 3가지) ─────────
function PhWorkCard({a, k, go, w=200, h=236}){
  const W=WORKS[k], s=workState(a,k), n=W.lines.length, p=progOf(a,k);
  const open = () => s==='done' ? go('poem',{pk:k}) : go('read',{pk:k,readInit:contInit(a,k)});
  return <div className="pk-hit pk-card" onClick={open} style={{width:w,height:h,boxSizing:'border-box',background:T.surface,border:`1px solid ${T.line}`,borderRadius:6,padding:'22px 20px 18px',display:'flex',flexDirection:'column'}}>
    <div style={{font:`700 19px/1.4 ${T.serif}`,color:T.ink,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',wordBreak:'keep-all'}}>{W.title}</div>
    <div style={{font:`400 13px ${T.sans}`,color:T.ink2,marginTop:6}}>{workLabel(W)}</div>
    <div style={{flex:1}}></div>
    {s==='done' && <HBar colors={a.tags[k]} st={W.st} w={w-40} h={22}/>}
    {s==='reading' && <div style={{height:4,background:T.line,borderRadius:2}}><div style={{width:`${p/n*100}%`,height:4,background:T.ink2,borderRadius:2}}></div></div>}
    <div style={{font:`400 13px ${T.sans}`,color:T.ink2,marginTop:12,whiteSpace:'nowrap'}}>{s==='done'?`내 바코드 · 독자 ${W.rep.length+1}명의 색 열림`:s==='reading'?`${p} / ${n}행 읽는 중`:'읽기 전'}</div>
    <div style={{font:`400 12px ${T.sans}`,color:T.caption,marginTop:4}}>읽은 독자 {W.rep.length+(s==='done'?1:0)}명</div>
  </div>;
}
const phCss = `.pk-card{transition:border-color .1s}.pk-card:hover{border-color:${T.ink2}}@keyframes phNew{0%{box-shadow:0 0 0 0 rgba(43,43,43,.35)}100%{box-shadow:0 0 0 10px rgba(43,43,43,0)}}`;

// 서재: 책등. 모든 책등은 같은 크기, 행 색은 행 수만큼 높이를 고르게 나눠 위→아래로 채움. 위쪽 라벨에 세로 제목
function PhSpine({a, k, go, w=52, h=250}){
  const W=WORKS[k], cs=a.tags[k], isNew=a.fresh===k, lw=Math.round(w*.5), fs0=Math.max(11,Math.round(w*.24));
  // 긴 제목은 책등 라벨 안에 다 들어가도록 글자를 줄임(제목·시인 모두 보이게)
  const tl=[...W.title.replace(/ /g,'')].length, pl=[...W.poet].length, maxH=Math.round(h*.7)-18; const need=tl*fs0*1.14+8+pl*Math.max(9,fs0-4)*1.1;
  const fs=need>maxH?Math.max(8,Math.floor(fs0*maxH/need)):fs0;
  return <div className="pk-hit ph-spine" onClick={()=>go('poem',{pk:k})} title={`${W.title} · ${W.poet}`} style={{position:'relative',width:w,height:h,flex:'none',borderRadius:'3px 3px 2px 2px',overflow:'hidden',
    boxShadow:'0 1px 0 rgba(0,0,0,.25), 2px 0 3px rgba(0,0,0,.12)',animation:isNew?'phNew 1.2s ease-out .4s 2':'none'}}>
    <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column'}}>{cs.map((c,i)=><div key={i} style={{flex:1,background:c&&PC[c]&&PC[c][1]?PC[c][1]:'#ECE9E1'}}></div>)}</div>
    <div style={{position:'absolute',left:(w-lw)/2,top:Math.round(h*.08),width:lw,maxHeight:Math.round(h*.7),background:'#FBFAF6',borderRadius:1,boxShadow:'0 0 0 1px rgba(0,0,0,.06)',display:'flex',flexDirection:'column',alignItems:'center',padding:'10px 0 8px',boxSizing:'border-box',overflow:'hidden'}}>
      <div style={{writingMode:'vertical-rl',font:`500 ${fs}px/1 ${T.serif}`,letterSpacing:'.12em',color:T.ink,whiteSpace:'nowrap'}}>{W.title.replace(/ /g,'')}</div>
      <div style={{writingMode:'vertical-rl',font:`400 ${fs<fs0?Math.max(7,fs-3):Math.max(9,fs-4)}px/1 ${T.sans}`,letterSpacing:'.08em',color:T.ink2,marginTop:8,whiteSpace:'nowrap'}}>{W.poet}</div></div>
    <div style={{position:'absolute',left:0,right:0,top:Math.round(h*.045),height:1,background:'rgba(255,255,255,.55)'}}></div>
    <div style={{position:'absolute',left:0,right:0,bottom:Math.round(h*.045),height:1,background:'rgba(255,255,255,.55)'}}></div>
    <div style={{position:'absolute',inset:0,pointerEvents:'none',background:'linear-gradient(90deg, rgba(0,0,0,.22) 0%, rgba(255,255,255,.14) 22%, rgba(255,255,255,0) 45%, rgba(0,0,0,.06) 78%, rgba(0,0,0,.24) 100%)'}}></div>
    {isNew && <div style={{position:'absolute',left:'50%',transform:'translateX(-50%)',bottom:Math.round(h*.07),font:`700 ${Math.max(9,Math.round(w*.17))}px ${T.sans}`,color:'#fff',background:T.ink,borderRadius:2,padding:'2px 4px',letterSpacing:'.04em'}}>NEW</div>}
  </div>;
}
// 홈 맨 아래: 시 추가 요청. 제목·시인 두 칸 + 한마디(선택). 보내면 접히고 "요청했어요" 상태. 이미 요청한 시는 목록으로
function PhRequest({a, up}){
  const [t,setT]=React.useState(''); const [p,setP]=React.useState(''); const [m,setM]=React.useState(''); const [open,setOpen]=React.useState(false);
  const reqs=a.requests||[]; const ok=t.trim()&&p.trim();
  const send=()=>{ if(!ok||!up) return; up(s=>({requests:[{title:t.trim(),poet:p.trim(),memo:m.trim(),when:TODAY},...(s.requests||[])]})); setT(''); setP(''); setM(''); setOpen(false); };
  const inp=(v,set,ph,w)=><input value={v} onChange={e=>set(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'&&!e.nativeEvent.isComposing) send(); }} placeholder={ph} style={{width:w,height:48,boxSizing:'border-box',padding:'0 16px',border:`1px solid ${v?T.ink2:T.line}`,borderRadius:8,background:T.surface,outline:'none',font:`400 15px ${T.sans}`,color:T.ink}}/>;
  return <div style={{marginTop:64,marginRight:80,padding:'36px 40px',border:`1px solid ${T.line}`,borderRadius:10,background:T.surface,display:'flex',gap:40,alignItems:'flex-start'}}>
    <div style={{flex:'0 0 300px'}}>
      <div style={{font:`700 20px ${T.serif}`,color:T.ink}}>읽고 싶은 시가 없나요?</div>
      <div style={{font:`400 14px/1.7 ${T.sans}`,color:T.ink2,marginTop:8}}>제목과 시인을 알려 주시면 확인 후 Poco에 올려요. 저작권 허락이 필요한 시는 시간이 걸릴 수 있어요.</div>
      {reqs.length>0 && <div style={{marginTop:18,display:'flex',flexDirection:'column',gap:6}}>
        <div style={{font:`500 12px ${T.sans}`,color:T.caption}}>내가 요청한 시 {reqs.length}</div>
        {reqs.slice(0,4).map((r,i)=><div key={i} style={{display:'flex',alignItems:'baseline',gap:8,font:`400 13px ${T.sans}`,color:T.ink}}><span style={{font:`500 14px ${T.serif}`}}>{r.title}</span><span style={{color:T.caption}}>{r.poet} · 확인 중</span></div>)}</div>}
    </div>
    <div style={{flex:1,minWidth:0}}>
      <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>{inp(t,setT,'시 제목',280)}{inp(p,setP,'시인',180)}
        <PBtn h={48} disabled={!ok} onClick={send} style={{padding:'0 22px'}}>추가 요청</PBtn></div>
      {!open ? <span className="pk-link" onClick={()=>setOpen(true)} style={{display:'inline-flex',alignItems:'center',height:40,marginTop:6,font:`400 13px ${T.sans}`}}>한마디 덧붙이기</span>
        : <textarea value={m} onChange={e=>setM([...e.target.value].slice(0,120).join(''))} placeholder="이 시를 읽고 싶은 이유나 출처(시집 이름 등)를 적어 주세요" rows={2} style={{width:'100%',boxSizing:'border-box',marginTop:10,padding:'12px 16px',border:`1px solid ${T.line}`,borderRadius:8,background:T.surface,outline:'none',resize:'none',font:`400 14px/1.6 ${T.sans}`,color:T.ink}}></textarea>}
    </div>
  </div>;
}
// 책장: 책등을 나란히 세우고 아래에 선반
function PhShelf({a, ks, go, w=52, h=250, gap=6}){
  return <div style={{display:'inline-flex',flexDirection:'column'}}>
    <style>{`.ph-spine{transition:transform .12s}.ph-spine:hover{transform:translateY(-8px)}`}</style>
    {!ks.length && <div style={{font:`400 14px ${T.sans}`,color:T.caption,padding:'0 14px 12px'}}>{a.authed?'아직 담긴 시가 없어요. 시를 끝까지 읽고 색을 고르면 이 서재에 꽂혀요.':'로그인하면 내가 읽은 시가 이 서재에 꽂혀요.'}</div>}
    <div style={{display:'flex',alignItems:'flex-end',gap,padding:'0 14px'}}>{ks.map(k=><PhSpine key={k} a={a} k={k} go={go} w={w} h={h}/>)}</div>
    <div style={{height:10,background:'linear-gradient(#CFC8B8,#B9B19F)',borderRadius:2,boxShadow:'0 3px 6px rgba(0,0,0,.12)'}}></div></div>;
}
const PhShelfItem = ({a,k,go}) => <PhSpine a={a} k={k} go={go}/>;

// 작품 탭(List)의 검색 + 표지 격자를 메인 왼쪽에 그대로 배치
function PhBrowse({a, go}){
  const [q,setQ] = React.useState('');
  const k = q.trim(); const keys = WORK_KEYS.filter(id=>!k || WORKS[id].title.includes(k) || WORKS[id].poet.includes(k));
  return <div>
    <style>{`.pk-cover{transition:transform .12s,box-shadow .12s}.pk-cover:hover{transform:translateY(-10px)}.pk-search::placeholder{color:${T.disabled}}`}</style>
    <label style={{width:'100%',height:56,boxSizing:'border-box',background:T.surface,borderRadius:28,display:'flex',alignItems:'center',gap:14,padding:'0 24px',boxShadow:'0 1px 2px rgba(0,0,0,.05)',cursor:'text'}}>
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke={T.ink} strokeWidth="1.8"><circle cx="9.5" cy="9.5" r="7"></circle><path d="M14.6 14.6L20 20"></path></svg>
      <input className="pk-search" value={q} onChange={e=>setQ(e.target.value)} placeholder="시 제목이나 시인을 검색해 보세요." style={{flex:1,border:'none',outline:'none',background:'transparent',font:`400 17px ${T.sans}`,color:T.ink}}/>
      {q && <div className="pk-hit" onClick={()=>setQ('')} style={{height:44,display:'flex',alignItems:'center',font:`400 14px ${T.sans}`,color:T.caption}}>지우기</div>}
    </label>
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,196px)',justifyContent:'space-between',rowGap:24,marginTop:24}}>
      {keys.map(id=><WorkCover key={id} fav={(a.fav||[]).includes(id)} width={196} w={WORKS[id]} tags={a.tags[id]} mine={!!a.tags[id]} onOpen={()=>go('poem',{pk:id})}/>)}
      {!keys.length && <div style={{gridColumn:'1 / -1',font:`400 15px ${T.sans}`,color:T.ink2}}>「{k}」에 맞는 시가 없어요.</div>}
    </div></div>;
}
// 소제목 아이콘: 회색조 선 아이콘(UI 회색조 규칙)
const PH_ICON = {
  '오늘의 시':<><circle cx="12" cy="12" r="4"></circle><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"></path></>,
  '나의 서재':<><path d="M5 4v16M9 4v16"></path><path d="M13 5l3 15"></path><path d="M3 20h18"></path></>,
  '내가 찜한 시':<path d="M6 3h12v18l-6-4-6 4z"></path>,
  '실시간 베스트':<><path d="M4 5h16M4 10h16M4 15h10M4 20h7"></path></>,
  '시인 랭킹':<><circle cx="12" cy="8" r="4"></circle><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"></path></>,
  '색으로 찾기':<><circle cx="9" cy="9" r="5"></circle><circle cx="15" cy="15" r="5"></circle></>,
};
const phIco = t => PH_ICON[t] ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.ink2} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{flex:'none',alignSelf:'center'}}>{PH_ICON[t]}</svg> : null;
// 가로 줄(캐러셀): 옆으로 스크롤하거나 ‹ › 버튼으로 한 화면씩 이동. 버튼은 더 볼 것이 있을 때만
function PhRow({title, link, onLink, button, children, h}){
  const ref=React.useRef(); const [e,setE]=React.useState({l:false,r:false});
  const upd=()=>{ const el=ref.current; if(!el) return; setE({l:el.scrollLeft>4,r:el.scrollLeft+el.clientWidth<el.scrollWidth-4}); };
  React.useEffect(()=>{ upd(); },[]);
  const go=d=>{ const el=ref.current; el.scrollBy({left:d*(el.clientWidth-120),behavior:'smooth'}); };
  const arrow=(d,on)=>on && <div className="pk-hit ph-arrow" onClick={()=>go(d)} style={{position:'absolute',top:0,bottom:12,[d<0?'left':'right']:0,width:56,display:'flex',alignItems:'center',justifyContent:'center',zIndex:2,
    background:`linear-gradient(${d<0?'90deg':'270deg'}, rgba(239,235,225,.95), rgba(239,235,225,0))`}}>
    <div style={{width:44,height:44,borderRadius:22,background:T.surface,boxShadow:'0 1px 4px rgba(0,0,0,.15)',display:'flex',alignItems:'center',justifyContent:'center',font:`400 22px ${T.sans}`,color:T.ink}}>{d<0?'‹':'›'}</div></div>;
  return <div style={{marginTop:36}}>
    <div style={{display:'flex',alignItems:'baseline',gap:16,paddingRight:80}}><div style={{font:`700 18px ${T.sans}`,color:T.ink,whiteSpace:'nowrap',flex:'none',display:'flex',alignItems:'center',gap:8}}>{phIco(title)}{title}</div>
      {link && <span className="pk-link" onClick={onLink} style={{font:`400 14px ${T.sans}`,height:44,display:'inline-flex',alignItems:'center',margin:'-14px 0'}}>{link}</span>}
      {button && <><div style={{flex:1}}></div><span className="pk-link" onClick={onLink} style={{font:`400 14px ${T.sans}`,height:44,display:'inline-flex',alignItems:'center',margin:'-14px 0'}}>{button}</span></>}</div>
    <div style={{position:'relative',marginTop:14}}>{arrow(-1,e.l)}{arrow(1,e.r)}
      <div ref={ref} onScroll={upd} className="ph-scroll ph-track" style={{display:'flex',gap:20,overflowX:'auto',overflowY:'hidden',paddingTop:14,marginTop:-14,paddingBottom:12,paddingRight:80,scrollSnapType:'x mandatory',height:h}}>{children}</div></div>
  </div>;
}
const phRowCss = `.ph-scroll{scrollbar-width:none}.ph-scroll::-webkit-scrollbar{display:none}.ph-track>*{scroll-snap-align:start;flex:none}`;

// 오늘의 시: 그날 새로 열린 시 1편(시연: 「질투는 나의 힘」). 읽은 사람 수는 실시간으로 늘어남(시연: 3~6초마다 +1~2)
const TODAY_PK = 'sar';
function PhToday({a, go}){
  const k=TODAY_PK, w=WORKS[k], done=!!a.tags[k], p=progOf(a,k);
  const [n,setN]=React.useState(w.readers||96); const [bump,setBump]=React.useState(0);
  React.useEffect(()=>{ let t; const tick=()=>{ t=setTimeout(()=>{ setN(x=>{ const v=x+1+Math.floor(Math.random()*2); WORKS[k].readers=v; return v; }); setBump(b=>b+1); tick(); },3000+Math.random()*3000); }; tick(); return ()=>clearTimeout(t); },[]);
  const cols=done?[[ME,a.tags[k]],...namesOf(w).map((nm,r)=>[nm,w.data.map(row=>row[r])])]:[];
  return <div style={{marginTop:36,paddingRight:80}}>
    <style>{`@keyframes phLive{0%{box-shadow:0 0 0 0 rgba(34,170,90,.5)}100%{box-shadow:0 0 0 8px rgba(34,170,90,0)}}@keyframes phBump{from{transform:translateY(-6px);opacity:.3}to{transform:none;opacity:1}}`}</style>
    <div style={{font:`700 18px ${T.sans}`,color:T.ink,display:'flex',alignItems:'center',gap:8,whiteSpace:'nowrap'}}>{phIco('오늘의 시')}오늘의 시</div>
    <div style={{marginTop:14,height:232,boxSizing:'border-box',background:T.surface,border:`1px solid ${T.line}`,borderRadius:8,padding:'28px 32px',display:'flex',gap:32,position:'relative',overflow:'hidden'}}>
      {w.art && <img src={w.art} alt="" style={{position:'absolute',right:0,top:0,height:'100%',width:'70%',objectFit:'cover',objectPosition:'72% 50%',display:'block',pointerEvents:'none',opacity:1,filter:'grayscale(1)',
        WebkitMaskImage:'linear-gradient(90deg,rgba(0,0,0,0) 0%,rgba(0,0,0,.35) 22%,#000 48%)',maskImage:'linear-gradient(90deg,rgba(0,0,0,0) 0%,rgba(0,0,0,.35) 22%,#000 48%)'}}/>}
      <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column',position:'relative'}}>
        <div style={{font:`400 13px ${T.sans}`,color:T.ink2}}>{TODAY} 새로 열린 시</div>
        <div style={{display:'flex',alignItems:'baseline',gap:14,marginTop:8}}><div style={{font:`400 32px ${T.serif}`,color:T.ink,whiteSpace:'nowrap'}}>{w.title}</div><div style={{font:`700 14px ${T.sans}`,color:T.ink}}>{w.poet}</div><div style={{font:`400 12px ${T.sans}`,color:T.caption}}>{w.year}</div></div>
        <div style={{display:'flex',alignItems:'center',gap:10,marginTop:18}}>
          <span title="지금 읽는 중" style={{width:8,height:8,borderRadius:4,background:'#22AA5A',animation:'phLive 1.6s ease-out infinite'}}></span>
          <span style={{font:`500 16px ${T.sans}`,color:T.ink}}>현재 읽은 사람 <span key={bump} style={{display:'inline-block',animation:'phBump .3s both'}}>{n}</span>명</span>
          <span style={{font:`400 13px ${T.sans}`,color:T.caption}}>· 지금도 읽는 중</span></div>
        <div style={{flex:1}}></div>
        {done ? <div style={{font:`400 14px ${T.sans}`,color:T.ink2}}>내 색을 다 골랐어요. 먼저 읽은 독자 {namesOf(w).length}명의 결과가 열렸어요.</div>
          : <div style={{display:'flex',alignItems:'center',gap:16}}><HBar colors={contInit(a,k)} st={w.st} w={360} h={22} empty/><span style={{font:`400 13px ${T.sans}`,color:T.ink2,whiteSpace:'nowrap'}}>{p} / {w.lines.length}행</span></div>}
      </div>
      {done ? (()=>{ const top=topColorOf(w,a.tags[k]); return <div className="pk-hit" onClick={()=>go('poem',{pk:k})} title="시 상세 보기" style={{display:'flex',gap:16,alignItems:'center',position:'relative',alignSelf:'flex-end',background:'rgba(255,255,255,.88)',padding:'14px 18px',borderRadius:8}}>
          <Sq c={top.c} w={56} r={4}/><div><div style={{font:`400 12px ${T.sans}`,color:T.ink2,whiteSpace:'nowrap'}}>독자들이 가장 많이 고른 색</div><div style={{font:`700 16px ${T.sans}`,color:T.ink,marginTop:2,whiteSpace:'nowrap'}}>{pcLabel(top.c)}</div></div>
        </div>; })()
        : <div style={{display:'flex',alignItems:'flex-end',position:'relative'}}><PBtn style={{background:'#1A7F44',borderColor:'#1A7F44'}} onClick={()=>go('read',{pk:k,readInit:contInit(a,k)})}>{p?'이어 읽기':'읽기 시작'}</PBtn></div>}
    </div>
  </div>;
}

// ───────── 00 메인 · 데스크톱 ─────────
// 위: 질문 제목 + 검색, 아래: 가로 줄 3개(모든 시 · 나의 서재 · 색으로 찾기). 세로로 스크롤
function PhHome({a, up, go}){
  const [q,setQ] = React.useState('');
  const k=q.trim(); const keys=WORK_KEYS.filter(id=>!k || WORKS[id].title.includes(k) || WORKS[id].poet.includes(k));
  const reading=WORK_KEYS.filter(id=>workState(a,id)==='reading'); const lib=libKeys(a);
  const cover=id=><WorkCover key={id} fav={(a.fav||[]).includes(id)} width={232} w={WORKS[id]} tags={a.tags[id]} mine={!!a.tags[id]} onOpen={()=>go('poem',{pk:id})}/>;
  return <PFrame><style>{phCss+phRowCss+`.pk-cover{transition:transform .12s,box-shadow .12s}.pk-cover:hover{transform:translateY(-10px)}.pk-search::placeholder{color:${T.disabled}}`}</style><TopNav go={go} active="home"/>
    <div className="ph-scroll" style={{position:'absolute',left:0,right:0,top:72,bottom:0,overflowY:'auto',overflowX:'hidden'}}>
      <div style={{padding:'40px 0 64px 80px'}}>
        <div style={{paddingRight:80,display:'flex',flexDirection:'column',alignItems:'center'}}>
          <div style={{font:`400 32px/1.4 ${T.serif}`,color:T.ink}}>어떤 시를 읽을까요?</div>
          <label style={{marginTop:24,width:'100%',height:60,boxSizing:'border-box',background:T.surface,borderRadius:30,display:'flex',alignItems:'center',gap:14,padding:'0 26px',boxShadow:'0 1px 2px rgba(0,0,0,.05)',cursor:'text'}}>
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke={T.ink} strokeWidth="1.8"><circle cx="9.5" cy="9.5" r="7"></circle><path d="M14.6 14.6L20 20"></path></svg>
            <input className="pk-search" value={q} onChange={e=>setQ(e.target.value)} placeholder="시 제목이나 시인을 검색해 보세요." style={{flex:1,border:'none',outline:'none',background:'transparent',font:`400 17px ${T.sans}`,color:T.ink}}/>
            {q && <div className="pk-hit" onClick={()=>setQ('')} style={{height:44,display:'flex',alignItems:'center',font:`400 14px ${T.sans}`,color:T.caption}}>지우기</div>}</label>
        </div>
        {k ? <PhRow key={'q'+k} title={`‘${k}’ 검색 결과 ${keys.length}편`}>{keys.length?keys.map(cover):<div style={{font:`400 15px ${T.sans}`,color:T.ink2,height:44,display:'flex',alignItems:'center'}}>맞는 시가 없어요.</div>}</PhRow> : <>
          <PhToday a={a} go={go}/>
          <PhRow title="나의 서재" link="서재 전체 보기" onLink={()=>go('lib')}><div style={{paddingTop:10}}><PhShelf a={a} ks={lib} go={go}/></div></PhRow>
          <PhRow title="실시간 베스트" button="모든 시 보러가기" onLink={()=>go('list')}>{BEST_KEYS.map((id,i)=><WorkCover key={id} fav={(a.fav||[]).includes(id)} width={232} w={WORKS[id]} tags={a.tags[id]} mine={!!a.tags[id]} rank={i+1} trend={BEST_TREND[i]} onOpen={()=>go('poem',{pk:id})}/>)}</PhRow>
          {(a.fav||[]).length>0 && <PhRow title="내가 찜한 시">{a.fav.map(id=><div key={id} className="pk-hit pk-card" onClick={()=>go('poem',{pk:id})}
            style={{width:280,height:96,boxSizing:'border-box',background:T.surface,border:`1px solid ${T.line}`,borderRadius:6,padding:'0 24px',display:'flex',flexDirection:'column',justifyContent:'center',gap:6}}>
            <div style={{font:`400 20px ${T.serif}`,color:T.ink,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{WORKS[id].title}</div>
            <div style={{display:'flex',alignItems:'baseline',gap:8}}><span style={{font:`700 13px ${T.sans}`,color:T.ink2}}>{WORKS[id].poet}</span><span style={{font:`400 12px ${T.sans}`,color:T.caption}}>{WORKS[id].year}</span></div></div>)}</PhRow>}
          <PhRow title="시인 랭킹" button="모든 시인 보러가기" onLink={()=>go('poets')}>{poetRank().map((p,i)=>{ const tr=POET_TREND[i]||{k:'same',n:0}; return <div key={p.poet} className="pk-hit" onClick={()=>go('poets',{poet:p.poet})} style={{width:232,display:'flex',flexDirection:'column'}}>
            <div style={{position:'relative',width:232,height:232,borderRadius:6,overflow:'hidden',background:'#E3DED2',display:'flex',alignItems:'center',justifyContent:'center'}}>
              {PHOTO_POETS[p.poet] ? <img src={PHOTO_POETS[p.poet]} alt={p.poet} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'50% 20%',display:'block'}}/> : <span style={{font:`500 56px ${T.serif}`,color:T.ink2}}>{p.poet.slice(-2)}</span>}
              <div style={{position:'absolute',left:12,top:12,minWidth:34,height:34,padding:'0 10px',boxSizing:'border-box',borderRadius:4,background:'rgba(0,0,0,.72)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',font:`700 18px ${T.sans}`}}>{i+1}</div></div>
            <div style={{display:'flex',alignItems:'baseline',gap:6,marginTop:14}}><span style={{font:`700 17px ${T.sans}`,color:T.ink,whiteSpace:'nowrap'}}>{p.poet}</span>
              <span style={{font:`400 14px ${T.sans}`,color:T.caption,display:'inline-flex',alignItems:'center',gap:3}}>(
                {tr.k==='new' ? <i style={{font:`700 italic 13px ${T.sans}`,color:T.ink}}>NEW</i> : <>
                  {tr.k==='up' && <svg width="10" height="9" viewBox="0 0 14 12"><path d="M7 1l6 10H1z" fill="#FF2D55"></path></svg>}
                  {tr.k==='down' && <svg width="10" height="9" viewBox="0 0 14 12"><path d="M7 11L1 1h12z" fill="#2EA8FF"></path></svg>}
                  {tr.k==='same' && <svg width="10" height="9" viewBox="0 0 14 12"><rect x="2" y="5" width="10" height="2" fill={T.caption}></rect></svg>}
                  <span>{tr.n}</span></>})</span></div>
            <div style={{display:'flex',gap:6,marginTop:10,flexWrap:'wrap'}}>{p.works.slice(0,2).map(t=><span key={t} style={{font:`400 13px ${T.sans}`,color:T.ink2,background:T.band,borderRadius:4,padding:'5px 10px',whiteSpace:'nowrap'}}>{t}</span>)}</div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginTop:12,font:`400 13px ${T.sans}`,color:T.ink2}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.ink2} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9h3v11H4zM7 10l4-7c1.5 0 2.5 1 2.5 2.5V9H19a2 2 0 012 2.3l-1.2 7A2 2 0 0117.8 20H7z"></path></svg>읽은 독자 {p.readers}</div>
          </div>; })}</PhRow>
          <PhRow title="색으로 찾기" link="전체 팔레트" onLink={()=>go('find')}><div style={{display:'flex',gap:8,paddingBottom:8}}>{PC_ORDER.filter(c=>c!=='SKIP').map(c=><div key={c} className="pk-hit pk-chip" onClick={()=>go('find',{fc:c})}><Sq c={c} w={44} r={4} title={pcLabel(c)}/></div>)}</div></PhRow>
          <PhRequest a={a} up={up}/>
        </>}
      </div>
    </div>
  </PFrame>;
}

// ───────── 00 메인 · 모바일 (390 폭, 세로로 쌓임 · 하단 탭) ─────────
function PhHomeM({a, go=()=>{}}){
  const ck='jil', CW=WORKS[ck], n=CW.lines.length, p=progOf(a,ck), next=(a.prog[ck]||[]).length;
  const lib = libKeys(a).slice(0,3);
  return <div style={{position:'relative',width:390,height:1760,background:PAPER,overflow:'hidden',fontFamily:T.sans,color:T.ink}}><PocoStyle/><style>{phCss}</style>
    <div style={{height:56,display:'flex',alignItems:'center',padding:'0 20px',borderBottom:`1px solid ${T.line}`}}><Wordmark size={19}/><div style={{flex:1}}></div>
      <div style={{width:28,height:28,borderRadius:'50%',background:T.band,display:'flex',alignItems:'center',justifyContent:'center',font:`500 12px ${T.sans}`,color:T.ink2}}>{ME==='김민지'?'민':ME_INI}</div></div>
    <div style={{padding:'24px 20px 120px'}}>
      <SecHead t="이어 읽기"/>
      <div style={{marginTop:12,background:T.surface,border:`1px solid ${T.line}`,borderRadius:8,padding:20}}>
        <div style={{font:`700 22px ${T.serif}`}}>「{CW.title}」</div>
        <div style={{font:`400 13px ${T.sans}`,color:T.ink2,marginTop:4}}>{workLabel(CW)} · {p} / {n}행</div>
        <div style={{font:`400 16px/1.6 ${T.serif}`,marginTop:14,wordBreak:'keep-all'}}>{next+1}. {CW.lines[next]}</div>
        <div style={{marginTop:14}}><HBar colors={contInit(a,ck)} st={CW.st} w={308} h={20} empty/></div>
        <PBtn onClick={()=>go('read',{pk:ck,readInit:contInit(a,ck)})} style={{width:'100%',marginTop:18}}>이어 읽기</PBtn>
      </div>
      <SecHead t="작품" link="모두 보기" style={{marginTop:36}}/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:12}}>{['cpd','jil','hk1','hk3'].map(k=><PhWorkCard key={k} a={a} k={k} go={go} w={169} h={200}/>)}</div>
      <SecHead t="나의 서재" link="전체 보기" style={{marginTop:36}}/>
      <div style={{marginTop:14}}><PhShelf a={a} ks={lib} go={go} w={44} h={210}/></div>
      <SecHead t="색으로 찾기" link="전체 팔레트" style={{marginTop:36}}/>
      <div style={{font:`400 13px ${T.sans}`,color:T.ink2,marginTop:8}}>색을 고르면 그 색으로 고른 행이 나와요.</div>
      <div style={{marginTop:14}}><Palette sw={38} gap={4} cg={8}/></div>
    </div>
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:64,borderTop:`1px solid ${T.line}`,background:'#F4F1E8',display:'grid',gridTemplateColumns:`repeat(${NAV_ITEMS.length},1fr)`}}>
      {NAV_ITEMS.map(([k,l])=><div key={k} style={{display:'flex',alignItems:'center',justifyContent:'center',font:`${k==='home'?700:400} 13px ${T.sans}`,color:k==='home'?T.ink:T.ink2}}>{l}</div>)}</div>
  </div>;
}

// ───────── 시인: 왼쪽 시인 목록(사진·시 편수·독자 수), 오른쪽 선택한 시인의 프로필·독자들이 고른 색·시 표지 ─────────
const poetPhoto = (p, s, radius=8) => <div style={{width:s,height:s,flex:'none',borderRadius:radius,overflow:'hidden',background:'#E3DED2',display:'flex',alignItems:'center',justifyContent:'center'}}>
  {PHOTO_POETS[p] ? <img src={PHOTO_POETS[p]} alt={p} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'50% 20%',display:'block'}}/> : <span style={{font:`500 ${Math.round(s*.34)}px ${T.serif}`,color:T.ink2}}>{p.slice(-2)}</span>}</div>;
function PhPoets({a, up, go}){
  const [q,setQ]=React.useState(''); const [sort,setSort]=React.useState('pop');
  const rank=poetRank(); // 독자 수 순(랭킹) · 가나다순
  let list=rank.slice(); if(sort==='name') list=list.sort((x,y)=>x.poet.localeCompare(y.poet,'ko'));
  const k=q.trim(); list=list.filter(p=>!k||p.poet.includes(k));
  const sel=list.find(p=>p.poet===a.poet)||list[0]; const selP=sel&&sel.poet;
  const works=WORK_KEYS.filter(id=>WORKS[id].poet===selP);
  const open=id=>go('poem',{pk:id});
  const rk=rank.findIndex(p=>p.poet===selP)+1; const tr=POET_TREND[rk-1]||{k:'same',n:0};
  return <PFrame><TopNav go={go} active="poets"/>
    <style>{`.pk-cover{transition:transform .12s,box-shadow .12s}.pk-cover:hover{transform:translateY(-10px)}.pk-search::placeholder{color:${T.disabled}}.pk-ls{scrollbar-width:none}.pk-ls::-webkit-scrollbar{display:none}`}</style>
    <div style={{position:'absolute',left:104,top:104,width:340,bottom:40,display:'flex',flexDirection:'column'}}>
      <div style={{font:`700 30px ${T.serif}`,color:T.ink}}>시인</div>
      <label style={{marginTop:22,height:52,boxSizing:'border-box',background:T.surface,borderRadius:26,display:'flex',alignItems:'center',gap:12,padding:'0 20px',boxShadow:'0 1px 2px rgba(0,0,0,.05)',cursor:'text'}}>
        <svg width="18" height="18" viewBox="0 0 22 22" fill="none" stroke={T.ink} strokeWidth="1.8"><circle cx="9.5" cy="9.5" r="7"></circle><path d="M14.6 14.6L20 20"></path></svg>
        <input className="pk-search" value={q} onChange={e=>setQ(e.target.value)} placeholder="시인 이름" style={{flex:1,minWidth:0,border:'none',outline:'none',background:'transparent',font:`400 16px ${T.sans}`,color:T.ink}}/></label>
      <div style={{display:'flex',alignItems:'center',margin:'18px 0 6px'}}><span style={{font:`400 13px ${T.sans}`,color:T.caption}}>시인 {list.length}명</span><div style={{flex:1}}></div>
        <div style={{display:'flex',border:`1px solid ${T.line}`,borderRadius:6,overflow:'hidden'}}>{[['pop','랭킹순'],['name','가나다순']].map(([m,l])=><div key={m} className="pk-hit" onClick={()=>setSort(m)} style={{height:36,padding:'0 12px',display:'flex',alignItems:'center',font:`${sort===m?700:400} 13px ${T.sans}`,background:sort===m?T.band:T.surface,color:sort===m?T.ink:T.ink2}}>{l}</div>)}</div></div>
      <div className="pk-ls" style={{flex:1,overflow:'auto',borderTop:`1px solid ${T.line}`}}>
        {list.map(p=>{ const on=p.poet===selP; const r=rank.findIndex(x=>x.poet===p.poet)+1;
          return <div key={p.poet} className="pk-hit pk-row" onClick={()=>up({poet:p.poet})} style={{height:64,display:'flex',alignItems:'center',gap:12,padding:'0 12px',borderBottom:`1px solid ${T.line}`,background:on?T.band:undefined}}>
            {sort==='pop' && <span style={{width:22,font:`700 14px ${T.sans}`,color:T.caption,textAlign:'center'}}>{r}</span>}
            {poetPhoto(p.poet,40,20)}
            <div style={{flex:1,minWidth:0}}><div style={{font:`${on?700:500} 15px ${T.sans}`,color:T.ink}}>{p.poet}</div><div style={{font:`400 12px ${T.sans}`,color:T.caption,marginTop:2,whiteSpace:'nowrap'}}>{p.n?`시 ${p.n}편`:'수록 예정'} · 독자 {p.readers}</div></div></div>; })}
        {!list.length && <div style={{font:`400 14px ${T.sans}`,color:T.ink2,padding:'16px 0'}}>‘{k}’ 시인을 찾지 못했어요.</div>}
      </div>
    </div>
    {sel && <div className="pk-ls" style={{position:'absolute',left:520,top:104,right:104,bottom:0,overflowY:'auto',paddingBottom:48}}>
      <div style={{display:'flex',alignItems:'center',gap:28}}>
        {poetPhoto(selP,136,8)}
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'baseline',gap:12}}><div style={{font:`400 32px ${T.serif}`,color:T.ink}}>{selP}</div></div>
          <div style={{font:`400 14px ${T.sans}`,color:T.ink2,marginTop:8}}>{sel.n?`Poco에 있는 시 ${sel.n}편`:'아직 수록된 시가 없어요. 곧 열립니다.'} · 읽은 독자 {sel.readers}명</div>
          {(()=>{ const rd=works.filter(id=>a.tags[id]); const cs=rd.flatMap(id=>[...a.tags[id],...WORKS[id].data.flat()]);
            const nm=rd.flatMap(id=>[...a.tags[id].map(()=>ME),...WORKS[id].data.flatMap(row=>row.map((_,r)=>namesOf(WORKS[id])[r]))]);
            return <div style={{marginTop:18}}>
              <div style={{font:`500 13px ${T.sans}`,color:T.ink2,marginBottom:8}}>이 시인의 시에서 독자들이 고른 색</div>
              {rd.length===works.length ? <PhStack cs={cs} names={nm} w={620} h={22}/> : <div style={{position:'relative',width:620,height:22}}>
                <div style={{position:'absolute',inset:0,filter:'grayscale(1) blur(5px)',opacity:.6,pointerEvents:'none'}}><PhStack cs={works.flatMap(id=>WORKS[id].data.flat())} names={works.flatMap(id=>WORKS[id].data.flatMap(row=>row.map(()=>'')))} w={620} h={22}/></div>
                <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <svg width="14" height="16" viewBox="0 0 14 16" fill="none" stroke={T.ink} strokeWidth="1.6"><rect x="1.5" y="7" width="11" height="8" rx="1.5" fill="#FBFAF6"></rect><path d="M4 7V4.5a3 3 0 016 0V7"></path></svg></div></div>}
              {rd.length<works.length && <div style={{font:`400 12px ${T.sans}`,color:T.caption,marginTop:8}}>이 시인의 시 {works.length}편을 다 읽으면 색이 열려요. ({rd.length}/{works.length})</div>}</div>; })()}
        </div>
      </div>
      {works.length>0 && <><div style={{font:`700 18px ${T.sans}`,color:T.ink,marginTop:40}}>시 {works.length}편</div>
      <div style={{display:'flex',gap:28,marginTop:16,flexWrap:'wrap'}}>{works.map(id=><WorkCover key={id} fav={(a.fav||[]).includes(id)} width={200} w={WORKS[id]} tags={a.tags[id]} mine={!!a.tags[id]} onOpen={()=>open(id)}/>)}</div></>}
    </div>}
  </PFrame>;
}

// ───────── 04 나의 서재 (F4) ─────────
function PhLib({a, go}){
  const ks = libKeys(a); const reading = WORK_KEYS.filter(k=>workState(a,k)==='reading');
  return <PFrame><style>{phCss}</style><TopNav go={go} active="lib"/>
    <div style={{position:'absolute',left:104,top:112,right:104}}>
      <div style={{font:`700 30px ${T.serif}`,color:T.ink}}>나의 서재</div>
      <div style={{font:`400 15px ${T.sans}`,color:T.ink2,marginTop:10}}>다 읽은 시의 바코드 {ks.length}개. 누르면 그 시의 내 바코드가 열려요.</div>
      <div style={{marginTop:48}}><PhShelf a={a} ks={ks} go={go} w={64} h={330} gap={8}/></div>
      {reading.length>0 && <><SecHead t="읽는 중" style={{marginTop:48}}/>
        <div style={{display:'flex',gap:24,marginTop:14}}>{reading.map(k=><div key={k} className="pk-hit" onClick={()=>go('read',{pk:k,readInit:contInit(a,k)})} style={{display:'flex',alignItems:'center',gap:16,minHeight:44}}>
          <HBar colors={contInit(a,k)} st={WORKS[k].st} w={280} h={22} empty/><div style={{font:`500 15px ${T.serif}`,color:T.ink}}>「{WORKS[k].title}」</div><div style={{font:`400 13px ${T.sans}`,color:T.ink2,whiteSpace:'nowrap'}}>{progOf(a,k)} / {WORKS[k].lines.length}행</div></div>)}</div></>}
    </div>
  </PFrame>;
}
Object.assign(window,{PhRequest,BEST_KEYS,BEST_TREND,POET_TREND,PHOTO_POETS,poetRank,poetPhoto,PhPoets,PhSpine,PhShelf,PhToday,PhRow,PhBrowse,VW,PH_INIT,HBar,PhStack,comboDist,lineColors,lineNamesOf,SecHead,PhWorkCard,PhShelfItem,PhHome,PhHomeM,PhLib,workState,progOf,contInit,workLabel,libKeys});
