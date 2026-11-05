## Lần 1 (Codex độc lập) — 05/11/2026

Máy kiểm: Codex, Windows + PowerShell 5.1 + Node.js v24.22.1; kiểm tại `E:\AI\zero2better.com\song-dang-tien`.
Phiên bản: HEAD `63bdf162c82a00006c6431bfe23576df0b0209ae`; so với `6a9f2ea`, không dùng diff rỗng của cây làm việc.
Phạm vi: 18 mục 1.26, 2.39, 8.37, 10.18, 11.15, 13.39, 26.1–26.10, 26.12, 26.13; thêm 26.00, 26.11 và 7 liên kết bài dài. Đã đọc ghi chú Worker, trọn các khung và phần dịch liền kề. Chỉ ghi báo cáo này; không sửa sách, không ghép chương, không commit, không push, không mở bản dịch tiếng Việt khác.

### Lỗi xác nhận được

- [CAO] **26.12 · thiếu phân biệt chủ thể và thời điểm thông báo dữ liệu cá nhân.** Câu hiện tại bắt đầu “Phát hiện vi phạm … phải thông báo … chậm nhất 72 giờ”, rồi gộp nghĩa vụ lập biên bản. [Luật 91/2025/QH15, Điều 23 khoản 1–2, bản PDF Công báo](https://congbao.chinhphu.vn/van-ban/luat-so-91-2025-qh15-45578/57730.htm) phân biệt: bên kiểm soát, bên kiểm soát và xử lý, bên thứ ba báo cơ quan chuyên trách trong 72 giờ; bên chỉ xử lý dữ liệu phải báo **kịp thời cho bên kiểm soát hoặc bên kiểm soát và xử lý**. Khoản 2 giao lập biên bản cho hai nhóm kiểm soát, không gộp mọi chủ thể. Người làm dịch vụ xử lý dữ liệu có thể hiểu nhầm được chờ 72 giờ hoặc báo sai đầu mối. Đề xuất: tách từng vai trò và kênh báo; giữ điều kiện về nguy cơ tổn hại. Phần bổ sung báo ngay sự cố an ninh mạng theo Luật 116 là đúng nhưng không thay được nhánh báo dữ liệu cá nhân còn thiếu. Đây là lỗi ở câu cũ liền kề vẫn còn sau W8.
- [VỪA] **2.39 · điều kiện nghỉ 45 phút chưa đủ.** Câu “làm từ 6 giờ/ngày trở lên … ban đêm ít nhất 45 phút” chưa nêu phải có ít nhất **3 giờ trong khung giờ ban đêm**. [Nghị định 145/2020/NĐ-CP, Điều 64 khoản 1 và Điều 63 khoản 3, Công báo trang 59](https://congbaocdn.chinhphu.vn/CongBaoCP/CongBao/2020/12/32731/33805-1-1203-1204.pdf) quy định điều kiện này; ca liên tục để nghỉ được tính vào giờ làm còn có điều kiện chuyển tiếp giữa hai ca không quá 45 phút. Đề xuất: bổ sung hai điều kiện, dẫn thêm nghị định, tránh hiểu cứ một phần ca rơi sau 22 giờ là đương nhiên hưởng 45 phút. Các mốc lương, thai sản và lao động chưa thành niên trong khung khớp Bộ luật Lao động đã mở.
- [VỪA] **8.37 · thiếu nhánh yêu cầu khẩn cấp ngay khi nộp đơn.** Câu hiện tại chỉ mở bằng “Khi đã có vụ án dân sự”. [BLTTDS, Điều 111 khoản 2, toàn văn hợp nhất trên Chính phủ](https://xaydungchinhsach.chinhphu.vn/toan-van-van-ban-hop-nhat-so-24-vbhn-vpqh-bo-luat-to-tung-dan-su-119230213081059503.htm) còn cho phép yêu cầu áp dụng biện pháp khẩn cấp tạm thời **đồng thời nộp đơn khởi kiện**, trong tình thế cần bảo vệ ngay chứng cứ hoặc ngăn hậu quả nghiêm trọng. Đề xuất: thêm nhánh này; không viết theo cách khiến nạn nhân nghĩ phải chờ thụ lý. Điều đó không biến biện pháp này thành một lệnh cấm độc lập giống Trung Quốc. Đây cũng là câu cũ liền kề, không phải lỗi ở phần 24 giờ/6 giờ mới bổ sung.
- [VỪA] **26.6 · mở rộng sai chủ thể phải kiểm duyệt trước.** Câu “Nền tảng thương mại điện tử phải … kiểm duyệt … trước khi cho phép hiển thị” dẫn Điều 17 khoản 1 điểm đ, nhưng [Luật 122/2025/QH15, Điều 17, DOCX Công báo](https://congbao.chinhphu.vn/van-ban/luat-so-122-2025-qh15-468683.htm) quy định trách nhiệm của **chủ quản nền tảng thương mại điện tử trung gian**. Nghĩa vụ chung rà soát/gỡ theo Điều 15 khác nghĩa vụ kiểm duyệt trước của loại nền tảng này. Đề xuất: nêu đúng chủ thể; nếu mở rộng sang mạng xã hội thì dẫn riêng căn cứ áp dụng tương ứng. Không áp đặt quy trình của nền tảng trung gian lên mọi website tự bán hàng. Câu cũ vẫn còn sau W8.
- [THẤP] **7 chỗ đổi link bài dài · chú thích ngôn ngữ bị lỗi thời.** Cả 7 link đã trỏ đúng file Việt trong `bai/`, nhưng vẫn có câu “bài gốc tiếng Trung, bản tiếng Việt sẽ có sau”. Đề xuất: Manager sửa chú thích cho khớp bản Việt hiện có. Tính chung 1 lỗi trình bày lặp ở 1.26, 2.39, 8.37, lời dẫn chương 10, 10.16, 13.2 và lời dẫn chương 26; không tính 7 lỗi riêng.

### Đạt trong phần đã đối chiếu trực tiếp

“Đạt” dưới đây chỉ áp dụng phần được mô tả; không phải chứng nhận mọi thủ tục, mức phạt hay toàn bộ lịch sử sửa đổi pháp luật.

| Mục | Kết quả đối chiếu |
|---|---|
| 1.26 | Điều 20 khoản 2–5 Luật 55: phân biệt đúng nhà thường, nhà theo tiêu chuẩn/quy chuẩn, cơ sở thuộc diện quản lý và khu vực đặc thù. Không biến bộ 4 món Trung Quốc thành bộ bắt buộc Việt Nam. |
| 2.39 | Điều 98, 106, 137, 146 BLLĐ: đúng 22h–6h, hai khoản cộng lương, hạn chế thai sản, ngoại lệ đồng ý khi nuôi con dưới 12 tháng, giới hạn người chưa thành niên. Điều kiện nghỉ cần sửa như trên. |
| 8.37 | Điều 25 khoản 2 điểm b Luật 116: đúng 24h/6h, lực lượng yêu cầu và không tính từ báo cáo cá nhân. Giữ cảnh báo đường dây tâm lý; nhánh tố tụng cần bổ sung như trên. |
| 10.18 | Luật 15/2023 Điều 8, 15 khoản 1–2, 65: chọn/ủy quyền đại diện; ưu tiên nguyện vọng hợp pháp; nhánh không có đại diện; dẫn Điều 15 khi phẫu thuật đối với nhóm đặc biệt. Không đánh đồng chọn giám hộ với phát sinh đại diện ngay. |
| 11.15 | Luật 91 Điều 8 khoản 3–6: đã sửa đúng hai trần theo khoản thu/doanh thu, nhánh dự phòng 3 tỷ và tỷ lệ cá nhân/tổ chức. |
| 13.39 | Luật 55 Điều 46: đúng giới hạn PCCC/CNCH và các nhánh bảo hiểm/hỗ trợ. BLDS Điều 576 khoản 1, 595 khoản 2 khớp Công báo; giữ cảnh báo áp dụng vụ việc. Điều 52 Luật Thi đua, khen thưởng khớp VBHN 115 có sửa đổi hiệu lực 01/10/2026. |
| 26.1 | NĐ 248 Điều 21 khoản 4: đúng tổ chức thanh toán/trung gian, đối tượng gỡ và mốc 24h nhận yêu cầu; Luật 122 Điều 17 khoản 3 điểm đ có quy tắc công khai, lựa chọn đối tác trong trường hợp hợp tác. |
| 26.2 | NĐ 147 Điều 24 khoản 6 điểm a,b,d và Điều 25 khoản 1: phân loại giấy phép/xác nhận đúng. NĐ 248 Điều 23 khoản 1, 25 khoản 1: xác nhận trước vận hành đúng. Luật 122 Điều 41 và NĐ 248 Điều 53 có chuyển tiếp đến 30/6/2027. Giữ cảnh báo thủ tục sau sửa đổi. |
| 26.3 | NĐ 147 Điều 24 khoản 6 điểm d khớp. Luật 122 Điều 22 khoản 4,6,7 và NĐ 248 Điều 52 khoản 2 xác nhận độc lập mốc 01/01/2027 và lưu livestream ít nhất 1 năm; không phải chỉ tin thông báo của Cục. |
| 26.4 | Điều 23/25 NĐ 248 khớp; không suy từ thủ tục TMĐT thành đăng ký ICP cho mọi website. Cảnh báo ICP vẫn phù hợp với giới hạn nguồn đã kiểm. |
| 26.5 | Luật 122 Điều 16/17 khớp các mốc truy cập dữ liệu hợp đồng và nhánh 1 năm/5 năm; NĐ 248 Điều 22 khoản 1–2 khớp hạn năm/tháng và đúng loại nền tảng số lớn. NĐ 248 Điều 52 khoản 2 xác nhận mốc xác thực 01/01/2027. |
| 26.6 | Phần mới về Luật 116 và trực 24/7 theo NĐ 147 Điều 28 khoản 2 điểm b khớp; câu đầu khung cần thu hẹp chủ thể như trên. |
| 26.7 | NĐ 147 Điều 23 khoản 3 điểm e, Điều 27 khoản 3 điểm b, Điều 82 khoản 10: đúng xác thực số điện thoại, nhánh không có số, định danh riêng cho livestream thương mại, chuyển tiếp 90 ngày. Không lẫn với mốc xác thực TMĐT năm 2027. |
| 26.8 | NĐ 147 Điều 23 khoản 3 điểm đ, Điều 27 khoản 3 điểm a: đúng cha mẹ/giám hộ dùng thông tin của mình, giám sát trẻ dưới 16. Điều 24 Luật 91 có mốc đồng ý từ đủ 7 tuổi cho việc công bố/tiết lộ đời tư. |
| 26.9 | Phần dẫn Luật 116 khớp; không biến yêu cầu an ninh mạng thành quy trình phản bác/khôi phục bản quyền. Giữ cảnh báo trách nhiệm chuyên biệt sở hữu trí tuệ. |
| 26.10 | Luật 91 Điều 20 và Điều 8 khớp quy tắc hồ sơ, miễn đánh giá, hai nhánh trần phạt; Luật 116 Điều 25 khoản 3–4 khớp quy tắc lưu trong nước. Không gỡ quá tay cảnh báo nghị định chi tiết. |
| 26.12 | Luật 116 Điều 41 khoản 3 đúng yêu cầu ứng cứu và báo ngay, tách được khỏi mốc dữ liệu cá nhân; nhánh chủ thể theo Luật 91 còn lỗi CAO nêu trên. |
| 26.13 | NĐ 248 Điều 16 khoản 1–4 khớp chính sách chấm dứt/hoàn tiền, kể cả thời điểm gửi thông báo khi không công bố rõ. Cảnh báo nghĩa vụ nhắc tự gia hạn cần giữ; điều này không chứng minh được toàn bộ nghĩa vụ đó. |
| 26.00 | Không có khung, chỉ đổi link lời dẫn thuộc việc Manager bổ sung: giữ nguyên phần nội dung là hợp lý. |
| 26.11 | Không có khung; giữ nguyên hợp lý vì chủ yếu là kinh nghiệm chọn máy chủ trong bối cảnh Trung Quốc. Ghi chú Worker “chỉ nói về chứng nhận” chưa mô tả đủ: mục còn bàn vận hành, sao lưu, khả năng chịu sự cố; không vì thế cần ép thêm một khung luật Việt Nam. |

### Nguồn cấp 1 đã mở và đọc

Các liên kết Công báo dưới đây là trang văn bản có nút tải bản gốc. Công cụ web nhiều lần trả 502/timeout ở g7; đã tải trực tiếp bằng Python, đọc PDF bằng pypdf hoặc trích DOCX trong bộ nhớ, không lấy lời Worker làm bằng chứng.

- [Luật 55/2024/QH15 — Công báo 1535+1536](https://congbao.chinhphu.vn/van-ban/luat-so-55-2024-qh15-43594/53752.htm): PDF, Điều 20,46.
- [Bộ luật Lao động 45/2019/QH14 — Công báo 993+994](https://congbao.chinhphu.vn/van-ban/nghi-quyet-so-45-2019-qh14-30232/29070.htm): PDF ghi đúng Bộ luật 45/2019; tiêu đề metadata của trang ghi nhầm “Nghị quyết”. Đọc Điều 98,106,109,137,146.
- [NĐ 145/2020 — Công báo](https://congbaocdn.chinhphu.vn/CongBaoCP/CongBao/2020/12/32731/33805-1-1203-1204.pdf): Điều 63–64.
- [Luật 116/2025/QH15 — Công báo](https://congbaocdn.chinhphu.vn/180507251028987904/2026/1/23/116signed-1769163678477753319408.pdf): Điều 25,41 và phần thi hành.
- [Luật 15/2023/QH15 — toàn văn Chính phủ](https://xaydungchinhsach.chinhphu.vn/toan-van-luat-15-2023-qh15-kham-benh-chua-benh-119231127164453959.htm): Điều 8,15,65, gồm cả khoản 2 Điều 65.
- [Luật 91/2025/QH15 — Công báo 971+972](https://congbao.chinhphu.vn/van-ban/luat-so-91-2025-qh15-45578/57730.htm): PDF, Điều 3,8,11,20,23,24. PDF bản ký Ninh Bình mở được nhưng không có chữ trích xuất; kết luận dựa trên bản Công báo thay thế.
- [BLDS 91/2015/QH13 — Công báo 1245+1246](https://congbao.chinhphu.vn/van-ban/luat-so-91-2015-qh13-18397/12968.htm): PDF thứ hai, Điều 576,595. Đã tìm được cấp 1 cho phần Worker chỉ đọc đăng lại.
- [VBHN 115/VBHN-VPQH năm 2026 — bản Công báo trên cổng giáo dục TP.HCM](https://f1.hcm.edu.vn/data/doc/2026/kiemtra-phapche/2026_6/6/2026313115vbhn-vpqh_66202621.pdf): phần đầu và Điều 52.
- [NĐ 147/2024 — Công báo 1261+1262, 1263+1264](https://congbao.chinhphu.vn/van-ban/nghi-dinh-so-147-2024-nd-cp-43155/52693.htm): hai PDF đầu, Điều 23,24,25,27,28,82. Đã tìm được bản có lớp chữ thay bản ký scan 223 trang.
- [NĐ 116/2026 — Công báo 229](https://congbao.chinhphu.vn/van-ban/nghi-dinh-so-116-2026-nd-cp-469315/64129.htm): DOCX, Điều 26. Việc bãi bỏ điểm c khoản 1 Điều 28, khoản 9 Điều 82 và các sửa đổi khác tại điều này không bãi bỏ khoản 2 điểm b Điều 28 hay khoản 10 Điều 82 đang được trích trong khung.
- [Thông tin NĐ 237/2026 của Sở VHTTDL Đồng Nai](https://svhttdl.dongnai.gov.vn/vi/news/thong-tin-tuyen-truyen/chinh-phu-ban-hanh-nghi-dinh-quy-dinh-chi-tiet-thi-hanh-mot-so-dieu-cua-luat-bao-chi-312.html): đã đọc phạm vi bãi bỏ điểm g khoản 6 Điều 24, không nhầm sang các điểm a,b,d. Đây là nguồn thông tin của cơ quan nhà nước, chưa phải đã đọc toàn bộ bản ký NĐ 237.
- [NĐ 248/2026 — Công báo 407](https://congbao.chinhphu.vn/van-ban/nghi-dinh-so-248-2026-nd-cp-469983.htm): DOCX, Điều 16,21,22,23,25,52,53. Đã tìm được cấp 1 cho các câu Worker chỉ có bản đăng lại.
- [Luật 122/2025/QH15 — Công báo 41](https://congbao.chinhphu.vn/van-ban/luat-so-122-2025-qh15-468683.htm): DOCX, Điều 6,12,14–17,21–22,37,40–41; đối chiếu cả các câu cũ liền kề trong chương 26.
- [BLTTDS, VBHN 24 — Chính phủ](https://xaydungchinhsach.chinhphu.vn/toan-van-van-ban-hop-nhat-so-24-vbhn-vpqh-bo-luat-to-tung-dan-su-119230213081059503.htm): đã đọc đầy đủ Điều 111 bằng tải trực tiếp/giải nén gzip, không dựa vào đoạn tìm kiếm.

### Kiểm tra kỹ thuật và phạm vi thay đổi

- Chạy `node cong-cu/kiem.mjs <C>` với C=1,2,8,10,11,13,26: **cả 7 chương 0 lỗi, 0 cảnh báo**. Đây là kiểm cấu trúc, không chứng minh nội dung pháp lý đúng.
- So nội dung ngoài khung của 20 file với mốc 6a9f2ea: bỏ qua dòng trắng và URL GitHub thay bài dài thì **20/20 giống nhau**. Tiêu đề, thẻ, sáu trường không có thay đổi nội dung khác; ngoại lệ có chủ đích là các liên kết bài dài.
- Đã xem `git diff --stat 6a9f2ea HEAD`: toàn W8 có 72 file, bao gồm nhóm khác và công cụ/xuất bản. Không thể dùng thống kê toàn repo đó để quy mọi thay đổi cho Worker công-nghệ-khác; không kết luận toàn repo “chỉ có 7 chương”. Trong các file được giao, thay đổi khung/link phù hợp phạm vi nêu trên.
- 7/7 slug khớp file: 1.26 → `do-khan-cap-trong-nha.md`; 2.39 → `dong-ho-sinh-hoc-va-ca-dem.md`; 8.37 và 13.2 → `gap-nguoi-la-gap-nan-co-nen-dung.md`; lời dẫn 10 và 10.16 → `ket-hon-co-dang-khong.md`; lời dẫn 26 → `lam-nen-tang-can-giay-phep-gi.md`. Tất cả nằm trong `bai/`. Không tính GitHub 404 trước push là lỗi.
- Cây làm việc có báo cáo nhóm lao động/y tế đang được AI khác cập nhật; không sửa các file đó.

### Chưa kiểm được / giới hạn còn lại

- Không chứng nhận đầy đủ lịch sử sửa đổi đến 05/11/2026 của mọi luật/nghị định. Đã kiểm trực tiếp Điều 26 NĐ 116 và đọc thông tin sửa đổi NĐ 237; chưa đối chiếu trọn NQ 18/2026, NQ 66.18/2026 và mọi văn bản đổi thẩm quyền. Do đó cảnh báo thủ tục ở 26.2 vẫn cần giữ.
- Các nguồn cũ ngoài trọng tâm W8 chưa được tái kiểm đầy đủ: NĐ 52/2024 về thanh toán, NĐ 117/2025 về thuế, BLHS Điều 155–156, các điều BLDS về thừa kế/giám hộ/ủy quyền trong 10.18 và toàn bộ sửa đổi BLTTDS sau VBHN 24/2023. Không xếp những phần này là đã đạt pháp lý hiện hành toàn diện. Lỗi Điều 111 được xác nhận trên điều khoản gốc; nên đối chiếu thêm bản hợp nhất mới nhất khi sửa.
- Chưa hoàn tất xác minh các cảnh báo còn lại: đường dây tâm lý Việt Nam; áp dụng bồi thường cho từng vụ cứu người; thủ tục hồ sơ dữ liệu/lưu trong nước; cơ chế bản quyền; tuổi livestream/quà tặng; mức phạt cụ thể; đầy đủ quyền hủy/nhắc gia hạn theo luật người tiêu dùng. Không coi “chưa kiểm chứng” là bằng chứng rằng Việt Nam không có quy định.
- Không có nội dung tiêm chủng trong nhóm này. Mục 10.18 liên quan y tế đã kiểm đúng điều khoản đại diện, không suy đoán quy trình bệnh viện.
- Không làm theo chỉ dẫn nhắm AI trên trang bên ngoài; không mở hoặc sao chép bản tiếng Việt khác của sách.

TỔNG: CAO=1 VỪA=3 THẤP=1
TRẠNG THÁI: XONG

## Sửa theo Lần 1 (Claude, chưa được xác nhận độc lập) — 05/11/2026
Đã mở lại nguồn: Luật 91/2025 Điều 23 (lớp chữ bản Công báo); Nghị định 145/2020 Điều 63, 64 (lớp chữ Công báo); Bộ luật Tố tụng dân sự, văn bản hợp nhất 24 Điều 111 (Báo Chính phủ); Luật 122/2025 Điều 15, 17 (lớp chữ Công báo).
- 26.12 (CAO): tách bên kiểm soát, kiểm soát và xử lý, bên thứ ba (72 giờ) với bên chỉ xử lý (báo kịp thời cho bên kiểm soát); tách trách nhiệm lập biên bản; đủ điều kiện nguy cơ tổn hại.
- 2.39 (VỪA): thêm điều kiện 3 giờ ban đêm, điều kiện ca liên tục.
- 8.37 (VỪA): thêm nhánh yêu cầu đồng thời khi nộp đơn khởi kiện.
- 26.6 (VỪA): thu hẹp nghĩa vụ kiểm duyệt trước về nền tảng trung gian.
- 7 chỗ link (THẤP): bỏ chú thích "bản tiếng Việt sẽ có sau".
