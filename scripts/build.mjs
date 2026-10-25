// The site is already static: build = copy public/ to docs/.
// GitHub Pages serves docs/ directly (Settings → Pages → main / docs).
import { cpSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'docs');
rmSync(out, { recursive: true, force: true });
cpSync(join(root, 'public'), out, { recursive: true });
// Skip Jekyll so GitHub Pages serves every file as-is (including .design-canvas.state.json).
writeFileSync(join(out, '.nojekyll'), '');
console.log('build: public/ → docs/');
