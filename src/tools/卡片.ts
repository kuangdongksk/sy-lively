import { showMessage } from "siyuan";
import SY文档 from "@/class/思源/文档";

export async function 校验卡片文档是否存在(ID: string) {
  if (!ID) {
    showMessage("请先在设置中生成卡片文档", 5000, "error");
    return false;
  }

  if (!(await SY文档.检验文档是否存在(ID))) {
    showMessage("卡片文档不存在，请重新生成", 5000, "error");
    return false;
  }
  return true;
}
