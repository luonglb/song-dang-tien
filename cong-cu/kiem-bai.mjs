// Kiểm 9 bài dài trong bai/ so với gốc Trung _goc/docs/. Chỉ đọc, không sửa file.
// kiem.mjs viết cho sách có mục đánh số 6 trường nên không dùng được cho bài dài.
// node cong-cu/kiem-bai.mjs              kiểm cả 9 bài (bài chưa có thì báo lỗi)
// node cong-cu/kiem-bai.mjs <slug>       kiểm một bài
// node cong-cu/kiem-bai.mjs --goc <slug> in nguyên văn gốc Trung
// Kiểm: comment đầu bài · cấu trúc tiêu đề, danh sách, bảng theo từng phần · số liệu của gốc còn đủ
// · dẫn chiếu "chương X mục Y" khớp gốc và tồn tại trong sách · link phần dịch khớp gốc
// · chữ Hán ngoài chỗ cho phép · khung Việt Nam có nguồn hoặc "Chưa kiểm chứng" · số khẩn cấp Trung Quốc có khung số Việt Nam.
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHUONG, parseVn, GOC_COMMIT } from './lib.mjs';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BAI = JSON.parse(readFileSync(resolve(REPO, 'cong-cu/bai.json'), 'utf8'));
const GOC_DIR = process.env.GOC_DOCS || resolve(REPO, '../_goc/docs');
const VN_DIR = process.env.BAI_DIR || resolve(REPO, 'bai');
const doc = f => readFileSync(f, 'utf8').replace(/\r/g, '');
const soMuc = new Map(CHUONG.map(c => [c.so, parseVn(c.so).items.length]));
const CAM_NGUON = /chuanman2707|hoanghadu/i;

