import { 设置块属性 } from "@/API/块数据";
import CL文档 from "@/API/文档";
import 弹窗表单, { T弹窗状态 } from "@/components/弹窗表单";
import { E块属性名称 } from "@/constant/系统码";
import { 用户设置Atom } from "@/store/用户设置";
import { 睡眠 } from "@/utils/异步";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Card, Dropdown, Form, Input, List, Switch } from "antd";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { I分类, I领域, 添加领域 } from "../..";
import { useStyle } from "./index.styles";
import { useEffect, useState } from "react";
import SQL助手 from "@/class/SQL助手";

function 领域卡片(props: {
  领域: I领域;
  令弹窗状态为: (状态: T弹窗状态) => void;
}) {
  const [用户设置] = useAtom(用户设置Atom);
  const 导航到 = useNavigate();
  const { styles } = useStyle();

  const { 领域, 令弹窗状态为 } = props;

  const [分类表单状态, 令分类表单状态为] = useState<T弹窗状态>(undefined);
  const [分类列表, 令分类列表为] = useState<I分类[]>([]);

  const 加载数据 = () => {
    if (领域.名称 === 添加领域) return;
    SQL助手.获取指定领域下的分类(领域.ID).then((data) => {
      令分类列表为(data);
    });
  };

  useEffect(() => {
    加载数据();
  }, [领域]);

  return (
    <>
      <Card
        className={styles.卡片}
        title={
          <div className={styles.卡片标题}>
            {领域.ID !== 添加领域 && (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "新建分类",
                      label: (
                        <span
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            令分类表单状态为("添加");
                          }}
                        >
                          新建分类
                        </span>
                      ),
                    },
                    {
                      key: "新建事项",
                      label: (
                        <span
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          新建事项
                        </span>
                      ),
                    },
                  ],
                }}
              >
                <Button icon={<PlusCircleOutlined />} type="link" />
              </Dropdown>
            )}
            <span>{领域.名称}</span>
            <span>{领域.描述}</span>
          </div>
        }
        onClick={() => {
          if (领域.ID === "添加领域") {
            令弹窗状态为("添加");
            return;
          }
          导航到("/领域/领域详情", { state: 领域 });
        }}
      >
        <div className={styles.卡片内容头}>
          <Switch checkedChildren="分类" unCheckedChildren="事项" />
        </div>
        <List
          dataSource={分类列表}
          renderItem={(分类) => <List.Item>{分类.名称}</List.Item>}
        />
      </Card>
      <弹窗表单
        弹窗标题="分类"
        弹窗状态={分类表单状态}
        表单配置={{
          initialValues: undefined,
        }}
        确认按钮文本="添加分类"
        表单内容={
          <>
            <Form.Item name="分类名称" label="分类名称" required>
              <Input />
            </Form.Item>
            <Form.Item name="分类描述" label="分类描述" required>
              <Input.TextArea />
            </Form.Item>
          </>
        }
        弹窗取消={() => 令分类表单状态为(undefined)}
        提交表单={(value: { 分类名称: string; 分类描述: string }) => {
          const { 分类名称, 分类描述 } = value;
          CL文档.通过Markdown创建(
            用户设置.笔记本ID,
            `/领域/${领域.名称}/${分类名称}`,
            ""
          ).then(async ({ data }) => {
            设置块属性({
              id: data,
              attrs: {
                [E块属性名称.分类]: JSON.stringify({
                  名称: 分类名称,
                  ID: data,
                  描述: 分类描述,
                  领域ID: 领域.ID,
                } as I分类),
              },
            });

            睡眠(1000).then(() => {
              加载数据();
            });
          });
        }}
      />
    </>
  );
}
export default 领域卡片;
