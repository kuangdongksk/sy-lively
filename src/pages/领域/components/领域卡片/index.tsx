import SQL助手 from "@/class/SQL助手";
import { T弹窗状态 } from "@/components/弹窗表单";
import { E事项状态 } from "@/constant/状态配置";
import { 用户设置Atom } from "@/store/用户设置";
import { 更新用户设置 } from "@/tools/设置";
import { I事项, I分类, I领域 } from "@/types/喧嚣";
import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Dropdown,
  List,
  message,
  Progress,
  Tooltip,
} from "antd";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 添加领域 } from "../..";
import 分类表单 from "../../../../业务组件/表单/分类表单";
import { useStyle } from "./index.styles";

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
  const [事项列表, 令事项列表为] = useState<I事项[]>([]);

  const 加载事项 = () => {
    if (名称 === 添加领域) return;
    SQL助手.获取指定领域下的事项(ID).then((data) => {
      令事项列表为(data);
    });
  };

  const 加载数据 = () => {
    if (名称 === 添加领域) return;
    SQL助手.获取指定领域下的分类(ID).then((data) => {
      令分类列表为(data);
    });
  };

  useEffect(() => {
    加载事项();
    加载数据();
  }, [领域]);

  return (
    <>
      <div
        className={styles.卡片}
        onClick={() => {
          if (ID === "添加领域") {
            令弹窗状态为("添加");
            return;
          }
          导航到("/领域/领域详情", { state: 领域 });
        }}
      >
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
        <div className={styles.卡片内容}>
          {ID !== 添加领域 && (
            <Progress
              percent={
                (事项列表.filter((事项) => 事项.状态 === E事项状态.已完成)
                  .length /
                  事项列表.length) *
                100
              }
              status="active"
              strokeColor={{ from: "#ff8486", to: "#9bc188" }}
            />
          )}
          <div className={styles.卡片内容中间}>
            {分类列表.map((分类) => (
              <List.Item>{分类.名称}</List.Item>
            ))}
          </div>
        </div>
      </div>
      <分类表单
        领域={领域}
        弹窗状态={分类表单状态}
        令弹窗状态为={令分类表单状态为}
      />
    </>
  );
}
export default 领域卡片;
