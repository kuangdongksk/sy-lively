import ReactDOM from "react-dom";

export function TSX2HTML(组件: React.JSX.Element) {
  const div = document.createElement("div");
  ReactDOM.render(组件, div);
  const htmlString = div.innerHTML;
  return htmlString;
}
