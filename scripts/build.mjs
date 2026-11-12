// The site is already static: build = copy public/ to docs/.
// GitHub Pages serves docs/ directly (Settings → Pages → main / docs).
import { cpSync, rmSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'docs');
rmSync(out, { recursive: true, force: true });
cpSync(join(root, 'public'), out, { recursive: true });
// Skip Jekyll so GitHub Pages serves every file as-is (including .design-canvas.state.json).
writeFileSync(join(out, '.nojekyll'), '');
// GitHub Pages는 파일을 10분 캐시한다. 배포 직후 옛 .jsx와 새 .js가 섞이지 않게
// 페이지가 읽는 우리 스크립트 주소에 내용 해시(?v=…)를 붙인다(바뀐 파일만 새로 받음).
for (const page of ['index.html', 'canvas.html']) {
  const f = join(out, page); if (!existsSync(f)) continue;
  const html = readFileSync(f, 'utf8').replace(/(<script\b[^>]*\bsrc=")(?!https?:|vendor\/)([^"?]+\.jsx?)"/g, (m, a, src) => {
    const file = join(out, src); if (!existsSync(file)) return m;
    const v = createHash('sha256').update(readFileSync(file)).digest('hex').slice(0, 10);
    return `${a}${src}?v=${v}"`;
  });
  writeFileSync(f, html);
}
console.log('build: public/ → docs/ (스크립트 주소에 ?v=해시)');
