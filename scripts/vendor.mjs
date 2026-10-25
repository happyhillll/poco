// Copies the libraries the page used to load from CDNs (unpkg, Google Fonts)
// out of node_modules into public/vendor, so the site runs offline.
import { cpSync, mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const nm = join(root, 'node_modules');
const out = join(root, 'public', 'vendor');

if (!existsSync(join(nm, 'react'))) {
  console.error('node_modules가 없습니다. 먼저 `npm install`을 실행하세요.');
  process.exit(1);
}

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'fonts', 'files'), { recursive: true });

// Same files and versions the original <script> tags loaded from unpkg.
cpSync(join(nm, 'react/umd/react.development.js'), join(out, 'react.development.js'));
cpSync(join(nm, 'react-dom/umd/react-dom.development.js'), join(out, 'react-dom.development.js'));
cpSync(join(nm, '@babel/standalone/babel.min.js'), join(out, 'babel.min.js'));

// Same families and weights as the original Google Fonts link:
// Noto Sans KR + Noto Serif KR, 400/500/700.
let css = '';
for (const fam of ['noto-sans-kr', 'noto-serif-kr']) {
  for (const w of ['400', '500', '700']) {
    const src = readFileSync(join(nm, '@fontsource', fam, `${w}.css`), 'utf8');
    // Keep only the woff2 source (every current browser supports it); drops ~half the size.
    const woff2Only = src.replace(/,\s*url\(\.\/files\/[^)]+\.woff\) format\('woff'\)/g, '');
    css += woff2Only.replace(/url\(\.\/files\/([^)]+)\)/g, (_, f) => {
      cpSync(join(nm, '@fontsource', fam, 'files', f), join(out, 'fonts', 'files', f));
      return `url(./files/${f})`;
    }) + '\n';
  }
}
writeFileSync(join(out, 'fonts', 'fonts.css'), css);
console.log('vendor: React 18.3.1, Babel 7.29.0, Noto Sans/Serif KR → public/vendor');
