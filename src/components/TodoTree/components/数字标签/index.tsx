import { Palette, red } from "@ant-design/colors";
import { Badge } from "antd";

export interface I数字标签Props {
  num: number;
  颜色数组: Palette;
}
function 数字标签(props: I数字标签Props) {
  const { num, 颜色数组 = red } = props;

  return <Badge color={颜色数组[num]} count={num} />;
}
export default 数字标签;
