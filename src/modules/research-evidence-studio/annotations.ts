/** Bound editorial presentation, never new scientific output or proof certification. */
export const studioAnchor = Object.freeze({
  runId: "8ec3fa5b-d423-4055-85ba-c2764ace4fdf",
  missionId: "c999b840-3b6a-4b8b-b99d-b567072c007b",
  sourceDigest: "ad93e61a826db1a584c8ded2a159876f39def30517c775b6f98195dc49592597",
  taskDigest: "7e31d58256accd055074c5a473af1588750ffadd1021bd10701c24cdb8019454",
  finalDigest: "cc6eb2217e25f6673bd6412f92e51f96b95cb9bb6f33ea5f41bc254690e49eb1",
  finalBytes: 3310,
  sequence: 11,
  eventDigest: "87b4ad1ec0af42b44bdcfbc9b2474d427de9b0e066e6787b8d7e7b6614be3527",
  archivedDigest: "976246818165fdfc4a01b7d89123e5d7bcbe18a63600549e99059dc312df8df2",
  archivedBytes: 120417,
});
export const rolePins = Object.freeze({
  ATTEMPT: {bytes:4041,digest:"88e4c88835482abd4c126996cecc798c3f37bc92a8a1ef8d324e5a19ea0b5427",promptDigest:"2ebd58bbc76540eb9102adeb3a3e6a52c518377616f5ace8e3360ca6d126b683"},
  CRITIC: {bytes:4175,digest:"560fa3c67d891e5c86faa3d0d8d6731b4d8b8d2ff6a5a25969eea8ab933aecf6",promptDigest:"1bc64199d3521feaf8d19bcb14e4906d4c6be7dee7e01feb94d45ac85769643d"},
  FINAL: {bytes:3310,digest:studioAnchor.finalDigest,promptDigest:"e22ac20f1c14a2aee8753a1a5ed4f6d4374f591a736d2483a6f3d1ff03af2a93"},
  POSTREVIEW: {bytes:6183,digest:"858171f27ff9e3b5cb20891ae2e7963b9dd4f7bcb9ebb2223a1e3964b826386e",promptDigest:"7184e2162b53869d02c109ec858b20c3bdd1765db8d44166bc2db3b5753f4cd8"},
});
export const stepIds = ["structure","expectation","harmonic","arithmetic"] as const;
export type StepId = typeof stepIds[number];
export interface EditorialStep {
  id:StepId; title:{vi:string;en:string}; paragraphs:{vi:string[];en:string[]}; formulas:string[];
  quoteStart:string;quoteEnd:string;scope:"ARGUMENT_NON_FORMAL"|"ARITHMETIC_ONLY";
}
export const editorialSteps:readonly EditorialStep[] = [
  {id:"structure",title:{vi:"Bổ đề khoảng và thứ tự",en:"Interval and order lemma"},scope:"ARGUMENT_NON_FORMAL",
    quoteStart:"For two letters a<b",quoteEnd:"a letter greater than b lies between them.",
    paragraphs:{vi:["Giả thiết: các nhãn trong từ đôi một khác nhau; mỗi bước tách tại nhãn lớn nhất và ghép đầu ra trái, phải, rồi nhãn lớn nhất.","Theo nhánh đệ quy chứa cả a và b. Khi cực đại ở ngoài khoảng hai đầu mút, cả khoảng vẫn nằm trong cùng một nhánh nhỏ hơn. Đến cực đại đầu tiên trong khoảng: nếu là b, b được đặt sau a; nếu ở trong lòng khoảng, nó lớn hơn b và hai đầu mút thuộc hai nhánh khác nhau. Ghép trái trước phải giữ thứ tự ban đầu. Những lần ghép sau không đổi thứ tự này."],en:["Assumptions: all labels are distinct; recursion splits at the maximum and concatenates left output, right output, then that maximum.","Follow the child containing both a and b. An outside maximum leaves their whole interval inside a strictly shorter child. At the first maximum inside the interval: if it is b, b is appended after a; otherwise it is an interior label greater than b, separating the endpoints into different children. Left-before-right concatenation preserves their input order. Later concatenations cannot change that order."]},
    formulas:[String.raw`F(\varnothing)=\varnothing,\qquad F(LmR)=F(L)F(R)m`,String.raw`a<b:\quad b\prec_{F(w)}a\iff b\prec_w a\ \land\ \exists c>b\text{ between }a,b`]},
  {id:"expectation",title:{vi:"Đếm xác suất, cộng kỳ vọng",en:"Counting and expectation"},scope:"ARGUMENT_NON_FORMAL",
    quoteStart:"Apply this with a=i",quoteEnd:"(n+1)/2-H_n.",
    paragraphs:{vi:["Đặt k=n-i-1 là số nhãn lớn hơn i+1. Hạn chế hoán vị đều vào hai đầu mút và k nhãn này cho (k+2)! thứ tự đều. Không có nhãn lớn hơn chen giữa đúng khi hai đầu mút kề nhau. Co cặp kề nhau và xét hai hướng cho 2(k+1)! thứ tự.","Ở các thứ tự không kề nhau, đổi hai nhãn đầu mút là song ánh đảo hướng. Do đó một nửa có i+1 đứng trước i. Tổng các biến chỉ báo dùng tính tuyến tính của kỳ vọng, không cần các sự kiện độc lập. Trường hợp i=n-1 cho xác suất bằng 0."],en:["Let k=n-i-1 count labels above i+1. Restricting a uniform permutation to these labels and the two endpoints gives (k+2)! equally likely orders. No larger separator is equivalent to adjacency. Contracting that pair in either orientation counts 2(k+1)! orders.","Among nonadjacent orders, swapping endpoint labels is an orientation-reversing bijection. Exactly half put i+1 first. Sum the indicators using linearity of expectation, without independence. The endpoint i=n-1 has probability zero."]},
    formulas:[String.raw`\Pr(i+1\prec_{F(\sigma)}i)=\frac12\left(1-\frac{2}{k+2}\right)=\frac12-\frac1{n-i+1}`,String.raw`X=\sum_{i=1}^{n-1}\left(\frac12-\frac1{n-i+1}\right)=\frac{n+1}{2}-H_n,\quad H_n=\sum_{j=1}^n\frac1j`]},
  {id:"harmonic",title:{vi:"Chặn điều hòa không xấp xỉ",en:"Rigorous harmonic bounds"},scope:"ARGUMENT_NON_FORMAL",
    quoteStart:"It remains to bound H_n rigorously",quoteEnd:"57/2.",
    paragraphs:{vi:["Đây là chặn trong FINAL, khác cách chặn số học của checker. Tích phân chuỗi hình học hội tụ đều trên [0,t] cho chuỗi log có các số hạng dương. Với t=1/2 và 1/19, log 10=2 log 3+log(10/9). Giữ bốn số hạng đầu cho log 3 và một số hạng cho log(10/9) cho chặn dưới nghiêm ngặt.","Thay mẫu các số hạng đuôi j≥2 của log 3 bằng 5 cho log 3<11/10; thay mọi mẫu của log(10/9) bằng 1 cho log(10/9)<19/180. Có số hạng bị tăng thật sự nên các chặn là nghiêm ngặt. Tích phân hàm 1/x giảm và tổng H₁₀=7381/2520 hoàn tất khoảng điều hòa."],en:["This is the FINAL argument, distinct from the checker's arithmetic enclosure. Integrating the uniformly convergent geometric series on [0,t] gives a positive-term logarithm series. Substitutions t=1/2 and 1/19 give log 10=2 log 3+log(10/9). Retaining four terms for log 3 and one for log(10/9) gives a strict lower bound.","Replacing tail denominators j≥2 by 5 gives log 3<11/10; replacing all denominators for log(10/9) by 1 gives log(10/9)<19/180. Some terms strictly increase, so these bounds are strict. Integral comparison for decreasing 1/x and H₁₀=7381/2520 finish the harmonic enclosure."]},
    formulas:[String.raw`\log\frac{1+t}{1-t}=2\sum_{j=0}^{\infty}\frac{t^{2j+1}}{2j+1}\quad(0<t<1)`,String.raw`\log10>\frac{146921}{63840}=\frac{23}{10}+\frac{89}{63840},\qquad\log10<\frac{83}{36}`,String.raw`H_n>12\frac{23}{10}=\frac{138}{5}>\frac{55}{2}`,String.raw`H_n\le H_{10}+\log(n/10)<\frac{7381}{2520}+11\frac{83}{36}=\frac{71291}{2520}<\frac{57}{2}`]},
  {id:"arithmetic",title:{vi:"Khoảng chính xác và phần nguyên",en:"Exact enclosure and floor"},scope:"ARITHMETIC_ONLY",
    quoteStart:"Finally X=500000000000",quoteEnd:"Therefore floor(X)=499999999972.",
    paragraphs:{vi:["Trừ khoảng nghiêm ngặt của Hₙ khỏi (n+1)/2 đảo hướng bất đẳng thức. FINAL suy ra khoảng giữa hai số nguyên liên tiếp và phần nguyên 499999999972.","Checker lưu một khoảng hữu tỉ hẹp hơn, dựa trên chuỗi log với r=9/11 và 16 số hạng. Khoảng này chỉ hỗ trợ số học dưới các bổ đề viết sẵn; checker không kiểm chứng bổ đề cấu trúc, đếm xác suất hay văn bản chứng minh. Bằng chứng checker và lập luận FINAL được hiển thị riêng."],en:["Subtracting the strict harmonic enclosure from (n+1)/2 reverses the relevant inequalities. FINAL obtains an interval between consecutive integers and floor 499999999972.","The retained checker uses a tighter rational enclosure, based on a log series with r=9/11 and 16 terms. It supports arithmetic under written lemmas only; it does not validate the structural lemma, probability counting, or proof text. Checker evidence and the FINAL argument remain distinct."]},
    formulas:[String.raw`499999999972<X<499999999973,\qquad\lfloor X\rfloor=499999999972`]},
];
