import { 通过Markdown创建文档 } from "@/API/文档";
import { TNav } from "@/App";
import 弹窗表单, { T弹窗状态 } from "@/components/弹窗表单";
import { 用户设置Atom } from "@/jotai/用户设置";
import { Button, Card, Form, Input, List } from "antd";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { 更新用户设置 } from "../设置/tools";

export interface I主页Props {
  切换视图: (视图: TNav) => void;
}

function 主页(props: I主页Props) {
  const { 切换视图 } = props;

  const [用户设置] = useAtom(用户设置Atom);
  const [弹窗状态, 令弹窗状态为] = useState<T弹窗状态>(undefined);
  const [领域列表, 令领域列表为] = useState([
    {
      名称: "添加领域",
      ID: "添加领域",
      描述: "添加领域",
      分类: [],
    },
  ]);

  const 获取领域列表 = () => {
    令领域列表为([
      ...用户设置.领域设置,
      { 名称: "添加领域", ID: "添加领域", 描述: "添加领域", 分类: [] },
    ]);
  };

  useEffect(() => {
    获取领域列表();
  }, []);

  return (
    <>
      <List
        dataSource={领域列表}
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 6,
          xxl: 3,
        }}
        pagination={{
          position: "bottom",
          align: "end",
        }}
        renderItem={(item) => (
          <List.Item
            onClick={() => {
              if (item.ID === "添加领域") {
                令弹窗状态为("添加");
                return;
              }
              切换视图("领域");
            }}
          >
            <Card title={item.名称}>{item.描述}</Card>
          </List.Item>
        )}
      />

      <弹窗表单
        弹窗标题={"领域"}
        弹窗状态={弹窗状态}
        表单配置={{
          initialValues: undefined,
        }}
        表单内容={
          <>
            <Form.Item name="领域名称" label="领域名称" required>
              <Input type="text" />
            </Form.Item>
            <Form.Item name="领域描述" label="领域描述">
              <Input.TextArea />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </>
        }
        弹窗确认={() => 令弹窗状态为(undefined)}
        弹窗取消={() => 令弹窗状态为(undefined)}
        提交表单={(value: { 领域名称: string; 领域描述: string }) => {
          const 新建领域 = () => {
            通过Markdown创建文档(
              用户设置.笔记本ID,
              `/领域/${value.领域名称}`,
              ""
            ).then(({ data }) => {
              更新用户设置(用户设置, {
                领域设置: [
                  ...用户设置.领域设置,
                  {
                    ID: data,
                    名称: value.领域名称,
                    描述: value.领域描述,
                    分类: [],
                  },
                ],
              });
              令弹窗状态为(undefined);
            });
          };

          if (用户设置.领域文档ID === "") {
            通过Markdown创建文档(用户设置.笔记本ID, `/领域`, "").then(
              ({ data }) => {
                更新用户设置(用户设置, {
                  领域文档ID: data,
                }).then(() => {
                  新建领域();
                });
              }
            );
            return;
          }

          新建领域();
        }}
      />
    </>
  );
}

export default 主页;
