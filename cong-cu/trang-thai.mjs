// Ghi trạng thái một chương vào tien-do/trang-thai.json (Manager chạy sau mỗi bước).
// node cong-cu/trang-thai.mjs 13 dich|kiem|sua|xong ["ghi chú"]
// node cong-cu/trang-thai.mjs          in bảng tổng
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { REPO, CHUONG, read, parseGoc } from './lib.mjs';

const f = resolve(REPO, 'tien-do', 'trang-thai.json');
const st = JSON.parse(read(f));
const [so, buoc, ...ghi] = process.argv.slice(2);
const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' });
if (so) {
  if (!['dich', 'kiem', 'sua', 'xong'].includes(buoc)) { console.error('Bước phải là dich|kiem|sua|xong'); process.exit(1); }
  let k = null;
  try { k = JSON.parse(execFileSync('node', [resolve(REPO, 'cong-cu', 'kiem.mjs'), so, '--json'], { encoding: 'utf8' }))[0]; }
  catch (e) { k = JSON.parse(e.stdout)[0]; }
  const c = CHUONG.find(x => x.so === Number(so));
  st.chuong[so] = { slug: c.slug, buoc, ngay: today, soMuc: k.soMuc, soMucGoc: k.soMucGoc, loiMay: k.loi.length, chuaKiemChung: k.chuaKiemChung, nhan: k.nhan, ghiChu: ghi.join(' ') || undefined };
  st.cap_nhat = today;
  writeFileSync(f, JSON.stringify(st, null, 2) + '\n');
}
let tong = 0, xong = 0;
for (const c of CHUONG) {
  const s = st.chuong[c.so];
  const n = parseGoc(c.so).items.length; tong += n;
  if (s?.buoc === 'xong') xong += n;
  console.log(`${String(c.so).padStart(2)} ${c.slug.padEnd(28)} ${s ? `${s.buoc.padEnd(5)} ${s.soMuc}/${n} lỗi máy ${s.loiMay} · chưa kiểm chứng ${s.chuaKiemChung} · ${s.ngay}` : `—     0/${n}`}`);
}
console.log(`Tổng: ${xong}/${tong} mục xong`);
