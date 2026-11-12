# 변경 내역 (원본 대비)

원본 위치: `~/Downloads/POCO/uploads/export/` (화면 코드·HTML), `~/Downloads/POCO/uploads/assets/` (이미지).
원본 폴더와 standalone HTML은 수정하지 않았습니다.

`uploads/export/`는 standalone HTML(`Poco Canvas (standalone).html`)에 들어 있던 코드와 15개 JSX 파일 모두 바이트 단위로 같아서 원본 소스로 삼았습니다. 이미지 24개도 standalone에 들어 있던 것과 같은 파일입니다.

| 파일 | 변경 내용 | 이유 |
|---|---|---|
| `public/index.html` (← `uploads/Poco Prototype.html`) | 원본 그대로 + 아래 세 가지만 추가·교체: ① 이미지 주소 meta 27개와 `window.__resources` 스크립트 한 줄, ② React·Babel을 `vendor/`로, ③ Google Fonts를 `vendor/fonts/fonts.css`로 | 앱을 첫 화면으로. ①은 원본 프로토타입 파일에 빠져 있어서, 없으면 앱이 시작하자마자 멈춤(로고·시인 사진·로그인 아이콘 주소를 이 표에서 읽음) |
| `public/canvas.html` (← `uploads/export/Poco Canvas.html`) | 이미지·파비콘 경로 `../assets/` → `assets/` (28곳) | export 폴더 밖에 있던 assets를 사이트 안으로 옮겨서 |
| `public/canvas.html` | `window.__resources`를 meta 태그에서 만드는 스크립트 한 줄 추가 | Claude Design이 실행 시 만들어 주던 이미지 주소 표. 이게 없으면 로고·시인 사진·로그인 아이콘이 깨짐 |
| `public/canvas.html` | React·ReactDOM·Babel `<script src>`를 unpkg → `vendor/` 로컬 파일로 | 오프라인 실행. 같은 버전이고, 원본의 SRI(integrity) 값을 그대로 두어도 통과함 = 파일 동일 |
| `public/canvas.html` | Google Fonts `<link>` 2개 → `vendor/fonts/fonts.css` 1개 | 오프라인 실행. 같은 폰트(Noto Sans KR·Noto Serif KR, 400/500/700) |
| `public/.design-canvas.state.json` | 새 파일 `{"sections":{}}` | 캔버스가 시작할 때 이 파일을 찾음. 없으면 콘솔에 404 에러가 남. 빈 값은 "기본 배치"와 같은 뜻이라 화면 변화 없음 |
| `public/poco-login.jsx` 32행 | `go(a.next\|\|'home')` → `go(a.next\|\|'home',{authed:true})` | **버그 수정.** 회원가입·로그인 직후 이동할 때 "방금 로그인됨"을 함께 넘김 |
| `public/poco-screens.jsx` 267행 | 로그인 검사에 `&& !ex0.authed` 추가 | 위와 짝. 이동 함수가 클릭 전 상태(로그아웃)를 보고 로그인 화면으로 되돌리던 문제. 로그아웃 상태에서 다른 화면을 열면 로그인 화면이 먼저 나오는 동작은 그대로 |
| `public/index.html` (앱) | 화면 맞춤 방식 변경: 1440×900이 다 보이게 축소하되, 남는 가로·세로 공간까지 화면을 늘려 채움. 회색 테두리 그림자 제거 | 창 비율에 따라 위아래·좌우에 생기던 빈 띠 제거 |
| `public/poco-ui.jsx` `PFrame` | 크기 `1440×900` → `var(--pw,1440px)×var(--ph,900px)` | 위와 짝. 값이 없으면(캔버스) 원래 1440×900 그대로 |
| `public/poco-onb.jsx` | 온보딩 화면을 가로 가운데 정렬로 감쌈 | 온보딩은 고정 좌표 배치라 넓은 창에서 왼쪽으로 쏠렸음 |
| `public/poco-me.jsx` | 문구 삭제 5개: 도움말 소개("Poco = POem + COlor. …"), 나의 서재·나의 색 띠·색 취향 분석·다시 읽기 기록 설명 | 요청에 따라 삭제 |
| `public/poco-home.jsx` | 문구 삭제: "요청이 많은 시부터 올라가요. 올라가면 알림으로 알려 드릴게요." | 요청에 따라 삭제 |
| `public/poco-explore.jsx` | 구절로 찾기 결과의 "읽으면 색이 열려요" 삭제(같은 폭 빈칸으로 두어 정렬 유지) | 요청에 따라 삭제. 시인 페이지의 "이 시인의 시 N편을 다 읽으면 색이 열려요"는 다른 문장이라 유지 |
| `public/*.jsx` 나머지 8개 | 변경 없음 | – |
| `public/assets/*` (24개) | 변경 없음 | – |
| `package.json`, `scripts/*.mjs`, `.gitignore` | 새 파일 | `npm install` / `npm run dev` / `npm run build` 실행용 |

