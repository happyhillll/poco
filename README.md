# Poco — 로컬 실행

Claude Design에서 만든 **Poco 앱**을 내 Mac에서 실제로 써 볼 수 있게 띄우는 폴더입니다.
디자인 작업용 캔버스(36개 화면을 한 판에 늘어놓은 것)도 따로 열 수 있습니다.
디자인 코드는 손대지 않았고, 실행에 필요한 부분만 바꿨습니다(→ [CHANGES.md](CHANGES.md)).

## 1. 준비 (처음 한 번)

Node.js가 필요합니다. 터미널에서 확인하세요.

```bash
node -v
```

`v18` 이상이 나오면 다음 단계로 넘어가세요. `command not found`가 나오면 둘 중 하나로 설치합니다.

- 공식 설치 파일: https://nodejs.org 에서 **LTS** 버전을 받아 설치
- Homebrew 사용 시:

```bash
brew install node
```

## 2. 설치 (처음 한 번)

```bash
cd ~/Downloads/POCO/app
npm install
```

설치가 끝나면 `vendor: React 18.3.1, Babel 7.29.0, Noto Sans/Serif KR → public/vendor` 줄이 보입니다.

## 3. 실행

```bash
npm run dev
```

끄려면 터미널에서 `Ctrl + C`를 누르세요.

| 주소 | 내용 |
|---|---|
| **http://localhost:5175** | **Poco 앱.** 온보딩 → 회원가입 → 홈 → 시 읽기·태깅 → 완료 → 마이페이지까지 실제로 클릭하며 사용 |
| http://localhost:5175/canvas.html | 디자인 캔버스(화면 36개를 한 판에, 화면별 설계 주석 포함) |

### 앱 사용법
- 화면은 1440×900 크기로 디자인되어 있어서 브라우저 창 크기에 맞춰 자동으로 확대·축소됩니다.
- 회원가입은 아이디 + 비밀번호만 받습니다(이메일·소셜 없음). 계정과 기록은 Supabase에 저장됩니다(`public/poco-config.js`, 서버 함수는 `supabase/setup.sql`).
- 로컬에서 실제 서버를 건드리지 않고 시험하려면 Console에서 `localStorage.setItem('poco.mock','1')` 후 새로고침하세요. 이 브라우저 안의 연습용 저장소를 씁니다(localhost에서만).
- 로그인·온보딩 완료 상태는 브라우저에 저장됩니다. **처음부터 다시** 보려면 개발자 도구(⌥⌘I) → Console에서 아래를 실행하고 새로고침하세요.
  ```js
  Object.keys(localStorage).filter(k=>k.startsWith('poco')).forEach(k=>localStorage.removeItem(k))
  ```
- 원본 디자인 코드에는 회원가입 후 로그인 화면이 한 번 더 나오는 버그가 있었는데, 이 폴더에서는 고쳤습니다([CHANGES.md](CHANGES.md) 참고).

### 캔버스 사용법 (canvas.html)
- 이동: 빈 배경을 드래그하거나 트랙패드 두 손가락 스크롤
- 확대·축소: 트랙패드 핀치 또는 마우스 휠
- 화면 이름표 옆 확대 버튼을 누르면 그 화면만 크게 보기(←/→로 넘기기, Esc로 닫기)
- 각 화면 안의 버튼, 색 칩, 검색 등은 원본과 똑같이 동작합니다

## 4. 배포용 파일 만들기 (선택)

```bash
npm run build
npm run preview
```

`docs/` 폴더에 정적 파일만 생깁니다. `npm run preview`는 그 결과를 http://localhost:4175 에서 미리 봅니다.

### GitHub Pages로 공개 (https://happyhillll.github.io/poco/)
이 폴더는 GitHub 저장소 `happyhillll/poco`로 올리고, GitHub Pages가 `docs/` 폴더를 서비스합니다.
화면을 고친 뒤 다시 올릴 때:
1. `npm run build` (docs/ 갱신)
2. GitHub Desktop에서 변경 내용을 Commit → **Push origin**
3. 1~2분 뒤 https://happyhillll.github.io/poco/ 에 반영

## 폴더 구성

