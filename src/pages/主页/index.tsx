import { 通过Markdown创建文档 } from "@/API/文档";
import { TNav } from "@/App";
import { 用户设置Atom } from "@/jotai/用户设置";
import { Button, Card, Form, Input, List, Modal } from "antd";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { 更新用户设置 } from "../设置/tools";

export interface I主页Props {
  切换视图: (视图: TNav) => void;
}

function 主页(props: I主页Props) {
  const { 切换视图 } = props;

  const [用户设置] = useAtom(用户设置Atom);
  const [弹窗状态, 令弹窗状态为] = useState(false);
  const [领域列表, 令领域列表为] = useState([
    {
      title: "添加领域",
      id: "添加领域",
    },
  ]);

  const 获取领域列表 = () => {
    令领域列表为([
      ...用户设置.领域设置.map((领域) => ({ title: 领域.名称, id: 领域.ID })),
      { title: "添加领域", id: "添加领域" },
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
              if (item.id === "添加领域") {
                令弹窗状态为(true);
                return;
              }
            }}
          >
            <Card title={item.title}>Card content</Card>
          </List.Item>
        )}
      />
      <Modal footer={false} open={弹窗状态} onClose={() => 令弹窗状态为(false)}>
        <Form
          onFinish={(value: { 领域名称: string; 领域描述: string }) => {
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
                令弹窗状态为(false);
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
        >
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
        </Form>
      </Modal>
    </>
  );
}

export default 主页;