## 검증 결과 (2026-10-25)

원본 standalone HTML과 새 사이트를 나란히 띄워 비교했습니다.

- 화면 36개, 이미지 81개(깨진 것 0), 페이지 전체 글자 수 39,905자 모두 같음
- 글자 차이는 두 곳뿐: "현재 읽은 사람 N명" 카운터와 "10월 19일 18:1x" 시각. 둘 다 시간이 지나면 바뀌는 시연용 값
- Noto Sans KR·Noto Serif KR 로드 확인
- 콘솔 에러 0건, 네트워크 요청 전부 200
- 구절로 찾기 칩 클릭 → 검색어·결과 갱신 확인
- `npm run build` → `dist/` 정적 파일로 서비스 확인

### 앱(index.html) 검증

- 첫 방문 상태에서 온보딩 4행 색 고르기 → 바코드 → 다른 독자 비교 → 회원가입 → 홈까지 직접 클릭으로 통과
- 앱 화면 19종(홈, 작품 목록, 시인, 색으로 찾기, 비슷한 시, 구절로 찾기, 시 상세 2편, 읽기·태깅, 완료, 다시 읽기, 바코드, 나란히 보기, 작품 공간, 서재, 마이페이지, 다른 독자 프로필, 도움말, 설정) 모두 내용이 그려지고 에러 0건
- 원본 코드의 버그 1건 발견 → 수정: 회원가입 버튼이 직전 로그인 상태를 기준으로 판단해서 로그인 화면을 한 번 더 보여줌 (`poco-login.jsx` 32행 `done`). 수정 후 확인: 첫 방문 → 온보딩 → 회원가입 한 번 클릭 → 바로 홈. 로그아웃 상태에서 마이페이지 → 로그인 화면 → 로그인 한 번 → 마이페이지. 콘솔 에러 0건
- 원본(`uploads/`)의 같은 파일은 수정하지 않음. Claude Design 쪽에서도 고치려면 위 두 줄을 똑같이 바꾸면 됨

## 검수 반영 (2026-11-09)

검증 에이전트(브라우저 UI·기능 검수)가 찾은 문제를 고치고, 로컬에서 2회 재검증해 모두 통과했습니다. `public/`과 `docs/`에 같은 파일을 넣었습니다.

