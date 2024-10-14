import { 通过Markdown创建文档 } from "@/API/文档";
import 弹窗表单, { T弹窗状态 } from "@/components/弹窗表单";
import { 用户设置Atom } from "@/jotai/用户设置";
import { Button, Card, Form, Input, List, Row, Space, Spin } from "antd";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { 更新用户设置 } from "../设置/tools";
import { Outlet, useNavigate } from "react-router-dom";
import {
  CloseOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { 设置块属性 } from "@/API/块数据";

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

function 主页() {
  const 导航到 = useNavigate();

  const [用户设置] = useAtom(用户设置Atom);
  const [弹窗状态, 令弹窗状态为] = useState<T弹窗状态>(undefined);
  const [创建中, 令创建中为] = useState<string | undefined>();

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
              导航到("/主页/领域", { state: item });
            }}
          >
            <Card title={item.名称}>{item.描述}</Card>
          </List.Item>
        )}
      />
      <Outlet />
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
            <Form.Item label="分类">
              <Form.List name={"分类"}>
                {(subFields, subOpt) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      rowGap: 16,
                    }}
                  >
                    {subFields.map((subField) => (
                      <Space key={subField.key}>
                        <Form.Item
                          noStyle
                          name={[subField.name, "名称"]}
                          required
                        >
                          <Input type="text" placeholder="分类名称" />
                        </Form.Item>
                        <Form.Item noStyle name={[subField.name, "描述"]}>
                          <Input.TextArea
                            autoSize={{ minRows: 1 }}
                            placeholder="分类描述"
                          />
                        </Form.Item>
                        <MinusCircleOutlined
                          onClick={() => {
                            subOpt.remove(subField.name);
                          }}
                        />
                      </Space>
                    ))}
                    <Button
                      icon={<PlusOutlined />}
                      type="dashed"
                      onClick={() => subOpt.add()}
                      block
                    />
                  </div>
                )}
              </Form.List>
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
          const 新建领域 = (领域文档ID: string) => {
            通过Markdown创建文档(
              用户设置.笔记本ID,
              `/领域/${value.领域名称}`,
              ""
            ).then(({ data: 领域文档ID }) => {
              value.分类?.forEach((分类) => {
                通过Markdown创建文档(
                  用户设置.笔记本ID,
                  `/领域/${value.领域名称}/${分类.名称}}`,
                  ""
                ).then(({ data }) => {
                  const 之前的领域设置 = 用户设置.领域设置;
                  const 之前的分类设置 = 之前的领域设置.分类;

                  更新用户设置(用户设置, {
                    领域设置: [
                      ...用户设置.领域设置,
                      {
                        ID: 领域文档ID,
                        名称: value.领域名称,
                        描述: value.领域描述,
                        分类: [
                          ...之前的分类设置,
                          {
                            ID: data,
                            ...分类,
                          },
                        ],
                      },
                    ],
                  });
                });
              });

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
                  新建领域(data);
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
