import { 设置块属性 } from "@/API/块数据";
import CL文档 from "@/API/文档";
import { 列出笔记本 } from "@/API/笔记本";
import SQL助手 from "@/class/SQL助手";
import { E块属性名称 } from "@/constant/系统码";
import { 用户设置Atom } from "@/store/用户设置";
import { I用户设置 } from "@/types/喧嚣/事项";
import { Form, message, Select } from "antd";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

function 设置() {
  const [用户设置, 设置用户设置] = useAtom(用户设置Atom);

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

            if (用户设置.笔记本ID !== "") {
              await 设置块属性({
                id: 用户设置.日记根文档ID,
                attrs: {
                  [E块属性名称.用户设置]: JSON.stringify({
                    ...用户设置,
                    是否使用中: false,
                  }),
                },
              });
            }

            const { id: 日记根文档ID } = await CL文档.获取日记根文档(笔记本ID);
            const 所有的笔记本设置 = await SQL助手.获取所有用户设置();

            let 新的用户设置: Partial<I用户设置> = 所有的笔记本设置.find(
              (设置) => 设置.笔记本ID === 笔记本ID
            );

            if (!新的用户设置) {
              新的用户设置 = {
                笔记本ID,
                是否使用中: true,
                日记根文档ID,
              };
            } else {
              新的用户设置.是否使用中 = true;
            }

            await 设置块属性({
              id: 日记根文档ID,
              attrs: {
                [E块属性名称.用户设置]: JSON.stringify({
                  ...新的用户设置,
                  是否使用中: true,
                }),
              },
            });

            设置用户设置({
              ...(新的用户设置 as I用户设置),
            });

            message.success("切换笔记本成功");
          }}
        />
      </Form.Item>
    </Form>
  );
}
export default 设置;
