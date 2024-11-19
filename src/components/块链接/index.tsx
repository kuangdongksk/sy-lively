import { 思源协议 } from "@/constant/系统码";

export interface I块链接Props {
  id: string;
  标题: string;
}

function 块链接(props: I块链接Props) {
  const { id, 标题 } = props;
  return (
    <a data-type="block-ref" data-id={id} href={思源协议 + id}>
      {标题}
    </a>
  );
}
export default 块链接;