// Tách khung Việt Nam khỏi phần dịch. Khung là khối dòng ">" bắt đầu bằng dòng có 🇻🇳 Ở Việt Nam.
function tachKhung(md) {
  const dich = [], khung = [];
  const dong = md.split('\n');
  for (let i = 0; i < dong.length; i++) {
    if (/^> \*\*🇻🇳 Ở Việt Nam/.test(dong[i])) {
      const k = [];
      while (i < dong.length && dong[i].startsWith('>')) k.push(dong[i++]);
      khung.push({ text: k.join('\n'), phan: dich.filter(l => /^#{1,6} /.test(l)).length });
      i--;
    } else dich.push(dong[i]);
  }
  return { dich: dich.join('\n'), khung };
}

// Chia theo tiêu đề; đếm danh sách, bảng. Dòng dẫn "[← ...]" và comment không tính.
function chiaPhan(md) {
  const phan = [{ cap: 0, tieuDe: '(đầu bài)', dong: [] }];
  let rao = false;
  for (const l of md.split('\n')) {
    if (l.startsWith('```')) rao = !rao;
    const m = !rao && l.match(/^(#{1,6}) (.+)/);
    if (m) phan.push({ cap: m[1].length, tieuDe: m[2], dong: [] });
    else if (!l.startsWith('[←') && !l.startsWith('<!--')) phan.at(-1).dong.push(l);
  }
  return phan.map(p => {
    const d = p.dong;
    const bang = d.filter(l => /^\|/.test(l) && !/^\|[\s:|-]+\|$/.test(l));
    return {
      ...p, text: d.join('\n'),
      so: d.filter(l => /^\s*\d+\. /.test(l)).length,
      gach: d.filter(l => /^\s*[-*] /.test(l)).length,
      trich: d.filter(l => /^>/.test(l)).length,
      hang: bang.length,
      cot: [...new Set(bang.map(l => l.replace(/\\\|/g, '').split('|').length - 2))].join('/'),
      doan: d.filter(l => l.trim() && !/^(\s*\d+\. |\s*[-*] |\||>)/.test(l)).length,
    };
  });
}

// Chuẩn hoá số để so: bỏ dấu ngăn nghìn, đổi thập phân về một dạng.
function chuanSo(s) {
  if (/^\d{1,3}([.,]\d{3})+$/.test(s)) return s.replace(/[.,]/g, '');
  return s.replace(',', '.');
}
const laySo = t => [...t.replace(/https?:\/\/\S+/g, ' ').replace(/\]\([^)]*\)/g, ']').matchAll(/\d+(?:[.,]\d+)*/g)].map(m => chuanSo(m[0]));

const layLink = t => [...t.matchAll(/\]\((https?:[^)\s]+)/g)].map(m => m[1]);

function hanTrai(text) {
  const bad = [];
  const re = /[㐀-鿿豈-﫿《》「」〈〉【】]+[㐀-鿿豈-﫿《》「」〈〉【】0-9a-zA-Z·（）()〔〕—-]*/g;
  let m;
  while ((m = re.exec(text))) {
    const sau = text.slice(m.index + m[0].length, m.index + m[0].length + 3);
    if (!/^\s?[(（]/.test(sau)) bad.push(m[0]);
  }
  return bad;
}

function kiemMot(b) {
  const loi = [];
  const canh = [];
  const p = resolve(VN_DIR, b.slug + '.md');
  const fg = resolve(GOC_DIR, b.goc);
  if (!existsSync(p)) return { loi: ['chưa có file'], canh, chua: 0, chu: 0 };
  const raw = doc(p);
  const goc = doc(fg);

  if (!raw.includes(`<!-- goc-commit: ${GOC_COMMIT} -->`)) loi.push('thiếu comment goc-commit');
  if (!raw.includes(`<!-- goc: docs/${b.goc} -->`)) loi.push('thiếu comment goc: docs/<tên gốc>');
  raw.split('\n').forEach((l, i) => {
    if (l.includes('<!--') && !/^<!-- (goc-commit: \w+|goc: docs\/.+\.md) -->$/.test(l.trim())) loi.push(`dòng ${i + 1}: comment HTML lạ`);
    if (/-->/.test(l) && !l.includes('<!--')) loi.push(`dòng ${i + 1}: thừa -->`);
  });
  if (CAM_NGUON.test(raw)) loi.push('có nhắc tới bản tiếng Việt khác');

  const { dich, khung } = tachKhung(raw);
  const pv = chiaPhan(dich);
  const pg = chiaPhan(goc);
  if (pv.length !== pg.length) loi.push(`số tiêu đề lệch: gốc ${pg.length - 1}, bản Việt ${pv.length - 1}`);
  const n = Math.min(pv.length, pg.length);
  for (let i = 0; i < n; i++) {
    const v = pv[i], g = pg[i];
    const ten = `phần "${g.tieuDe.slice(0, 18)}"`;
    if (v.cap !== g.cap) loi.push(`${ten}: cấp tiêu đề lệch ${g.cap}/${v.cap}`);
    for (const [k, nhan] of [['so', 'danh sách số'], ['gach', 'gạch đầu dòng'], ['trich', 'dòng trích'], ['hang', 'hàng bảng']]) {
      if (v[k] !== g[k]) loi.push(`${ten}: ${nhan} lệch: gốc ${g[k]}, bản Việt ${v[k]}`);
    }
    if (v.cot !== g.cot) loi.push(`${ten}: số cột bảng lệch: gốc ${g.cot}, bản Việt ${v.cot}`);
    if (v.doan !== g.doan) canh.push(`${ten}: số đoạn văn khác: gốc ${g.doan}, bản Việt ${v.doan}`);

    // Số liệu của gốc phải còn đủ (kể cả số lặp lại) trong đúng phần đó
    const sv = laySo(v.tieuDe + '\n' + v.text);
    const con = new Map();
    for (const s of sv) con.set(s, (con.get(s) || 0) + 1);
    // Số kèm 万/亿 thì bản Việt có thể viết đủ (15.000) hoặc theo nghìn, triệu, tỷ (15 nghìn, 1,5 triệu)
    const gocRaw = (g.tieuDe + '\n' + g.text).replace(/https?:\/\/\S+/g, ' ').replace(/\]\([^)]*\)/g, ']');
    const hoiVan = [...gocRaw.matchAll(/(\d+(?:\.\d+)?)\s*(万|亿)/g)].map(m => {
      const v = Number(m[1]) * (m[2] === '万' ? 1e4 : 1e8);
      return [v, v / 1e3, v / 1e6, v / 1e9].map(x => String(Number(x.toFixed(4))));
    });
    for (const nhom of hoiVan) {
      const hit = nhom.find(x => con.get(x));
      if (hit) con.set(hit, con.get(hit) - 1);
      else loi.push(`${ten}: thiếu số ${nhom[0]} của gốc`);
    }
    const gocBo = gocRaw.replace(/(\d+(?:\.\d+)?)\s*(万|亿)/g, ' ');
    for (const s of laySo(gocBo)) {
      if (con.get(s)) con.set(s, con.get(s) - 1);
      else loi.push(`${ten}: thiếu số ${s} của gốc`);
    }

    // Dẫn chiếu sang sách: số lần và cặp số phải khớp gốc
    const refG = [...g.text.matchAll(/第\s*(\d+)\s*节(?:\s*第\s*(\d+)\s*条)?/g)].map(m => m[2] ? `${m[1]}.${m[2]}` : m[1]).sort();
    const refV = [...v.text.matchAll(/chương (\d+)(?: mục (\d+))?/gi)].map(m => m[2] ? `${m[1]}.${m[2]}` : m[1]).sort();
    const thieu = refG.filter(x => { const k = refV.indexOf(x); if (k >= 0) { refV.splice(k, 1); return false; } return true; });
    if (thieu.length) loi.push(`${ten}: thiếu dẫn chiếu: ${thieu.join(', ')}`);
    if (refV.length) loi.push(`${ten}: dẫn chiếu không có ở gốc: ${refV.join(', ')}`);

    // Số khẩn cấp Trung Quốc trong phần dịch thì phải có số Việt Nam trong khung của cùng phần
    if (/(?<![\d.])(120|110|119)(?![\d.])/.test(g.text) && /(打|拨|电话|急救|报警)/.test(g.text)) {
      const kb = khung.filter(k => k.phan === i).map(k => k.text).join('\n');
      if (!/115|113|114/.test(kb)) canh.push(`${ten}: gốc có thể có số khẩn cấp Trung Quốc, chưa có số Việt Nam trong khung của phần này`);
    }
  }

  // Link phần dịch phải khớp link gốc; link Việt Nam chỉ nằm trong khung
  const lg = layLink(goc), lv = layLink(dich);
  // Link tới tài liệu của bản gốc không dịch (核实记录...) thì ghim commit trên repo gốc
  for (const u of lv) if (!lg.includes(u) && !u.startsWith('https://github.com/eternity4719/HowToLiveBetter/blob/e2605d3e')) loi.push(`link ngoài khung không có ở gốc: ${u}`);
  for (const u of lg) if (!lv.includes(u)) loi.push(`thiếu link của gốc: ${u}`);
  for (const m of dich.matchAll(/\]\((?!https?:|mailto:|#)([^)]+)\)/g)) {
    const dich1 = decodeURIComponent(m[1].split('#')[0]);
    if (!existsSync(resolve(VN_DIR, dich1))) loi.push(`link nội bộ hỏng: ${m[1]}`);
  }
  if (/\.\.\/docs\/|\.\.\/book\//.test(raw)) loi.push('còn link ../docs/ hoặc ../book/');

  // Dẫn chiếu tồn tại trong sách (cả phần dịch và khung)
  for (const m of raw.matchAll(/chương (\d+)(?: mục (\d+))?/gi)) {
    const c = Number(m[1]), mu = m[2] && Number(m[2]);
    if (!soMuc.has(c)) loi.push(`dẫn tới chương không có: ${m[0]}`);
    else if (mu && (mu < 1 || mu > soMuc.get(c))) loi.push(`dẫn tới mục không có: ${m[0]} (chương có ${soMuc.get(c)} mục)`);
  }

  // Chữ Hán: phần dịch cho phép khi có bản dịch ngay sau trong ngoặc
  // Tên văn bản Trung có dấu cách hoặc dấu câu ("第 7 部分：...", "...？...！") vẫn được giữ nguyên khi có bản dịch ngay sau trong ngoặc
  const boTen = t => t.replace(/[㐀-鿿][㐀-鿿0-9a-zA-Z\s：？！，、“”—·-]{0,60}?(?=\s?[(（])/g, '');
  const dichLoc = boTen(dich.split('\n').filter(l => !l.startsWith('<!--')).join('\n'));
  const bad = hanTrai(dichLoc);
  if (bad.length) loi.push(`chữ Hán ngoài chỗ cho phép: ${bad.slice(0, 5).join(' | ')}`);
  if (/[，。；：？！、]/.test(dichLoc.replace(/[㐀-鿿]/g, ''))) loi.push('có dấu câu Trung Quốc');

  // Khung Việt Nam
  khung.forEach((k, i) => {
    const ten = `khung ${i + 1}`;
    if (hanTrai(k.text).length) loi.push(`${ten}: chữ Hán: ${hanTrai(k.text).slice(0, 3).join(' | ')}`);
    const coNguon = /\*Nguồn VN:\*.*\]\(https?:/.test(k.text) && /\*Kiểm chứng ngày \d\d\/\d\d\/\d{4}\*/.test(k.text);
    const chua = /⚠️ Chưa kiểm chứng/.test(k.text);
    if (!coNguon && !chua) loi.push(`${ten}: thiếu "*Nguồn VN:*" có link và ngày kiểm chứng, hoặc "⚠️ Chưa kiểm chứng"`);
    if (/\bĐiều \d+/.test(k.text) && !coNguon) loi.push(`${ten}: nêu số điều luật mà không có nguồn`);
    if (/\*Nguồn VN:\*/.test(k.text) && !/\*Nguồn VN:\*.*\n?$/m.test(k.text)) canh.push(`${ten}: dòng nguồn lạ`);
  });
  if (!khung.length) canh.push('bài không có khung Việt Nam nào');

  return {
    loi, canh,
    chua: (raw.match(/Chưa kiểm chứng/g) || []).length,
    chu: dich.replace(/<!--.*-->/g, '').split(/\s+/).filter(Boolean).length,
    khung: khung.length,
  };
}

const args = process.argv.slice(2);
if (args[0] === '--goc') {
  const b = BAI.find(x => x.slug === args[1]);
  if (!b) { console.error('Không có bài: ' + args[1]); process.exit(2); }
  console.log(doc(resolve(GOC_DIR, b.goc)));
  process.exit(0);
}
const chon = args[0] ? BAI.filter(b => b.slug === args[0]) : BAI;
if (!chon.length) { console.error('Không có bài: ' + args[0]); process.exit(2); }
let tong = 0;
for (const b of chon) {
  const r = kiemMot(b);
  tong += r.loi.length;
  console.log(`${r.loi.length ? '❌' : '✅'} ${b.slug}: lỗi ${r.loi.length} · cảnh báo ${r.canh.length} · khung ${r.khung ?? 0} · "Chưa kiểm chứng" ${r.chua} · ${r.chu} chữ`);
  r.loi.slice(0, 40).forEach(s => console.log('   ❌ ' + s));
  r.canh.slice(0, 15).forEach(s => console.log('   ⚠️ ' + s));
}
process.exit(tong ? 1 : 0);
