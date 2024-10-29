import { PlusCircleOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import 事项表单 from "../表单/事项表单";

export interface I浮动按钮Props {}

function 浮动按钮(props: I浮动按钮Props) {
  const {} = props;
  return (
    <事项表单
      触发器={
        <FloatButton
          style={{
            insetInlineStart: 96,
          }}
          icon={<PlusCircleOutlined />}
          shape="circle"
        />
      }
    />
  );
}
export default 浮动按钮;
