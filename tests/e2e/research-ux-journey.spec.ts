import {expect,test} from "@playwright/test";
import {signUpToDashboard} from "./auth-helpers";

for(const locale of ["en","vi"] as const){
  test(`manual workbench keeps ${locale} drafts explicit and never restores proof status`,async({page},testInfo)=>{
    const vi=locale==="vi",t=(a:string,b:string)=>vi?a:b;
    page.on("dialog",dialog=>dialog.accept());
    const {dashboardUrl}=await signUpToDashboard(page,`Draft UX ${locale}`,locale);
    await page.goto(`${dashboardUrl}/research/lean`);
    await expect(page.getByRole("heading",{level:1})).toHaveCount(1);
    const problem=page.getByLabel(t("Bài toán và mục tiêu chính xác","Problem and exact goal"));
    const solver=page.getByLabel(t("Đầu ra gốc của solver (JSON)","Original solver output (JSON)"));
    await expect(problem).toBeVisible();
    await expect(solver).toBeHidden();
    await problem.fill("Check this retained synthetic argument; no new mathematical research.");
    await expect(page.getByText(t("Có thay đổi chưa lưu","Unsaved changes"),{exact:true})).toBeVisible();
    expect(await page.evaluate(()=>Object.keys(sessionStorage).filter(key=>key.startsWith("hive:lean-draft:")))).toEqual([]);
    await page.getByText(t("Đã có câu trả lời? Nhập đầu ra mô hình","Already have a response? Import model output"),{exact:true}).click();
    const original=' {"argument":"Retained synthetic argument for UI testing only; this is not a proof.","certificate":null,"gaps":[]} ';
    await solver.fill(original);
    // Existing manual checker only; this action cannot dispatch a model or persist a job.
    await page.getByRole("button",{name:t("Kiểm tra đầu ra đã nhập","Check imported outputs"),exact:true}).click();
    await expect(page.getByRole("heading",{name:t("Đã giữ bản giải; chứng minh chưa được xác nhận","Draft retained; argument not verified"),exact:true})).toBeVisible();
    await page.getByRole("button",{name:t("Lưu bản nháp trong tab","Save draft in this tab"),exact:true}).click();
    const saved=await page.evaluate(()=>{
      const key=Object.keys(sessionStorage).find(key=>key.startsWith("hive:lean-draft:"));
      return key?JSON.parse(sessionStorage.getItem(key)!):null;
    });
    expect(Object.keys(saved).sort()).toEqual(["input","savedAt","version"]);
    expect(saved.input.solver).toBe(original);
    await page.reload();
    await expect(problem).toHaveValue("");
    await expect(page.locator("#lean-outcome")).toHaveCount(0);
    await page.getByRole("button",{name:t("Khôi phục đầu vào","Restore inputs"),exact:true}).click();
    await expect(solver).toHaveValue(original);
    await expect(page.locator("#lean-outcome")).toHaveCount(0);
    await expect(page.getByText(t("Không có thay đổi đầu vào chưa lưu","No unsaved input changes"),{exact:true})).toBeVisible();
    await problem.fill("Edited goal after restore; no verification has run.");
    await expect(page.getByText(t("Có thay đổi chưa lưu","Unsaved changes"),{exact:true})).toBeVisible();
    await page.getByRole("button",{name:t("Xóa bản nháp đã lưu","Delete saved draft"),exact:true}).click();
    expect(await page.evaluate(()=>Object.keys(sessionStorage).filter(key=>key.startsWith("hive:lean-draft:")))).toEqual([]);
    await expect(problem).toHaveValue("Edited goal after restore; no verification has run.");
    await page.setViewportSize({width:390,height:844});
    await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    await page.screenshot({path:testInfo.outputPath(`lean-draft-${locale}-390.png`),fullPage:true});
    // Storage may be disabled by privacy settings; the form remains usable.
    await page.evaluate(()=>Object.defineProperty(window,"sessionStorage",{configurable:true,get(){throw new DOMException("Blocked","SecurityError");}}));
    await page.getByRole("button",{name:t("Lưu bản nháp trong tab","Save draft in this tab"),exact:true}).click();
    await expect(page.getByText(t("Không lưu được bản nháp (bộ nhớ đầy hoặc bị chặn). Đầu vào vẫn ở đây; hãy sao chép trước khi rời trang.","Draft not saved (storage full or blocked). Inputs are still here; copy them before leaving."),{exact:true})).toBeVisible();
    await expect(problem).toHaveValue("Edited goal after restore; no verification has run.");
  });
}
