// In nguyên văn bản gốc tiếng Trung để dịch.
// node cong-cu/goc.mjs 13         lời dẫn chương 13 (phần trước mục 1)
// node cong-cu/goc.mjs 13 5       mục 13.5
// node cong-cu/goc.mjs 13 5-9     mục 13.5 đến 13.9
// node cong-cu/goc.mjs 13 list    danh sách tiêu đề + 成本标签
import { parseGoc } from './lib.mjs';
const [so, sel] = process.argv.slice(2);
const g = parseGoc(so);
if (!sel) { console.log(g.head.join('\n').trim()); process.exit(0); }
if (sel === 'list') { for (const it of g.items) console.log(`${so}.${it.so}\t${it.title}\t${it.tag}`); process.exit(0); }
const [a, b] = sel.split('-').map(Number);
for (const it of g.items.filter(x => x.so >= a && x.so <= (b || a))) {
  console.log(`### ${it.so}. ${it.title}\n${it.lines.join('\n').trim()}\n`);
}
