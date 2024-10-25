import SQL助手 from "@/class/SQL助手";
import { T弹窗状态 } from "@/components/弹窗表单";
import { 用户设置Atom } from "@/store/用户设置";
import { I领域 } from "@/types/喧嚣";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import 领域卡片 from "./components/领域卡片";
import { 领域页面样式 } from "./index.style";
import 领域表单 from "../../业务组件/表单/领域表单";

export const 添加领域 = "添加领域";

function 领域() {
  const [用户设置] = useAtom(用户设置Atom);
  const { styles } = 领域页面样式();
  const 添加 = {
    ID: 添加领域,
    笔记本ID: 用户设置.笔记本ID,
    名称: 添加领域,
    描述: 添加领域,
    默认分类: "",
  };
  const [弹窗状态, 令弹窗状态为] = useState<T弹窗状态>(undefined);

  const [领域列表, 令领域列表为] = useState<I领域[]>([添加]);

  const 获取领域列表 = async () => {
    const data = await SQL助手.获取笔记本下的领域(用户设置.笔记本ID);
    令领域列表为(data.concat(添加));
  };

  useEffect(() => {
    获取领域列表();
  }, [用户设置]);

  return (
    <>
      <div className={styles.领域}>
        {领域列表.map((领域) => (
          <领域卡片 key={领域.ID} 领域={领域} 令弹窗状态为={令弹窗状态为} />
        ))}
      </div>
      <领域表单
        弹窗状态={弹窗状态}
        令弹窗状态为={令弹窗状态为}
        完成回调={获取领域列表}
      />
    </>
  );
}

export default 领域;
