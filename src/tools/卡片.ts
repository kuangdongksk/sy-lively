import MsgSender from "@/class/helper/MsgSender";
import SY文档 from "@/class/思源/文档";

export async function 校验卡片文档是否存在(ID: string) {
  if (!ID) {
    MsgSender.sySendError({ msg: "请先在设置中生成卡片文档", timeout: 5000 });
    return false;
  }

  if (!(await SY文档.检验文档是否存在(ID))) {
    MsgSender.sySendError({ msg: "卡片文档不存在，请重新生成", timeout: 5000 });
    return false;
  }
  return true;
}
