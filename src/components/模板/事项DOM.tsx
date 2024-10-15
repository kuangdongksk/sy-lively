import { I事项 } from "@/pages/主页/components/事项树/components/事项";
import dayjs from "dayjs";

function 事项DOM(props: { 事项: I事项 }) {
  const { 事项 } = props;

  return (
    <div
      data-node-index="0"
      data-type="NodeSuperBlock"
      className="sb"
      data-sb-layout="row"
      style={{ backgroundColor: "var(--b3-font-background13)" }}
    >
      <div data-type="NodeParagraph" className="p">
        <div contentEditable="true" spellCheck="false">
          未命名
          <span data-type="a" data-href="">
            #{事项.id.slice(0, 6)}
          </span>
          重要程度{事项.重要程度} 紧急程度{事项.紧急程度} 开始时间
          {dayjs(事项.开始时间).format("YYYY-MM-DD HH:mm:ss")} 结束时间
          {dayjs(事项.结束时间).format("YYYY-MM-DD HH:mm:ss")}
        </div>
        <div className="protyle-attr" contentEditable="false">
          ​
        </div>
      </div>
      <div data-type="NodeParagraph" className="p">
        <div contentEditable="true" spellCheck="false">
          事项详情...
        </div>
        <div className="protyle-attr" contentEditable="false">
          ​
        </div>
      </div>
      <div className="protyle-attr" contentEditable="false">
        ​
      </div>
    </div>
  );
}

export default 事项DOM;
