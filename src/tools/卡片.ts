import { 系统推送错误消息 } from "@/API/推送消息";
import SY文档 from "@/class/思源/文档";

export async function 校验卡片文档是否存在(ID: string) {
  if (!ID) {
    系统推送错误消息({ msg: "请先在设置中生成卡片文档", timeout: 5000 });
    return false;
  }

  if (!(await SY文档.检验文档是否存在(ID))) {
    系统推送错误消息({ msg: "卡片文档不存在，请重新生成", timeout: 5000 });
    return false;
  }
  return true;
}
