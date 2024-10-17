import { 获取笔记本下的日记根文档 } from "@/API/文档/获取";
import { 列出笔记本 } from "@/API/笔记本";
import { 用户设置Atom } from "@/store/用户设置";
import { 更新用户设置 } from "@/tools/设置";
import { Form, Select } from "antd";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

function 设置() {
  const [用户设置] = useAtom(用户设置Atom);

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
          onChange={(笔记本ID) => {
            if (用户设置.笔记本ID === 笔记本ID) return;
            const 更新设置 = () => {
              获取笔记本下的日记根文档(笔记本ID).then(
                ({ id: 日记根文档ID }) => {
                  更新用户设置(
                    {
                      笔记本ID,
                      是否使用中: true,
                      日记根文档ID,
                    },
                    日记根文档ID
                  );
                }
              );
            };

            if (用户设置.笔记本ID === "") {
              更新设置();
              return;
            }

            更新用户设置({
              是否使用中: false,
            }).then(() => {
              更新设置();
            });
          }}
        />
      </Form.Item>
    </Form>
  );
}
export default 设置;
