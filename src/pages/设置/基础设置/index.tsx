import SQLer from "@/class/SQLer";
import { SY块 } from "@/class/思源/块";
import SY文档 from "@/class/思源/文档";
import { SY笔记本 } from "@/class/思源/笔记本";
import { E块属性名称, E持久化键, 思源协议 } from "@/constant/系统码";
import { 持久化atom } from "@/store";
import { 用户设置Atom } from "@/store/用户设置";
import { I用户设置 } from "@/types/喧嚣/设置";
import { E按钮类型 } from "@/基础组件/按钮";
import { Button, Form, Modal, Select, message } from "antd";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

function 用户设置() {
  const [用户设置, 设置用户设置] = useAtom(用户设置Atom);
  const [持久化] = useAtom(持久化atom);

  const [笔记本列表, 令笔记本列表为] = useState([]);
  const [卡片文档ID, 令卡片文档ID为] = useState<string>();

  useEffect(() => {
    SY笔记本.列出笔记本().then(({ data }) => {
      令笔记本列表为(
        data.notebooks.map((notebook: { id: any; name: any }) => ({
          value: notebook.id,
          label: notebook.name,
        }))
      );
    });

    持久化.加载(E持久化键.卡片文档ID).then((id) => {
      if (!id) return;
      SY文档.检验文档是否存在(id).then((是否存在) => {
        if (!是否存在) {
          持久化.保存(E持久化键.卡片文档ID, null);
        } else {
          令卡片文档ID为(id);
        }
      });
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

            const { id: 日记根文档ID } = await SY文档.获取日记根文档(笔记本ID);
            const 所有的笔记本设置 = await SQLer.获取所有用户设置();

            let 新的用户设置: I用户设置 = 所有的笔记本设置.find(
              (设置) => 设置.笔记本ID === 笔记本ID
            );

            if (!新的用户设置) {
              新的用户设置 = {
                笔记本ID,
                日记根文档ID,
              };

              await SY块.设置块属性({
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
        {卡片文档ID ? (
          <a
            data-type="block-ref"
            data-id={卡片文档ID}
            href={思源协议 + 卡片文档ID}
          >
            {卡片文档ID}
          </a>
        ) : (
          <Button
            className={E按钮类型.默认}
            onClick={async () => {
              if (!用户设置.笔记本ID) return message.error("请先选择笔记本");

              const { id } = await SY文档.创建卡片文档(用户设置.笔记本ID);

              await 持久化.保存(E持久化键.卡片文档ID, id);
              令卡片文档ID为(id);
              Modal.success({
                title: "卡片文档生成成功",
                content: "此文档可随意移动，但是请不要删除此文档！",
              });
            }}
          >
            生成卡片文档
          </Button>
        )}
      </Form.Item>
    </Form>
  );
}
export default 用户设置;
