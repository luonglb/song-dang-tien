# Dựng EPUB Sống Đáng Tiền

```powershell
node .\song-dang-tien\epub\build.mjs
python .\song-dang-tien\epub\verify.py
```

`build.mjs` đọc 34 chương từ `sach/` ở commit hiện tại (HEAD), nên phải commit trước khi dựng. Đầu ra: `epub/out/Song-Dang-Tien.epub`. `verify.py` kiểm đủ chương và mục, XHTML hợp lệ, link nội bộ, metadata.

Công cụ: Typst và Pandoc 3.13 portable trong `pdf/bin/` (xem `pdf/README.md`). EPUBCheck và Java portable để trong `epub/bin/`, không cài hệ thống, không commit.

- `bia.typ`: bìa. `style.css`: giao diện. `dau-sach.md`: ghi công và lời nói đầu.
- `nhan.lua`: đưa nhãn đậm (Chi phí, Nguồn...) thành dòng riêng, nội dung nằm sát dưới.
- Ghi công nằm ở trang tiêu đề của Pandoc, nên đứng trước mục lục.
- Không thêm `page-break-before` cho `h1`: Apple Books sẽ hiện trang trắng.
- Dòng link cuối mỗi chương chỉ có trong EPUB, không sửa `sach/`.

Nội dung sách theo CC BY 4.0, công cụ theo MIT.
