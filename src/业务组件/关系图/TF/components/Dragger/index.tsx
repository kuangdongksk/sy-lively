import { DragControls } from "@react-three/drei";

export interface IDraggerProps {
  children: React.ReactNode;
}

function Dragger(props: IDraggerProps) {
  const { children } = props;

  return <DragControls>{children}</DragControls>;
}
export default Dragger;
