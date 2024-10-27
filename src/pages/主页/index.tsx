import SQL助手 from "@/class/SQL助手";
import { 用户设置Atom } from "@/store/用户设置";
import { I领域分类事项 } from "@/types/喧嚣";
import { List } from "antd";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

function 主页() {
  const [用户设置] = useAtom(用户设置Atom);
  const [事项列表, 令事项列表为] = useState<I领域分类事项[]>([]);

  const 获取事项 = async () => {
    const 结果 = await SQL助手.获取笔记本下的所有事项按领域分类组织(
      用户设置.笔记本ID
    );
    令事项列表为(结果);
  };

  useEffect(() => {
    获取事项();
  }, [用户设置]);

  return (
    <List
      dataSource={事项列表}
      renderItem={(领域) => (
        <div>
          <h2 data-type="block-ref" data-id={领域.ID}>
            {领域.名称}
          </h2>
          <List
            dataSource={领域.分类}
            renderItem={(分类) => (
              <div>
                <h3 data-type="block-ref" data-id={分类.ID}>
                  {分类.名称}
                </h3>
                <List
                  dataSource={分类.事项}
                  renderItem={(事项) => (
                    <List.Item data-type="block-ref" data-id={事项.ID}>
                      {事项.名称}
                    </List.Item>
                  )}
                />
              </div>
            )}
          />
        </div>
      )}
    />
  );
}

export default 主页;
