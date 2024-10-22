import { T弹窗状态 } from "@/components/弹窗表单";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Card, Dropdown, List } from "antd";
import { useNavigate } from "react-router-dom";
import { I领域 } from "../..";
import { useStyle } from "./index.styles";

function 领域卡片(props: {
  领域: I领域;
  令弹窗状态为: (状态: T弹窗状态) => void;
}) {
  const 导航到 = useNavigate();
  const { styles } = useStyle();

  const { 领域, 令弹窗状态为 } = props;

  return (
    <Card
      className={styles.卡片}
      title={
        <div className={styles.卡片标题}>
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
        
      </div>
      <List />
    </Card>
  );
}
export default 领域卡片;
