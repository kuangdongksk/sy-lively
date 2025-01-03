import SQLer from "@/class/helper/SQLer";
import { 用户设置Atom } from "@/store/用户设置";
import { I领域 } from "@/types/喧嚣/事项";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import 领域卡片 from "./components/领域卡片";
import 新建领域 from "./components/领域卡片/新建领域";
import styles from "./index.module.less";

export const 添加领域 = "添加领域";

function 领域() {
  const [用户设置] = useAtom(用户设置Atom);

  const [领域列表, 令领域列表为] = useState<I领域[]>([]);

  const 获取领域列表 = async () => {
    const data = await SQLer.获取笔记本下的领域(用户设置.笔记本ID);
    令领域列表为(data);
  };

  useEffect(() => {
    获取领域列表();
  }, [用户设置]);

  return (
    <div className={styles.领域}>
      {领域列表.map((领域) => (
        <领域卡片 key={领域.ID} 领域={领域} />
      ))}

      <新建领域 完成回调={获取领域列表} />
    </div>
  );
}

export default 领域;
