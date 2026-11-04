// Cập nhật bảng "Mục lục và tiến độ dịch" trong README.md từ tien-do/trang-thai.json.
// node cong-cu/readme.mjs
import { writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { REPO, CHUONG, read, parseGoc } from './lib.mjs';

const st = JSON.parse(read(resolve(REPO, 'tien-do', 'trang-thai.json')));
let tong = 0, daDich = 0;
const rows = CHUONG.map(c => {
  const n = parseGoc(c.so).items.length; tong += n;
  const s = st.chuong[c.so];
  const coFile = existsSync(resolve(REPO, 'sach', c.slug + '.md'));
  if (s && coFile) daDich += s.soMuc;
  const ten = coFile && s ? `[${c.so}. ${c.ten}](sach/${c.slug}.md)` : `${c.so}. ${c.ten}`;
  return `| ${ten} | ${n} |`;
});
const bang = [
  `Đã dịch **${daDich}/${tong} mục** · cập nhật ${st.cap_nhat}`,
  '',
  '| Chương | Số mục |',
  '|---|---:|',
  ...rows,
].join('\n');
const p = resolve(REPO, 'README.md');
const md = read(p).replace(/<!-- tien-do:bat-dau -->[\s\S]*<!-- tien-do:ket-thuc -->/, `<!-- tien-do:bat-dau -->\n${bang}\n<!-- tien-do:ket-thuc -->`);
writeFileSync(p, md);
console.log(`README: ${daDich}/${tong} mục`);
