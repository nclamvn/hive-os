# TIP116 — K6 structural hand proof: partial, global target open

## Kết luận

**Chưa chứng minh bất đẳng thức toàn cục `ALLreal F6>=20/93`.**
Đợt này có chứng minh cấu trúc mới, đã được Main và một agent phản biện
kiểm bằng tay, cho hai lớp cực tiểu ứng viên. Không lấy kết quả trên các
lớp đó thay cho nghĩa vụ toàn miền R116-1; không công bố một milestone toàn
cục, không tuyên bố kết quả mới đối với giả thuyết Kakeya tổng quát.

Mục tiêu và mô hình giữ nguyên: sáu tam giác tịnh tiến, `G=6F6`,
`D_i=A_(i+1)-A_i`, `D_*=(25,11,34,11,25)/31`, đích `G>=40/31`.
Chứng chỉ cận trên cũ và các kết quả109C/108F không bị sửa.

## 1. Chặn sắc cho cực tiểu ứng viên có gốc trung tâm

Gọi `T_i` là thời điểm khe i đóng, tính từ công thức khe THỰC. Trong miền
thứ tự đỉnh tự nhiên `D_i>0`, giữ nguyên các điều kiện cần đã chứng minh
cho một cực tiểu toàn cục cạnh tranh: một thành phần đáy đóng, phương trình
dừng đầy đủ của diện tích thật, các điều kiện khoảng cách/độ dốc đáy. Nếu

    T3>=T1,T5, T3>max(T2,T4),

thì cực tiểu ứng viên đó thỏa

    G>=40/31, tức F6>=20/93.

Không giả sử đối xứng. Gốc trung tâm cực đại nghiêm ngặt đã được kiểm đầy
đủ. Hai đầu đồng cực đại cũng được giữ, với sửa chữa tường minh cho nhánh
biên của lập luận sao; không kéo dài nguyên xi một mâu thuẫn dùng dấu `<`.
Các khối đường bao gộp, khối0, luồng láng giềng tắt và tiếp xúc cuối đều
được giữ. Đây là chặn tại cực tiểu ứng viên của DIỆN TÍCH THẬT, không phải
một chặn điểm được chứng minh cho mọi cấu hình chỉ có thứ tự T nói trên.

Các bước cấu trúc trong Builder §§7--11:

- Từ cân bằng thật và phép chiếu đường bao, buộc `T1>=T2,T5>=T4`.
- Loại luồng xa của gốc3, kể cả trường hợp đầu đối diện vẫn đang cấp luồng.
  Nhánh gộp hỗn hợp cho `a=126/241,theta=117/241`, trái `theta>a`.
- Khi một đầu đồng cực đại, xử lý khối0 và khối gộp bằng phương trình thật;
  không thay bất đẳng thức của khối0 bằng công thức trung bình dương.
- Còn lại đúng diện tích của luồng láng giềng1,3,5. Hai phép chiếu đường
  bao thật thuộc các không gian khối cần thiết, nhưng có thể gộp/cắt0.

## 2. Bổ đề hiệu chuẩn — phần ghép còn thiếu trong chứng minh vùng C cũ

Hàm thật trong lớp luồng đã rút gọn có dạng CHÍNH XÁC

    G(D)=Q(D)-sum E_k(D),
    Q(D)=40/31+q(D-D_*),

trong đó `q` là dạng toàn phương xác định dương của năm bình phương109.
Mỗi `E_k` là nửa khoảng cách bình phương có trọng số từ điểm cực đại tự
do tới một nón lồi đóng: hai đường bao, hai phục hồi đầu và một phục hồi
trung tâm. Tất cả điểm neo tự do ở `D_*` đều nằm trong nón tương ứng.

Đặt `z_*=z(D_*)`, `p=P_K z`, `n=z-p`. Tính pháp tuyến cho
`<n,z_*-p>_W<=0`, do đó

    grad E_k(D) dot(D-D_*)>=2E_k(D).

Lấy phương trình dừng ĐẦY ĐỦ của diện tích thật nhân `D-D_*`:

    0=2q(D-D_*)-sum grad E_k(D) dot(D-D_*).

Suy ra `q>=sum E_k`, nên `G>=40/31`. Điểm neo nằm trong nội thất các nón,
nên dấu bằng tại điểm dừng buộc mọi sai lệch bằng0, rồi `D=D_*`.

