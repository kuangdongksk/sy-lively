import TlWb from "@/业务组件/WhiteBoard/TlWb";
import "tldraw/tldraw.css";
export interface IExcalidrawProps {}

function WhiteBoard(props: IExcalidrawProps) {
  const {} = props;

  return <TlWb />;
}
export default WhiteBoard;
