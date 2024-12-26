import { I卡片 } from "@/class/卡片";
import { Grid, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Node } from "./node";
import { useState, useRef, useEffect } from "react";

// https://fiber.framer.wiki/
function TF({ 卡片列表 }: { 卡片列表: I卡片[] }) {
  const [isDragging, setIsDragging] = useState(false); // 用于跟踪是否正在拖拽
  const controlsRef = useRef(null); // 用于存储OrbitControls的引用

  // 在每一帧中更新OrbitControls的enabled状态
  useEffect(() => {
    const controls = controlsRef.current;

    const updateControls = () => {
      if (controls) {
        controls.enabled = !isDragging;
      }
    };

    updateControls();

    return () => {
      if (controls) {
        controls.enabled = true;
      }
    };
  }, [isDragging]);

  // 模拟拖拽事件处理函数
  const handleDragStart = () => {
    setIsDragging(true); // 开始拖拽时，设置isDragging为true
  };

  const handleDragEnd = () => {
    setIsDragging(false); // 结束拖拽时，设置isDragging为false
  };

  return (
    <div id="canvas-container" style={{ width: "100%", height: "100vh" }}>
      <Canvas
        camera={{ position: [0, 0, 10] }}
        performance={{ min: 0.5 }}
        dpr={[1, 2]}
      >
        {/* 环境光 */}
        <ambientLight intensity={0.5} />
        {/* 点光源 */}
        <pointLight position={[10, 10, 10]} />
        {/* 拖动 */}
        <OrbitControls ref={controlsRef} />
        <Grid
          cellSize={1} // 单元格大小，默认为 0.5
          cellThickness={1} // 单元厚度，默认为 0.5
          cellColor="#444444" // 单元颜色，默认为黑色
          sectionSize={5} // 切片尺寸，默认为 1
          sectionThickness={1} // 切片厚度，默认为 1
          sectionColor="#2080ff" // 切片颜色，默认为 #2080ff
          followCamera={false} // 是否跟随摄像机，默认为 false
          infiniteGrid={true} // 是否无限显示网格，默认为 false
          fadeDistance={100} // 淡入淡出距离，默认为 100
          fadeStrength={1} // 衰减强度，默认为 1
        />
        {卡片列表.map((卡片, index) => (
          <Node
            key={卡片.ID}
            id={卡片.ID}
            position={[(index % 5) * 3 - 6, Math.floor(index / 5) * 2 - 4, 0]}
            title={卡片.标题}
            handlePointerOver={handleDragStart}
            handlePointerOut={handleDragEnd}
          />
        ))}
      </Canvas>
    </div>
  );
}

export default TF;
