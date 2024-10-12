import { 获取日记文档 } from "@/API/SQL";
import { 设置块属性 } from "@/API/块数据";
import { 通过Markdown创建文档 } from "@/API/文档";
import { 列出笔记本, 获取笔记本配置 } from "@/API/笔记本";
import { E块属性名称 } from "@/constant/系统码";
import { 用户设置Atom } from "@/jotai/用户设置";
import { Form, Select } from "antd";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

function 设置() {
  const [用户设置, 令用户设置为] = useAtom(用户设置Atom);

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
          options={笔记本列表}
          onChange={(笔记本ID) => {
            获取笔记本配置(笔记本ID).then((value) => {
              const 日记文档名称 =
                value.data.conf.dailyNoteSavePath.split("/")[1];
              获取日记文档(笔记本ID, 日记文档名称).then(({ data }) => {
                if (data.length === 0) {
                  通过Markdown创建文档(笔记本ID, `/${日记文档名称}`, "").then(
                    (value) => {
                      设置块属性({
                        id: value.data,
                        attrs: {
                          [E块属性名称.用户设置]: JSON.stringify({
                            笔记本: value,
                          }),
                        },
                      }).then(() => {
                        令用户设置为({
                          笔记本: 笔记本ID,
                        });
                      });
                    }
                  );
                } else {
                  设置块属性({
                    id: data[0].id,
                    attrs: {
                      [E块属性名称.用户设置]: JSON.stringify({
                        笔记本: 笔记本ID,
                      }),
                    },
                  }).then(() => {
                    令用户设置为({
                      笔记本: 笔记本ID,
                    });
                  });
                }
              });
            });
          }}
        />
      </Form.Item>
    </Form>
  );
}
export default 设置;
