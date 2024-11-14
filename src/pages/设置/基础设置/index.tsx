import { 设置块属性 } from "@/API/块数据";
import CL文档 from "@/class/文档";
import { 列出笔记本 } from "@/API/笔记本";
import SQL助手 from "@/class/SQL助手";
import { E块属性名称, E持久化键 } from "@/constant/系统码";
import { 持久化atom } from "@/store";
import { 用户设置Atom } from "@/store/用户设置";
import { I用户设置 } from "@/types/喧嚣/设置";
import { Button, Form, Select, message } from "antd";
import { useAtom } from "jotai";
import { useState, useEffect } from "react";

function 用户设置() {
  const [用户设置, 设置用户设置] = useAtom(用户设置Atom);
  const [持久化] = useAtom(持久化atom);

  const [笔记本列表, 令笔记本列表为] = useState([]);

  useEffect(() => {
    列出笔记本().then(({ data }) => {
      令笔记本列表为(
        data.notebooks.map((notebook: { id: any; name: any }) => ({
          value: notebook.id,
          label: notebook.name,
        }))
      );
    });
  }, []);

  return (
    <Form>
      <Form.Item label="笔记本">
        <Select<string>
          defaultValue={用户设置.笔记本ID}
          options={笔记本列表}
          onChange={async (笔记本ID) => {
            if (用户设置.笔记本ID === 笔记本ID) return;

            const { id: 日记根文档ID } = await CL文档.获取日记根文档(笔记本ID);
            const 所有的笔记本设置 = await SQL助手.获取所有用户设置();

            let 新的用户设置: I用户设置 = 所有的笔记本设置.find(
              (设置) => 设置.笔记本ID === 笔记本ID
            );

            if (!新的用户设置) {
              新的用户设置 = {
                笔记本ID,
                日记根文档ID,
              };
              await 设置块属性({
                id: 日记根文档ID,
                attrs: {
                  [E块属性名称.用户设置]: JSON.stringify(新的用户设置),
                },
              });
            }

            await 持久化.保存(E持久化键.用户设置, JSON.stringify(新的用户设置));
            设置用户设置(新的用户设置);

            message.success("切换笔记本成功");
          }}
        />
      </Form.Item>
      <Form.Item label="卡片文档">
        <Button
          onClick={async () => {
            if (!用户设置.笔记本ID) return message.error("请先选择笔记本");
            const 卡片文档ID = await 持久化.加载(E持久化键.卡片文档ID);
            if (卡片文档ID) {
              message.error("卡片文档已存在");
              return;
            }

            const { id } = await CL文档.创建卡片文档(用户设置.笔记本ID);

            await 持久化.保存(E持久化键.卡片文档ID, id);
            message.success("生成卡片文档成功");
          }}
        >
          生成卡片文档
        </Button>
      </Form.Item>
    </Form>
  );
}
export default 用户设置;
