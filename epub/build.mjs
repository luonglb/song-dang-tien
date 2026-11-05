// Dựng EPUB "Sống Đáng Tiền" từ sach/ bản đã commit (HEAD), không đọc thay đổi chưa commit.
// Cách lọc Markdown giống pdf/build.mjs. Dùng Typst và Pandoc portable trong pdf/bin/.
import {readFileSync, writeFileSync, mkdirSync, readdirSync, statSync} from 'node:fs';
import {resolve, dirname, basename} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {BAI,linkBaiNoiBo,locBai,moPhuLuc} from '../cong-cu/phu-luc.mjs';
const ROOT = dirname(fileURLToPath(import.meta.url));
const BOOK = resolve(ROOT, '..');
const OUT = resolve(ROOT, 'out');
const WORK = resolve(OUT, 'work');
mkdirSync(WORK, {recursive: true});

function findExe(dir, name) {
  for (const e of readdirSync(dir, {withFileTypes: true})) {
    const p = resolve(dir, e.name);
    if (e.isFile() && e.name.toLowerCase() === name) return p;
    if (e.isDirectory()) { const hit = findExe(p, name); if (hit) return hit; }
  }
}
const BIN = resolve(BOOK, 'pdf/bin');
const TYPST = process.env.TYPST || findExe(BIN, 'typst.exe');
const PANDOC = process.env.PANDOC || findExe(BIN, 'pandoc.exe');
if (!TYPST || !PANDOC) throw Error('Cần Typst và Pandoc portable trong pdf/bin/.');
const run = (cmd, args) => execFileSync(cmd, args, {encoding: 'utf8', maxBuffer: 256 * 1024 * 1024});
const CUOI_CHUONG = '<p class="cuoi-chuong"><a href="https://zero2better.com/song-dang-tien/">zero2better.com · Tốt hơn mỗi ngày</a></p>';

const chapters = JSON.parse(readFileSync(resolve(BOOK, 'cong-cu/chuong.json'), 'utf8'));
if (chapters.length !== 34) throw Error('Cần đủ 34 chương.');
const parts = chapters.map(c => {
  const raw = run('git', ['-C', BOOK, 'show', `HEAD:sach/${c.slug}.md`]);
  const md = raw.replace(/<!--[\s\S]*?-->/g, '').replace(/^\[←[^\n]+\n/gm, '')
    .replace(/\]\((?!https?:|mailto:|#)([^)]+)\)/g, (_, href) => {
      const slug = basename(href.split('#')[0], '.md');
      if (chapters.some(x => x.slug === slug)) return `](#chapter-${slug})`;
      return `](https://github.com/luonglb/song-dang-tien/blob/main/${href.replace(/^\.\.\//, '')})`;
    }).replace(/^(# .+)$/m, `$1 {#chapter-${c.slug}}`);
  return `${linkBaiNoiBo(md).trim()}\n\n${CUOI_CHUONG}\n`;
});
if (BAI.length !== 9) throw Error('Cần đủ 9 bài.');
const phuLuc = BAI.map(b => {
  const raw = run('git', ['-C', BOOK, 'show', `HEAD:bai/${b.slug}.md`]);
  return `${locBai(raw, b.slug, chapters, s => '#chapter-' + s)}\n\n${CUOI_CHUONG}\n`;
});

// Ghi công nằm ở trang tiêu đề, là trang Pandoc đặt trước mục lục. Lời nói đầu là chương đầu, sau mục lục.
const dau = readFileSync(resolve(ROOT, 'dau-sach.md'), 'utf8').replace(/\r/g, '');
const chia = dau.indexOf('# Lời nói đầu');
if (chia < 0) throw Error('dau-sach.md thiếu "# Lời nói đầu".');
const ghiCongMd = resolve(WORK, 'ghi-cong.md');
writeFileSync(ghiCongMd, dau.slice(0, chia).trim());
// Tự chuyển sang HTML rồi gắn vào mẫu: biến metadata ở trang tiêu đề bị Pandoc làm phẳng, mất tiêu đề và danh sách.
const ghiCong = run(PANDOC, ['--from=gfm+attributes', '--to=html5', '--wrap=none', ghiCongMd]).trim();
const loiNoiDau = dau.slice(chia).trim();

const mau = run(PANDOC, ['-D', 'epub3']);
const moTrang = /<section epub:type="titlepage"[\s\S]*?<\/section>/;
if (!moTrang.test(mau)) throw Error('Không tìm thấy trang tiêu đề trong mẫu epub3 của Pandoc.');
const template = resolve(WORK, 'mau.xhtml');
writeFileSync(template, mau.replace(moTrang, () => `<section epub:type="titlepage" class="titlepage">\n${ghiCong.replaceAll('$', () => '$$')}\n</section>`));

const metadata = resolve(WORK, 'metadata.json');
writeFileSync(metadata, JSON.stringify({
  title: 'Sống Đáng Tiền',
  subtitle: '767 việc đáng làm, xếp theo chi phí và lợi ích',
  author: ['eternity4719', 'zero2better.com'],
  rights: 'Creative Commons Attribution 4.0 (CC BY 4.0)',
  lang: 'vi',
  identifier: [{scheme: 'URI', text: 'https://zero2better.com/song-dang-tien/'}],
  'toc-title': 'Mục lục',
}));

const input = resolve(WORK, 'sach.md');
writeFileSync(input, [loiNoiDau, ...parts, `${moPhuLuc()}\n\n${CUOI_CHUONG}\n`, ...phuLuc].join('\n\n'));
const bia = resolve(WORK, 'bia.png');
run(TYPST, ['compile', resolve(ROOT, 'bia.typ'), bia, '--format', 'png', '--ppi', '72', '--font-path', resolve(BOOK, 'pdf/fonts')]);
const epub = resolve(OUT, 'Song-Dang-Tien.epub');
run(PANDOC, ['--from=gfm+attributes', '--to=epub3', '--split-level=1', '--toc', '--toc-depth=2',
  '--epub-title-page=true', `--template=${template}`, `--metadata-file=${metadata}`,
  `--css=${resolve(ROOT, 'style.css')}`, `--lua-filter=${resolve(ROOT, 'nhan.lua')}`,
  `--epub-cover-image=${bia}`, '-o', epub, input]);
console.log(`Đã dựng ${basename(epub)}: ${(statSync(epub).size / 1024 / 1024).toFixed(1)} MB`);
