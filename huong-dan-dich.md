# Hướng dẫn dịch "Sống Đáng Tiền"

Đọc hết trang này trước khi dịch. Mọi người dịch (Claude, Codex, người) theo cùng một cách. Có góp ý mới của người dùng → ghi vào mục **"Sổ góp ý"** cuối file.

## 1. Luật nguồn (cứng, không ngoại lệ)
- **Chỉ dịch từ bản gốc tiếng Trung**: `..\_goc\book\*.md` (eternity4719/HowToLiveBetter, commit `e2605d3e`). Xem nguyên văn: `node cong-cu/goc.mjs <chương> <mục>`.
- ⛔ **Không mở, không đọc, không chép bất kỳ bản tiếng Việt nào khác** của cuốn sách này (repo GitHub, web, PDF, Google Drive, kết quả tìm kiếm có trích đoạn). Tìm kiếm ra một bản dịch tiếng Việt khác → đóng lại, không dùng, không trích.
- Được dùng: văn bản pháp luật VN, cổng Bộ/ngành VN, WHO, bài báo khoa học, tài liệu gốc mà bản gốc dẫn.

## 2. Hai phần của mỗi mục — không trộn
| Phần | Là gì | Luật |
|---|---|---|
| **Ngoài khung** (tiêu đề + 6 trường) | Bản dịch trung thành của tác giả gốc | Được biên tập cho tự nhiên. **Không thêm ý, không bớt ý, không đổi số liệu, không bỏ cảnh báo.** Số 120/110/119, tên luật TQ… giữ nguyên như gốc. |
| **Trong khung "🇻🇳 Ở Việt Nam"** | Phần riêng của bản Việt | Đối chiếu Việt Nam: số khẩn cấp, luật, chế độ, giá, thuốc. **Mọi câu về luật VN phải có nguồn.** |

## 3. Khung một mục (copy đúng)
```markdown
### 1. Có người ngã gục, gọi không tỉnh, không thở bình thường: ép tim ngay, nhờ người gọi 120 và tìm máy AED
<!-- 成本标签: 钱=0 时间=中 毅力=否 收益=大 口径=死亡率 -->
<!-- goc: 13.1 · viet-hoa: vang -->
- **Chi phí:** …
- **Nói đơn giản:** …
- **Lợi ích:** …
- **Mức bằng chứng:** A
- **Nguồn:** …
- **Ghi chú:** …

> **🇻🇳 Ở Việt Nam**
> - Gọi **115** (cấp cứu). …
> *Nguồn VN:* [Tên văn bản, điều khoản](https://link) · *Kiểm chứng ngày 03/11/2026*
```
- Số thứ tự mục **giữ nguyên** như gốc.
- Dòng `<!-- 成本标签 … -->` **chép y nguyên** từ gốc (kể cả `人群=…`).
- Dòng `<!-- goc: C.M · viet-hoa: xanh|vang|do -->`: nhãn lấy từ `tien-do/phan-loai.csv`; thấy nhãn sai thì sửa cả csv và ghi lý do vào báo cáo.
- 6 trường đúng thứ tự, nhãn in đậm có dấu hai chấm **bên trong** `**…:**`, mỗi trường **một dòng** (không xuống dòng giữa trường).
- Nhãn `do` → thêm một dòng riêng ngay dưới 6 trường: `*Chỉ áp dụng ở Trung Quốc.*`
- Nhãn `vang` → **bắt buộc** có khung VN. Nhãn `xanh` → chỉ thêm khung khi có khác biệt thật (số khẩn cấp, thuốc, giá, ví dụ VN).

## 4. Mức Việt hoá
| Nhãn | Khi nào | Làm gì |
|---|---|---|
| `xanh` | Khoa học / kỹ năng dùng mọi nơi | Dịch. Khung VN chỉ khi có khác biệt thật |
| `vang` | Có luật/chế độ TQ, VN có cái tương ứng | Dịch, ghi "(Trung Quốc)" sau thể chế TQ. Khung VN bắt buộc: quy định VN + điều khoản + link + ngày kiểm chứng |
| `do` | Chỉ có ở TQ | Dịch gọn (vẫn đủ ý), dòng "*Chỉ áp dụng ở Trung Quốc.*". Có thứ thay thế ở VN → khung VN |

**Mục cấp cứu có số 120/110/119** → luôn có khung VN ghi số Việt Nam tương ứng (115/113/114), dù nhãn `xanh`.

## 5. Khung "🇻🇳 Ở Việt Nam" — chống bịa
- Mỗi câu về luật VN: **tên văn bản + số hiệu + điều/khoản + link** (ưu tiên `vbpl.vn`, `chinhphu.vn`, `thuvienphapluat.vn`, `moh.gov.vn`, cổng Bộ/ngành) + `*Kiểm chứng ngày dd/mm/yyyy*` (ngày bạn mở link thật).
- **Mở link, đọc đúng điều khoản** rồi mới viết. Văn bản phải còn hiệu lực. Đã đổi gần đây: Luật BHXH 2024 (hiệu lực 01/7/2025), Luật BHYT sửa đổi 2024, Luật Đất đai 2024, Luật Nhà ở 2023, Luật KD BĐS 2023, Bộ luật Lao động 2019, Luật TTATGT đường bộ 2024 + Nghị định 168/2024.
- Không tìm được nguồn thật → viết `⚠️ Chưa kiểm chứng: <điều cần kiểm>` trong khung. **Không đoán số điều, không đoán mức phạt.** Một câu "⚠️ Chưa kiểm chứng" tốt hơn một điều khoản bịa.
- Số liệu VN: chỉ từ cơ quan chính thức (Bộ Y tế, Cục Thống kê, WHO VN…) hoặc bài báo khoa học. Báo chí chỉ để chứng minh "đã xảy ra", ghi "chỉ có báo chí đưa tin".
- Giá: ước bằng đồng, ghi "ước tính tháng 11/2026". Không ước được → "X nhân dân tệ (khoảng Y đồng, tỷ giá ngày dd/mm/yyyy)".
- Khung ngắn: 1–5 gạch đầu dòng. Không lặp lại phần dịch.
- Link VN **chỉ** đặt trong khung (máy kiểm so tập link phần dịch với gốc).

