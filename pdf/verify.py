"""Kiểm tra PDF; thư viện nằm riêng trong bin/python-libs."""
from pathlib import Path
import sys, json, hashlib
ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / 'bin/python-libs'))
import pymupdf as fitz

out = ROOT / 'out'
manifest = json.loads((out / 'build-manifest.json').read_text('utf-8'))
expected = {'https://github.com/eternity4719/HowToLiveBetter',
            'https://github.com/luonglb/song-dang-tien',
            'https://zero2better.com/song-dang-tien/'}
assert len(manifest['files']) == 35
assert sum(c['items'] for c in manifest['chapters']) == 767
for c in manifest['chapters']:
    assert hashlib.sha256((ROOT.parent / 'sach' / (c['slug']+'.md')).read_bytes()).hexdigest() == c['sha256'], c['slug']
rows = []
for record in manifest['files']:
    path = out / record['file']
    doc = fitz.open(path)
    credit = {l.get('uri') for l in doc[1].get_links()}
    assert expected <= credit, path.name
    assert doc.get_toc(), path.name
    for p in doc:
        text = p.get_text()
        assert '<!--' not in text and '成本标签' not in text, (path.name, p.number)
        assert 'Tài liệu miễn phí' in text, (path.name, p.number)
        assert any(l.get('uri') == 'https://zero2better.com' for l in p.get_links())
    rows.append({'file':path.name, 'pages':len(doc), 'bytes':path.stat().st_size,
                 'bookmarks':len(doc.get_toc()), 'links':sum(len(p.get_links()) for p in doc)})
    doc.close()
doc = fitz.open(out / 'Song-Dang-Tien-tron-bo.pdf')
toc = [l for l in doc[3].get_links() if l['kind'] in (fitz.LINK_GOTO, fitz.LINK_NAMED) and 'page' in l]
assert len(toc) == 34
assert len([r for r in doc.get_toc() if r[0] == 1]) == 34
assert all(0 <= l['page'] < len(doc) for l in toc)
fonts = {font[3] for p in doc for font in p.get_fonts()}
assert any('BeVietnamPro' in f for f in fonts)
assert any('NotoSerif' in f for f in fonts)
vn = next(i for i,p in enumerate(doc) if i > 5 and 'Ở Việt Nam' in p.get_text())
for i in sorted({0,1,3,len(doc)//2,vn}):
    doc[i].get_pixmap(matrix=fitz.Matrix(1.3,1.3)).save(out / f'check-{i+1}.png')
report = {'files':rows,'fullPages':len(doc),'tocInternalLinks':len(toc),
          'fonts':sorted(fonts), 'previewPages':[1,2,4,len(doc)//2+1,vn+1],
          'totalBytes':sum(r['bytes'] for r in rows)}
(out / 'verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),'utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
