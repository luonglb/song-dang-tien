// Rà các điểm ảnh hưởng tới EPUB, bổ sung cho kiem.mjs. Chỉ đọc, không sửa file.
// node cong-cu/kiem-epub.mjs        in lỗi; có lỗi thì mã thoát 1
// Kiểm: nháp khớp bản ghép · comment HTML lạ · chữ Hán ngoài chỗ cho phép · link tương đối · dẫn chiếu "chương X mục Y".
import { existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { CHUONG, REPO, read, parseVn, GOC_COMMIT } from './lib.mjs';

const loi = [];
const canhBao = [];
const soMuc = new Map(CHUONG.map(c => [c.so, parseVn(c.so).items.length]));

// Chữ Hán được phép khi có phần dịch ngay sau trong ngoặc, giống luật của kiem.mjs
function hanTrai(text) {
  const bad = [];
  const re = /[\u3400-\u9fff\uf900-\ufaff《》「」〈〉【】]+[\u3400-\u9fff\uf900-\ufaff《》「」〈〉【】0-9a-zA-Z·（）()〔〕—-]*/gu;
  let m;
  while ((m = re.exec(text))) {
    const sau = text.slice(m.index + m[0].length, m.index + m[0].length + 3);
    if (/^\s?[(（]/.test(sau)) continue;
    bad.push(m[0]);
  }
  return bad;
}

function bangGhep(c) {
  const dir = resolve(REPO, 'sach', '_nhap', String(c.so).padStart(2, '0'));
  const phan = [`[← Về mục lục](../README.md)\n<!-- goc-commit: ${GOC_COMMIT} -->\n\n` + read(resolve(dir, '00.md')).replace(/^\[← .*\n/, '').replace(/<!-- goc-commit: \w+ -->\n?/, '').trim()];
  const tep = readdirSync(dir).filter(f => /^\d\d\.md$/.test(f) && f !== '00.md').sort();
  for (const f of tep) phan.push(read(resolve(dir, f)).trim());
  return phan.join('\n\n') + '\n';
}

for (const c of CHUONG) {
  const vn = parseVn(c.so);
  if (bangGhep({ so: c.so }) !== vn.md) loi.push(`${c.so}: bản ghép lệch nháp, chạy lại ghep.mjs`);

  // comment HTML: chỉ 3 loại, và phải đóng trên cùng dòng
  vn.md.split('\n').forEach((l, i) => {
    if (l.includes('<!--') && !/^<!-- (goc-commit: \w+|goc: \d+\.\d+ · viet-hoa: \w+|成本标签: .*) -->$/.test(l.trim())) loi.push(`${c.so} dòng ${i + 1}: comment HTML lạ: ${l.slice(0, 70)}`);
    if (/-->/.test(l) && !l.includes('<!--')) loi.push(`${c.so} dòng ${i + 1}: thừa -->`);
  });

  const nhom = [{ ma: `${c.so}.0`, text: vn.head.filter(l => !l.startsWith('<!--')).join('\n') }];
  for (const it of vn.items) {
    const ma = `${c.so}.${it.so}`;
    nhom.push({ ma, text: it.title });
    // Mọi dòng của mục trừ comment và trường Nguồn, để không sót dòng nằm ngoài 6 trường
    nhom.push({ ma, text: it.lines.filter(l => !l.startsWith('<!--') && !l.startsWith('- **Nguồn:**') && !l.startsWith('>')).join('\n') });
    if (it.box) nhom.push({ ma, text: it.box, truong: 'khung VN' });
  }
  for (const n of nhom) {
    const bad = hanTrai(n.text);
    if (bad.length) loi.push(`${n.ma}${n.truong ? ' · ' + n.truong : ''}: chữ Hán ngoài chỗ cho phép: ${bad.slice(0, 3).join(' | ')}`);
    // dấu câu Trung Quốc không nằm trong tên văn bản
    const dau = n.text.replace(/[(（][^)）]*[)）]/g, '').match(/[，。；：？！、]/g);
    if (dau && !/[\u3400-\u9fff]/u.test(n.text)) canhBao.push(`${n.ma}: dấu câu Trung Quốc: ${[...new Set(dau)].join(' ')}`);

    // link tương đối
    for (const m of n.text.matchAll(/\]\((?!https?:|mailto:|#)([^)]+)\)/g)) {
      const dich = decodeURIComponent(m[1].split('#')[0]);
      if (!existsSync(resolve(dirname(vn.chuong.vnPath), dich))) loi.push(`${n.ma}: link nội bộ hỏng: ${m[1]}`);
    }
    // dẫn chiếu chéo
    for (const m of n.text.matchAll(/chương (\d+) mục (\d+)/gi)) {
      const so = Number(m[1]), muc = Number(m[2]);
      if (!soMuc.has(so)) loi.push(`${n.ma}: dẫn tới chương không có: ${m[0]}`);
      else if (muc < 1 || muc > soMuc.get(so)) loi.push(`${n.ma}: dẫn tới mục không có: ${m[0]} (chương có ${soMuc.get(so)} mục)`);
    }
    for (const m of n.text.matchAll(/(?:chương này mục|mục) (\d+) chương này|chương này mục (\d+)/gi)) {
      const muc = Number(m[1] || m[2]);
      if (muc < 1 || muc > soMuc.get(c.so)) loi.push(`${n.ma}: dẫn tới mục không có: ${m[0]} (chương có ${soMuc.get(c.so)} mục)`);
    }
  }
}

console.log(`${loi.length ? '❌' : '✅'} kiem-epub: ${CHUONG.length} chương · lỗi ${loi.length} · cảnh báo ${canhBao.length}`);
loi.slice(0, 80).forEach(s => console.log('  ❌ ' + s));
if (loi.length > 80) console.log(`  … còn ${loi.length - 80} lỗi`);
canhBao.slice(0, 30).forEach(s => console.log('  ⚠️ ' + s));
process.exit(loi.length ? 1 : 0);
