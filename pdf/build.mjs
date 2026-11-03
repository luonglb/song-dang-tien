// Adapted from eternity4719/HowToLiveBetter tools/pdf/build.mjs (MIT).
// Copyright (c) 2026 eternity4719. Full license: LICENSE-MIT.txt.
import {readFileSync, writeFileSync, mkdirSync, readdirSync, statSync} from 'node:fs';
import {resolve, dirname, basename} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const ROOT=dirname(fileURLToPath(import.meta.url));
const BOOK=resolve(ROOT,'..');
const OUT=resolve(ROOT,'out');
const WORK=resolve(OUT,'work');
mkdirSync(WORK,{recursive:true});
function findExe(dir,name) {
  for(const e of readdirSync(dir,{withFileTypes:true})) {
    const p=resolve(dir,e.name);
    if(e.isFile() && e.name.toLowerCase()===name) return p;
    if(e.isDirectory()) {const hit=findExe(p,name); if(hit) return hit;}
  }
}
const TYPST=process.env.TYPST || findExe(resolve(ROOT,'bin'),'typst.exe');
const PANDOC=process.env.PANDOC || findExe(resolve(ROOT,'bin'),'pandoc.exe');
if(!TYPST || !PANDOC) throw Error('Cần Typst và Pandoc portable trong pdf/bin/.');
const run=(cmd,args)=>execFileSync(cmd,args,{encoding:'utf8',maxBuffer:64*1024*1024});
const chapters=JSON.parse(readFileSync(resolve(BOOK,'cong-cu/chuong.json'),'utf8'));
if(chapters.length!==34) throw Error('Cần đủ 34 chương.');
const stamp=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Ho_Chi_Minh',day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date());
const snapshots=chapters.map(c=>{
 const path=resolve(BOOK,'sach',c.slug+'.md');
 const raw=readFileSync(path,'utf8');
 const md=raw.replace(/<!--[\s\S]*?-->/g,'').replace(/^\[←[^\n]+\n/gm,'')
  .replace(/\]\((?!https?:|mailto:|#)([^)]+)\)/g,(_,href)=>{
    const slug=basename(href.split('#')[0],'.md');
    if(chapters.some(x=>x.slug===slug)) return `](#chapter-${slug})`;
    return `](https://github.com/luonglb/song-dang-tien/blob/main/${href.replace(/^\.\.\//,'')})`;
  }).replace(/^(# .+)$/m,`$1 {#chapter-${c.slug}}`);
 return {...c,md,sha256:createHash('sha256').update(raw).digest('hex'),items:(raw.match(/^### /gm)||[]).length};
});
const results=[];
function build(name,selected,full) {
 let md=selected.map(c=>c.md).join('\n\n');
 // Individual PDFs cannot resolve references to chapters outside the selection.
 if(!full) md=md.replace(/\]\(#chapter-([^)]+)\)/g,(_,slug)=>slug===selected[0].slug?`](#chapter-${slug})`:`](https://zero2better.com/song-dang-tien/${slug}/)`);
 const input=resolve(WORK,name+'.md'); const typ=resolve(WORK,name+'.typ');
 writeFileSync(input,md);
 run(PANDOC,['--from=gfm+attributes','--to=typst','--wrap=none',`--template=${resolve(ROOT,'template.typ')}`,'-V',`subtitle=${full?'Trọn bộ 34 chương':selected[0].ten}`,'-V',`tocdepth=${full?1:3}`,'-V',`builddate=${stamp}`,'-o',typ,input]);
 const pdf=resolve(OUT,name+'.pdf');
 run(TYPST,['compile',typ,pdf,'--root',BOOK,'--font-path',resolve(ROOT,'fonts')]);
 results.push({file:basename(pdf),bytes:statSync(pdf).size});
 console.log(`Đã dựng ${basename(pdf)}`);
}
build('Song-Dang-Tien-tron-bo',snapshots,true);
for(const c of snapshots) build(c.slug,[c],false);
writeFileSync(resolve(OUT,'build-manifest.json'),JSON.stringify({date:stamp,typst:run(TYPST,['--version']).trim(),pandoc:run(PANDOC,['--version']).split('\n')[0],sourceCommit:'e2605d3e',chapters:snapshots.map(({md,...c})=>c),files:results},null,2));
console.log(`Xong ${results.length} PDF; ${snapshots.reduce((n,c)=>n+c.items,0)} mục.`);
