// Phụ lục 9 bài dài, dùng chung cho pdf/build.mjs và epub/build.mjs.
import {readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const REPO=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const BAI=JSON.parse(readFileSync(resolve(REPO,'cong-cu/bai.json'),'utf8'));
const CO_BAI=new Set(BAI.map(b=>b.slug));

// Link bài dài trong sách là URL GitHub tuyệt đối. Trọn bộ và EPUB có sẵn Phụ lục nên nhảy nội bộ.
export function linkBaiNoiBo(md){
  return md.replace(/\]\(https:\/\/github\.com\/luonglb\/song-dang-tien\/blob\/main\/bai\/([a-z0-9-]+)\.md\)/g,(all,slug)=>{
    if(!CO_BAI.has(slug)) throw Error('Link tới bài không có: '+slug);
    return `](#bai-${slug})`;
  });
}

// Lọc một bài: bỏ comment, dòng về mục lục; đổi link tương đối.
// chuongLink(slug) trả đích cho link tới chương.
export function locBai(raw,slug,chapters,chuongLink){
  const md=raw.replace(/\r/g,'').replace(/<!--[\s\S]*?-->/g,'').replace(/^\[←[^\n]+\n/gm,'')
   .replace(/\]\((?!https?:|mailto:|#)([^)]+)\)/g,(_,href)=>{
     const ten=href.split('#')[0].split('/').pop().replace(/\.md$/,'');
     if(chapters.some(c=>c.slug===ten)) return `](${chuongLink(ten)})`;
     if(CO_BAI.has(ten)) return `](#bai-${ten})`;
     throw Error(`${slug}: link tương đối lạ: ${href}`);
   });
  if(!/^# .+$/m.test(md)) throw Error(slug+': thiếu tiêu đề');
  return md.replace(/^(# .+)$/m,`$1 {#bai-${slug}}`).trim();
}

export function moPhuLuc(){
  return ['# Phụ lục: 9 bài dài {#phu-luc}','',
   'Chín bài dài trong bản gốc, dịch từ tiếng Trung. Phần dịch giữ bối cảnh Trung Quốc của bản gốc. Khung "Ở Việt Nam" là phần đối chiếu của bản Việt, giống như ở các chương. Phụ lục không làm thay đổi số chương và số mục của sách.','',
   ...BAI.map(b=>{
     // Lấy đúng tiêu đề của bài để khớp mục lục.
     const h1=readFileSync(resolve(REPO,'bai',b.slug+'.md'),'utf8').match(/^# (.+)$/m)[1].trim();
     return `- [${h1}](#bai-${b.slug})`;
   })].join('\n');
}