| ID | 파일 | 변경 |
|---|---|---|
| B1 | poco-screens.jsx, poco-read.jsx, poco-me.jsx | 내 기록(태깅·진행·찜·팔로우·반응 등)을 localStorage `poco.state.v1`에 저장해 새로고침 뒤에도 유지. 태깅 중에도 행마다 진행 저장. 설정 > 내 기록 > 행별 색 기록 CSV 내보내기(HEX sRGB, UTF-8 BOM) |
| B2 | poco-read.jsx | 다음 행으로 넘어가는 0.26초 동안의 두 번째 클릭 무시(같은 행 덮어쓰기·'색 변경' 기록 방지) |
| B4 | poco-login.jsx | 온보딩 바코드를 가입 후 「사랑가」 11~14행 진행으로 저장 |
| B5 | poco-explore.jsx | 구절로 찾기에서 읽는 중인 시를 '읽는 중'과 내 색으로 표시 |
| B6 | poco-me.jsx, poco-poem.jsx | 내 반응을 누르면 내 말풍선이 열리고 그 행으로 스크롤 |
| B7·B8 | poco-data.jsx, poco-poem.jsx, poco-read.jsx | 내 이유 ↔ 행 반응 목록·프로필 반응 수 동기화(쓰기·고치기·지우기). 친구 이유는 같은 행 반응 글과 같은 내용 사용 |
| B9 | poco-read.jsx, poco-me.jsx | '또 읽기'로 바뀐 행을 다시 읽기 기록에 남김. '고친 행'은 행 수 기준 |
| B11 | poco-explore.jsx | '모든 독자' → '다른 독자' |
| B12 | poco-screens.jsx | 시 목록 '참여 많은 순'을 독자 수 기준으로, 검색해도 순위 번호 유지 |
| B13 | poco-read.jsx | 설정 글자 크기를 읽기·태깅·다시 읽기에 반영. 긴 시는 화면에 맞게 자동 축소(진행 표시와 겹침 해소) |
| B14·B15 | poco-home.jsx, poco-me.jsx | 긴 책등 제목 글자 축소, '이어 읽기' 한 줄 |
| B17 | poco-poem.jsx, poco-login.jsx, poco-screens.jsx | Esc로 말풍선 닫기, 가입 단계 뒤로가기, 로그아웃 상태 메뉴 클릭 시 안내 문구 |
| B18 | poco-login.jsx | 이메일 형식·가입 비밀번호 8자 검사 |
| 기타 | poco-me.jsx | 설정 화면 로그아웃도 로그인 기록 삭제 |

그대로 둔 것: 모바일 반응형(B3), 팔레트 A2 두 칸(B10, 코드 주석상 의도), 시연용 날짜 고정(B16).

## 아이디·비밀번호 계정 + Supabase 저장 (2026-11-12)

가짜 로그인(누르면 바로 '김민지'로 로그인)을 실제 계정으로 바꿨습니다. 이메일·소셜 계정 없이 아이디와 비밀번호만 받습니다.

| 파일 | 변경 |
|---|---|
| `supabase/setup.sql` (새 파일) | Supabase SQL Editor에서 한 번 실행. 표 3개(`poco_users`·`poco_sessions`·`poco_states`)와 가입·로그인·저장 함수(`poco_*`). 표는 RLS로 잠겨 있고 브라우저는 함수로만 접근. 비밀번호는 bcrypt 해시. 연구자용 보기 `poco_line_tags`(계정 × 시 × 행 색 코드) |
| `public/poco-config.js` (새 파일) | Supabase Project URL과 anon(publishable) 키를 넣는 곳 |
| `public/poco-api.js` (새 파일) | 가입·로그인·로그아웃·계정 삭제·기록 저장/불러오기. 설정이 비어 있으면 localhost에서만 브라우저 안 연습용 저장소로 동작 |
| `public/poco-login.jsx` | 소셜·이메일 버튼 → 아이디·비밀번호 폼. 가입 시 아이디 중복을 입력 중에 확인(한글·영문·숫자·밑줄 2~16자, 비밀번호 6자 이상) |
| `public/poco-screens.jsx` | 새 계정은 빈 서재에서 시작(시연용 읽은 시 12편 없음). 기록이 바뀌면 서버에도 저장. 화면 오류 시 '홈으로' 안내 |
| `public/poco-data.jsx`, `poco-ui.jsx`, `poco-home.jsx`, `poco-me.jsx` | 화면의 내 이름 = 로그인한 아이디. 로그아웃·계정 삭제가 서버 계정 기준으로 동작 |
| `public/poco-explore.jsx` | 다 읽은 시가 없을 때 '비슷한 색 조합 찾기' 안내 화면 |
| `public/index.html` | 시작할 때 서버 기록을 먼저 내려받음. `#home` 같은 주소로 로그인 없이 시연 상태로 들어가던 길은 없앰(`#onb`는 온보딩 다시 보기) |

그대로 둔 것: 다른 독자의 색·반응은 여전히 시연용 데이터(가입한 사람들끼리 서로의 색이 보이지는 않음), 날짜 표시 '10월 19일' 고정. 캔버스(`canvas.html`)는 예전 시연 상태 그대로.
