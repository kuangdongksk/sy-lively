import SQL助手 from "@/class/SQL助手";
import { 用户设置Atom } from "@/store/用户设置";
import { I事项 } from "@/types/喧嚣/事项";
import 事项表格 from "@/业务组件/表格/事项表格";
import { useAtom } from "jotai";

function 主页() {
  const [用户设置] = useAtom(用户设置Atom);

  return (
    <事项表格<
      I事项 & {
        领域名称: string;
        分类名称: string;
      }
    >
      获取事项列表={() =>
        SQL助手.获取笔记本下的所有事项添加分类(用户设置.笔记本ID)
      }
    />
  );
}

export default 主页;
