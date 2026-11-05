// Máy kiểm bản Việt so với bản gốc (SPEC mục 13).
// Dùng:  node cong-cu/kiem.mjs 13          kiểm chương 13
//        node cong-cu/kiem.mjs all         kiểm mọi chương đã có file
//        node cong-cu/kiem.mjs 13 --json   in kết quả dạng JSON
//        node cong-cu/kiem.mjs --file <đường dẫn> 13   kiểm một file khác (vd bản nháp)
// Có lỗi → mã thoát 1. Cảnh báo không làm đỏ.
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseGoc, parseVn, CHUONG, VN_FIELDS, GOC_COMMIT, urls, HAN_RE, read, REPO } from './lib.mjs';
const SLUG_BAI = new Set(JSON.parse(read(resolve(REPO, 'cong-cu/bai.json'))).map(b => b.slug));
const linkBaiViet = u => { const m = u.match(/^https:\/\/github\.com\/luonglb\/song-dang-tien\/blob\/main\/bai\/([a-z0-9-]+)\.md$/); return !!m && SLUG_BAI.has(m[1]); };

const args = process.argv.slice(2);
const json = args.includes('--json');
const fi = args.indexOf('--file');
const filePath = fi >= 0 ? resolve(args[fi + 1]) : null;
const target = args.filter((a, i) => !a.startsWith('--') && (fi < 0 || i !== fi + 1))[0] || 'all';

// Bảng phân loại xanh/vang/do (nguồn chuẩn), nếu có
const phanLoai = new Map();
const plPath = resolve(REPO, 'tien-do', 'phan-loai.csv');
if (existsSync(plPath)) {
  for (const line of read(plPath).split('\n').slice(1)) {
    const [ma, nhan] = line.split(',');
    if (ma && nhan) phanLoai.set(ma.trim(), nhan.trim());
  }
}

