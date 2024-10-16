import { E块属性名称 } from "@/constant/系统码";
import { I事项 } from "@/pages/主页/components/事项树/components/事项";
import dayjs from "dayjs";

function 事项DOM(props: { 事项: I事项 }) {
  const { 事项 } = props;

  const attribute = {
    [E块属性名称.事项]: JSON.stringify(事项),
  };

  return (
    <div
      data-node-id={事项.id}
      data-node-index="1"
      data-type="NodeSuperBlock"
      className="sb"
      updated="20241015160845"
      data-sb-layout="row"
      {...attribute}
    >
      <div
        data-node-id="20241015160845-mnb7txf"
        data-type="NodeParagraph"
        className="p"
        updated="20241015160845"
      >
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
      </div>
      <div
        data-node-id="20241015160845-rc18rtf"
        data-type="NodeParagraph"
        className="p"
        updated="20241015160845"
      >
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
