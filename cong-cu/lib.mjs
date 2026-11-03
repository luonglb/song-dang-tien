// Thư viện dùng chung: đọc chương bản gốc (tiếng Trung) và chương bản Việt thành danh sách mục.
// Không phụ thuộc gói ngoài. Node >= 20.
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// Bản gốc clone ở ..\_goc (repo ngoài). Có thể đổi bằng biến môi trường GOC_DIR.
export const GOC = process.env.GOC_DIR || resolve(REPO, '..', '_goc');
export const GOC_COMMIT = 'e2605d3e';

export const read = p => readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
export const CHUONG = JSON.parse(read(resolve(REPO, 'cong-cu', 'chuong.json')));

export function chuong(so) {
  const c = CHUONG.find(x => x.so === Number(so));
  if (!c) throw new Error(`Không có chương ${so}`);
  return { ...c, gocPath: resolve(GOC, 'book', c.goc), vnPath: resolve(REPO, 'sach', c.slug + '.md') };
}

export const GOC_FIELDS = ['成本', '说人话', '收益', '证据等级', '来源', '备注'];
export const VN_FIELDS = ['Chi phí', 'Nói đơn giản', 'Lợi ích', 'Mức bằng chứng', 'Nguồn', 'Ghi chú'];

// Tách 1 file markdown thành { head, items:[{ so, title, lines, start }] } theo tiêu đề "### N. "
function splitItems(md) {
  const lines = md.split('\n');
  const items = []; const head = []; let cur = null;
  lines.forEach((l, i) => {
    const m = l.match(/^### (\d+)\. (.*)$/);
    if (m) { cur = { so: Number(m[1]), title: m[2].trim(), lines: [], start: i + 1 }; items.push(cur); return; }
    if (cur) cur.lines.push(l); else head.push(l);
  });
  return { head, items };
}

export function parseGoc(so) {
  const c = chuong(so);
  const { head, items } = splitItems(read(c.gocPath));
  for (const it of items) {
    it.tag = it.lines.find(l => l.startsWith('<!-- 成本标签')) || '';
    it.fields = {};
    for (const l of it.lines) {
      const m = l.match(/^- (成本|说人话|收益|证据等级|来源|备注)：(.*)$/);
      if (m) it.fields[m[1]] = m[2];
    }
    // dòng thừa ngoài 6 trường (nếu có) — để biết khi dịch
    it.extra = it.lines.filter(l => l.trim() && !l.startsWith('<!--') && !/^- (成本|说人话|收益|证据等级|来源|备注)：/.test(l));
  }
  return { chuong: c, head, items };
}

// Mục bản Việt: tách phần dịch (ngoài khung) và khung "🇻🇳 Ở Việt Nam" (các dòng bắt đầu bằng ">")
export function parseVn(so, path) {
  const c = chuong(so);
  const p = path || c.vnPath;
  if (!existsSync(p)) return null;
  const md = read(p);
  const { head, items } = splitItems(md);
  for (const it of items) {
    it.tag = it.lines.find(l => l.startsWith('<!-- 成本标签')) || '';
    const g = it.lines.map(l => l.match(/^<!-- goc: (\d+)\.(\d+) · viet-hoa: (\w+) -->$/)).find(Boolean);
    it.goc = g ? { chuong: Number(g[1]), muc: Number(g[2]), vh: g[3] } : null;
    it.fields = {}; it.fieldOrder = [];
    for (const l of it.lines) {
      const m = l.match(/^- \*\*([^*]+):\*\* ?(.*)$/);
      if (m) { it.fields[m[1]] = m[2]; it.fieldOrder.push(m[1]); }
    }
    it.box = it.lines.filter(l => l.startsWith('>')).join('\n');
    it.body = it.lines.filter(l => !l.startsWith('>')).join('\n');
  }
  return { chuong: c, md, head, items };
}

export const URL_RE = /https?:\/\/[^\s<>)\]」』，；。]+/g;
export const urls = s => new Set((s.match(URL_RE) || []).map(u => u.replace(/[.,;:]+$/, '')));
export const HAN_RE = /[㐀-鿿豈-﫿]/;

export function ratioOf(tag) {
  const m = tag.match(/钱=(\S+) 时间=(\S+) 毅力=(\S+) 收益=(\S+)/);
  if (!m) return null;
  const W = { money: { '0': 0, '少': 1, '多': 2 }, time: { '少': 0, '中': 1, '多': 2 }, will: { '否': 0, '些': 1, '是': 2 } };
  const cs = W.money[m[1]] + W.time[m[2]] + W.will[m[3]];
  if (m[4] === '大') return cs === 0 ? 'rat-cao' : cs <= 2 ? 'cao' : 'binh-thuong';
  return m[4] === '中' && cs === 0 ? 'cao' : 'binh-thuong';
}
