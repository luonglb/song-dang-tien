// Ghép bản nháp từng mục thành file chương.
// Nháp: sach/_nhap/<số chương 2 chữ số>/00.md (tiêu đề chương + lời dẫn), 01.md, 02.md … (mỗi file 1 mục, bắt đầu bằng "### N. ")
// node cong-cu/ghep.mjs 13   → ghi sach/13-tinh-huong-khan-cap.md, báo mục còn thiếu
import { readdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { chuong, parseGoc, read, REPO, GOC_COMMIT } from './lib.mjs';
const so = Number(process.argv[2]);
const c = chuong(so);
const dir = resolve(REPO, 'sach', '_nhap', String(so).padStart(2, '0'));
if (!existsSync(dir)) { console.error('Không có thư mục nháp ' + dir); process.exit(1); }
const n = parseGoc(so).items.length;
const parts = [];
const head = resolve(dir, '00.md');
if (!existsSync(head)) { console.error('Thiếu 00.md (tiêu đề + lời dẫn chương)'); process.exit(1); }
parts.push(`[← Về mục lục](../README.md)\n<!-- goc-commit: ${GOC_COMMIT} -->\n\n` + read(head).replace(/^\[← .*\n/, '').replace(/<!-- goc-commit: \w+ -->\n?/, '').trim());
const thieu = [];
for (let i = 1; i <= n; i++) {
  const f = resolve(dir, String(i).padStart(2, '0') + '.md');
  if (!existsSync(f)) { thieu.push(i); continue; }
  parts.push(read(f).trim());
}
writeFileSync(c.vnPath, parts.join('\n\n') + '\n');
console.log(`Đã ghép ${n - thieu.length}/${n} mục → ${c.vnPath}` + (thieu.length ? `\nCòn thiếu: ${thieu.join(', ')}` : ''));
