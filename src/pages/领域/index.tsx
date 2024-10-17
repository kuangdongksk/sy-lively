import { 获取块属性 } from "@/API/块数据";
import { 通过Markdown创建文档 } from "@/API/文档/创建";
import 弹窗表单, { T弹窗状态 } from "@/components/弹窗表单";
import { 用户设置Atom, 领域设置Atom } from "@/store/用户设置";
import { 更新用户设置, 更新领域设置 } from "@/tools/设置";
import { Button, Card, Form, Input, List, Spin } from "antd";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface I分类 {
  名称: string;
  ID: string;
  描述: string;
}
export interface I领域 {
  名称: string;
  ID: string;
  描述: string;
  分类: I分类[];
}

function 领域() {
  const 导航到 = useNavigate();

  const [用户设置, 设置用户设置] = useAtom(用户设置Atom);
  const [领域设置, 设置领域设置] = useAtom(领域设置Atom);
  const [弹窗状态, 令弹窗状态为] = useState<T弹窗状态>(undefined);
  const [创建中] = useState<string | undefined>();

  const [领域列表, 令领域列表为] = useState([
    {
      名称: "添加领域",
      ID: "添加领域",
      描述: "添加领域",
      分类: [],
    },
  ]);

  const 获取领域列表 = () => {
    if (用户设置.领域文档ID === "") return;
    获取块属性({ id: 用户设置.领域文档ID }).then(({ data }) => {
      console.log("🚀 ~ 获取块属性 ~ data:", data);
    });
    令领域列表为([
      ...领域设置,
      { 名称: "添加领域", ID: "添加领域", 描述: "添加领域", 分类: [] },
    ]);
  };

  useEffect(() => {
    获取领域列表();
  }, [用户设置]);
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
              导航到("/领域/领域详情", { state: item });
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
          <Spin spinning={创建中 !== undefined}>
            <Form.Item name="领域名称" label="领域名称" required>
              <Input type="text" />
            </Form.Item>
            <Form.Item name="领域描述" label="领域描述">
              <Input.TextArea autoSize={{ minRows: 1 }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Spin>
        }
        弹窗确认={() => 令弹窗状态为(undefined)}
        弹窗取消={() => 令弹窗状态为(undefined)}
        提交表单={(value: {
          领域名称: string;
          领域描述: string;
          分类: {
            名称: string;
            描述: string;
          }[];
        }) => {
          const 新建领域 = () => {
            通过Markdown创建文档(
              用户设置.笔记本ID,
              `/领域/${value.领域名称}`,
              ""
            ).then(({ data: 领域文档ID }) => {
              通过Markdown创建文档(
                用户设置.笔记本ID,
                `/领域/${value.领域名称}/杂项`,
                ""
              ).then(({ data }) => {
                const 新的领域设置 = [
                  ...领域设置,
                  {
                    ID: 领域文档ID,
                    名称: value.领域名称,
                    描述: value.领域描述,
                    分类: [
                      {
                        ID: data,
                        名称: "杂项",
                        描述: "系统默认创建",
                      },
                    ],
                  },
                ];

                更新领域设置({ 新的领域设置, 设置领域设置, 领域文档ID });
                令弹窗状态为(undefined);
              });
            });
          };

          if (用户设置.领域文档ID === "") {
            通过Markdown创建文档(用户设置.笔记本ID, `/领域`, "").then(
              ({ data }) => {
                更新用户设置({
                  当前用户设置: 用户设置,
                  更改的用户设置: { 领域文档ID: data },
                  设置用户设置,
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

export default 领域;