Đây là bước ghép giá trị và phương trình dừng, không phải Jensen, không
phải chặn Hessian độc lập, và không đặt phương trình dừng cho một hàm
chặn dưới. Các khoảng cách bình phương là C1 trên các mặt gộp/khối0;
phần đuôi vượt chiều cao1 là `O(h^2)`, chỉ cho phép chuyển đạo hàm bậc
nhất, không cho phép dùng Hessian giả ở đáy.

Chứng minh đầy đủ và các ma trận trọng số:
[MAIN_STATIONARY_CALIBRATION.md](../../artifacts/research/tip116/MAIN_STATIONARY_CALIBRATION.md).

## 3. Một lớp gốc không ở giữa được khép, không phải tất cả

Builder §14 và phản biện độc lập xử lý TOÀN lớp có

    T2>max(T1,T3,T4,T5), T4>max(T3,T5),

cùng các điều kiện cần thật phía trên. Nhánh luồng xa buộc đồng thời
`a>14/25` và `a<14/25`, hoặc vi phạm cân bằng khối0/khoảng cách đáy.
Vì vậy nó bị loại; phần còn lại là luồng láng giềng2,4 chính xác.

Dạng toàn phương tự do của lớp đối lập có điểm neo
`D_dagger=(8,18,6,18,8)/17`, giá trị `22/17`. Các bộ nhân tự do là
`(0,1/17)` và `(1/17,0)`, hợp lệ TRÊN biên. Cùng bổ đề hiệu chuẩn cho

    G>=22/17>40/31, với chênh lệch2/527.

Ảnh đối xứng gốc4/cây con trái2 được xử lý cùng cách. Điểm neo của hàm
láng giềng2,4 có hai cực đại T bằng nhau, nhưng điều này KHÔNG chứng minh
mọi cây có cực đại bằng nhau đều đã được rút về lớp đó.

## 4. Nghĩa vụ toàn cục còn mở

Chưa có rút gọn hoặc chặn đầy đủ cho:

- Các cây cực đại tự nhiên còn lại: gốc1 và ảnh đối xứng5; gốc2 với cực
  đại cây con phải3 hoặc5, cùng các ảnh đối xứng.
- Các cực đại thời điểm đóng bằng nhau chưa được rút gọn, nhất là gốc3
  đồng cực đại với khe trong2 hoặc4, và các mặt biên liên quan.
- Cả12 miền đảo thứ tự đỉnh và các mặt của chúng.

Không có chứng minh rằng mọi cực tiểu toàn cục nằm trong hai lớp đã khép.
Không có phần trăm bao phủ toàn miền; không dùng một mẫu hữu hạn, một
chứng chỉ vùng C cũ hay một ví dụ dừng để thay thế các nghĩa vụ này.

R116-1 **NOT CLOSED**. R116-2 chỉ kiểm được các mệnh đề mới có phạm vi nêu
trên, không phải nghiệm thu một chứng minh toàn cục chưa tồn tại. R116-3
lưu hồ sơ và các sửa chữa. Toàn bộ K6 vẫn **OPEN**.

Ưu tiên toán học tiếp theo, chưa được thực thi tiếp: chứng minh một rút
gọn cấu trúc cho các cây cực đại còn lại, hoặc định giá trực tiếp chúng
bằng cân bằng đầy đủ; phần đảo thứ tự phải dùng điều kiện cực tiểu toàn
cục của TOÀN hợp tam giác. Không quay lại tối ưu vét ô hoặc thêm hạ tầng.

## 5. Kiểm chứng và sửa sai được giữ lại

**Verify — kiểm tay, không formal/kernel/tool replay.** Main và Critic đã
kiểm các đồng nhất thức khe, hai phép chiếu toàn đường bao, cân bằng năm
biến, thứ tự sống của luồng, các nhánh khối dương/khối0, đại số hỗn hợp,
hai dạng năm bình phương, các điểm neo và đạo hàm trên biên. Đây là phản
biện AI trong dự án, chưa phải phản biện chuyên gia ngoài hoặc Lean.

Các lỗi/giới hạn không bị xóa khỏi hồ sơ:

1. Chỉ giữ tổng năm phương trình dừng là không đủ. Ví dụ chính xác
   `D=(1/2,1/2,10/7,1/2,1/2)` thỏa một thành phần đáy và các ràng buộc
   thời gian nhưng cho `M_total/r=2/11>8/49`. Năm cân bằng riêng KHÔNG
   bằng1; ví dụ này không bác bỏ K6 hay mệnh đề dùng dừng đầy đủ.
