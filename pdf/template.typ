// Adapted from eternity4719/HowToLiveBetter tools/pdf/template.typ (MIT).
// Copyright (c) 2026 eternity4719. Full license: LICENSE-MIT.txt.
#set terms(hanging-indent: 1.5em)
#set table(inset: 6pt, stroke: 0.3pt + luma(220))
#show table.cell: it => align(left, it)
#let horizontalRule = line(length: 100%, stroke: 0.4pt + luma(220))
#let divider = horizontalRule
#show figure.where(kind: table): set figure.caption(position: top)
#show figure: set block(breakable: true)
#set smartquote(enabled: false)
#set document(title: "Sống Đáng Tiền", author: ("eternity4719", "zero2better.com"))
#set text(font: ("Noto Serif", "Microsoft YaHei", "Segoe UI Emoji"), size: 10pt, lang: "vi")
#set par(justify: false, leading: 0.65em, spacing: 0.75em)
#set list(indent: 0.5em, spacing: 0.6em)
#show raw: set text(font: "Consolas", size: 8pt)
#show link: set text(fill: rgb("245d91"))
#show "🇻🇳": box(width: 1.3em, height: 0.85em, fill: rgb("da251d"), baseline: 15%)[#align(center + horizon, text(font: "Segoe UI Symbol", size: 7pt, fill: rgb("ffff00"))[★])]
#show heading: set text(font: "Be Vietnam Pro", fill: rgb("174d44"))
#show heading: set block(sticky: true, above: 1.3em, below: 0.6em)
#show heading.where(level: 1): set text(21pt)
#show heading.where(level: 2): set text(14pt)
#show heading.where(level: 3): set text(11pt)
#show heading.where(level: 1): it => { pagebreak(weak: true); it }
#show quote.where(block: true): it => block(
  fill: rgb("edf6f2"), stroke: (left: 2pt + rgb("398671")),
  inset: 10pt, radius: 3pt, width: 100%, breakable: true,
)[#it.body]
#let running-head = context {
  set text(font: "Be Vietnam Pro", size: 8pt, fill: luma(110))
  [Sống Đáng Tiền #h(1fr) zero2better.com]
}
#set page(paper: "a4", margin: (x: 2cm, top: 2cm, bottom: 2.1cm), header: none,
  footer: context {
    set text(size: 8pt, fill: luma(110))
    grid(columns: (1fr, auto), link("https://zero2better.com")[Tài liệu miễn phí · zero2better.com], counter(page).display())
  })
#align(center + horizon)[
  #text(font: "Be Vietnam Pro", size: 12pt, fill: rgb("398671"))[ZERO2BETTER.COM]
  #v(1.5cm)
  #text(font: "Be Vietnam Pro", weight: "bold", size: 40pt, fill: rgb("174d44"))[Sống Đáng Tiền]
  #v(0.8cm)
  #text(size: 15pt)[$subtitle$]
  #v(1.5cm)
  Mỗi ngày tốt hơn một chút.
  #v(1cm)
  #text(size: 10pt)[Bản cộng đồng, chưa qua chuyên gia duyệt]
  #v(0.5cm)
  #text(size: 9pt, fill: luma(110))[Bản dựng ngày $builddate$ · Miễn phí]
]
#pagebreak()
#heading(level: 1, outlined: false)[Ghi công và giấy phép]
Tác giả bản gốc: *eternity4719*. Bản Việt hoá được dịch từ tiếng Trung, biên tập và bổ sung phần “Ở Việt Nam” bởi dự án zero2better.com.

- Bản gốc: #link("https://github.com/eternity4719/HowToLiveBetter")[github.com/eternity4719/HowToLiveBetter]
- Bản dịch và báo lỗi: #link("https://github.com/luonglb/song-dang-tien")[github.com/luonglb/song-dang-tien]
- Đọc online: #link("https://zero2better.com/song-dang-tien/")[zero2better.com/song-dang-tien/]

Nội dung được phát hành theo #link("https://creativecommons.org/licenses/by/4.0/")[Creative Commons Attribution 4.0 (CC BY 4.0)]. Khi chia sẻ hoặc sửa đổi, ghi công tác giả và nguồn, dẫn giấy phép, nêu rõ thay đổi. Các khung “Ở Việt Nam” là phần bổ sung của bản Việt.

Commit bản gốc: `e2605d3e` (21/10/2026). Ngày dựng PDF: $builddate$.

Công cụ PDF chuyển từ mẫu MIT của eternity4719. Font Be Vietnam Pro và Noto Serif dùng giấy phép SIL Open Font License 1.1.

*Bản cộng đồng, chưa qua chuyên gia duyệt.* Chỉ để tham khảo, không thay lời khuyên của bác sĩ, luật sư. Những chỗ chưa kiểm chứng vẫn được giữ để bạn nhận biết giới hạn của tài liệu.

#heading(level: 1, outlined: false)[Lời nói đầu]
Cuốn sách tập hợp những việc thực tế giúp bạn bảo vệ sức khoẻ, thời gian, tiền bạc và người thân. Bạn có thể đọc theo chương hoặc dùng mục lục để tìm tình huống mình đang gặp.

Phần dịch giữ bối cảnh bản gốc; khung nền xanh “Ở Việt Nam” trình bày phần đối chiếu dành cho người đọc Việt. Hãy đọc cả nguồn, ngày kiểm chứng và cảnh báo trước khi áp dụng.

#pagebreak()
#outline(title: [Mục lục], depth: $tocdepth$, indent: 0pt)
#pagebreak(weak: true)
#set page(header: running-head)
$body$