### Số khẩn cấp Việt Nam (đã kiểm W0, xem `thuat-ngu.md` mục Số khẩn cấp)
**115** cấp cứu y tế · **114** cứu hoả, cứu nạn cứu hộ · **113** công an · **112** tìm kiếm cứu nạn · **111** tổng đài bảo vệ trẻ em · **1900 9095** đường dây nóng Bộ Y tế.

## 6. Giọng văn
- Xưng **"bạn"**. Câu ngắn, mỗi câu một ý. Viết như người Việt nói.
- **Không dịch sát chữ Hán.** Cấm Hán-Việt ngượng: "vạch khởi tuyến", "vùng quyết toán", "tiến hành thao tác", "hữu hiệu tính". Hỏi: người Việt bình thường có nói câu này không?
  - 说人话 → "Nói đơn giản"; 不花钱 → "Không tốn tiền."; 划算 → "đáng", "lời"; 别急着 → "đừng vội".
- **Nói đơn giản**: 1–3 câu, người không học y/luật đọc hiểu ngay.
- **Tiêu đề mục**: một câu, bắt đầu bằng động từ hoặc tình huống, giữ đủ các vế như gốc.
- Văn bản gốc trích nguyên văn trong 「」 → dịch sang tiếng Việt trong ngoặc kép "…". Câu trích tiếng Anh trong Nguồn giữ nguyên.
- Thuật ngữ: theo `thuat-ngu.md`. Y khoa theo cách Bộ Y tế dùng. Thuốc theo tên hoạt chất (INN): alteplase, paracetamol, epinephrine (adrenaline)…

## 7. Số, đơn vị, trích dẫn
- Số kiểu VN: `142.740`; `7,6%`; `OR = 1,75`; khoảng tin cậy: "khoảng tin cậy 95% từ 1,35 đến 2,27". Năm không có dấu chấm: `2025`.
- Không đổi số liệu. Đổi đơn vị chỉ khi gốc dùng đơn vị TQ (斤 → "X cân TQ (khoảng Y kg)").
- **Nguồn**: giữ nguyên tên tác giả, tên bài báo, tạp chí, DOI, URL (tiếng Anh). Phần chữ Trung trong Nguồn:
  - Tên văn bản/cơ quan TQ: giữ chữ Hán + dịch trong ngoặc: `全国人大 (Quốc hội Trung Quốc) (2020). 民法典 (Bộ luật Dân sự Trung Quốc) (Điều 184).`
  - Các chữ nối như 第 154 页, 见, 转载 → dịch: "trang 154", "xem", "bản đăng lại".
  - Ngăn cách nguồn bằng ` ; ` như gốc.
- Ngoài trường Nguồn **không để chữ Hán**, trừ tên văn bản TQ kèm bản dịch ngay sau trong ngoặc: `民法典 (Bộ luật Dân sự Trung Quốc)`. Lần sau trong cùng mục có thể chỉ viết "Bộ luật Dân sự Trung Quốc".
- Dẫn chiếu chéo "见第 8 节第 3 条（反诈硬规则）" → "xem chương 8 mục 3 (luật cứng chống lừa đảo)". Link file `../docs/…md` → giữ link tên file gốc tạm thời, viết `(bài dài: …)`; Manager sẽ đổi sang `../bai/…` khi dịch xong W3.
- Mọi thể chế/cơ quan/chế độ TQ: kèm "(Trung Quốc)" **lần đầu trong mục**: "bảo hiểm y tế (Trung Quốc)", "Toà án Nhân dân Tối cao (Trung Quốc)".

## 8. Mức bằng chứng
Giữ chữ cái như gốc (A/B/C/D…). Nếu gốc có thêm chữ sau (vd "B（争议）") → dịch phần chữ: "B (còn tranh cãi)".

## 9. Quy trình một chương
1. `node cong-cu/goc.mjs <C>` (lời dẫn) và `node cong-cu/goc.mjs <C> <M>` (từng mục).
2. Viết nháp **mỗi mục một file**: `sach/_nhap/<CC>/<MM>.md` (vd `sach/_nhap/13/07.md`); lời dẫn + tiêu đề chương ở `00.md`:
   ```markdown
   # 13. Tình huống khẩn cấp: làm gì trước

   …lời dẫn…
   ```
3. `node cong-cu/ghep.mjs <C>` → `sach/<slug>.md`.
4. `node cong-cu/kiem.mjs <C>` → sửa tới khi ✅ (0 lỗi).
5. Ghi trạng thái vào `tien-do/trang-thai.json` (Manager làm).

## 10. Sổ góp ý (cập nhật khi người dùng/Codex góp ý)
- *(chưa có)*
