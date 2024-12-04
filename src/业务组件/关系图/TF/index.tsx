import { I卡片 } from "@/class/卡片";
import { Html } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { memo, useCallback, useRef, useState } from "react";
import { Mesh } from "three";

// https://fiber.framer.wiki/
const Card = memo(({
  position,
  title,
}: {
  position: [number, number, number];
  title: string;
}) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHover] = useState(false);

  const handlePointerOver = useCallback(() => setHover(true), []);
  const handlePointerOut = useCallback(() => setHover(false), []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={hovered ? 1.2 : 1}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <boxGeometry args={[2, 1, 0.1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
      <Html
        position={[0, 0, 0.06]}
        center
        style={{
          color: 'black',
          background: 'rgba(255,255,255,0.8)',
          padding: '5px 10px',
          borderRadius: '5px',
          userSelect: 'none',
          fontSize: '14px',
          whiteSpace: 'nowrap'
        }}
      >
        {title}
      </Html>
    </mesh>
  );
});

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
          <Card
            key={卡片.ID}
            position={[
              (index % 5) * 3 - 6,
              Math.floor(index / 5) * 2 - 4,
              0
            ]}
            title={卡片.标题}
          />
        ))}
      </Canvas>
    </div>
  );
}

export default TF;