```
app/
├─ package.json          실행 명령과 의존성
├─ scripts/
│  ├─ vendor.mjs         node_modules의 React·Babel·폰트를 public/vendor로 복사
│  └─ build.mjs          public/ → docs/ 복사 (GitHub Pages용)
└─ public/               ← 실제로 서비스되는 사이트
   ├─ index.html         Poco 앱 (원본: uploads/Poco Prototype.html)
   ├─ canvas.html        디자인 캔버스 (원본: uploads/export/Poco Canvas.html)
   ├─ *.jsx              화면 코드 15개 (원본 그대로)
   ├─ assets/            이미지 24개 (원본: uploads/assets)
   ├─ .design-canvas.state.json   캔버스 배치 상태(빈 값)
   └─ vendor/            npm install 때 자동 생성 (직접 고치지 마세요)
```

화면을 고치려면 `public/*.jsx`를 수정하고 브라우저를 새로고침하면 됩니다(빌드 단계 없음).

## 사용 기술과 의존성

원본은 CDN에서 React와 Babel을 불러와 브라우저 안에서 JSX를 바로 변환하는 구조입니다. 이 구조를 그대로 두고, CDN 파일만 npm 패키지로 바꿔 **인터넷 없이도** 돌아가게 했습니다.

| 패키지 | 버전 | 원래 불러오던 곳 | 추가 이유 |
|---|---|---|---|
| react | 18.3.1 | unpkg.com | 원본과 같은 버전을 로컬에서 제공 (파일 해시가 원본 SRI 값과 일치) |
| react-dom | 18.3.1 | unpkg.com | 위와 같음 |
| @babel/standalone | 7.29.0 | unpkg.com | 브라우저에서 .jsx 변환, 위와 같음 |
| @fontsource/noto-sans-kr | 5.x | fonts.googleapis.com | 같은 폰트(400/500/700)를 오프라인 제공 |
| @fontsource/noto-serif-kr | 5.x | fonts.googleapis.com | 위와 같음 |
| serve (개발용) | 14.x | – | 정적 파일 로컬 서버. `file://`로 직접 열면 .jsx를 못 읽기 때문에 필요 |

`package.json`의 `overrides`는 serve가 쓰는 `compression` 라이브러리를 보안 패치된 버전(1.8.2 이상)으로 고정합니다. 이것만으로 `npm audit` 경고 2건이 사라집니다.

## 콘솔에 남는 메시지 (에러 아님)

브라우저 콘솔에 에러는 없습니다. 아래 두 줄은 원본에서도 똑같이 나옵니다.

| 메시지 | 원인 | 조치 |
|---|---|---|
| `You are using the in-browser Babel transformer...` (경고) | 원본이 JSX를 브라우저에서 변환하는 구조라서 | 프로토타입 용도라 그대로 둠. 실서비스로 키울 때 Vite 등으로 옮기면 사라짐 |
| `Download the React DevTools...` (안내) | React 개발 빌드가 띄우는 안내 문구 | 무시해도 됨 |

## 자주 생기는 문제

| 증상 | 원인 | 해결 |
|---|---|---|
| `npm: command not found` | Node.js 미설치 | 위 1번대로 설치 |
| `node_modules가 없습니다` | 설치 전에 실행 | `npm install` 먼저 |
| 터미널에 `This port was picked because 5175 is in use` | 5175 포트를 다른 프로그램이 사용 중 | 터미널에 나온 새 주소로 접속하거나, 이전 서버 창에서 `Ctrl + C` |
| `index.html`을 더블클릭하면 빈 화면 | `file://`에서는 브라우저가 .jsx 파일을 읽지 못함 | 반드시 `npm run dev`로 띄운 주소로 접속 |
| 화면이 잠깐 비어 보임 | 처음 열 때 브라우저가 JSX를 변환하는 중(1~2초) | 잠시 기다리기 |
| 화면 배치·확대 상태가 이상함 | 브라우저에 저장된 캔버스 위치 | 주소창에서 새로고침, 그래도 같으면 사이트 데이터 삭제 |

## 범위 밖

- 내 계정과 내 기록(태깅·진행·반응·찜·팔로우)은 Supabase에 저장됩니다. 다른 독자의 색·반응·독자 수는 시연용 데이터이고, 계정끼리 기록이 공유되지는 않습니다.
- 비밀번호 찾기는 없습니다(이메일을 받지 않음).
- Claude Design 안에서만 되는 "캔버스 배치 저장"(섹션 순서·이름 변경 저장)은 로컬에서는 저장되지 않습니다. 보기와 상호작용은 모두 됩니다.
