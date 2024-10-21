import SQL from "@/API/SQL";
import { 设置块属性 } from "@/API/块数据";
import { 通过Markdown创建文档 } from "@/API/文档/创建";
import 弹窗表单, { T弹窗状态 } from "@/components/弹窗表单";
import { E块属性名称 } from "@/constant/系统码";
import { 用户设置Atom } from "@/store/用户设置";
import { 更新用户设置 } from "@/tools/设置";
import { 睡眠 } from "@/utils/异步";
import { Button, Card, Form, Input, List, Spin } from "antd";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface I分类 {
  名称: string;
  ID: string;
  描述: string;
  领域ID: string;
}
export interface I领域 {
  名称: string;
  ID: string;
  描述: string;
  笔记本ID: string;
}

function 领域() {
  const 导航到 = useNavigate();

  const [用户设置, 设置用户设置] = useAtom(用户设置Atom);
  const [弹窗状态, 令弹窗状态为] = useState<T弹窗状态>(undefined);
  const [创建中] = useState<string | undefined>();

  const [领域列表, 令领域列表为] = useState([
    {
      名称: "添加领域",
      ID: "添加领域",
      描述: "添加领域",
    },
  ]);

  const 获取领域列表 = () => {
    if (用户设置.领域文档ID === "") return;
    SQL.获取笔记本下的领域设置(用户设置.笔记本ID).then(({ data }) => {
      令领域列表为(
        data
          .map((item: { value: string }) => JSON.parse(item.value))
          .concat({
            名称: "添加领域",
            ID: "添加领域",
            描述: "添加领域",
          })
      );
    });
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
                添加
              </Button>
            </Form.Item>
          </Spin>
        }
        弹窗确认={() => 令弹窗状态为(undefined)}
        弹窗取消={() => 令弹窗状态为(undefined)}
        提交表单={(value: { 领域名称: string; 领域描述: string }) => {
          const 新建领域 = () => {
            通过Markdown创建文档(
              用户设置.笔记本ID,
              `/领域/${value.领域名称}`,
              ""
            ).then(({ data: 领域文档ID }) => {
              设置块属性({
                id: 领域文档ID,
                attrs: {
                  [E块属性名称.领域]: JSON.stringify({
                    名称: value.领域名称,
                    ID: 领域文档ID,
                    描述: value.领域描述,
                    笔记本ID: 用户设置.笔记本ID,
                  }),
                },
              });

              通过Markdown创建文档(
                用户设置.笔记本ID,
                `/领域/${value.领域名称}/杂项`,
                ""
              ).then(async ({ data }) => {
                设置块属性({
                  id: data,
                  attrs: {
                    [E块属性名称.分类]: JSON.stringify({
                      名称: "杂项",
                      ID: data,
                      描述: "杂项",
                      领域ID: 领域文档ID,
                    }),
                  },
                });
                睡眠(1000).then(() => {
                  获取领域列表();
                  令弹窗状态为(undefined);
                });
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
