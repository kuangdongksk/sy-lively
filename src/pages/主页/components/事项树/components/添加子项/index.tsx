import { 插入前置子块 } from "@/API/块数据";
import { 事项状态 } from "@/constant/状态配置";
import { 事项数据 } from "@/jotai/事项数据";
import { string2stringArr, stringArr2string } from "@/utils/拼接与拆解";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { nanoid } from "nanoid";
import { TreeNode } from "../..";
import { 层级增加 } from "../../tools";

function 添加子项(props: { 节点: TreeNode }) {
  const { 节点 } = props;

  const [数据, 令数据为] = useAtom(事项数据);
  return (
    <>
      {节点.层级 < 5 && 节点.状态 !== 事项状态.已完成 && (
        <Button
          icon={<PlusCircleOutlined />}
          size="small"
          type="link"
          onClick={() => {
            const id = nanoid();
            const 状态 = string2stringArr(节点.key)[0];
            const 名称 = "未命名";
            const 层级 = 层级增加(节点.层级);
            const 新事项 = {
              id,
              key: stringArr2string([状态, 名称, id]),
              checkable: true,
              名称,
              重要程度: 5,
              紧急程度: 5,
              开始时间: dayjs().valueOf(),
              结束时间: dayjs().add(1, "hour").valueOf(),
              状态: 事项状态[状态],
              重复: undefined,
              层级,
              子项: [],
              父项: 节点.id,
            };

            数据.push(新事项);
            插入前置子块({
              dataType: "markdown",
              data: 新事项.toString(),
              parentID: 节点.id,
            }).then((value) => {
              console.log("🚀 ~ value:", value);
              令数据为([...数据]);
            });
          }}
        />
      )}
    </>
  );
}

export default 添加子项;
