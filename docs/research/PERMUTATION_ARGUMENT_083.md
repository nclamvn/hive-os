# Bài hoán vị: chứng minh tổng quát và nghiệm thu tái lập

2026-10-09 · PERMUTATION_ARGUMENT_REPRODUCTION_083 · REPRODUCTION.
Trạng thái: SUPPORTED_NON_FORMAL_REPRODUCTION — lập luận đầy đủ đã qua phản biện AI và Main kiểm tra; không phải chứng chỉ Lean hoặc nghiệm thu chuyên gia ngoài hệ thống.

## Mục tiêu và xuất xứ

Đây là tái lập bài mẫu công khai [FrontierMath Tier 2 của Epoch](https://epoch.ai/frontiermath/tiers-1-4/benchmark-problems#tier-2), không phải khám phá mới hay benchmark kín. Công thức, đáp án và hướng giải đã công khai. Main đã đọc nguồn; các agent đã tiếp xúc với checker/test của dự án. Không suy ra năng lực giải bài chưa thấy từ lượt này.

Với một từ gồm các số nguyên dương phân biệt, đặt

\[
F(\varnothing)=\varnothing,\qquad F(LmR)=F(L)F(R)m,
\]

trong đó \(m\) là chữ lớn nhất. Nếu \(\sigma\) là hoán vị đều của \(\{1,\ldots,n\}\), gọi

\[
D_n(\sigma)=\#\{1\le i<n:\operatorname{pos}_{F(\sigma)}(i+1)<\operatorname{pos}_{F(\sigma)}(i)\},\qquad X_n=\mathbb E[D_n].
\]

Thống kê này đếm descent của **hoán vị nghịch đảo**, không phải descent của từ đầu ra. Ký hiệu \(S_n\) được hiểu là các hoán vị trên \(n\) chữ, gồm \(n!\) phần tử.

## 1. Bổ đề cấu trúc cho mọi từ

Viết \(x\prec_w y\) khi \(x\) đứng trước \(y\) trong \(w\). Với mọi hai chữ \(a<b\) thuộc \(w\),

\[
b\prec_{F(w)}a
\quad\Longleftrightarrow\quad
\exists c>b:\ b\prec_w c\prec_w a.
\]

**Chứng minh.** Quy nạp theo độ dài từ. Với độ dài 0 hoặc 1, không có cặp cần xét. Với từ dài hơn, viết \(w=LmR\). Định nghĩa đệ quy bảo toàn mỗi chữ đúng một lần.

- Nếu \(b=m\), \(b\) đứng cuối \(F(w)\), nên không đứng trước \(a\). Vế phải cũng sai vì không có chữ lớn hơn \(b\).
- Nếu \(a,b\) cùng thuộc \(L\) hoặc cùng thuộc \(R\), thứ tự của chúng trong đầu ra là thứ tự trong ảnh của từ con đó. Các chữ nằm giữa chúng trong đầu vào cũng hoàn toàn thuộc từ con. Áp dụng giả thiết quy nạp cho cả hai chiều.
- Nếu \(a\in L,b\in R\), toàn bộ \(F(L)\) đứng trước \(F(R)\). Vì thế \(b\) không đứng trước \(a\); trong đầu vào \(b\) cũng đứng sau \(a\), nên vế phải sai.
- Nếu \(b\in L,a\in R\), \(b\) đứng trước \(a\) trong đầu ra. Trong đầu vào, \(m>b\) nằm giữa hai chữ, nên vế phải đúng.

Đây là tất cả các trường hợp: \(m=a\) không thể xảy ra vì \(a<b\). Bổ đề được chứng minh. Ví dụ \(F([2,1])=[1,2]\) cho thấy đảo thứ tự trong đầu vào **không đủ**; cần chữ lớn hơn ngăn cách.

## 2. Đếm xác suất, không giả định đầu ra đều

Với \(1\le i<n\), gọi \(I_i\) là chỉ báo của \(i+1\prec_{F(\sigma)}i\). Xóa các chữ nhỏ hơn \(i\) khỏi đầu vào, giữ thứ tự tương đối của tập

\[
T_i=\{i,i+1,\ldots,n\},\qquad k=n-i+1.
\]

Mỗi thứ tự cho trước của \(k\) chữ xuất hiện trong đúng
\(\binom nk(n-k)!=n!/k!\) hoán vị đầy đủ: chọn vị trí cho \(k\) chữ rồi sắp các chữ còn lại. Vì thế thứ tự hạn chế là đều trên \(k!\) khả năng.

Theo bổ đề, sự kiện cần đếm là: \(i+1\) đứng trước \(i\), và có ít nhất một chữ lớn hơn \(i+1\) ở giữa. Sau phép xóa, mọi chữ khác đều lớn hơn \(i+1\). Do đó trường hợp không có chữ lớn hơn ở giữa chính là khối có hướng \((i+1,i)\) kề nhau **trong từ hạn chế**, không nhất thiết trong hoán vị đầy đủ.

Xác suất \(i+1\) đứng trước \(i\) là \(1/2\). Gộp khối có hướng thành một phần tử cho \((k-1)!\) thứ tự xấu. Không nhân thêm 2: khối \((i,i+1)\) không thuộc sự kiện đang trừ. Vậy

\[
\mathbb P(I_i=1)=\frac12-\frac{(k-1)!}{k!}
=\frac12-\frac1{n-i+1}.
\]

Không cần \(F(\sigma)\) đều; thực tế nó luôn kết thúc bằng \(n\).

## 3. Công thức cho mọi n và trường hợp biên

Tuyến tính kỳ vọng không đòi hỏi các \(I_i\) độc lập:

\[
\begin{aligned}
X_n&=\sum_{i=1}^{n-1}\left(\frac12-\frac1{n-i+1}\right)\\
&=\frac{n-1}{2}-\sum_{k=2}^n\frac1k
=\boxed{\frac{n+1}{2}-H_n},\qquad H_n=\sum_{k=1}^n\frac1k.
\end{aligned}
\]

Với \(n=1\), tổng rỗng bằng 0 và công thức cho \(1-H_1=0\). Với \(n=2\), cả hai hoán vị đều cho đầu ra \([1,2]\), phù hợp \(3/2-H_2=0\). Khi \(i=n-1\), xác suất bằng \(1/2-1/2=0\), đúng với việc chữ lớn nhất luôn đứng cuối.

## 4. Chặn hữu tỉ cho n = 10^12, không dựa vào số chấm động

Ta chứng minh \(23/10<\log 10<231/100\). Tích phân đẳng thức chuỗi hình học cho \(0<r<1\) cho

\[
\log\frac{1+r}{1-r}=2\sum_{j\ge0}\frac{r^{2j+1}}{2j+1}.
\]

Sau \(s\) số hạng đầu, phần dư dương và nhỏ hơn
\(2r^{2s+1}/((2s+1)(1-r^2))\). Có thể thấy trực tiếp từ đẳng thức hữu hạn
\(1/(1-t^2)=\sum_{j=0}^{s-1}t^{2j}+t^{2s}/(1-t^2)\): phần dư là \(2\int_0^r t^{2s}/(1-t^2)\,dt\). Chặn \(1/(1-t^2)<1/(1-r^2)\) trên \(0<t<r\) cho bất đẳng thức nghiêm ngặt, không cần một phép xấp xỉ số chấm động.

Với \(r=1/3,s=3\), tổng đầu bằng \(842/1215\), phần dư nhỏ hơn \(1/6804\). Với \(r=1/9,s=1\), tổng đầu bằng \(2/9\), phần dư nhỏ hơn \(1/1080\). Vì \(10=2^3(5/4)\),

\[
\frac{932}{405}<\log 10<\frac{932}{405}+\frac1{2268}+\frac1{1080}.
\]

Chặn dưới vượt \(23/10\) một lượng \(1/810\). Chặn trên nhỏ hơn
\(1151/500+1/2000+1/1000=4607/2000<231/100\). Các so sánh đều là so sánh hữu tỉ.

Với \(n=10^{12}\), so sánh tích phân của hàm giảm \(1/x\) cho

\[
H_n>\log n>12\cdot\frac{23}{10}=\frac{138}{5},
\]

và, dùng \(H_{10}=7381/2520\),

\[
H_n<H_{10}+\int_{10}^{n}\frac{dx}{x}
<\frac{7381}{2520}+11\cdot\frac{231}{100}
=\frac{357071}{12600}.
\]

Đặt \(q=499999999972\). Thay vào công thức kỳ vọng:

\[
q+\frac{2029}{12600}<X_n<q+\frac9{10}.
\]

Hai đầu đều nằm nghiêm ngặt giữa \(q\) và \(q+1\). Do đó

\[
\boxed{\lfloor X_{10^{12}}\rfloor=499999999972}.
\]

## 5. Phản biện và phạm vi nghiệm thu

Solver: agent `/root/acorn_allocation_back`. Critic: agent khác `/root/acorn_allocation_front`. Critic tự dựng lại bổ đề và phép đếm trước khi nhận bản giải của solver, sau đó kiểm toàn bộ bản giải gồm các phần dư logarithm và phép so sánh hữu tỉ. Kết luận phản biện: **Supported; không tìm thấy khoảng trống thiết yếu**.

Một sửa diễn đạt thực sự: "khoảng giữa a và b" phải là khoảng vị trí của hai chữ trong từ, không phải khoảng số học [a,b]. Bản chứng minh mục 1 tránh nhập nhằng bằng cách tách bốn trường hợp trên L và R.

Các điểm dễ sai đã được kiểm: cực đại không thể bằng a; cả hai chiều của bổ đề; giữ nguyên các chữ nằm giữa khi quy nạp; kề nhau sau hạn chế chứ không phải trong hoán vị đầy đủ; khối có hướng không nhân 2; không giả định đầu ra đều hay các chỉ báo độc lập; n=1, n=2 và cặp cuối; phần dư logarithm dương và bị chặn nghiêm ngặt. Chặn tích phân sau H10 chỉ dùng ở n=10^12>10.

Main kiểm tra lại các trường hợp và phép tính, đặc biệt 932/405-23/10=1/810, chặn trên 4607/2000<231/100 và độ lệch 2029/12600 của kỳ vọng so với q. A1–A4 được khép ở mức lập luận toán học thông thường có phản biện AI.

Độc lập ở đây là **agent/ngữ cảnh khác**, không phải mô hình khác, chuyên gia bên ngoài, bối cảnh mù hay phép đo độc lập thống kê. Giới hạn tạo agent mới của phiên buộc tái dùng hai ngữ cảnh hiện có; cả hai đã biết checker/test và đáp án. Việc thống nhất kết luận không thay thế chứng minh được trình bày ở trên. Không dùng kết quả số học của checker để tự nhận toàn bộ chứng minh đã được kiểm máy.

## 6. Kiểm thử hỗ trợ thực tế

Main đã chạy một lần `npm run research:check`: exit0, syntax32.6ms, strict types2088.9ms, tests749.5ms, CLI smoke165.6ms, tổng nội bộ3038.1ms. Vitest: 2 file, 63/63 test đạt, duration471ms; các phép vét nhỏ n=1..8 và các kiểm tra đầu vào sai/đáp án sai có sẵn được tái dùng. Không thêm test hoặc sửa code.

Checker tính theo một khai triển 16 số hạng ở r=9/11, khác với chặn viết ở mục 4 dùng ba số hạng cho log2 và một số hạng cho log(5/4). Cả hai cho cùng chặn hữu tỉ cần thiết. Đây là đối chiếu hai cách tính, không phải hai hệ thống chứng minh hình thức độc lập.

Trạng thái checker vẫn là SUPPORTED_UNDER_LEMMA_ARITHMETIC, proofValidation=NOT_VALIDATED_NON_FORMAL_REVIEW_REQUIRED. FormalProof và officialScore vẫn NOT_ESTABLISHED. Hồ sơ này không sửa, nâng nhãn hay ghi kết quả vào run ứng dụng cũ.

## 7. Completion report

STATUS: DONE / SUPPORTED_NON_FORMAL_REPRODUCTION. Requirement coverage: A1–A4, 4/4. A1 bổ đề mọi từ: đạt; A2 xác suất và tổng harmonic: đạt; A3 biên và floor: đạt; A4 phản biện và kiểm thử hỗ trợ: đạt. Không có khoảng trống thiết yếu được nhận diện trong lập luận này; chứng minh hình thức và đánh giá bên ngoài chưa thực hiện.

Technical health: một lần kiểm tra hỗ trợ, syntax/type PASS, 0 type diagnostics, 63 tests PASS; build/lint/full-app/integration/E2E NOT_RUN. Không có code mới để nghiệm thu. Kết quả toán học là lập luận ở mục 1–4, không phải số test hay thời gian chạy.

Phần mới so với lượt trước: trước đây chỉ có replay số học dưới bổ đề; nay có chứng minh đầy đủ bổ đề cho mọi từ, phép đếm cho mọi n, chặn hữu tỉ viết được kiểm tra theo một khai triển khác checker, cùng phản biện cụ thể. Đây là hoàn thiện hồ sơ tái lập của một bài đã biết, không phải đột phá FrontierMath hay bằng chứng giải được bài mở. Vòng này là điều phối Codex-assisted, không phải lượt agent tự trị đã được thực thi/lưu vào ứng dụng HIVE OS.

Vibecode Kit được rút gọn thành một TIP và một hồ sơ chứa chứng minh/phản biện/completion; không thêm stack báo cáo. Chỉ bổ sung hai hồ sơ này cùng checkpoint; không tạo framework, UI, parser, chứng chỉ thực thi hay manifest. Không dùng API trả phí, DB, browser, build/install, Git, Lean hoặc R3. Không có scratch/project copy/distDir mới hoặc dọn xóa dữ liệu. Code/checker/test cũ không sửa.

Kết thúc trước deadline 06:16:57UTC của lượt 20 phút. Milestone này đóng; không tự mở target hay chiến dịch tiếp theo. R3 giữ nguyên trạng thái deferred/unaccepted và lịch sử thất bại.
