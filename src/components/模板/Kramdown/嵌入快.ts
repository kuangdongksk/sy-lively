import { E时间格式化 } from "@/constant/配置常量";
import {} from "@/pages/主页/components/事项树/components/事项";
import { I事项 } from "@/types/喧嚣";
import { 生成块ID } from "@/utils/DOM";
import dayjs from "dayjs";

export function 生成嵌入块Kramdown(事项: I事项) {
  return `{{select * from blocks where id='${事项.ID}'}}\n{: id="${
    事项.嵌入块ID
  }" updated="${dayjs().format(E时间格式化.思源时间)}"}`;
}