// Chữ Hán ngoài trường Nguồn chỉ được phép khi là tên văn bản/thể chế TQ có dịch ngay sau trong ngoặc: 民法典 (Bộ luật…)
// hoặc nằm trong dòng 成本标签.
function hanLoi(text) {
  const bad = [];
  const re = /[㐀-鿿豈-﫿《》「」〈〉【】]+[㐀-鿿豈-﫿《》「」〈〉【】0-9a-zA-Z·（）()〔〕\-—]*/g;
  let m;
  while ((m = re.exec(text))) {
    const after = text.slice(m.index + m[0].length, m.index + m[0].length + 3);
    if (/^\s?\(/.test(after) || /^\s?（/.test(after)) continue;
    bad.push(m[0]);
  }
  return bad;
}

function kiemChuong(so) {
  const goc = parseGoc(so);
  const vn = parseVn(so, filePath);
  const r = { chuong: so, file: filePath || goc.chuong.vnPath, loi: [], canhBao: [], chuaKiemChung: 0, soMuc: 0, soMucGoc: goc.items.length, nhan: { xanh: 0, vang: 0, do: 0 } };
  if (!vn) { r.loi.push('Chưa có file bản Việt'); r.chuaCo = true; return r; }
  const L = (m, s) => r.loi.push(m ? `${so}.${m}: ${s}` : s);
  const W = (m, s) => r.canhBao.push(m ? `${so}.${m}: ${s}` : s);
  r.soMuc = vn.items.length;
  if (!vn.md.includes(`<!-- goc-commit: ${GOC_COMMIT} -->`)) L(0, `Thiếu dòng <!-- goc-commit: ${GOC_COMMIT} -->`);
  if (!vn.head.some(l => new RegExp(`^# ${so}\\. `).test(l))) L(0, `Thiếu tiêu đề chương "# ${so}. …"`);
  if (vn.items.length !== goc.items.length) L(0, `Số mục ${vn.items.length} ≠ gốc ${goc.items.length}`);
  // phần lời dẫn chương: không còn chữ Hán ngoài ngoặc
  const headHan = hanLoi(vn.head.filter(l => !l.startsWith('<!--')).join('\n'));
  if (vn.head.some(l => l.includes('](../docs/'))) L(0, 'Lời dẫn có link tới ../docs/ (repo này không có docs): trỏ về bài gốc tiếng Trung');
  if (headHan.length) L(0, `Lời dẫn còn chữ Hán: ${headHan.slice(0, 5).join(' | ')}`);
  r.chuaKiemChung += (vn.md.match(/Chưa kiểm chứng/g) || []).length;

  goc.items.forEach((g, i) => {
    const v = vn.items[i];
    if (!v) return;
    const n = g.so;
    if (v.so !== g.so) L(n, `Số thứ tự là ${v.so}, gốc là ${g.so}`);
    if (!v.title || HAN_RE.test(v.title.replace(/[㐀-鿿]+\s?\([^)]*\)/g, ''))) L(n, 'Tiêu đề trống hoặc còn chữ Hán');
    if (v.tag !== g.tag) L(n, `Dòng 成本标签 khác gốc: "${v.tag}" ≠ "${g.tag}"`);
    if (!v.goc) L(n, 'Thiếu dòng <!-- goc: C.M · viet-hoa: xanh|vang|do -->');
    else {
      if (v.goc.chuong !== so || v.goc.muc !== g.so) L(n, `Dòng goc ghi ${v.goc.chuong}.${v.goc.muc}`);
      if (!['xanh', 'vang', 'do'].includes(v.goc.vh)) L(n, `Nhãn viet-hoa lạ: ${v.goc.vh}`);
      else r.nhan[v.goc.vh]++;
      const pl = phanLoai.get(`${so}.${g.so}`);
      if (pl && pl !== v.goc.vh) W(n, `Nhãn ${v.goc.vh} khác phan-loai.csv (${pl}) — sửa csv hoặc file cho khớp`);
    }
    // 6 trường đúng thứ tự
    const order = v.fieldOrder.join('|');
    if (order !== VN_FIELDS.join('|')) L(n, `Trường sai/thiếu/thứ tự: [${v.fieldOrder.join(', ')}]`);
    for (const f of VN_FIELDS) if (v.fields[f] !== undefined && !v.fields[f].trim()) L(n, `Trường "${f}" trống`);
    const mbc = (v.fields['Mức bằng chứng'] || '').trim();
    const gmbc = (g.fields['证据等级'] || '').trim();
    if (gmbc && mbc.slice(0, 1) !== gmbc.slice(0, 1)) L(n, `Mức bằng chứng "${mbc}" ≠ gốc "${gmbc}"`);
    // link/DOI: tập link phần dịch phải bằng tập link gốc
    const gu = urls(Object.values(g.fields).join(' '));
    const vu = urls(v.body);
    const thieu = [...gu].filter(u => !vu.has(u));
    // Link bài dài trỏ về bài gốc tiếng Trung trên repo gốc: bản Việt chưa có
    // Từ W8: link bài dài trỏ bản Việt trong bai/; slug phải có trong cong-cu/bai.json
    const thua = [...vu].filter(u => !gu.has(u) && !u.startsWith(`https://github.com/eternity4719/HowToLiveBetter/blob/${GOC_COMMIT}`) && !linkBaiViet(u));
    if ((v.body + v.box).includes('](../docs/')) L(n, 'Link tới ../docs/ (repo này không có docs): trỏ về bài gốc tiếng Trung');
    if (thieu.length) L(n, `Thiếu link gốc: ${thieu.join(' ')}`);
    if (thua.length) L(n, `Link lạ ngoài khung VN (link VN phải nằm trong khung 🇻🇳): ${thua.join(' ')}`);
    // chữ Hán ngoài Nguồn
    for (const f of VN_FIELDS) {
      if (f === 'Nguồn' || !v.fields[f]) continue;
      const bad = hanLoi(v.fields[f]);
      if (bad.length) L(n, `Còn chữ Hán trong "${f}": ${bad.slice(0, 4).join(' | ')}`);
    }
    const extraBody = v.lines.filter(l => l.trim() && !l.startsWith('<!--') && !l.startsWith('>') && !/^- \*\*/.test(l) && !/^\*Chỉ áp dụng ở Trung Quốc\.\*$/.test(l.trim()) && !/^\s+- /.test(l));
    if (extraBody.length) W(n, `Dòng lạ ngoài khung: ${extraBody[0].slice(0, 80)}`);
    // khung VN
    const vh = v.goc?.vh;
    if (v.box) {
      if (!/^> \*\*🇻🇳 Ở Việt Nam\*\*/m.test(v.box)) L(n, 'Khung VN phải mở bằng "> **🇻🇳 Ở Việt Nam**"');
      const coLink = /\]\(https?:\/\//.test(v.box);
      const kc = /Kiểm chứng ngày \d{2}\/\d{2}\/\d{4}/.test(v.box);
      const chua = /⚠️ Chưa kiểm chứng/.test(v.box);
      if (!chua && !(coLink && kc)) L(n, 'Khung VN cần link + "Kiểm chứng ngày dd/mm/yyyy", hoặc ghi "⚠️ Chưa kiểm chứng"');
      if (HAN_RE.test(v.box.replace(/[㐀-鿿]+\s?[（(][^)）]*[)）]/g, ''))) W(n, 'Khung VN có chữ Hán');
    } else if (vh === 'vang') L(n, 'Nhãn vang bắt buộc có khung "🇻🇳 Ở Việt Nam"');
    if (vh === 'do' && !v.lines.some(l => l.trim() === '*Chỉ áp dụng ở Trung Quốc.*')) L(n, 'Nhãn do cần dòng "*Chỉ áp dụng ở Trung Quốc.*"');
    // số khẩn cấp TQ trong phần dịch → nhắc có khung VN
    if (/(gọi|bấm|số|đường dây)\s*(cấp cứu\s*)?(120|110|119)\b|\b(120|110|119)\s*(\/|hoặc|và)\s*(120|110|119)\b/i.test(v.body) && !v.box) W(n, 'Phần dịch có số 120/110/119 nhưng không có khung VN (115/113/114)');
  });
  return r;
}

const list = target === 'all' ? CHUONG.map(c => c.so) : [Number(target)];
const out = list.map(kiemChuong).filter(r => target !== 'all' || !r.chuaCo);
if (json) console.log(JSON.stringify(out, null, 2));
else {
  for (const r of out) {
    const ok = r.loi.length === 0;
    console.log(`${ok ? '✅' : '❌'} Chương ${r.chuong}: ${r.soMuc}/${r.soMucGoc} mục · lỗi ${r.loi.length} · cảnh báo ${r.canhBao.length} · "Chưa kiểm chứng" ${r.chuaKiemChung} · xanh ${r.nhan.xanh} vàng ${r.nhan.vang} đỏ ${r.nhan.do}`);
    r.loi.slice(0, 60).forEach(s => console.log('  ❌ ' + s));
    if (r.loi.length > 60) console.log(`  … còn ${r.loi.length - 60} lỗi`);
    r.canhBao.slice(0, 30).forEach(s => console.log('  ⚠️ ' + s));
  }
  if (!out.length) console.log('Chưa có chương nào.');
}
process.exit(out.some(r => r.loi.length) ? 1 : 0);
