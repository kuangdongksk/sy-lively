import { Palette, red } from "@ant-design/colors";

export interface INumberTagProps {
  num: number;
  颜色数组: Palette;
}
function NumberTag(props: INumberTagProps) {
  const { num, 颜色数组 = red } = props;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "20px",
        height: "20px",
        borderRadius: "10px",
        border: `1px ${颜色数组[num]} solid`,
        color: 颜色数组[num],
      }}
    >
      {num}
    </div>
  );
}
export default NumberTag;
