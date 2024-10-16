import { I事项 } from "@/pages/主页/components/事项树/components/事项";
import dayjs from "dayjs";

function 第一行DOM(props: { 事项: I事项 }) {
  const { 事项 } = props;

  return (
    <>
      <div contentEditable="true" spellCheck="false">
        {事项.名称}
        <span data-type="a" data-href="">
          {事项.id.slice(-6)}
        </span>
        重要程度{事项.重要程度} 紧急程度{事项.紧急程度} 开始时间
        {dayjs(事项.开始时间).format("YYYY-MM-DD HH:mm:ss")}
        结束时间{dayjs(事项.结束时间).format("YYYY-MM-DD HH:mm:ss")}
      </div>
      <div className="protyle-attr" contentEditable="false">
        ​
      </div>
    </>
  );
}

export default 第一行DOM;
