import { I事项 } from "@/pages/主页/components/事项树/components/事项";
import dayjs from "dayjs";
import ReactDOM from "react-dom";

export function TSX2HTML(组件: React.JSX.Element) {
  const div = document.createElement("div");
  ReactDOM.render(组件, div);
  const htmlString = div.innerHTML;
  return htmlString;
}

export function markDown创建(事项: I事项): string {
  return `{{{row\n${事项.名称}[#${事项.id.slice(0, 6)}]()重要程度${
    事项.重要程度
  } 紧急程度${事项.紧急程度} 开始时间${dayjs(事项.开始时间).format(
    "YYYY-MM-DD HH:mm:ss"
  )} 结束时间${dayjs(事项.结束时间).format(
    "YYYY-MM-DD HH:mm:ss"
  )}\n\n事项详情...`;
}

export function markDown更新(markdown: string, 事项: I事项): string {
  const 事项详情 = markdown.slice(markdown.indexOf("\n\n") + 2);

  const 新的事项 =
    `{{{row\n${事项.名称}[#${事项.id.slice(0, 6)}]()重要程度${
      事项.重要程度
    } 紧急程度${事项.紧急程度} 开始时间${dayjs(事项.开始时间).format(
      "YYYY-MM-DD HH:mm:ss"
    )} 结束时间${dayjs(事项.结束时间).format("YYYY-MM-DD HH:mm:ss")}\n\n` +
    事项详情;

  return 新的事项;
}

export function 生成块ID() {
  return `${dayjs().format("YYYYMMDDHHmmss")}-${生成随机字符(7)}`;
}

export function 生成随机字符(length: number): string {
  const letter = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += letter.charAt(Math.floor(Math.random() * letter.length));
  }
  return result;
}
