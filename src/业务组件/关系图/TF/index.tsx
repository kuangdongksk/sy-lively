import { I卡片 } from "@/class/卡片";
import { Canvas } from "@react-three/fiber";
import { Node } from "./node";

// https://fiber.framer.wiki/
function TF({ 卡片列表 }: { 卡片列表: I卡片[] }) {
  return (
    <div id="canvas-container" style={{ width: "100%", height: "100vh" }}>
      <Canvas
        camera={{ position: [0, 0, 10] }}
        performance={{ min: 0.5 }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {卡片列表.map((卡片, index) => (
          <Node
            key={卡片.ID}
            id={卡片.ID}
            position={[(index % 5) * 3 - 6, Math.floor(index / 5) * 2 - 4, 0]}
            title={卡片.标题}
          />
        ))}
      </Canvas>
    </div>
  );
}

export default TF;
