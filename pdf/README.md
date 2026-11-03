# Dựng PDF Sống Đáng Tiền

Chạy ở thư mục `E:\AI\zero2better.com` bằng PowerShell:

```powershell
node .\song-dang-tien\pdf\build.mjs
python .\song-dang-tien\pdf\verify.py
```

Lệnh đầu đọc đủ 34 chương từ `sach/`, loại comment HTML, chuyển Markdown bằng Pandoc rồi biên dịch Typst. Đầu ra ở `out/`: bản trọn bộ và 34 chương, kèm bản kê nguồn SHA-256 trong `build-manifest.json`. Lệnh sau kiểm tra liên kết, số chương, comment, font và tạo ảnh xem trước cùng `verification.json`.

Typst 0.15.1 và Pandoc 3.13 là bản Windows x86_64 portable nằm trong `bin/`. Không cài hệ thống hoặc sửa PATH. Có thể chỉ định đường dẫn khác qua biến `TYPST`, `PANDOC`. Thư viện Python kiểm tra nằm riêng trong `bin/python-libs/`.

Nguồn tải công cụ chính thức:

- https://github.com/typst/typst/releases/tag/v0.15.1
- https://github.com/jgm/pandoc/releases/tag/3.13

Font từ kho Google Fonts chính thức, giấy phép SIL OFL 1.1 được lưu cạnh font:

- https://github.com/google/fonts/tree/main/ofl/bevietnampro
- https://github.com/google/fonts/tree/main/ofl/notoserif

Tiêu đề dùng Be Vietnam Pro; thân dùng Noto Serif. Tên nguồn tiếng Trung dùng font dự phòng Microsoft YaHei trên Windows. Cờ Việt Nam được vẽ trực tiếp bằng Typst để không phụ thuộc hỗ trợ emoji của máy.

Mẫu và cách ghép sách chuyển từ `eternity4719/HowToLiveBetter`, commit `e2605d3e`, công cụ MIT; giữ đầy đủ ghi công trong `LICENSE-MIT.txt`. Nội dung sách CC BY 4.0. Không tự đăng PDF lên web.
