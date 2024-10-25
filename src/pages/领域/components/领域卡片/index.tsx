import SQL助手 from "@/class/SQL助手";
import { T弹窗状态 } from "@/components/弹窗表单";
import { 用户设置Atom } from "@/store/用户设置";
import { I分类, I领域 } from "@/types/喧嚣";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Dropdown, List, message, Tooltip } from "antd";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 添加领域 } from "../..";
import 分类表单 from "../分类表单";
import { useStyle } from "./index.styles";
import { 更新用户设置 } from "@/tools/设置";

function 领域卡片(props: {
  领域: I领域;
  令弹窗状态为: (状态: T弹窗状态) => void;
}) {
  const 导航到 = useNavigate();
  const [用户设置, 令用户设置为] = useAtom(用户设置Atom);
  const { styles } = useStyle();

  const { 领域, 令弹窗状态为 } = props;
  const { ID, 名称, 描述 } = 领域;

  const [分类表单状态, 令分类表单状态为] = useState<T弹窗状态>(undefined);
  const [分类列表, 令分类列表为] = useState<I分类[]>([]);

  const 加载数据 = () => {
    if (名称 === 添加领域) return;
    SQL助手.获取指定领域下的分类(ID).then((data) => {
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
            <div className={styles.卡片标题第一行}>
              {ID !== 添加领域 && (
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
              <span>{名称}</span>
              {名称 !== 添加领域 && (
                <span>
                  <Tooltip title="设置为默认领域">
                    <Checkbox
                      checked={用户设置.默认领域 === ID}
                      disabled={用户设置.默认领域 === ID}
                      onClick={async (e) => {
                        e.stopPropagation();
                        await 更新用户设置({
                          当前用户设置: 用户设置,
                          更改的用户设置: {
                            默认领域: ID,
                          },
                          设置用户设置: 令用户设置为,
                        });
                        message.success("设置默认领域成功！");
                      }}
                    />
                  </Tooltip>
                </span>
              )}
            </div>
            <span>{描述}</span>
          </div>
        }
        onClick={() => {
          if (ID === "添加领域") {
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