2. Một biến phân có vẻ giảm diện tích đã bỏ mất `h^2` năng lượng khi một
   đoạn tiền tố mới xuất hiện. Main rút lại biến phân đó trước khi dùng.
3. Hệ số tổng năng lượng tự do của toàn luồng được sửa từ `11/4` thành
   `9/4`. Điểm neo tự do toàn luồng có tọa độ âm nên không được dùng bổ
   đề neo khả thi để suy ra chặn toàn cục.
4. Một ứng viên phản ví dụ cho định lý ghép các vị trí tối đa hóa phần
   giao có đáy HAI thành phần, trái với khẳng định ban đầu. Main chỉ ra
   khe đáy `(-2.31,-2.27)`. Critic giữ sửa chữa: không được dùng ví dụ
   này để bác bỏ mệnh đề trên miền một thành phần còn phải xét.
5. Nhánh biên đồng cực đại không được kế thừa máy móc mâu thuẫn dùng dấu
   nghiêm ngặt. Trường hợp `u=c=2theta` đã được xử lý riêng bằng phép
   chiếu của cây con phải, thay vì giả vờ vẫn có `u<2theta`.

## 6. Phạm vi thực thi và hồ sơ

Activation2026-10-11 15:59:50UTC; hardstop16:59:50UTC. Hạn mức thực thi
toán bằng subprocess0, số đã dùng0, thời gian0, failed mathematical starts0.
Không chạy optimizer, mẫu, LP, replay, enumeration, code/test/build/UI/API
hay Git write. Có đọc nguồn, kiểm giờ, tra nguồn chính và ghi Markdown.
Không sửa byte chứng minh/công cụ tiền nhiệm, không tạo distDir hay bản sao
scratch, không xóa gì; không có rác tạo mới cần dọn. Các thay đổi có sẵn
trong checkout được giữ nguyên. Đây không phải tuyên bố hết ngân sách hoặc
bất khả thi về mặt toán học; chỉ là một lượt chứng minh chưa khép toàn miền.

Terminal2026-10-11 16:44:05UTC: STOP/PARTIAL. Dừng sau phản biện các chứng
minh lớp và xác định rằng đề xuất khép bằng các ràng buộc tổng là sai;
chứng minh toàn miền vẫn thiếu. Không kéo dài để chạy thêm lớp chưa có
phương án trọn vẹn, không tự cấp lượt nối tiếp. Thời hạn60 phút chưa bị
dùng hết; đây không phải nghiệm thu thành công R116-1.

Kiểm tra tài liệu: `git diff --check` không có lỗi; kiểm khoảng trắng cuối
dòng trên các tệp mới không có kết quả lỗi. Một yêu cầu fingerprint của
Main dùng sai tên tệp SOS109 và trả lỗi tệp không tồn tại; đã tìm đúng
`MAIN_STRUCTURAL_SOS.md` và kiểm lại, không sửa tệp cũ. Builder lưu cả một
lần đọc sai đường dẫn và một patch sai ngữ cảnh. Các lỗi thao tác này không
là lượt thực thi toán và không bị biến thành kết quả kiểm chứng toán.

Hồ sơ:

- [Builder derivation](../../artifacts/research/tip116/BUILDER_STRUCTURAL_PROOF.md).
- [Main calibration](../../artifacts/research/tip116/MAIN_STATIONARY_CALIBRATION.md).
- [Independent review](../../artifacts/research/tip116/INDEPENDENT_STRUCTURAL_REVIEW.md).
- [TIP116 charter](../contractor/tips/TIP-116_K6_STRUCTURAL_CLOSURE.md).

Vibecode Kit được dùng ở mức gọn: một người dựng chứng minh, một người
phản biện, Main tự suy và kiểm lại; không mở bầy agent hay pipeline mặc định.

## English outcome

PARTIAL, not a global K6 proof. An actual-stationary calibration couples
the free quadratic to ALL hull/restoration cone-distance losses by projection
normality. Together with reviewed structural reductions it excludes a strictly
subtarget candidate minimum in the central-max class (endpoint ties retained,
inner maxima strict); equality forces the accepted sharp configuration. A
second whole strict root2/right-subtree4 class and its reflection satisfy
`G>=22/17>40/31`. Other natural max trees, untreated maximum ties and all
twelve inverted continua remain open. No new target, computational grant,
automatic successor, novelty claim, formal proof or external acceptance.
