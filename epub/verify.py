"""Kiểm tra EPUB: đủ chương, đủ mục, XHTML hợp lệ, link nội bộ, nhãn và dòng cuối chương. Chỉ đọc."""
from pathlib import Path
from posixpath import dirname, join, normpath
from urllib.parse import unquote
import json, re, sys, zipfile
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent
EPUB = ROOT / 'out' / 'Song-Dang-Tien.epub'
XH = '{http://www.w3.org/1999/xhtml}'
OPF = '{http://www.idpf.org/2007/opf}'
DC = '{http://purl.org/dc/elements/1.1/}'
loi = []
z = zipfile.ZipFile(EPUB)
assert z.testzip() is None
assert z.infolist()[0].filename == 'mimetype' and z.read('mimetype') == b'application/epub+zip'

goc = ET.fromstring(z.read('EPUB/content.opf'))
items = {i.get('id'): i.get('href') for i in goc.iter(OPF + 'item')}
spine = [items[i.get('idref')] for i in goc.iter(OPF + 'itemref')]
doc = {}
for n in z.namelist():
    if n.endswith(('.xhtml', '.ncx', '.opf', '.xml')):
        try:
            doc[n] = ET.fromstring(z.read(n))
        except ET.ParseError as e:
            loi.append(f'XML hỏng {n}: {e}')
trang = [n for n in doc if n.endswith('.xhtml')]
ids = {n: {e.get('id') for e in doc[n].iter() if e.get('id')} for n in trang}

so_link = so_ngoai = 0
for n in trang:
    for a in doc[n].iter(XH + 'a'):
        href = a.get('href') or ''
        if re.match(r'^[a-z]+:', href):
            so_ngoai += 1
            continue
        so_link += 1
        p, _, neo = href.partition('#')
        dich = normpath(join(dirname(n), unquote(p))) if p else n
        if dich not in doc:
            loi.append(f'Link hỏng {n}: {href}')
        elif neo and neo not in ids[dich]:
            loi.append(f'Neo hỏng {n}: {href}')

chuong = []
for href in spine:
    n = join('EPUB', href)
    if not href.startswith('text/ch'):
        continue
    h1 = [''.join(e.itertext()).strip() for e in doc[n].iter(XH + 'h1')]
    if len(h1) != 1:
        loi.append(f'{n}: {len(h1)} h1')
    h3 = sum(1 for _ in doc[n].iter(XH + 'h3'))
    cuoi = [e for e in doc[n].iter(XH + 'p') if e.get('class') == 'cuoi-chuong']
    nhan = [e for e in doc[n].iter(XH + 'span') if e.get('class') == 'nhan']
    chuong.append(dict(file=n, ten=h1[0] if h1 else '', muc=h3, cuoi=len(cuoi), nhan=len(nhan)))

so_chuong = [c for c in chuong if re.match(r'^\d+\.', c['ten'])]
if [c['ten'].split('.')[0] for c in so_chuong] != [str(i) for i in range(1, 35)]:
    loi.append('Sai thứ tự hoặc thiếu chương 1 đến 34')
tong_muc = sum(c['muc'] for c in so_chuong)
if tong_muc != 767:
    loi.append(f'Có {tong_muc} mục, cần 767')
for c in so_chuong:
    if c['cuoi'] != 1:
        loi.append(f"{c['file']}: {c['cuoi']} dòng cuối chương")

tong_nhan = sum(c['nhan'] for c in so_chuong)
van_ban = {n: z.read(n).decode('utf-8') for n in trang}
for n, s in van_ban.items():
    if '<!--' in s or '成本标签' in s:
        loi.append(f'Comment HTML sót: {n}')
    if re.search(r'nhan">.{0,200}?</span>\s', s) and re.search(r'class="nhan"><strong>[^<]*</strong></span>[ \n]', s):
        loi.append(f'Còn khoảng trắng sau nhãn: {n}')
    if '../docs/' in s:
        loi.append(f'Còn link ../docs/: {n}')

tacgia = [e.text for e in goc.iter(DC + 'creator')]
vitri_nav = next(i for i, h in enumerate(spine) if 'nav' in h)
vitri_tp = next(i for i, h in enumerate(spine) if 'title_page' in h)
nav = next(n for n in trang if n.endswith('nav.xhtml'))
if vitri_tp >= vitri_nav:
    loi.append('Ghi công không đứng trước mục lục')
if 'Ghi công và giấy phép' not in van_ban[join('EPUB', spine[vitri_tp])]:
    loi.append('Trang đầu thiếu ghi công')
if 'Mục lục' not in van_ban[nav]:
    loi.append('Thiếu tiêu đề Mục lục')
if tacgia != ['eternity4719', 'zero2better.com']:
    loi.append(f'Sai tác giả: {tacgia}')
quyen = [e.text for e in goc.iter(DC + 'rights')]
if not quyen or 'CC BY 4.0' not in quyen[0]:
    loi.append(f'Sai giấy phép: {quyen}')

print(json.dumps(dict(trang_xhtml=len(trang), chuong=len(so_chuong), muc=tong_muc, nhan=tong_nhan,
                      link_noi_bo=so_link, link_ngoai=so_ngoai, spine_dau=spine[:4], tac_gia=tacgia,
                      dung_luong_mb=round(EPUB.stat().st_size / 1048576, 2), loi=len(loi)), ensure_ascii=False))
for l in loi[:40]:
    print('LỖI', l)
sys.exit(1 if loi else 0)
