// Sinh tien-do/chua-kiem-chung.md: liệt kê mọi chỗ ghi "Chưa kiểm chứng" theo chương và mục (SPEC mục 16).
// node cong-cu/chua-kiem-chung.mjs
// Chỉ thống kê, không đổi trạng thái kiểm chứng của nội dung nào.
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CHUONG, REPO, parseVn } from './lib.mjs';

const TU = /chưa kiểm chứng/i;
const gon = s => s.replace(/^>\s*(-\s*)?/, '').replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();

const chuong = [];
let tongDong = 0, tongMuc = 0, tongLan = 0;
for (const c of CHUONG) {
  const vn = parseVn(c.so);
  const dong = [];
  vn.head.forEach(l => { if (TU.test(l)) dong.push({ muc: 'Lời dẫn', text: gon(l) }); });
  for (const it of vn.items) for (const l of it.lines) if (TU.test(l)) dong.push({ muc: `${c.so}.${it.so}`, so: it.so, text: gon(l), tieuDe: it.title });
  const muc = new Set(dong.map(d => d.muc));
  const lan = (vn.md.match(/chưa kiểm chứng/gi) || []).length;
  tongDong += dong.length; tongMuc += muc.size; tongLan += lan;
  chuong.push({ so: c.so, slug: c.slug, tieuDe: vn.head.find(l => l.startsWith('# '))?.replace(/^# /, '') || c.slug, soMuc: vn.items.length, dong, muc, lan });
}

const out = [];
out.push('# Danh sách "Chưa kiểm chứng"', '');
out.push('Tự sinh bằng `node cong-cu/chua-kiem-chung.mjs`, đừng sửa tay. Yêu cầu ở SPEC.md mục 16.', '');
out.push('📌 Những chỗ này CHƯA được đối chiếu đủ với văn bản gốc của Việt Nam. Danh sách chỉ để người đọc và người dùng biết, không có nghĩa là nội dung sai hay đúng, và không đánh dấu mục nào là đã kiểm chứng.', '');
out.push(`**Tổng: ${tongMuc} mục có ghi "Chưa kiểm chứng", ${tongDong} dòng, ${tongLan} lần xuất hiện, trên ${chuong.reduce((a, c) => a + c.soMuc, 0)} mục của ${chuong.length} chương.**`, '');
out.push('| Chương | Số mục của chương | Mục có ghi | Dòng | Lần xuất hiện |', '|---|---:|---:|---:|---:|');
for (const c of chuong) out.push(`| ${c.tieuDe} | ${c.soMuc} | ${c.muc.size} | ${c.dong.length} | ${c.lan} |`);
out.push(`| **Tổng** | **${chuong.reduce((a, c) => a + c.soMuc, 0)}** | **${tongMuc}** | **${tongDong}** | **${tongLan}** |`, '');
for (const c of chuong) {
  if (!c.dong.length) continue;
  out.push(`## ${c.tieuDe}`, '');
  for (const d of c.dong) out.push(`- **${d.muc}**: ${d.text}`);
  out.push('');
}
writeFileSync(resolve(REPO, 'tien-do', 'chua-kiem-chung.md'), out.join('\n'));
console.log(`Đã ghi tien-do/chua-kiem-chung.md: ${tongMuc} mục · ${tongDong} dòng · ${tongLan} lần`);
