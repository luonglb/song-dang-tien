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
assert len(manifest['files']) == 36
assert len(manifest['bai']) == 9
assert sum(c['items'] for c in manifest['chapters']) == 767
for c in manifest['chapters']:
    assert hashlib.sha256((ROOT.parent / 'sach' / (c['slug']+'.md')).read_bytes()).hexdigest() == c['sha256'], c['slug']
for b in manifest['bai']:
    assert hashlib.sha256((ROOT.parent / 'bai' / (b['slug']+'.md')).read_bytes()).hexdigest() == b['sha256'], b['slug']
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
        assert 'Tốt hơn mỗi ngày - zero2better.com' in text, (path.name, p.number)
        assert any(l.get('uri') == 'https://zero2better.com' for l in p.get_links())
    rows.append({'file':path.name, 'pages':len(doc), 'bytes':path.stat().st_size,
                 'bookmarks':len(doc.get_toc()), 'links':sum(len(p.get_links()) for p in doc)})
    doc.close()
doc = fitz.open(out / 'Song-Dang-Tien-tron-bo.pdf')
# Mục lục trọn bộ có thể sang trang: quét từ trang 4 tới trước trang đầu chương 1.
muc1 = [r for r in doc.get_toc() if r[0] == 1]
tieu_de = [r[1] for r in muc1]
assert len(muc1) == 44, len(muc1)   # 34 chương + trang mở Phụ lục + 9 bài
assert [t.split('.')[0] for t in tieu_de[:34]] == [str(i) for i in range(1, 35)], tieu_de[:34]
assert tieu_de[34].startswith('Phụ lục'), tieu_de[34]
assert muc1[34][2] > muc1[33][2], 'Phụ lục phải sau chương 34'
toc = [l for i in range(3, muc1[0][2] - 1) for l in doc[i].get_links() if l['kind'] in (fitz.LINK_GOTO, fitz.LINK_NAMED) and 'page' in l]
assert len(toc) == 44, len(toc)
assert all(0 <= l['page'] < len(doc) for l in toc)
# Link trong sách tới bài dài phải là link nội bộ, không còn trỏ GitHub hay bản Trung.
tat_ca = [l.get('uri', '') for p in doc for l in p.get_links() if l.get('uri')]
assert not [u for u in tat_ca if '/blob/main/bai/' in u], 'tron-bo con link bai ra GitHub'
assert not [u for u in tat_ca if 'HowToLiveBetter/blob/' in u and '/docs/' in u], 'tron-bo con link bai ban Trung'
dai = fitz.open(out / 'Song-Dang-Tien-bai-dai.pdf')
assert len([r for r in dai.get_toc() if r[0] == 1]) == 9
assert not [l for p in dai for l in p.get_links() if '/blob/main/bai/' in l.get('uri', '')]
dai.close()
fonts = {font[3] for p in doc for font in p.get_fonts()}
assert any('BeVietnamPro' in f for f in fonts)
assert any('NotoSerif' in f for f in fonts)
vn = next(i for i,p in enumerate(doc) if i > 5 and 'Ở Việt Nam' in p.get_text())
pl = muc1[34][2] - 1
for i in sorted({0,1,3,len(doc)//2,vn,pl,pl+1}):
    doc[i].get_pixmap(matrix=fitz.Matrix(1.3,1.3)).save(out / f'check-{i+1}.png')
report = {'files':rows,'fullPages':len(doc),'tocInternalLinks':len(toc),
          'fonts':sorted(fonts), 'previewPages':[1,2,4,len(doc)//2+1,vn+1,pl+1,pl+2],'phuLucTrang':pl+1,
          'totalBytes':sum(r['bytes'] for r in rows)}
(out / 'verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),'utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
