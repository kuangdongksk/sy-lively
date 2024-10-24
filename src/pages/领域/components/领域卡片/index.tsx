import SQL助手 from "@/class/SQL助手";
import { T弹窗状态 } from "@/components/弹窗表单";
import { I分类, I领域 } from "@/types/喧嚣";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Card, Dropdown, List } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 添加领域 } from "../..";
import 分类表单 from "../分类表单";
import { useStyle } from "./index.styles";

function 领域卡片(props: {
  领域: I领域;
  令弹窗状态为: (状态: T弹窗状态) => void;
}) {
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
          {/* <Switch
            checkedChildren="分类"
            unCheckedChildren="事项"
            onClick={(_checked, e) => {
              e.stopPropagation();
            }}
          /> */}
        </div>
        <List
          dataSource={分类列表}
          renderItem={(分类) => <List.Item>{分类.名称}</List.Item>}
        />
      </Card>
      <分类表单
        领域={领域}
        弹窗状态={分类表单状态}
        令弹窗状态为={令分类表单状态为}
      />
    </>
  );
}
export default 领域卡片;
